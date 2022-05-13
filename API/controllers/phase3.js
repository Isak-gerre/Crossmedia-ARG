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

export const getPhase3 = async (req, res) => {
	const client = await main();
	console.log(req.query);

	await client.close();
};
export const checkAnswer = async (req, res) => {
	const client = await main();
	const sentLevel = req.body.level;
	const rotations = req.body.rotations;

	const cables = await client.db("CrossmediaARG").collection("challenges_phase_3").findOne({ type: "cable" });
	const answers = cables.answers;

	let foundAnswer = answers.find(({ level }) => level == "svar" + sentLevel);
	let formattedSvar = formatSvar(foundAnswer.answer);
	console.log(rotations);

	if (arraysEqual(formattedSvar, rotations)) {
		res.send(true);
	} else {
		res.send(false);
	}

	await client.close();
};

function formatSvar(arr) {
	let format = arr.map((deg) => {
		return `rotate(${deg}deg)`;
	});
	return format;
}
function arraysEqual(a1, a2) {
	/* WARNING: arrays must not contain {objects} or behavior may be undefined */
	return JSON.stringify(a1) == JSON.stringify(a2);
}
