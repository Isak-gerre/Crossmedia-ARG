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
//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------

export const getPhase2 = async (req, res) => {
	const client = await main();
	let challenge = await client.db("CrossmediaARG").collection("challenges_phase_2").find({}).toArray();

	let challengeNA = [];

	challenge.forEach((element) => {
		delete element.answer;
		challengeNA.push(element);
	});

	res.send(challengeNA);

	await client.close();
};

export const getChallenge2 = async (req, res) => {
	const client = await main();
	console.log(req.query.id);
	let challenge = await client
		.db("CrossmediaARG")
		.collection("challenges_phase_2")
		.findOne({ id: `${req.query.id}` });

	if (challenge.answer == req.query.guess) {
		res.send(true);
	} else {
		res.send(false);
	}

	await client.close();
};
