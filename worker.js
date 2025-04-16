// worker/index.js

export default {
    async fetch(request, env, ctx) {
      const url = new URL(request.url);
  
      // Fetch guestbook entries (GET request)
      if (url.pathname === "/api/entries" && request.method === "GET") {
        const { results } = await env.DB.prepare(`SELECT name, message FROM entries ORDER BY id DESC LIMIT 10`).all();
        return new Response(JSON.stringify(results), {
          headers: { "Content-Type": "application/json" }
        });
      }
  
      // Add new guestbook entry (POST request)
      if (url.pathname === "/api/entries" && request.method === "POST") {
        const { name, message } = await request.json();
        await env.DB.prepare("INSERT INTO entries (name, message) VALUES (?, ?)").bind(name, message).run();
        return new Response("Entry added", { status: 201 });
      }
  
      return new Response("Not Found", { status: 404 });
    }
  };
  