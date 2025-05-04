export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', // 👈 CORS!
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    // GET guestbook entries
    if (url.pathname === "/api/entries" && request.method === "GET") {
      const { results } = await env.DB.prepare(
        "SELECT name, message FROM entries ORDER BY id DESC LIMIT 10"
      ).all();

      return new Response(JSON.stringify(results), { headers });
    }

    // POST guestbook entry
    if (url.pathname === "/api/entries" && request.method === "POST") {
      try {
        const { name, message } = await request.json();

        if (!name || !message) {
          return new Response(JSON.stringify({ error: "Missing name or message" }), {
            status: 400,
            headers,
          });
        }

        await env.DB.prepare(
          "INSERT INTO entries (name, message) VALUES (?, ?)"
        ).bind(name, message).run();

        return new Response(JSON.stringify({ success: true }), {
          status: 201,
          headers,
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: "Invalid JSON" }), {
          status: 400,
          headers,
        });
      }
    }

    // Fallback for other paths
    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers,
    });
  }
};
