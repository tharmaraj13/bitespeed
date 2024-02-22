require("dotenv").config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";
import contact from "./routes/contact";

const app = express();

app.use(cors({ origin: "*" }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use("", contact);

const server = http.createServer(app);

const port = process.env.PORT || 3000; // Default port is 3000
const host: any = "0.0.0.0";

server.listen(port, host);

server.on("error", (error) => {
  console.error("Server error:", error);
});

server.on("listening", () => {
  console.log(`Server started on http://${host}:${port}`);
});
