"use strict";

let progress = [];

renderPhase3();

async function renderPhase3() {
	const sessionCode = JSON.parse(getFromLS("user")).session;
	const player = JSON.parse(getFromLS("user"));
	const activeSession = await getSessions("sessionCode", sessionCode);
	if (activeSession.phase == 3) {
		renderTimer(activeSession);
		if (activeSession.phaseThreeTime == 0) {
			// KÖR CALCULATE POINTS HÄR
		} else {
			renderGrid();
		}
	}
}

async function renderTimer(activeSession) {
	if (activeSession.phaseThreeTime == undefined) {
		let date = new Date();
		let time = date.getTime();
		let minutes = 1000 * 60;
		time = time + minutes * 10;
		await updateSession({
			filter: { sessionCode: session.sessionCode },
			updates: { $set: { phaseThreeTime: time } },
		});
		window.location.reload();
	}
	if (session.phaseThreeTime) {
		let phaseTwoTime = session.phaseTwoTime;
		let timerDiv = createElemAndClass("div", "timer");
		timerDiv.setAttribute("id", "timer");
		document.body.prepend(timerDiv);
		const timerInterval = setInterval(async () => {
			let date = new Date();
			let currentTime = date.getTime();
			let difference = phaseTwoTime - currentTime;

			document.getElementById("timer").textContent = "You have: " + Math.round(difference / 1000) + " seconds left";
			if (Math.round(difference / 1000) < 0) {
				await updateSession({
					filter: { sessionCode: session.sessionCode },
					updates: { $set: { phaseTwoTime: 0 } },
				});
				clearInterval(timerInterval);
				window.location.reload();
			}
		}, 1000);
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
	console.log(gameID);
	const player = JSON.parse(getFromLS("user"));
	const group = await getGroupById(JSON.parse(getFromLS("user")).group);
	const power = group.power;

	let body = document.querySelector("body");
	body.innerHTML = "";

	const getGame = { game: gameID };
	const game = await fetch(localhost + "challenges/cgame", postData(getGame));
	const gameJson = await game.json();
	const arrayOfGameImages = gameJson.images;

	let div = document.createElement("div");
	let button = document.createElement("button");

	div.classList.add("divCableParent", style);
	div.setAttribute("id", getGame.game);
	button.setAttribute("game", gameID);
	button.innerHTML = "gå vidare";
	button.addEventListener("click", async (e) => {
		console.log("Rättar");
		let divs = document.querySelectorAll(".tile");
		let rotations = [];
		divs.forEach((tile) => {
			rotations.push(`${tile.style.transform}`);
		});
		let answer = await getSvar(gameID, rotations);

		if (answer == true) {
			let points = 100;
			if (gameID.includes("M")) {
				points = 200;
			}
			if (gameID.includes("H")) {
				points = 300;
			}
			body.innerHTML = "";

			let totalPoints = points * power;
			console.log(power);

			const playerFilter = { username: player.username };
			const playerUpdates = { $push: { points: totalPoints, completed: gameID } };

			console.log(player.username, player.points, player.completed);

			updatePlayer({
				filter: playerFilter,
				updates: playerUpdates,
			});

			renderGrid();
		}
	});

	document.querySelector("body").append(div);
	document.querySelector("body").append(button);
	let arrayOfDivs = makeDiv(arrayOfGameImages);
	arrayOfDivs.forEach((element) => {
		div.append(element);
	});

	renderGrid();
}

async function calculateTeamPoints() {
	const player = JSON.parse(getFromLS("user"));
	let teams = await getTeam("session", player.session);
	console.log(teams);
	let team1;
	let team2;
	teams.forEach((team) => {
		let allPlayersTotalPoints = 0;
		team.points.forEach((pointArray) => {
			allPlayersTotalPoints += pointArray.reduce((a, b) => a + b, 0);
		});
		let teamPoints = allPlayersTotalPoints / team.points.length;
		if (team.team == 1) {
			team1 = teamPoints;
		} else {
			team2 = teamPoints;
		}
	});

	if (team1 > team2) {
		//Goda vinner
	} else {
		//Onda vinner
	}
}

// calculateTeamPoints();
