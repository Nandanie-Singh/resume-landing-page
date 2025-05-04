export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // GET entries
    if (request.method === "GET" && url.pathname === "/api/entries") {
      const { results } = await env.DB.prepare(
        "SELECT id, name, message, created_at FROM entries ORDER BY created_at DESC"
      ).all();

      return new Response(JSON.stringify(results), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // POST entry
    if (request.method === "POST" && url.pathname === "/api/entries") {
      try {
        const { name, message } = await request.json();

        if (!name || !message) {
          return new Response("Name and message are required", { status: 400 });
        }

        await env.DB.prepare(
          "INSERT INTO entries (name, message) VALUES (?, ?)"
        ).bind(name, message).run();

        return new Response("Entry submitted!", { status: 201 });
      } catch (err) {
        return new Response("Invalid JSON body", { status: 400 });
      }
    }

    return new Response("Not found", { status: 404 });
  }
};
