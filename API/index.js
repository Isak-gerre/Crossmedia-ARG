import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { MongoClient } = require("mongodb");
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import playersRoutes from "./routes/players.js";
import sessionRoutes from "./routes/sessions.js";

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  bodyParser.json({
    extended: true,
  })
);
app.use(cors());

const PORT = process.env.PORT || 8000;
app.listen(PORT);

app.use("/players", playersRoutes);
app.use("/sessions", sessionRoutes);
