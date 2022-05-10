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
	console.log("hej")
	await fetch("http://localhost:8000/challenges/phase2")
		.then((response) => response.json())
		.then((data) => (challengeData = data));
})();

phaseCheck(2, async () => {
	console.log("hej1")
	let challenge = await challengeCheck();
	let task = challenge.task;
	let linje = challenge.linje;
	let position = challengeData[task].position;
	console.log(position);

	for(let i = 0; i <= 15; i++){
		if(task == i){
			renderChallenge(i, i, position.latitude, position.longitude, linje)
		}
	}
});

async function renderChallenge(challengedata, clueNumber, lat, long, linje = "0") {
	let clue = createContentBlock(challengeData[challengedata].title, "h1", challengeData[challengedata].description);
	let input = createInput("answer", `clue_${clueNumber}`, "name");
	let button = createButton("button text", async () => {
		let guess = document.getElementById(`clue_${clueNumber}`).value;
		let answer = await checkAnswer("phase2", `${clueNumber}`, `${guess}`);
		let distance = await getDiffrencePosition(lat, long);
		console.log(distance);
		if(distance < 25000){
			if (answer) {
				let group = JSON.parse(getFromLS("user")).group;
	
				let task = (clueNumber + 1) % 16;
	
				const groupFilter = { _id: group };
				let groupUpdates = { $set: { task: String(task) } };
	
				if (task == 4 || task == 8 || task == 12 || task == 16) {
					console.log("ye")
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
		}
		else{
			alert("You are not close enought to the antenna");
		}
		
	});
	document.getElementById("phase-one-div").append(clue, input, button);
}

// async function renderChallenge_2_1_1() {
// 	let clue = createContentBlock(challengeData[0].title, "h1", challengeData[0].description);
// 	let input = createInput("answer", "clue_1", "name");
// 	let button = createButton("button text", async () => {
// 		let guess = document.getElementById("clue_1").value;
// 		let answer = await checkAnswer("phase2", "1", `${guess}`);
// 		if (answer) {
// 			let group = JSON.parse(getFromLS("user")).group;
// 			console.log(group);
// 			const groupFilter = { id: group };
// 			const groupUpdates = { $set: { task: "2" } };

// 			let res = await updateGroup({
// 				filter: groupFilter,
// 				updates: groupUpdates,
// 			});

// 			window.location.href = "phase.html";
// 		} else {
// 			alert("Wrong Answer Try Again");
// 		}
// 	});
// 	document.getElementById("phase-one-div").append(clue, input, button);
// }

// async function renderChallenge_2_1_2() {
// 	let clue = createContentBlock(challengeData[1].title, "h1", challengeData[1].description);
// 	let input = createInput("answer", "clue_2", "name");
// 	let button = createButton("button text", async () => {
// 		let guess = document.getElementById("clue_2").value;
// 		let answer = await checkAnswer("phase2", "2", `${guess}`);
// 		if (answer) {
// 			let group = JSON.parse(getFromLS("user")).group;
// 			console.log(group);
// 			const groupFilter = { id: group };
// 			const groupUpdates = { $set: { task: "3" } };

// 			let res = await updateGroup({
// 				filter: groupFilter,
// 				updates: groupUpdates,
// 			});
// 			window.location.href = "phase.html";
// 		} else {
// 			alert("Wrong Answer Try Again");
// 		}
// 	});
// 	document.getElementById("phase-one-div").append(clue, input, button);
// }

// async function renderChallenge_2_1_3() {
// 	let clue = createContentBlock(challengeData[2].title, "h1", challengeData[2].description);
// 	let input = createInput("answer", "clue_3", "name");
// 	let button = createButton("button text", async () => {
// 		let guess = document.getElementById("clue_3").value;
// 		let answer = await checkAnswer("phase2", "3", `${guess}`);
// 		if (answer) {
// 			let group = JSON.parse(getFromLS("user")).group;
// 			console.log(group);
// 			const groupFilter = { id: group };
// 			const groupUpdates = { $set: { task: "4" } };

// 			let res = await updateGroup({
// 				filter: groupFilter,
// 				updates: groupUpdates,
// 			});
// 			window.location.href = "phase.html";
// 		} else {
// 			alert("Wrong Answer Try Again");
// 		}
// 	});
// 	document.getElementById("phase-one-div").append(clue, input, button);
// }

// async function renderChallenge_2_1_4() {
// 	let clue = createContentBlock(challengeData[3].title, "h1", challengeData[3].description);
// 	let input = createInput("answer", "clue_4", "name");
// 	let button = createButton("button text", async () => {
// 		let guess = document.getElementById("clue_4").value;
// 		let answer = await checkAnswer("phase2", "4", `${guess}`);
// 		if (answer) {
// 			let group = JSON.parse(getFromLS("user")).group;
// 			console.log(group);
// 			const groupFilter = { id: group };
// 			const groupUpdates = { $set: { task: "5" } };

// 			let res = await updateGroup({
// 				filter: groupFilter,
// 				updates: groupUpdates,
// 			});
// 			window.location.href = "phase.html";
// 		} else {
// 			alert("Wrong Answer Try Again");
// 		}
// 	});
// 	document.getElementById("phase-one-div").append(clue, input, button);
// }
