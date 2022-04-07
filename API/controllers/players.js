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

export const getPlayer = async (req, res) => {
  const client = await main();
  console.log(req.query);

  await client.close();
};

export const createPlayer = async (req, res) => {
  const client = await main();
  console.log(req.body);
  await client.db("CrossmediaARG").collection("players").insertOne(req.body);
  res.send(req.body);
  await client.close();
};

export const updatePlayer = async (req, res) => {
  const client = await main();

  await client.close();
};
