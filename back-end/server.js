import http from "node:http";
import path from "node:path";
import { readFileSync } from "node:fs";
import serveStatic from "./utility/serveStatic.js";
const __dirname = import.meta.dirname;
const server = http.createServer((req, res) => {
  let html = serveStatic(__dirname);
  const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
  };

  let file = readFileSync(html, "utf-8");
  console.log(file);
  res.writeHead(200, {
    "content-type": ,
  });
  res.end(file);
});
server.listen(3200, () => console.log("the server is set up"));
