import { createRequire } from "module";
const require = createRequire(import.meta.url);

const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
const passport = require("passport");

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
  const foundUser = await client.db("CrossmediaARG").collection("players").findOne(req.query);
  res.send(foundUser);
  await client.close();
};

export const createPlayer = async (req, res) => {
  const client = await main();
  const player = req.body;
  console.log(req);
  try {
    const hashedPassword = await bcrypt.hash(player.password, 10);
    player.password = hashedPassword;
    await client.db("CrossmediaARG").collection("players").insertOne(player);
    res.status(201).send({ message: "Player created" });
  } catch (error) {
    res.status(400).send({ message: "Something went wrong", error: error });
  }
  await client.close();
};

export const loginPlayer = async (req, res) => {
  const client = await main();
  const foundUser = await client.db("CrossmediaARG").collection("players").findOne({ username: req.body.username });
  if (foundUser == null) {
    res.status(404).send({ message: "User not found" });
  }
  try {
    if (await bcrypt.compare(req.body.password, foundUser.password)) {
      res.status(200).send(true);
    } else {
      res.status(500).send(false);
    }
  } catch (error) {
    res.status(500).send();
  }

  await client.close();
};

export const updatePlayer = async (req, res) => {
  const client = await main();

  await client.close();
};
