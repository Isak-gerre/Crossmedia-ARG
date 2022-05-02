import { createRequire } from "module";
const require = createRequire(import.meta.url);

const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");

import { credentials } from "../database_credentials.js";

// Koppla upp sig till databasen
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

export const getPlayer = async (req, res) => {
	const client = await main();
	console.log(req.query);
	const foundUser = await client.db("CrossmediaARG").collection("players").findOne(req.query);
	res.send(foundUser);
	await client.close();
};

//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------

export const createPlayer = async (req, res) => {
	const client = await main();
	const player = req.body;
	console.log(req);
	const foundUser = await client.db("CrossmediaARG").collection("players").findOne({ username: req.body.username });
	if (foundUser != null) {
		res.status(400).send({ message: "User already exists" });
	} else {
		try {
			const hashedPassword = await bcrypt.hash(player.password, 10);
			player.password = hashedPassword;
			await client.db("CrossmediaARG").collection("players").insertOne(player);
			res.status(201).send({ message: "Player created", player: player });
		} catch (error) {
			res.status(400).send({ message: "Something went wrong", error: error });
		}
	}
	await client.close();
};

//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------

export const loginPlayer = async (req, res) => {
	const client = await main();
	const foundUser = await client.db("CrossmediaARG").collection("players").findOne({ username: req.body.username });

	if (foundUser == null) {
		res.status(404).send({ message: "User not found" });
	} else {
		try {
			if (req.body.password === foundUser.password || (await bcrypt.compare(req.body.password, foundUser.password))) {
				res.status(200).send(foundUser);
			} else {
				res.status(400).send(false);
			}
		} catch (error) {
			res.status(500).send();
		}
	}

	await client.close();
};
//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------
export const updatePlayer = async (req, res) => {
	const client = await main();

	const filter = req.body.filter;
	const updates = { $set: req.body.updates };
	console.log(filter);

	try {
		await client.db("CrossmediaARG").collection("players").updateOne(filter, updates);
		const foundUser = await client.db("CrossmediaARG").collection("players").findOne(filter);
		console.log(foundUser);
		res.status(201).send(foundUser);
	} catch (error) {
		console.log(error);
	}

	await client.close();
};
//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------
