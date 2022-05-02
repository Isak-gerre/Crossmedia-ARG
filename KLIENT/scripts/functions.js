"use strict";

//LOCALSTORAGE FUNCTIONS
//--------------------------------------------------
if (getFromLS("user") == null && window.location.pathname != "/KLIENT/index.html") {
	window.location.pathname = "/KLIENT/index.html";
}
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
	let player = JSON.parse(localStorage.getItem("loggedInUser"));
	return (await logInPlayer(postData(player))) ? true : false;
}
async function logInPlayer(player) {
	let res = await fetch(`${localhost}players/login`, player);
	let loggedin = res.ok ? true : false;
	let playerData = await res.json();

	loggedin ? saveToLS("user", playerData) : null;
	return loggedin;
}
async function updateUserLS() {
	let player = JSON.parse(getFromLS("user"));
	await logInPlayer(player);
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
		saveToLS("user", data.player);
	} else {
		displayLoginErrorMessage("A user with that username already exits!");
	}
}
async function updatePlayer(update) {
	console.log(update);
	try {
		let res = await fetch(localhost + "players", postData(update, "PATCH"));
		if (res.ok) {
			let data = await res.json();
			await saveToLS("user", JSON.stringify(data));
		}
	} catch (error) {
		return error;
	}
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
async function getSessions(query, value) {
	let res = await fetch(`${localhost}sessions?${query}=${value}`);
	if (res.ok) {
		let data = await res.json();
		saveToLS("sessions", data);
		return data;
	} else {
		return false;
	}
}

async function joinSession(sessionCode) {
	const player = JSON.parse(getFromLS("user"));
	console.log(player);
	const playerFilter = { username: player.username, password: player.password };
	const playerUpdates = { session: sessionCode };

	const sessionFilter = { sessionCode: sessionCode };
	const sessionUpdates = { $push: { user: player.username } };

	try {
		await updatePlayer({
			filter: playerFilter,
			updates: playerUpdates,
		});
		await updateSession({
			filter: sessionFilter,
			updates: sessionUpdates,
		});
		return true;
	} catch (error) {
		console.log(error);
		return false;
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
		phase: 0,
	};
	let res = await fetch(`${localhost}sessions`, postData(postBody));
	if (res.ok) {
		return await res.json();
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
async function createGroup(sessionCode = "") {
	let postBody = {
		users: [],
		inSession: sessionCode,
	};
	let res = await fetch(`${localhost}groups`, postData(postBody));
	if (res.ok) {
		return await res.json();
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
