export default {
    async fetch(request, env, ctx) {
      const url = new URL(request.url);
  
      if (request.method === "POST" && url.pathname === "/api/guestbook") {
        const formData = await request.json();
        const { name, message } = formData;
  
        if (!name || !message) {
          return new Response("Missing name or message", { status: 400 });
        }
  
        await env.DB.prepare(
          "INSERT INTO entries (name, message) VALUES (?, ?)"
        ).bind(name, message).run();
  
        return new Response("Entry saved!", { status: 200 });
      }
  
      if (request.method === "GET" && url.pathname === "/api/guestbook") {
        const { results } = await env.DB.prepare(
          "SELECT id, name, message, created_at FROM entries ORDER BY created_at DESC"
        ).all();
  
        return new Response(JSON.stringify(results), {
          headers: { "Content-Type": "application/json" }
        });
      }
  
      return new Response("Not found", { status: 404 });
    },
  };
  