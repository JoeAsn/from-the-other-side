import http from "node:http";
import path from "node:path";
const __dirname = import.meta.dirname;
const server = http.createServer((req, res) => {
  res.writeHead(200, {
    "content-type": "text/html",
  });
  res.end("file");
});
server.listen(3200, () => console.log("the server is set up"));
