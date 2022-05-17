"use strict";


let progress = [];

renderPhase3();

async function renderPhase3() {
	console.count();
	const sessionCode = JSON.parse(getFromLS("user")).session;
	const player = JSON.parse(getFromLS("user"));
	const activeSession = await getSessions("sessionCode", sessionCode);
	if (activeSession.phase == 3) {
		// createChallengeGrid();
		renderGrid();
	}
}

async function renderGrid() {
	const player = JSON.parse(getFromLS("user"));
	let challanges;

	await fetch(`${localhost}challenges/phase3/get`)
		.then((response) => response.json())
		.then((data) => (challanges = data));

	console.log(challanges);

	let upToDateuser = await getPlayer("username", player.username);

	let body = document.querySelector("body");

	body.append(createChallengeGrid(challanges, upToDateuser.completed));
}

async function renderGame(gameID, style) {
	const player = JSON.parse(getFromLS("user"));
	const group = await getGroupById(JSON.parse(getFromLS("user")).group);
	const power = group.power

	let body = document.querySelector("body");
	body.innerHTML = "";

	let answer = await game(gameID, style);

	if (answer == true) {
		let points = 100;
		if (gameID.includes("M")) {
			points = 200;
		}
		if (gameID.includes("H")) {
			points = 300;
		}
		body.innerHTML = "";

		const playerFilter = { username: player.username };
		const playerUpdates = { $push: { points: points * power, completed: gameID } };

		console.log(player.username, player.points);

		updatePlayer({
			filter: playerFilter,
			updates: playerUpdates,
		});

		renderGrid();
	}
}

// async function calculateTeamPoints() {

// }
