import http from "http";
import index from "./index.js";
import "dotenv/config";
import { connectToDB } from "./model/repository.js";

const port = process.env.USER_SERVICE_SERVICE_PORT || 3001;

const server = http.createServer(index);

await connectToDB().then(() => {
  console.log("MongoDB Connected!");

  server.listen(port);
  console.log("User service server listening on http://localhost:" + port);
}).catch((err) => {
  console.error("Failed to connect to DB");
  console.error(err);
});

