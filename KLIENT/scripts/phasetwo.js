"use strict";

// document.addEventListener("DOMContentLoaded", async () => {
// 	const user = JSON.parse(getFromLS("user"));
// 	const activeSession = user.session;
// 	const session = await getSessions("sessionCode", activeSession);
// 	const usersInSession = session.users;
// 	if (session.lobby) {
// 		window.location.href = "lobby.html";
// 	}
// });

<<<<<<< Updated upstream
var challengeData = "";
(async () => {
	await fetch(`${localhost}challenges/phase2`)
		.then((response) => response.json())
		.then((data) => (challengeData = data));
})();
// checkLoggedInPlayer();

const areWeDone = async () => {
	let group = await getGroupById(JSON.parse(getFromLS("user")).group);
	let session = await getSessions("sessionCode", group.session);
	console.log(group);
	if (group.completedChallenges.length == 15) {
		console.log("BAJJSSJKORV");
		console.log(session);
		if (session.phaseTwoTime == undefined) {
			let date = new Date();
			let time = date.getTime();
			time = time + 1000 * 60 * 14;
			await updateSession({
				filter: { sessionCode: session.sessionCode },
				updates: { $set: { phaseTwoTime: time } },
			});
		}
	}
	if (session.phaseTwoTime) {
		let phaseTwoTime = session.phaseTwoTime;
		let timerDiv = createElemAndClass("div", "timer");
		timerDiv.setAttribute("id", "timer");
		document.body.prepend(timerDiv);
		const timerInterval = setInterval(async () => {
			let date = new Date();
			let currentTime = date.getTime();
			let difference = phaseTwoTime - currentTime;

			let seconds = Math.round((difference / 1000) % 59);
			let minutes = Math.round((difference / (1000 * 60)) % 60);
			console.log(minutes + ":" + seconds);
			document.getElementById("timer").textContent = "You have: " + Math.round(difference / 1000) + " seconds left";
			if (minutes < 0 && seconds < 0) {
				await updateSession({
					filter: { sessionCode: session.sessionCode },
					updates: { $set: { phaseTwoTime: 0 } },
=======
const ws = new WebSocket("ws://localhost:8002");

ws.addEventListener("open", () => {
	console.log("New Client Connected");
});

let challengeData = "";
let timerOn = false;

fetch(`${localhost}challenges/phase2`)
	.then((response) => response.json())
	.then(async (data) => {
		challengeData = data;
		console.log(challengeData);
		let challenge = await challengeCheck();
		// checkLoggedInPlayer();
		const areWeDone = async () => {
			let group = await getGroupById(JSON.parse(getFromLS("user")).group);
			let session = await getSessions("sessionCode", group.session);
			console.log(group);
			if (group.completedChallenges.length == 16) {
				ws.send("done");
				if (timerOn) {
					return;
				}
				if (session.phaseTwoTime == undefined) {
					let date = new Date();
					let time = date.getTime();
					time = time + 1000 * 60 * 14;
					await updateSession({
						filter: { sessionCode: session.sessionCode },
						updates: { $set: { phaseTwoTime: time } },
					});
				}
			}
			if (session.phaseTwoTime) {
				let phaseTwoTime = session.phaseTwoTime;
				let timerDiv = createElemAndClass("div", "timer");
				timerDiv.setAttribute("id", "timer");
				document.body.prepend(timerDiv);
				const timerInterval = setInterval(async () => {
					let date = new Date();
					let currentTime = date.getTime();
					let difference = phaseTwoTime - currentTime;

					let seconds = Math.round((difference / 1000) % 59);
					let minutes = Math.round((difference / (1000 * 60)) % 60);
					document.getElementById("timer").textContent = "Du har: " + Math.round(difference / 1000) + " sekunder kvar";
					if (minutes < 0 && seconds < 0) {
						await updateSession({
							filter: { sessionCode: session.sessionCode },
							updates: { $set: { phaseTwoTime: 0 } },
						});
						clearInterval(timerInterval);
					}
				}, 1000);
			}
			timerOn = true;
		};

		ws.addEventListener("message", (data) => {
			if (data.data == "timer") {
				// areWeDone();
			}
		});

		areWeDone();
		async function checkChallenge(task, linje, position, lastPosition) {
			for (let i = 0; i <= 15; i++) {
				if (task == i) {
					return await renderChallenge(i, i, position, lastPosition, linje);
				}
			}
		}

		phaseCheck(2, async () => {
			let session = await getSessions("sessionCode", JSON.parse(getFromLS("user")).session);
			console.log(session);

			let task = challenge.task;

			let completed = challenge.completedChallenges.length;
			console.log("TASK", completed);

			let linje = challenge.linje;
			let position = challengeData[task].position;
			let lastPosition;
			if (task == 0) {
				lastPosition = challengeData[15].position;
			} else {
				lastPosition = challengeData[task - 1].position;
			}
			const content = await checkChallenge(task, linje, position, lastPosition);

			// createChallengeEntries( [challenges], [progress] )
			// skapad utefter följande array struktur:
			//test
			let challenges = [
				{
					id: 1,
					stages: [4],
					func: () => {},
				},
				{
					id: 2,
					stages: [4],
					func: () => {},
				},
				{
					id: 3,
					stages: [4],
					func: () => {},
				},
				{
					id: 4,
					stages: [4],
					func: () => {},
				},
			];
			const currentTask = (completed, id) => {
				completed++;
				let roof = id * 4;
				if (roof < completed) {
					return 4;
				}
				if (completed < roof - 4 && roof > completed) {
					return 0;
				}
				if (roof > completed) {
					return task % 4;
				}
				if (roof == completed) {
					return 3;
				}
			};
			const isStarted = (completed, id) => {
				return currentTask(completed, id) != 0 ? true : false;
			};
			let progress = [
				{
					id: 1,
					prog:
						currentTask(completed, 1) != 4 && currentTask(completed, 1) != 0
							? currentTask(completed, 1) - 1
							: currentTask(completed, 1),
					started: true,
				},
				{
					id: 2,
					prog:
						currentTask(completed, 2) != 4 && currentTask(completed, 2) != 0
							? currentTask(completed, 2) - 1
							: currentTask(completed, 2),
					started: isStarted(completed, 2),
				},
				{
					id: 3,
					prog:
						currentTask(completed, 3) != 4 && currentTask(completed, 3) != 0
							? currentTask(completed, 3) - 1
							: currentTask(completed, 3),
					started: isStarted(completed, 3),
				},
				{
					id: 4,
					prog:
						currentTask(completed, 4) != 4 && currentTask(completed, 4) != 0
							? currentTask(completed, 4) - 1
							: currentTask(completed, 4),
					started: isStarted(completed, 4),
				},
			];
			let challengeEntries = createChallengeEntries(challenges, progress);

			const groupInfo = await getGroups("session", JSON.parse(getFromLS("user")).session);
			let userGroupname = "";
			const groupInfoArray = groupInfo.map((group) => {
				if (group._id == JSON.parse(getFromLS("user")).group) {
					userGroupname = group.groupName;
				}
				return [group.groupName, parseInt(group.task), group.completedChallenges.length];
			});
			const progressInfo = createProgressionSection(groupInfoArray, 16);
			challengeEntries.prepend(createString(userGroupname));
			challengeEntries.append(progressInfo);

			const tabs = createTabs([
				{ header: "Översikt", content: challengeEntries },
				{ header: "Utmaningar", content: content },
			]);

			document.getElementById("phase-one-div").append(tabs);
		});

		async function renderChallenge(number, clueNumber, position, lastPosition, linje = "0") {
			let group = await getGroupById(JSON.parse(getFromLS("user")).group);
			let session = await getSessions("sessionCode", group.session);
			if (session.phaseTwoTime == 0) {
				await phaseOver(lastPosition);
				document.querySelector("button").addEventListener("click", async () => {
					console.log("hej");
					phaseOverLoad(lastPosition);
>>>>>>> Stashed changes
				});
				clearInterval(timerInterval);
			}
<<<<<<< Updated upstream
		}, 1000);
	}
};
areWeDone();
async function checkChallenge(task, linje, position, lastPosition) {
	for (let i = 0; i <= 15; i++) {
		if (task == i) {
			return await renderChallenge(i, i, position, lastPosition, linje);
=======

			setBodyState(["body-space-between"]);
			let distance = await getDiffrencePosition(position.latitude, position.longitude);

			let startDistane = await getDiffrencePositionScanner(
				position.latitude,
				position.longitude,
				lastPosition.latitude,
				lastPosition.longitude
			);

			let scannerStrength = scannerDistance(startDistane, distance);

			let scannerArray = [
				createString(scannerStrength),
				"För att kunna gå vidare måste signalstyrkan vara minst -30dBm",
			];

			let scannerButton = createButton("Skanna", () => {
				document.querySelector(".scannerContent p").innerHTML = scannerDistance(startDistane, distance);
			});

			scannerArray.push(scannerButton);

			let scanner = createContentBlock("Skanner", "h1", scannerArray, "scannerContent");

			let content = [];

			if (challengeData[number].img) {
				let img = document.createElement("img");
				img.src = `${challengeData[number].img}`;
				content.push(img);
			}

			content.push(challengeData[number].description);

			let input = createInputBoxes(challengeData[number].answerLength);

			let clue = createContentBlock(challengeData[number].title, "h1", content, "center");
			let button = createButton("skicka", async () => {
				let guess = checkAnswerBox();
				let answer = await checkAnswer("phase2", `${clueNumber}`, `${guess}`);
				if (distance < 100) {
					if (answer) {
						let group = JSON.parse(getFromLS("user")).group;

						let task = (clueNumber + 1) % 15;

						const groupFilter = { _id: group };
						let groupUpdates = { $push: { completedChallenges: String(task) }, $set: { task: String(task) } };

						let updates = 1;

						if (task == 4 || task == 8 || task == 12 || task == 16) {
							updates += updates + 0.25;
							groupUpdates = {
								$push: { completedChallenges: String(task) },
								$set: { task: String(task), linje: String((linje + 1) % 4), power: updates },
							};
						}

						let res = await updateGroup({
							filter: groupFilter,
							updates: groupUpdates,
						});
						window.location.href = "phase.html";
					} else {
						button.textContent = "Fel svar, testa igen";
						button.classList.add("button-accent");
						button.style.pointerEvents = "none";

						setTimeout(() => {
							button.classList.remove("button-accent");
							button.textContent = "skicka";
							button.style.pointerEvents = "unset";
						}, 1000);
					}
				} else {
					alert("Du är inte tillräckligt nära antennen");
				}
			});
			let div = document.createElement("div");
			div.append(clue, input, button, scanner);
			return div;
>>>>>>> Stashed changes
		}
	}
}

phaseCheck(2, async () => {
	let session = await getSessions("sessionCode", JSON.parse(getFromLS("user")).session);
	console.log(session);
	if (session.phaseTwoTime == 0) {
		printTerminalText(["Denna fasen är över, återvänd till kuben"]);
		//SCANNER HÄR
		return;
	}
	let challenge = await challengeCheck();
	let task = challenge.task;
	let linje = challenge.linje;
	let position = challengeData[task].position;
	let lastPosition;
	if (task == 0) {
		lastPosition = challengeData[15].position;
	} else {
		lastPosition = challengeData[task - 1].position;
	}
	const content = await checkChallenge(task, linje, position, lastPosition);

	// createChallengeEntries( [challenges], [progress] )
	// skapad utefter följande array struktur:
	let challenges = [
		{
			id: 1,
			stages: [4],
			func: () => {},
		},
		{
			id: 2,
			stages: [4],
			func: () => {},
		},
		{
			id: 3,
			stages: [4],
			func: () => {},
		},
		{
			id: 4,
			stages: [4],
			func: () => {},
		},
	];
	const currentTask = (task, id) => {
		task++;
		let roof = id * 4;
		if (roof < task) {
			return 4;
		}
		if (task < roof - 4 && roof > task) {
			return 0;
		}
		if (roof > task) {
			return task % 4;
		}
		if (roof == task) {
			return 3;
		}
	};
	const isStarted = (task, id) => {
		return currentTask(task, id) != 0 ? true : false;
	};
	let progress = [
		{
			id: 1,
			prog: currentTask(task, 1) != 4 && currentTask(task, 1) != 0 ? currentTask(task, 1) - 1 : currentTask(task, 1),
			started: true,
		},
		{
			id: 2,
			prog: currentTask(task, 2) != 4 && currentTask(task, 2) != 0 ? currentTask(task, 2) - 1 : currentTask(task, 2),
			started: isStarted(task, 2),
		},
		{
			id: 3,
			prog: currentTask(task, 3) != 4 && currentTask(task, 3) != 0 ? currentTask(task, 3) - 1 : currentTask(task, 3),
			started: isStarted(task, 3),
		},
		{
			id: 4,
			prog: currentTask(task, 4) != 4 && currentTask(task, 4) != 0 ? currentTask(task, 4) - 1 : currentTask(task, 4),
			started: isStarted(task, 4),
		},
	];
	let challengeEntries = createChallengeEntries(challenges, progress);

	const groupInfo = await getGroups("session", JSON.parse(getFromLS("user")).session);
	let userGroupname = "";
	const groupInfoArray = groupInfo.map((group) => {
		if (group._id == JSON.parse(getFromLS("user")).group) {
			userGroupname = group.groupName;
		}
		return [group.groupName, parseInt(group.task)];
	});
	const progressInfo = createProgressionSection(groupInfoArray, 16);
	challengeEntries.prepend(createString(userGroupname));
	challengeEntries.append(progressInfo);

	const tabs = createTabs([
		{ header: "Overview", content: challengeEntries },
		{ header: "Utmaningar", content: content },
	]);

	document.getElementById("phase-one-div").append(tabs);
});

async function renderChallenge(number, clueNumber, position, lastPosition, linje = "0") {
	setBodyState(["body-space-between"]);
	let distance = await getDiffrencePosition(position.latitude, position.longitude);

	let startDistane = await getDiffrencePositionScanner(
		position.latitude,
		position.longitude,
		lastPosition.latitude,
		lastPosition.longitude
	);

	let scannerStrength = scannerDistance(startDistane, distance);

	let scannerArray = [createString(scannerStrength), "För att kunna gå vidare måste signal styrkan vara minst -30dBm"];

	let scannerButton = createButton("Skanna", () => {
		document.querySelector(".scannerContent p").innerHTML = scannerDistance(startDistane, distance);
	});

	scannerArray.push(scannerButton);

	let scanner = createContentBlock("Skanner", "h1", scannerArray, "scannerContent");

	let content = [];

	if (challengeData[number].img) {
		let img = document.createElement("img");
		img.src = `${challengeData[number].img}`;
		content.push(img);
	}

	content.push(challengeData[number].description);

	let input = createInputBoxes(challengeData[number].answerLength);

	let clue = createContentBlock(challengeData[number].title, "h1", content, "center");
	let button = createButton("skicka", async () => {
		let guess = checkAnswerBox();
		let answer = await checkAnswer("phase2", `${clueNumber}`, `${guess}`);
		if (distance < 250000) {
			if (answer) {
				let group = JSON.parse(getFromLS("user")).group;

				let task = (clueNumber + 1) % 15;

				const groupFilter = { _id: group };
				let groupUpdates = { $push: { completedChallenges: String(task) }, $set: { task: String(task) } };

				if (task == 4 || task == 8 || task == 12 || task == 16) {
					groupUpdates = {
						$push: { completedChallenges: String(task) },
						$set: { task: String(task), linje: String((linje + 1) % 4) },
					};
				}

				let res = await updateGroup({
					filter: groupFilter,
					updates: groupUpdates,
				});
				window.location.href = "phase.html";
			} else {
				button.textContent = "Fel svar, testa igen";
				button.classList.add("button-accent");
				button.style.pointerEvents = "none";

				setTimeout(() => {
					button.classList.remove("button-accent");
					button.textContent = "skicka";
					button.style.pointerEvents = "unset";
				}, 1000);
			}
		} else {
			alert("You are not close enought to the antenna");
		}
	});
	let div = document.createElement("div");
	div.append(clue, input, button, scanner);
	return div;
}
