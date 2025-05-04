export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle CORS preflight (OPTIONS)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders()
      });
    }

    // GET: Fetch guestbook entries
    if (request.method === "GET" && url.pathname === "/api/entries") {
      const { results } = await env.DB.prepare(
        "SELECT name, message FROM entries ORDER BY id DESC LIMIT 10"
      ).all();

      return new Response(JSON.stringify(results), {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders()
        }
      });
    }

    // POST: Add a new guestbook entry
    if (request.method === "POST" && url.pathname === "/api/entries") {
      try {
        const { name, message } = await request.json();

        if (!name || !message) {
          return new Response(JSON.stringify({ error: "Missing fields" }), {
            status: 400,
            headers: corsHeaders()
          });
        }

        await env.DB.prepare(
          "INSERT INTO entries (name, message) VALUES (?, ?)"
        ).bind(name.trim(), message.trim()).run();

        return new Response(JSON.stringify({ success: true }), {
          status: 201,
          headers: corsHeaders()
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: "Invalid JSON" }), {
          status: 400,
          headers: corsHeaders()
        });
      }
    }

    // Fallback for all other routes
    return new Response("Not Found", {
      status: 404,
      headers: corsHeaders()
    });
  }
};

// Reusable CORS headers
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*", // Or restrict to your resume domain
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}
