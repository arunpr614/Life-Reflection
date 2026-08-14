import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const host = "127.0.0.1";
const port = Number(process.env.LIFE_IN_DAYS_PROTOTYPE_PORT || 4173);

const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
};

createServer(async (request, response) => {
  try {
    const pathname = new URL(request.url || "/", `http://${host}:${port}`).pathname;
    const requested = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
    const safePath = normalize(requested);

    if (safePath.startsWith("..")) {
      response.writeHead(403).end("Forbidden");
      return;
    }

    let filePath = join(root, safePath);
    const fileStat = await stat(filePath);
    if (fileStat.isDirectory()) filePath = join(filePath, "index.html");
    const body = await readFile(filePath);

    response.writeHead(200, {
      "Content-Type": types[extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    response.end(body);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Prototype file not found");
  }
}).listen(port, host, () => {
  console.log(`Life in Days prototype: http://${host}:${port}/?variant=A`);
  console.log("Press Ctrl+C to stop.");
});
