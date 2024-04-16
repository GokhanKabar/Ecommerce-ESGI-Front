import express from "express";
import { indexRouter } from "./routes/index.js";
import { dbConnection } from "./database/index.js";

const server = express();

dbConnection();

server.use("/", indexRouter);

server.listen(8000, "0.0.0.0", () => {
  console.log("Server listening on http://localhost:8000");
});
