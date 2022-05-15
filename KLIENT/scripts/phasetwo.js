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

var challengeData = "";
(async () => {
	console.log("hej");
	await fetch(`${localhost}challenges/phase2`)
		.then((response) => response.json())
		.then((data) => (challengeData = data));
})();

async function checkChallenge(task, linje, position, lastPosition) {
	for (let i = 0; i <= 15; i++) {
		if (task == i) {
			return await renderChallenge(i, i, position, lastPosition, linje);
		}
	}
}

phaseCheck(2, async () => {
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
	console.log(challenge);

	// createChallengeEntries( [challenges], [progress] )
	// skapad utefter följande array struktur:
	let challenges = [
		{
			id: 1,
			stages: [4],
			func: () => {
				console.log("one");
			},
		},
		{
			id: 2,
			stages: [4],
			func: () => {
				console.log("two");
			},
		},
		{
			id: 3,
			stages: [4],
			func: () => {
				console.log("one");
			},
		},
		{
			id: 4,
			stages: [4],
			func: () => {
				console.log("two");
			},
		},
	];
	const currentTask = (task, id) => {
		let roof = id * 4;
		console.log(task % roof);
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
			prog: currentTask(task, 1) != 4 && currentTask(task, 1) != 0 ? currentTask(task, 1) : currentTask(task, 1),
			started: true,
		},
		{
			id: 2,
			prog: currentTask(task, 2) != 4 && currentTask(task, 2) != 0 ? currentTask(task, 2) : currentTask(task, 2),
			started: isStarted(task, 2),
		},
		{
			id: 3,
			prog: currentTask(task, 3) != 4 && currentTask(task, 3) != 0 ? currentTask(task, 3) : currentTask(task, 3),
			started: isStarted(task, 3),
		},
		{
			id: 4,
			prog: currentTask(task, 4) != 4 && currentTask(task, 4) != 0 ? currentTask(task, 4) : currentTask(task, 4),
			started: isStarted(task, 4),
		},
	];
	let challengeEntries = createChallengeEntries(challenges, progress);

	const groupInfo = await getGroups("session", JSON.parse(getFromLS("user")).session);
	const groupInfoArray = groupInfo.map((group) => {
		return [group.groupName, parseInt(group.task)];
	});
	console.log(groupInfoArray);
	const progressInfo = createProgressionSection(groupInfoArray, 16);
	challengeEntries.append(progressInfo);

	const tabs = createTabs([
		{ header: "Overview", content: challengeEntries },
		{ header: "Utmaningar", content: content },
	]);

	document.getElementById("phase-one-div").append(tabs);
});

async function renderChallenge(number, clueNumber, position, lastPosition, linje = "0") {
	setBodyState(["body-space-between"]);
	console.log(position);
	let distance = await getDiffrencePosition(position.latitude, position.longitude);

	let startDistane = await getDiffrencePositionScanner(
		position.latitude,
		position.longitude,
		lastPosition.latitude,
		lastPosition.longitude
	);

	console.log(startDistane);

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
		console.log(distance);
		if (distance < 25000) {
			if (answer) {
				let group = JSON.parse(getFromLS("user")).group;

				let task = (clueNumber + 1) % 15;

				const groupFilter = { _id: group };
				let groupUpdates = { $set: { task: String(task) } };

				if (task == 4 || task == 8 || task == 12 || task == 16) {
					groupUpdates = { $set: { task: String(task), linje: String((linje + 1) % 4) } };
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
