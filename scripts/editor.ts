async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  console.log(request.method, url.pathname);
  switch (url.pathname) {
    case "/":
      return new Response(Bun.file("scripts/editor.html"));

    case "/calendar":
      if (request.method === "POST") {
        const data = await request.json();
        Bun.write("calendar.json", JSON.stringify(data, null, 2) + "\n");
        return new Response("", {
          status: 204,
        });
      } else if (request.method === "GET") {
        return new Response(Bun.file("calendar.json"));
      } else {
        return new Response("Method Not Allowed!", {
          status: 405,
          headers: { "content-type": "text/plain" },
        });
      }

    default:
      return new Response("Not Found!", {
        status: 404,
        headers: { "content-type": "text/plain" },
      });
  }
}

Bun.serve({
  fetch: handleRequest,
});
