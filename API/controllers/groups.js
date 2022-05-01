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
  const group = req.body;
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

  const filter = req.body.filter;
  const updates = { $push: req.body.updates };

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
