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

let challengeData = "";
(async () => {
	console.log("hej");
	await fetch("http://localhost:8000/challenges/phase2")
		.then((response) => response.json())
		.then((data) => (challengeData = data));
})();

async function checkChallenge(task, linje, position) {
	for (let i = 0; i <= 15; i++) {
		if (task == i) {
			return await renderChallenge(i, i, position.latitude, position.longitude, linje);
		}
	}
}

phaseCheck(2, async () => {
	let challenge = await challengeCheck();
	let task = challenge.task;
	let linje = challenge.linje;
	let position = challengeData[task].position;

	const content = await checkChallenge(task, linje, position);
	console.log(content);

	// createChallengeEntries( [challenges], [progress] )
	// skapad utefter följande array struktur:
	// let challenges = [
	// 	{id: 1, stages: [4], func: ()=>{console.log("one")} },	<--**func kallas vid klick**
	// 	{id: 2, stages: [4], func: ()=>{console.log("two")} },
	// ]

	// let progress = [
	// 	{id: 2, prog:4, started: true},
	// 	{id: 1, prog:4, started: true},
	// ]
	// createChallengeEntries();

	const tabs = createTabs([
		{ header: "Overview", content: content },
		{ header: "Utmaningar", content: content },
	]);
	document.getElementById("phase-one-div").append(tabs);
});

async function renderChallenge(challengedata, clueNumber, lat, long, linje = "0") {
	let clue = createContentBlock(challengeData[challengedata].title, "h1", challengeData[challengedata].description);
	let input = createInput("answer", `clue_${clueNumber}`, "name");
	let button = createButton("button text", async () => {
		let guess = document.getElementById(`clue_${clueNumber}`).value;
		let answer = await checkAnswer("phase2", `${clueNumber}`, `${guess}`);
		let distance = await getDiffrencePosition(lat, long);
		console.log(distance);
		if (distance < 25000) {
			if (answer) {
				let group = JSON.parse(getFromLS("user")).group;

				let task = (clueNumber + 1) % 15;

				const groupFilter = { _id: group };
				let groupUpdates = { $set: { task: String(task) } };

				if (task == 4 || task == 8 || task == 12 || task == 16) {
					console.log("ye");
					groupUpdates = { $set: { task: String(task), linje: String((linje + 1) % 4) } };
				}

				let res = await updateGroup({
					filter: groupFilter,
					updates: groupUpdates,
				});
				window.location.href = "phase.html";
			} else {
				alert("Wrong Answer Try Again");
			}
		} else {
			alert("You are not close enought to the antenna");
		}
	});
	let div = document.createElement("div");
	div.append(clue, input, button);
	return div;
}
