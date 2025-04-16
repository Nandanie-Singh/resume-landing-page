1. **What is a Cloudflare Worker?**
   A Cloudflare Worker is a serverless function that allows you to execute JavaScript at the edge, close to the user, for faster performance.

2. **How does a Worker handle HTTP requests and return responses?**
   Workers intercept HTTP requests using `fetch` and handle them with JavaScript, allowing for customized responses directly from the edge.

3. **What is Cloudflare D1? What are some pros and cons of using it?**
   D1 is a fully managed serverless database built on SQLite. It offers scalability but may have limitations in query complexity and performance.

4. **How does client-side JavaScript call an external API?**
   Client-side JS calls an API using `fetch()` or `XMLHttpRequest` to send HTTP requests, and then processes the response.

5. **What is the benefit of deploying APIs to the edge instead of traditional servers?**
   Edge deployment minimizes latency, scales automatically, and handles more requests by running functions closer to the user.
