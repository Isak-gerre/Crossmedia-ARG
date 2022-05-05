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
	let challange = await client.db("CrossmediaARG").collection("challenges_phase_2").find({}).toArray();
	
	let challangeNA = [];

	challange.forEach(element => {
		delete element.answer
		challangeNA.push(element);
	});

	res.send(challangeNA);

	await client.close();
};

export const getChallange2 = async (req, res) => {
	const client = await main();
	console.log(req.query.id);
	let challange = await client.db("CrossmediaARG").collection("challenges_phase_2").findOne({"id": `${req.query.id}`});
	
	if(challange.answer == req.query.guess){
		res.send(true);
	}
	else{
		res.send(false);
	}
	
	await client.close();
};