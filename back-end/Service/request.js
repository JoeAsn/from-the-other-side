import path from "node:path"
import { readFile , writeFile} from "node:fs/promises";
export async function Get(res) {
  let __dirname = import.meta.dirname;
  try {
    const dataPath = path.join(__dirname, "..", "Data", "data.js");
    const data = JSON.parse(await readFile(dataPath, "utf-8"));
    res.statusCode = 200;
    res.end(JSON.stringify(data));
  } catch (error) {
    console.error(error);
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Unable to load sightings" }));
  }
}

export async function post(res ,req) {
  try {
    let body = "";

    // Listen for incoming data
    req.on("data", (chunk) => {
      body += chunk;
    });

    // Listen for end of request
    req.on("end", async () => {
      try {
        const __dirname = import.meta.dirname
        const dataPath = path.join(__dirname, ".." ,"Data", "data.js");
        const data = JSON.parse(await readFile(dataPath, "utf-8"));

        const newData = JSON.parse(body);
        data.push(newData);

        await writeFile(dataPath, JSON.stringify(data), "utf-8");

        res.statusCode = 200;
        res.end(JSON.stringify({ message: "success" }));
      } catch (error) {
        console.error(error);
        res.statusCode = 400; // Bad Request
        res.end(JSON.stringify({ error: "Invalid JSON format" }));
      }
    });

    return; // End here to avoid sending response multiple times
  } catch (error) {
    console.error(error);
    res.statusCode = 500; // Internal Server Error
    res.end(JSON.stringify({ error: "Unable to process request" }));
  }
}
