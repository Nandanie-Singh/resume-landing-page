export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle GET
    if (request.method === "GET" && url.pathname === "/api/entries") {
      const { results } = await env.DB.prepare(
        "SELECT name, message FROM entries ORDER BY id DESC LIMIT 10"
      ).all();

      return new Response(JSON.stringify(results), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // Handle POST
    if (request.method === "POST" && url.pathname === "/api/entries") {
      try {
        const contentType = request.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          return new Response(JSON.stringify({ error: "Expected application/json" }), {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          });
        }

        const data = await request.json();
        const name = data?.name?.trim();
        const message = data?.message?.trim();

        if (!name || !message) {
          return new Response(JSON.stringify({ error: "Name and message required" }), {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          });
        }

        await env.DB.prepare("INSERT INTO entries (name, message) VALUES (?, ?)")
          .bind(name, message)
          .run();

        return new Response(JSON.stringify({ success: true }), {
          status: 201,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: "Invalid JSON" }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }
    }

    // Preflight for CORS (OPTIONS)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    return new Response("Not Found", {
      status: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  },
};
