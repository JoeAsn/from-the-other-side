import http from "node:http";
import { Get , post} from "./Service/request.js";

const server = http.createServer(async (req, res) => {
  res.setHeader("access-control-allow-origin", "http://localhost:5173");
  res.setHeader("content-type", "application/json");
  res.setHeader("access-control-allow-headers", "Content-Type");

  if (req.method === "OPTIONS") {
    // Respond to preflight request
    res.statusCode = 204; // No Content
    res.end();
    return;
  }

  if (req.url === "/api" && req.method === "GET") {
    await Get(res)
    return;
  } else if (req.url === "/api" && req.method === "POST") {
    await post(res ,req)
    return;
  }
  res.statusCode = 404;
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(3200, () => console.log("The server is set up"));
