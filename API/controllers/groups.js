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

export const getGroup = async (req, res) => {
  const client = await main();
  console.log(req.query);
  const foundUser = await client.db("CrossmediaARG").collection("groups").findOne(req.query);
  res.send(foundUser);
  await client.close();
};

//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------

export const createGroup = async (req, res) => {
  const client = await main();
  const Group = req.body;
  console.log(req);
  const foundUser = await client.db("CrossmediaARG").collection("groups").findOne({ username: req.body.username });
  if (foundUser != null) {
    res.status(400).send({ message: "User already exists" });
  } else {
    try {
      const hashedPassword = await bcrypt.hash(Group.password, 10);
      Group.password = hashedPassword;
      await client.db("CrossmediaARG").collection("groups").insertOne(Group);
      res.status(201).send({ message: "Group created", Group: Group });
    } catch (error) {
      res.status(400).send({ message: "Something went wrong", error: error });
    }
  }
  await client.close();
};

//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------

export const loginGroup = async (req, res) => {
  const client = await main();
  const foundUser = await client.db("CrossmediaARG").collection("groups").findOne({ username: req.body.username });

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
export const updateGroup = async (req, res) => {
  const client = await main();

  const filter = req.body.filter;
  const updates = { $set: req.body.updates };

  try {
    await client.db("CrossmediaARG").collection("groups").updateOne(filter, updates);
    res.status(201).send({ message: "Updated Groups" });
  } catch (error) {
    console.log(error);
  }

  await client.close();
};
//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------
