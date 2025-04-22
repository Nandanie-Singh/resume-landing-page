export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // === API ROUTES ===
    if (pathname === "/api/guestbook" && request.method === "GET") {
      const { results } = await env.DB.prepare(
        "SELECT id, name, message, created_at FROM entries ORDER BY created_at DESC"
      ).all();
      return new Response(JSON.stringify(results), {
        headers: { "Content-Type": "application/json" }
      });
    }

    if (pathname === "/api/guestbook" && request.method === "POST") {
      try {
        const { name, message } = await request.json();
        if (!name || !message) {
          return new Response("Name and message are required", { status: 400 });
        }
        await env.DB.prepare(
          "INSERT INTO entries (name, message) VALUES (?, ?)"
        ).bind(name, message).run();
        return new Response("Entry submitted!", { status: 201 });
      } catch {
        return new Response("Invalid JSON body", { status: 400 });
      }
    }

    // === STATIC FILES ===
    // Serve index.html at root
    if (pathname === "/" || pathname === "/index.html") {
      return serveStatic("index.html");
    }

    // Serve style.css
    if (pathname === "/style.css") {
      return serveStatic("style.css", "text/css");
    }

    return new Response("Not Found", { status: 404 });
  }
};

// Helper function to fetch static files from public folder
async function serveStatic(filename, contentType = "text/html") {
  const file = await fetch(`./public/${filename}`);
  const body = await file.text();
  return new Response(body, {
    headers: { "Content-Type": contentType }
  });
}

  