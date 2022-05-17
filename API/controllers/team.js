import { ObjectID } from "bson";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const { MongoClient, ObjectId } = require("mongodb");

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

export const getTeam = async (req, res) => {
	const client = await main();
	const foundTeams = await client.db("CrossmediaARG").collection("teams").find(req.query).toArray();
	res.send(foundTeams);
	await client.close();
};

export const getTeamId = async (req, res) => {
	const client = await main();
	console.log(req.params.id);
	const foundTeam = await client.db("CrossmediaARG").collection("teams").findOne(ObjectId(req.params.id));
	res.send(foundTeam);
	await client.close();
};

//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------

export const createTeam = async (req, res) => {
	const client = await main();
	let team = req.body;
	team.points = [];
	const foundTeam = await client.db("CrossmediaARG").collection("teams").findOne({ _id: req.body._id });
	if (foundTeam != null) {
		res.status(400).send({ message: "Team already exists" });
	} else {
		try {
			await client.db("CrossmediaARG").collection("teams").insertOne(team);
			res.status(201).send({ message: "created" });
		} catch (error) {
			res.status(400).send({ message: "Something went wrong", error: error });
		}
	}
	await client.close();
};

//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------
export const updateTeam = async (req, res) => {
	const client = await main();

	let filter = req.body.filter;
	if (req.body.filter._id) {
		filter = { _id: ObjectId(req.body.filter._id) };
	}
	const updates = req.body.updates;
	console.log(filter, updates);

	try {
		let team = await client.db("CrossmediaARG").collection("teams").updateOne(filter, updates);
		console.log(team);
		res.status(201).send(team);
	} catch (error) {
		console.log(error);
	}

	await client.close();
};
//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------
