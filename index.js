export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    // Handle CORS preflight request
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers
      });
    }

    // Handle GET request to fetch guestbook entries
    if (request.method === "GET" && url.pathname === "/api/entries") {
      const { results } = await env.DB.prepare(
        "SELECT name, message FROM entries ORDER BY id DESC LIMIT 10"
      ).all();
      return new Response(JSON.stringify(results), { headers });
    }

    // Handle POST request to submit a new entry
    if (request.method === "POST" && url.pathname === "/api/entries") {
      try {
        let name, message;
try {
  const data = await request.json();
  name = data.name;
  message = data.message;
} catch (err) {
  return new Response(JSON.stringify({ error: "Invalid JSON" }), {
    status: 400,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
  });
}

        if (!name || !message) {
          return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400, headers });
        }

        await env.DB.prepare(
          "INSERT INTO entries (name, message) VALUES (?, ?)"
        ).bind(name, message).run();

        return new Response(JSON.stringify({ success: true }), { status: 201, headers });
      } catch (err) {
        return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers });
      }
    }

    return new Response("Not Found", { status: 404, headers });
  }
};
