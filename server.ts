import { serve, file } from "bun";

const PORT = process.env.PORT || 3000;

serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    // Serve the main page
    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(file("./public/index.html"), {
        headers: { "Content-Type": "text/html" },
      });
    }

    // Serve static files from public directory
    if (url.pathname.startsWith("/")) {
      const filePath = `./public${url.pathname}`;
      const staticFile = file(filePath);

      if (await staticFile.exists()) {
        const ext = url.pathname.split(".").pop();
        const contentTypes: Record<string, string> = {
          css: "text/css",
          js: "application/javascript",
          png: "image/png",
          ico: "image/x-icon",
          svg: "image/svg+xml",
        };

        return new Response(staticFile, {
          headers: { "Content-Type": contentTypes[ext || ""] || "text/plain" },
        });
      }
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`🔒 Secure message server running at http://localhost:${PORT}`);
