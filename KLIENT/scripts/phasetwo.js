"use strict"

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
	console.log(challange);
	if(challange == 0 || challange == 1){
		renderChallange_2_1();
	}
	else if(challange == 2){
		renderChallange_2_2();
	}
	});


async function renderChallange_2_1() {

let clue = createContentBlock(challangeData[0].title, "h1", challangeData[0].description)
let input = createInput( "answer", "clue_1", "name",);
let button = createButton( "button text", async () => {

	let guess = document.getElementById("clue_1").value;
	let answer = await checkAnswer("phase2", "1", `${guess}`);
	if(answer){
		let group = JSON.parse(getFromLS("user")).group;
		console.log(group);
		const groupFilter = {id: group};
		const groupUpdates = { $set: {task: "2"} };

		let res = await updateGroup({
			filter: groupFilter,
			updates: groupUpdates,
		});
		window.location.href = "phase.html"
	}
	else{
		alert("Wrong Answer Try Again");
	}
})
document.getElementById("phase-one-div").append(clue, input, button);

}

async function renderChallange_2_2() {

	let clue = createContentBlock(challangeData[1].title, "h1", challangeData[1].description)
	let input = createInput( "answer", "clue_1", "name",);
	document.getElementById("phase-one-div").append(clue, input, button);
}