import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
const __dirname = import.meta.dirname;
const server = http.createServer(async (req, res) => {
  if (req.url === "/api" && req.method === "GET") {
    try {
      const dataPath = path.join(__dirname, "Data", "data.js");
      const data = JSON.parse(await readFile(dataPath , "utf-8"))
      res.writeHead(200, {
        "access-control-allow-origin": "http://localhost:5173",
        "content-type": "application/json",
      });
      res.end(JSON.stringify(data));
    } catch (error) {
      res.writeHead(500, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "Unable to load sightings" }));
    }
    return;
  }
  else if (req.url === "/api" && req.method === "POST"){
    
  }
  res.writeHead(404, { "content-type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});
server.listen(3200, () => console.log("the server is set up"));
