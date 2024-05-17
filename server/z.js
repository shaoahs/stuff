import serveStatic from "serve-static-bun";

Bun.serve({
  port: 3000,
  tls: {
    key: Bun.file("./keys/server.key"),
    cert: Bun.file("./keys/server.crt"),
  },
  fetch: serveStatic("")
});

