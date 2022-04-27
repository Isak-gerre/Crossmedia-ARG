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

export const getSessions = async (req, res) => {
  const client = await main();
  console.log(req.query);
  const sessions = await client.db("CrossmediaARG").collection("sessions").find({}).toArray();
  res.send(sessions);
  console.log(sessions);
  await client.close();
};

export const createSession = async (req, res) => {
  const client = await main();
  console.log(req);
  await client.db("CrossmediaARG").collection("sessions").insertOne(req.body);
  res.send(req.body);
  await client.close();
};

export const getSessionsLive = async (req, res) => {
  console.log("open");

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Allow-Control-Allow-Origin", "*");

  setInterval(async () => {
    const client = await main();
    const sessions = await client.db("CrossmediaARG").collection("sessions").find({}).toArray();
    res.write(`data: ${JSON.stringify(sessions)}\n\n`);
    await client.close();
  }, 3000);
  console.log("send");

  // res.on("close", () => {
  //   console.log("Closed");
  //   // clearInterval(intervalID);
  //   res.end();
  // });
};
export const updateSession = async (req, res) => {
  const client = await main();

  await client.close();
};
