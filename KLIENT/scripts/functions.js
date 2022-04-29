"use strict";

//LOCALSTORAGE FUNCTIONS
//--------------------------------------------------
function saveToLS(getter, setter) {
  if (typeof setter == "string") {
    localStorage.setItem(getter, setter);
  } else {
    localStorage.setItem(getter, JSON.stringify(setter));
  }
}
function getFromLS(getter) {
  return localStorage.getItem(getter);
}
async function checkLoggedInPlayer() {
  const player = JSON.parse(localStorage.getItem("loggedInUser"));
  return (await logInPlayer(postData(player))) ? true : false;
}
async function logInPlayer(player) {
  let res = await fetch(`${localhost}players/login`, player);
  let loggedin = res.ok ? true : false;
  let playerData = await res.json();
  loggedin ? saveToLS("user", playerData) : null;
  return loggedin;
}

//PLAYERS
//--------------------------------------------------

async function createPlayer() {
  let formData = new FormData(document.getElementById("sign-form"));
  formData.append("group", "0");
  formData.append("team", "0");
  formData.append("session", "0");
  formData.append("points", "0");

  let res = await fetch(localhost + "players", postFormData(formData));
  console.log(res);
  if (res.ok) {
    let data = await res.json();
    savePlayer({
      id: data.player["_id"],
      username: data.player.username,
      password: data.player.password,
    });
  } else {
    displayLoginErrorMessage("A user with that username already exits!");
  }
}
async function updatePlayer(update) {
  try {
    let res = await fetch(localhost + "players", postData(update, "PATCH"));
    if (res.ok) {
      saveToLS("user", res.json());
    }
    return res.json();
  } catch (error) {}
}

async function getPlayer(query, value) {
  let res = await fetch(`${localhost}players?${query}=${value}`);
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
async function updateSession(update) {
  let res = await fetch(localhost + "sessions", postData(update, "PATCH"));
  return res.json();
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
async function getGroup() {
  let res = await fetch(`${localhost}groups`);
  if (res.ok) {
    let data = await res.json();
    console.log(data);
  }
}
async function updateGroup(update) {
  let res = await fetch(localhost + "groups", postData(update, "PATCH"));
  return res.json();
}
async function createGroup(userID) {
  let postBody = {
    creator: userID,
    users: [userID],
    sessionCode: makeSessionCode(6),
  };
  let res = await fetch(`${localhost}groups`, postData(postBody));
  if (res.ok) {
    let data = await res.json();
    console.log(data);
  }
}
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

//POST DATA
//--------------------------------------------------

//Använd när du skickar med data from en <form> med FormData
function postFormData(formData, method = "POST") {
  let postData = JSON.stringify(Object.fromEntries(formData));
  let settings = {
    method: method,
    body: postData,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  return settings;
}

// Använd när man ska skicka ett vanligt object
function postData(postData, method = "POST") {
  let settings = {
    method: method,
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
function displayLoginErrorMessage(error) {
  document.querySelector("#error-messages").textContent = error;
}
