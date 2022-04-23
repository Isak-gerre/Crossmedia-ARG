import { createRequire } from "module";
const require = createRequire(import.meta.url);

const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
const passport = require("passport");

import { credentials } from "../database_credentials.js";
import { initializePassport } from "../passport-config.js";
initializePassport(passport);

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
  console.log(foundUser);
  await client.close();
};

export const createPlayer = async (req, res) => {
  const client = await main();
  const player = req.body;
  console.log(req);
  try {
    const hashedPassword = await bcrypt.hash(player.password, 10);
    player.password = hashedPassword;
  } catch (error) {}
  await client.db("CrossmediaARG").collection("players").insertOne(player);
  res.send(req.body);
  await client.close();
};

export const updatePlayer = async (req, res) => {
  const client = await main();

  await client.close();
};
