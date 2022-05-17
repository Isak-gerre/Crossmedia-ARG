import { clear } from "console";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { MongoClient } = require("mongodb");
import { credentials } from "../database_credentials.js";

async function main() {
	const uri = credentials();

	const client = new MongoClient(uri);

	try {
		await client.connect();
		return client;
	} catch (error) {
		console.log(error);
	}
}

export const getSessions = async (req, res) => {
	const client = await main();
	if (req.query.sessionCode) {
		try {
			const session = await client
				.db("CrossmediaARG")
				.collection("sessions")
				.findOne({ sessionCode: req.query.sessionCode });
			res.status(200).send(session);
		} catch (error) {
			console.log(error);
		}
	} else {
		try {
			const sessions = await client.db("CrossmediaARG").collection("sessions").find({}).toArray();
			res.send(sessions);
		} catch (error) {
			console.log(error);
		}
	}
	await client.close();
};

export const createSession = async (req, res) => {
	const client = await main();
	try {
		let session = await client.db("CrossmediaARG").collection("sessions").insertOne(req.body);
		const createdSession = await client.db("CrossmediaARG").collection("sessions").findOne({ _id: session.insertedId });
		res.send(createdSession);
	} catch (error) {}
	await client.close();
};

export const getSessionsLive = async (req, res) => {
	console.log("open");

	res.setHeader("Content-Type", "text/event-stream");
	res.setHeader("Allow-Control-Allow-Origin", "*");
	var id = setInterval(async () => {
		const client = await main();
		const sessions = await client
			.db("CrossmediaARG")
			.collection("sessions")
			.findOne({ sessionCode: req.query.sessionCode });
		console.log(sessions);
		res.write(`data: ${JSON.stringify(sessions)}\n\n`);
		await client.close();
	}, 2000);
	console.log("send");

	res.on("close", () => {
		id._destroyed = true;
		clearInterval(id);
		console.log("Closed");
	});
};
// export const getSessionsLive = async (req, res) => {
// 	console.log("open");

// 	res.setHeader("Content-Type", "text/event-stream");
// 	res.setHeader("Allow-Control-Allow-Origin", "*");

// 	setInterval(async () => {
// 		const client = await main();
// 		const sessions = await client.db("CrossmediaARG").collection("sessions").find({}).toArray();
// 		res.write(`data: ${JSON.stringify(sessions)}\n\n`);
// 		await client.close();
// 	}, 2000);
// 	console.log("send");

// 	// res.on("close", () => {
// 	// 	console.log("Closed");
// 	// 	// clearInterval(intervalID);
// 	// 	res.end();
// 	// });
// };
export const updateSession = async (req, res) => {
	const client = await main();

	const filter = req.body.filter;
	const updates = req.body.updates;
	console.log(filter, updates);

	try {
		await client.db("CrossmediaARG").collection("sessions").updateOne(filter, updates);
		res.status(200).send({ message: "Updated session" });
	} catch (error) {
		console.log(error);
	}
	await client.close();
};
//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------

export const getAllPlayersInSession = async (req, res) => {
	console.log("open");

	res.setHeader("Content-Type", "text/event-stream");
	res.setHeader("Allow-Control-Allow-Origin", "*");

	setInterval(async () => {
		try {
			const client = await main();
			const usersInSession = await client.db("CrossmediaARG").collection("sessions").findOne(req.body.session);
			res.write(`data: ${JSON.stringify(usersInSession)}\n\n`);
			await client.close();
		} catch (error) {
			console.log(error);
		}
	}, 5000);
	console.log("send");

	// res.on("close", () => {
	//   console.log("Closed");
	//   // clearInterval(intervalID);
	//   res.end();
	// });
};
