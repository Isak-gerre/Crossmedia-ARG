import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { MongoClient } = require("mongodb");
const http = require("http");
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import playersRoutes from "./routes/players.js";
import sessionRoutes from "./routes/sessions.js";
import groupRoutes from "./routes/groups.js";
import challengesRoutes from "./routes/challenges.js";
import teamRoutes from "./routes/team.js";

const app = express();
const server = http.createServer(app);

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
server.listen(PORT);

app.use("/players", playersRoutes);
app.use("/sessions", sessionRoutes);
app.use("/groups", groupRoutes);
app.use("/challenges", challengesRoutes);
app.use("/teams", teamRoutes);


const Websocket = require("ws"); 

const wss = new Websocket.Server({port: 8002});

wss.on("connection", ws => {
	console.log("Connected individual");
	ws.on("close", () => {
		console.log("User has dissconeted");
	})
	ws.on("message", (data) => {
		if(data.toString() == "done"){
			ws.send("timer");
		}
	});
});