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

	}
}
//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------

export const getGroup = async (req, res) => {
	const client = await main();
	const foundGroups = await client.db("CrossmediaARG").collection("groups").find(req.query).toArray();

	res.send(foundGroups);
	await client.close();
};

export const getGroupId = async (req, res) => {
	const client = await main();

	const foundGroup = await client.db("CrossmediaARG").collection("groups").findOne(ObjectId(req.params.id));
	res.send(foundGroup);
	await client.close();
};

//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------

export const createGroup = async (req, res) => {
	const client = await main();
	const group = req.body;
	group.completedChallenges = [];
	const foundGroup = await client.db("CrossmediaARG").collection("groups").findOne({ _id: req.body._id });
	if (foundGroup != null) {
		res.status(400).send({ message: "Group already exists" });
	} else {
		try {
			await client.db("CrossmediaARG").collection("groups").insertOne(group);
			res.status(201).send({ groupID: group._id });
		} catch (error) {
			res.status(400).send({ message: "Something went wrong", error: error });
		}
	}
	await client.close();
};

//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------
export const updateGroup = async (req, res) => {
	const client = await main();

	let filter = req.body.filter;
	if (req.body.filter._id) {
		filter = { _id: ObjectId(req.body.filter._id) };
	}
	const updates = req.body.updates;


	try {
		let group = await client.db("CrossmediaARG").collection("groups").updateOne(filter, updates);

		res.status(201).send(group);
	} catch (error) {

	}

	await client.close();
};
export const updatePlayers = async (req, res) => {
	const client = await main();

	const sessionCode = req.body.sessionCode;

	try {
		const foundGroups = await client.db("CrossmediaARG").collection("groups").find({ session: sessionCode }).toArray();

		foundGroups.forEach(async (group) => {
			group.users.forEach(async (user) => {
				const filter = { username: user };
				const updates = { $set: { group: group._id } };
				let updated = await client.db("CrossmediaARG").collection("groups").updateOne(filter, updates);

			});
		});
	} catch (error) {
	}

	await client.close();
};
//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------
