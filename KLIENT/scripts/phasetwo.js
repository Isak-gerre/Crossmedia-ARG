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
let timerOn = false;

fetch(`${localhost}challenges/phase2`)
	.then((response) => response.json())
	.then(async (data) => {
		challengeData = data;
		let challenge = await challengeCheck();
		// checkLoggedInPlayer();
		const areWeDone = async () => {
			let group = await getGroupById(JSON.parse(getFromLS("user")).group);
			let session = await getSessions("sessionCode", group.session);
			if (session.phaseTwoTime == undefined) {
				let date = new Date();
				let time = date.getTime();
				let hours = 1000 * 60 * 60;
				time = time + hours * 3;
				await updateSession({
					filter: { sessionCode: session.sessionCode },
					updates: { $set: { phaseTwoTime: time } },
				});
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

					document.getElementById("timer").textContent =
						"Du har: " + Math.round(difference / (1000 * 60)) + " minuter kvar";
					if (Math.round(difference / (1000 * 60)) < 0) {
						await updateSession({
							filter: { sessionCode: session.sessionCode },
							updates: { $set: { phaseTwoTime: 0 } },
						});
						clearInterval(timerInterval);
						window.location.reload();
					}
				}, 1000);
			}
			timerOn = true;
		};

		phaseCheck(2, () => {
			console.log("vi är på fas 2");
			areWeDone();
		});

		async function checkChallenge(task, linje, position, lastPosition) {
			for (let i = 0; i <= 15; i++) {
				if (task == i) {
					return await renderChallenge(i, i, position, lastPosition, linje);
				}
			}
		}

		phaseCheck(2, async () => {
			let session = await getSessions("sessionCode", JSON.parse(getFromLS("user")).session);

			let task = challenge.task;

			let completed = challenge.completedChallenges.length;
			console.log(challenge.completedChallenges.length);
			if (completed >= 16) {
				document.getElementById("phase-one-div").innerHTML = "";
				printTerminalText([
					"Du har lyckats lösa alla Uppdrag!",
					"Bra jobbat!!",
					"De andra lagen har nu kortare tid på sig att lösa uppdragen",
					"När tiden runnit ut kan vi återsamlas vid kuben",
				]);
				await updateSession({
					filter: { sessionCode: session.sessionCode },
					updates: { $set: { oneGroupDone: true } },
				});
				return;
			}

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
				let roof = id * 4;
				if (roof < completed) {
					return 4;
				}
				if (completed <= roof - 4 && roof >= completed) {
					return 0;
				}
				if (roof > completed) {
					return task % 4;
				}
				if (roof == completed) {
					return 4;
				}
			};
			const isStarted = (completed, id) => {
				return currentTask(completed, id) != 0 ? true : false;
			};
			const groups = await getGroups("session", session.sessionCode);
			let progress = [
				{
					id: 1,
					prog: currentTask(completed, 1),
					started: true,
				},
				{
					id: 2,
					prog: currentTask(completed, 2),
					started: isStarted(completed, 2),
				},
				{
					id: 3,
					prog: currentTask(completed, 3),
					started: isStarted(completed, 3),
				},
				{
					id: 4,
					prog: currentTask(completed, 4),
					started: isStarted(completed, 4),
				},
			];

			console.log(challenges, progress);

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
			if (session.oneGroupDone === true) {
				challengeEntries.append(
					createString("En annan grupp är har klarat alla uppdrag! Skynda er för att hinna lösa så många ni kan!"),
					progressInfo
				);
			} else {
				challengeEntries.append(progressInfo);
			}

			const tabs = createTabs([
				{ header: "Overview", content: challengeEntries },
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
					phaseOverLoad(lastPosition);
				});
				//SCANNER HÄR
				return;
			}

			let distance = await getDiffrencePosition(position.latitude, position.longitude);

			// let startDistane = await getDiffrencePositionScanner(
			// 	position.latitude,
			// 	position.longitude,
			// 	lastPosition.latitude,
			// 	lastPosition.longitude
			// );

			// let scannerStrength = scannerDistance(startDistane, distance);

			let scannerArray = [
				createString(`lat:${(position.latitude)} ${(position.longitude)}`),
				"Bege dig till kordinaterna innan du löser nästa gåta",
			];

			let scanner = createContentBlock("Nästa Plats", "h1", scannerArray, "scannerContent");

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
					if (answer) {
						let group = JSON.parse(getFromLS("user")).group;

						let task = (clueNumber + 1) % 16;

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

						let newGroup = await getGroupById(group);

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
			});
			let div = document.createElement("div");
			div.append(clue, input, button, scanner);
			return div;
		}

		async function phaseOver(lastPosition) {
			let body = document.querySelector("body");

			body.innerHTML = "";

			let cube = {
				latitude: 55.58865042339298,
				longitude: 12.992876839769947,
			};

			let scannerStrength;

			let distance = await getDiffrencePosition(cube.latitude, cube.longitude);
			// let startDistane = await getDiffrencePositionScanner(
			// 	cube.latitude,
			// 	cube.longitude,
			// 	lastPosition.latitude,
			// 	lastPosition.longitude
			// );

			let scannerArray = [
				createString(`-${Math.round(distance)}dBm`),
				"För att kunna gå vidare måste signalstyrkan vara minst -30dBm",
			];

			let scanner = createContentBlock("Skanner", "h1", scannerArray, "scannerContent");

			let infoArray = [
				"Fas 2 är över!",
				"Återvänd till kuben",
				"Spelet kommer att fortsätta när alla är samlade",
				"Kordinater:",
				"lat: 55.58865042339298",
				"long: 12.992876839769947"
			];

			body.append(createContentBlock("Fas 2 är slut", "h1", infoArray), scanner);
		}

		async function phaseOverLoad(lastPosition) {
			let cube = {
				latitude: 55.58865042339298,
				longitude: 12.992876839769947,
			};

			let distance = await getDiffrencePosition(cube.latitude, cube.longitude);
			let startDistane = await getDiffrencePositionScanner(
				cube.latitude,
				cube.longitude,
				lastPosition.latitude,
				lastPosition.longitude
			);

			if (document.querySelector("button").innerHTML != "jag är framme") {
			}
			distance = 30;
			if (distance <= 300000000000000000) {
				document.querySelector("button").innerHTML = "jag är framme";

				document.querySelector("button").addEventListener("click", async () => {
					let id = JSON.parse(getFromLS("user")).group;
					let sessionCode = JSON.parse(getFromLS("sessions")).sessionCode;

					const groupFilter = { _id: id };
					const groupUpdates = { $set: { arrived: true } };

					await updateGroup({
						filter: groupFilter,
						updates: groupUpdates,
					});

					document.querySelector("body").innerHTML = "";
					printTerminalText("Väntar på alla grupper");

					setInterval(async () => {
						let allGroups = await getGroups("session", sessionCode);
						allGroups.forEach(async (group) => {
							if (!group.arrived) {
								return;
							} else {
								const sessionFilter = { sessionCode: sessionCode };
								const sessionUpdates = { $set: { lobby: true } };

								await updateSession({
									filter: sessionFilter,
									updates: sessionUpdates,
								});

								window.location.href = "lobby.html";
							}
						});
					}, 5000);
				});
			}
		}
	});
