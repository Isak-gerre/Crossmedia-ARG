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

export const getPhase1 = async (req, res) => {
	const client = await main();
	let challenge = await client.db("CrossmediaARG").collection("challenges_phase_1").findOne({ challenge: 1 });
	res.send(challenge);
	await client.close();
};
