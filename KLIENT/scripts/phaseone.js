"use strict";

phaseCheck(1, async () => {
	renderChallenge_1();
});

async function renderChallenge_1() {
	let challengeData = "";

	await fetch(`${localhost}challenges/phase1`)
		.then((response) => response.json())
		.then((data) => (challengeData = data));

	let position = challengeData.position;

	let text = challengeData.text;
	console.log(challengeData);

	document.getElementById("phase-one-div").innerHTML = "";

	let block2 = createContentBlock("", "h1", text[2]);
	let block3 = createContentBlock("", "h1", text[3]);
	let block4 = createContentBlock("", "h1", text[4]);
	let block5 = createContentBlock("", "h1", text[5]);
	let block6 = createContentBlock("", "h1", text[6]);
	let block7 = createContentBlock("", "h1", text[7]);

	let button2 = createButton("jag har hittat kuben", async () => {

			document.getElementById("phase-one-div").innerHTML = "";
			let block = createContentBlock("Du hittade Kuben", "h1", text[8]);
			let button3 = createButton("nästa", async () => {
				const user = JSON.parse(getFromLS("user"));
				const activeSession = user.session;
				const sessionFilter = { sessionCode: activeSession };
				const sessionUpdates = { $set: { phase: 1, lobby: true } };

				await updateSession({
					filter: sessionFilter,
					updates: sessionUpdates,
				});
				window.location.href = "lobby.html";
			});
			document.getElementById("phase-one-div").append(block, button3);

	});

	document.getElementById("phase-one-div").append(block2, block3, block4, block5, block6, block7, button2);
}

phaseCheck();
