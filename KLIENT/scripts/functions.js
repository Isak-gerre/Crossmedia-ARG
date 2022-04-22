"use strict";

function get(category = "") {}

//LOCALSTORAGE FUNCTIONS
//--------------------------------------------------
function logInPlayer(player) {
  localStorage.setItem("loggedInUser", JSON.stringify(`ObjectId("${player}")`));
}
async function checkLoggedInPlayer() {
  await getPlayer("_id", JSON.parse(localStorage.getItem("loggedInUser")));
}

//PLAYERS
//--------------------------------------------------

async function createPlayer() {
  let formData = new FormData(document.getElementById("login-form"));
  formData.append("group", "0");
  formData.append("team", "0");
  formData.append("session", "0");
  formData.append("points", "0");

  let res = await fetch(localhost + "players", postFormData(formData));
  if (res.ok) {
    let data = await res.json();
    console.log(data);
    logInPlayer(data["_id"]);
  }
}

async function getPlayer(query, username) {
  let res = await fetch(`${localhost}players?${query}=${username}`);
  if (res.ok) {
    let player = await res.json();
    console.log(player);
    return player;
  }
}

//SESSIONS
//--------------------------------------------------
async function getSessions() {
  let res = await fetch(`${localhost}sessions`);
  if (res.ok) {
    let data = await res.json();
    console.log(data);
  }
}
async function createSession(userID) {
  let postBody = {
    creator: userID,
    users: [userID],
    sessionCode: makeSessionCode(6),
  };
  let res = await fetch(`${localhost}sessions`, postData(postBody));
  if (res.ok) {
    let data = await res.json();
    console.log(data);
  }
}

//GROUPS
//--------------------------------------------------

//TEAMS
//--------------------------------------------------

//LOGS
//--------------------------------------------------

function logFormData(formData) {
  for (var pair of formData.entries()) {
    console.log(pair[0] + ", " + pair[1]);
  }
}

//EVENTLISTENERS
//--------------------------------------------------

document.getElementById("sign-up").addEventListener("click", async (e) => {
  e.preventDefault();
  await createPlayer();
});

//POST DATA
//--------------------------------------------------

//Använd när du skickar med data from en <form> med FormData
function postFormData(formData) {
  let postData = JSON.stringify(Object.fromEntries(formData));
  let settings = {
    method: "POST",
    body: postData,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  return settings;
}

// Använd när man ska skicka ett vanligt object
function postData(postData) {
  let settings = {
    method: "POST",
    body: JSON.stringify(postData),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  return settings;
}

//RANDOM FUNCTIONS
//--------------------------------------------------
function makeSessionCode(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
