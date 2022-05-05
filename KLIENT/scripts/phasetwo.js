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

let challangeData = "";
(async () => {
	await fetch("http://localhost:8000/challenges/phase2")
		.then((response) => response.json())
		.then((data) => (challangeData = data));
})();

phaseCheck(2, async () => {
	let challange = await challangeCheck();
	let task = challange.task;
	let linje = challange.linje;

	if (linje == 1) {
		if (task == 0 || task == 1) {
			renderChallange_2_1_1();
		} else if (task == 2) {
			renderChallange_2_1_2();
		} else if (task == 3) {
			renderChallange_2_1_3();
		} else if (task == 4) {
			renderChallange_2_1_4();
		}
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
		else{

			if(linje == 4){
				linje = 1;
			}
			else{
				linje += linje;
			}

			let group = JSON.parse(getFromLS("user")).group;
			const groupFilter = {id: group};
			const groupUpdates = { $set: {linje: linje} };
	
=======
=======
>>>>>>> c39760a104b6be1a28c58f0bb44c6ebac2613ef1
	} else if (linje == 2) {
		console.log("1");
	}
});

async function renderChallange(challangedata, clueNumber) {
	let clue = createContentBlock(challangeData[challangedata].title, "h1", challangeData[challangedata].description);
	let input = createInput("answer", `clue_${clueNumber}`, "name");
	let button = createButton("button text", async () => {
		let guess = document.getElementById(`clue_${clueNumber}`).value;
		let answer = await checkAnswer("phase2", clueNumber, `${guess}`);
		if (answer) {
			let group = JSON.parse(getFromLS("user")).group;
			console.log(group);
			let task = toString(clueNumber + (1 % 5));
			const groupFilter = { id: group };
			const groupUpdates = { $set: { task: task } };

<<<<<<< HEAD
>>>>>>> c39760a104b6be1a28c58f0bb44c6ebac2613ef1
=======
>>>>>>> c39760a104b6be1a28c58f0bb44c6ebac2613ef1
			let res = await updateGroup({
				filter: groupFilter,
				updates: groupUpdates,
			});
<<<<<<< HEAD
<<<<<<< HEAD
			window.location.href = "phase.html"
		}
	}
	else if(linje == 2){
=======
	} else if (linje == 2) {
>>>>>>> c39760a104b6be1a28c58f0bb44c6ebac2613ef1
		console.log("1");
	}
});

async function renderChallange(challangedata, clueNumber) {
	let clue = createContentBlock(challangeData[challangedata].title, "h1", challangeData[challangedata].description);
	let input = createInput("answer", `clue_${clueNumber}`, "name");
	let button = createButton("button text", async () => {
		let guess = document.getElementById(`clue_${clueNumber}`).value;
		let answer = await checkAnswer("phase2", clueNumber, `${guess}`);
		if (answer) {
			let group = JSON.parse(getFromLS("user")).group;
			console.log(group);
			let task = toString(clueNumber + (1 % 5));
			const groupFilter = { id: group };
			const groupUpdates = { $set: { task: task } };

			let res = await updateGroup({
				filter: groupFilter,
				updates: groupUpdates,
			});
=======
>>>>>>> c39760a104b6be1a28c58f0bb44c6ebac2613ef1
=======
>>>>>>> c39760a104b6be1a28c58f0bb44c6ebac2613ef1

			window.location.href = "phase.html";
		} else {
			alert("Wrong Answer Try Again");
		}
	});
	document.getElementById("phase-one-div").append(clue, input, button);
}

async function renderChallange_2_1_1() {
	let clue = createContentBlock(challangeData[0].title, "h1", challangeData[0].description);
	let input = createInput("answer", "clue_1", "name");
	let button = createButton("button text", async () => {
		let guess = document.getElementById("clue_1").value;
		let answer = await checkAnswer("phase2", "1", `${guess}`);
		if (answer) {
			let group = JSON.parse(getFromLS("user")).group;
			console.log(group);
			const groupFilter = { id: group };
			const groupUpdates = { $set: { task: "2" } };

			let res = await updateGroup({
				filter: groupFilter,
				updates: groupUpdates,
			});

			window.location.href = "phase.html";
		} else {
			alert("Wrong Answer Try Again");
		}
	});
	document.getElementById("phase-one-div").append(clue, input, button);
}

async function renderChallange_2_1_2() {
	let clue = createContentBlock(challangeData[1].title, "h1", challangeData[1].description);
	let input = createInput("answer", "clue_2", "name");
	let button = createButton("button text", async () => {
		let guess = document.getElementById("clue_2").value;
		let answer = await checkAnswer("phase2", "2", `${guess}`);
		if (answer) {
			let group = JSON.parse(getFromLS("user")).group;
			console.log(group);
			const groupFilter = { id: group };
			const groupUpdates = { $set: { task: "3" } };

			let res = await updateGroup({
				filter: groupFilter,
				updates: groupUpdates,
			});
			window.location.href = "phase.html";
		} else {
			alert("Wrong Answer Try Again");
		}
	});
	document.getElementById("phase-one-div").append(clue, input, button);
}

async function renderChallange_2_1_3() {
	let clue = createContentBlock(challangeData[2].title, "h1", challangeData[2].description);
	let input = createInput("answer", "clue_3", "name");
	let button = createButton("button text", async () => {
		let guess = document.getElementById("clue_3").value;
		let answer = await checkAnswer("phase2", "3", `${guess}`);
		if (answer) {
			let group = JSON.parse(getFromLS("user")).group;
			console.log(group);
			const groupFilter = { id: group };
			const groupUpdates = { $set: { task: "4" } };

			let res = await updateGroup({
				filter: groupFilter,
				updates: groupUpdates,
			});
			window.location.href = "phase.html";
		} else {
			alert("Wrong Answer Try Again");
		}
	});
	document.getElementById("phase-one-div").append(clue, input, button);
}

async function renderChallange_2_1_4() {
	let clue = createContentBlock(challangeData[3].title, "h1", challangeData[3].description);
	let input = createInput("answer", "clue_4", "name");
	let button = createButton("button text", async () => {
		let guess = document.getElementById("clue_4").value;
		let answer = await checkAnswer("phase2", "4", `${guess}`);
		if (answer) {
			let group = JSON.parse(getFromLS("user")).group;
			console.log(group);
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
			const groupFilter = {id: group};
			const groupUpdates = { $set: {task: "1"} };
	
=======
			const groupFilter = { id: group };
			const groupUpdates = { $set: { task: "5" } };

>>>>>>> c39760a104b6be1a28c58f0bb44c6ebac2613ef1
=======
			const groupFilter = { id: group };
			const groupUpdates = { $set: { task: "5" } };

>>>>>>> c39760a104b6be1a28c58f0bb44c6ebac2613ef1
=======
			const groupFilter = { id: group };
			const groupUpdates = { $set: { task: "5" } };

>>>>>>> c39760a104b6be1a28c58f0bb44c6ebac2613ef1
			let res = await updateGroup({
				filter: groupFilter,
				updates: groupUpdates,
			});
			window.location.href = "phase.html";
		} else {
			alert("Wrong Answer Try Again");
		}
	});
	document.getElementById("phase-one-div").append(clue, input, button);
}
