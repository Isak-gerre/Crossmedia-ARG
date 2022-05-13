"use strict";

async function renderPhase3() {
	const sessionCode = JSON.parse(getFromLS("user")).session;
	const player = JSON.parse(getFromLS("user"));
	const activeSession = await getSessions("sessionCode", sessionCode);
	if (activeSession.phase == 3) {
		// createChallengeGrid();
	}
}

async function renderGrid() {

	let challanges;

	await fetch("http://localhost:8000/challenges//phase3/get")
		.then(response => response.json())
		.then(data => challanges = data);

	console.log(challanges);

	let body = document.querySelector("body");
	
	body.append(createChallengeGrid(challanges, [0]));
}

function renderGame(gameID, style){
	console.log(style);
	let body = document.querySelector("body");
	body.innerHTML = "";
	game(gameID, style);
}

renderGrid(); 
renderPhase3();

