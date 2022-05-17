const activeSession = JSON.parse(getFromLS("user")).session;
const player = JSON.parse(getFromLS("user"));
const sessionH1 = document.getElementById("session-code");
const lobbyDiv = document.getElementById("lobby-one-div");
const lobbyPlayers = document.getElementById("lobby-one-players");

// document.addEventListener("DOMContentLoaded", () => {
// 	setTimeout(() => {
// 		const getSessionsLive = new EventSource("http://localhost:8000/sessions/live/users");

// 		let displayedPlayers = {};
// 		getSessionsLive.onmessage = function (event) {
// 			if (JSON.stringify(displayedPlayers) != event.data) {
// 				lobbyPlayers.innerHTML = "";
// 				displayedPlayers = JSON.parse(event.data);
// 				const session = JSON.parse(event.data);
// 				session.users.forEach((user) => {
// 					lobbyPlayers.innerHTML += `<p>${user}</p>`;
// 				});
// 			}
// 		};
// 		getSessionsLive.onerror = function () {
// 			getSessionsLive.close();
// 		};
// 	}, 0000);
// });
document.addEventListener("DOMContentLoaded", async () => {
	const user = JSON.parse(getFromLS("user"));
	const activeSession = user.session;
	const session = await getSessions("sessionCode", activeSession);
	const usersInSession = session.users;
	if (!session.lobby) {
		document.body.append(loadScreen(""));
		window.location.href = "phase.html";
	}
	console.log(session.phase);
	if (session.phase == 0) {
		makeLobbyOne(user, activeSession, session, usersInSession);
	}
	if (session.phase == 1) {
		makeLobbyTwo(user, activeSession, session, usersInSession);
	}
	if (session.phase == 2) {
		makeLobbyThree(user, activeSession, session, usersInSession);
	}
});

function makeLobbyOne(user, activeSession, session, usersInSession) {
	sessionH1.innerText = activeSession;
	const seen = JSON.parse(getFromLS("seenPhase1")).seen;
	if (seen == null || !seen) {
		printTerminalText([
			"För att kuben ska kunna kommunicera med er måste ni etablera en koppling med den. ",
			"Härnäst kommer du att kunna se vilka som är med i lobbyn.",
			"Användarna i lobbyn behöver gemensamt ta sig till kuben genom att lösa gåtorna.",
			{
				txt: "Fortsätt",
				func: async () => {
					saveToLS("seenPhase1", { seen: true });
					document.body.append(loadScreen(""));

					window.location.reload();
				},
			},
		]);
	} else {
		lobbyDiv.append(createList(usersInSession, 8));

		if (user.username == session.creator) {
			document.body.append(
				createConfirmButton(
					"Starta Spelet",
					"Starta",
					async () => {
						const sessionFilter = { sessionCode: activeSession };
						const sessionUpdates = { $set: { phase: 1, lobby: false } };

						await createTeams(activeSession, "1");
						await createTeams(activeSession, "2");

						let groupedPlayers = [[], [], [], []];
						let shuffeldUsers = shuffleArray(usersInSession);
						shuffeldUsers.forEach((user, index) => {
							groupedPlayers[`${(index + 1) % 4}`].push(user);
						});

						let linjeArray = shuffleArray([0, 1, 2, 3]);
						let taskArray = [];
						linjeArray.forEach((e) => {
							if (e == 0) {
								taskArray.push(0);
							} else if (e == 1) {
								taskArray.push(4);
							} else if (e == 2) {
								taskArray.push(8);
							} else if (e == 3) {
								taskArray.push(12);
							}
						});

						let groups = await getGroups("session", activeSession);
						groups.forEach(async (group, index) => {
							const groupFilter = { session: activeSession, groupName: group.groupName };
							const groupUpdates = {
								$set: { users: groupedPlayers[index], linje: linjeArray[index], task: taskArray[index] },
							};
							const res = await updateGroup({
								filter: groupFilter,
								updates: groupUpdates,
							});
							groupedPlayers[index].forEach(async (player) => {

								if(JSON.parse(getFromLS("user")).username == player){
									let user = JSON.parse(getFromLS("user"));
									user.group = group._id;
									saveToLS("user", user);
								}

								console.log(res);
								const playerFilter = { username: player };
								const playerUpdates = { $set: { group: group._id } };
								console.log(group._id);
								await updateManyPlayers({
									filter: playerFilter,
									updates: playerUpdates,
								});
							});
						});

						
						let res = await updateSession({
							filter: sessionFilter,
							updates: sessionUpdates,
						});
						if (res.message == "Updated session") {
							document.body.append(loadScreen(""));
							window.location.href = "phase.html";
						}
					},
					"Efter spelet har startat kan inte nya spelare gå med. Är du säker på att du vill fortsätta?"
				)
			);
		}
	}
}
function shuffleArray(array) {
	let currentIndex = array.length,
		randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex != 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}

	return array;
}
async function makeLobbyTwo(user, activeSession, session, usersInSession) {
	sessionH1.innerText = "Fas 2";
	const seen = JSON.parse(getFromLS("seenPhase2")).seen;
	if (seen == null || !seen) {
		let videoWrapper = document.createElement("div");
		videoWrapper.setAttribute("id", "videoWrapper");
		videoWrapper.append(
			createVideo("https://www.youtube.com/embed/4aWGxWyJ5Tw"),
			createButton("Fortsätt", () => {
				document.getElementById("videoWrapper").remove();
				printTerminalText([
					"Bra jobbat, ni har hittat vart jag ligger gömd. ",
					"Var inte rädda, jag bits inte. Jag har i många hundra år legat gömd här i Malmö stad, och har väntat på att äventyrliga människor ska våga ta sig på mina krafter. ",
					"Ni kommer alldeles strax slumpmässigt delas in grupper där ni tar er till de utvalda koordinaterna, där signalen är som starkast, och göra de utmaningar som jag har förberett för er.",
					"Jag vill att ni visar er värdiga för mina krafter, och därför har jag gjort dem lite utmanande. Klara så många utmaningar som möjligt innan tiden har runnit ut. ",
					{
						txt: "Fortsätt",
						func: async () => {
							saveToLS("seenPhase2", { seen: true });
							document.body.append(loadScreen(""));

							window.location.reload();
						},
					},
				]);
			})
		);
		document.body.append(videoWrapper);
	} else {
		// printTerminalText(["Ni har blivit tilldelade era grupper av Kuben"]);
		// lobbyDiv.append(createList(usersInSession, 1));
		let groups = await getGroups("session", activeSession);
		groups.forEach((group) => {
			let list = createList(group.users, 2);
			lobbyDiv.append(createAccordion(group.groupName, list, true));
		});
		if (user.username == session.creator) {
			document.body.append(
				createConfirmButton(
					"Starta Spelet",
					"Starta",
					async () => {
						let group = await getGroupById(JSON.parse(getFromLS("user")).group);
						let session = await getSessions("sessionCode", group.session);
						console.log(group);
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
						let groups = await getGroups("session", activeSession);
						console.log(groups);
						groups.forEach(async (group) => {
							if (group.users.length != 0) {
								group.users.forEach(async (user) => {
									await updatePlayer({
										filter: { username: user },
										updates: { $set: { group: group._id } },
									});
								});
							}
						});

						const sessionFilter = { sessionCode: activeSession };
						const sessionUpdates = { $set: { phase: 2, lobby: false } };

						let res = await updateSession({
							filter: sessionFilter,
							updates: sessionUpdates,
						});
						if (res.message == "Updated session") {
							document.body.append(loadScreen(""));

							window.location.href = "phase.html";
						}
					},
					"Se till så att alla spelare är redo innan du startar spelet. Är du säker på att du vill fortsätta?"
				)
			);
		}
		// document.body.append(createReadyButton("Redo", "ready-btn", "Väntar på andra spelare", activeSession));
	}
}
async function makeLobbyThree(user, activeSession, session, usersInSession) {
	sessionH1.innerText = "Fas 3";
	const seen3 = JSON.parse(getFromLS("seenPhase3")).seen;
	if (seen3 == null || !seen3) {
		printTerminalText([
			"Jag vill att ni gör ett val.",
			"Vill ni att aktivera mig och få mina utomjordiska krafter som kommer att göra er odödliga?",
			"Till följd av det kommer resten av mänskligheten bli utplånade.",
			"Eller vill ni hellre förstöra mig och låtsas som att detta bara var en enda stor mardröm?Detta val är individuellt.",
			"Hur bra ni gjorde ifrån er i den förra fasen kommer att gynna er i denna.",
			{
				txt: "Fortsätt",
				func: async () => {
					saveToLS("seenPhase3", { seen: true });
					document.body.append(loadScreen(""));

					window.location.reload();
				},
			},
		]);
	} else {
		if (JSON.parse(getFromLS("user")).team != "0") {
			let teams = await getTeam("session", activeSession);
			teams.forEach((team) => {
				let list = createList(team.users, 2);
				lobbyDiv.append(createAccordion(team.team, list));
			});
			if (user.username == session.creator) {
				document.body.append(
					createConfirmButton(
						"Starta Spelet",
						"Starta",
						async () => {
							const sessionFilter = { sessionCode: activeSession };
							const sessionUpdates = { $set: { phase: 3, lobby: false } };
							let res = await updateSession({
								filter: sessionFilter,
								updates: sessionUpdates,
							});
							if (res.message == "Updated session") {
								document.body.append(loadScreen(""));
								window.location.href = "phase.html";
							}
						},
						"Se till att alla spelare är redo innan ni börjar nästa fas. Är du säker på att du vill fortsätta?"
					)
				);
			}
		} else {
			let save = createConfirmButton(
				"Rädda världen",
				"rädda",
				async () => {
					await joinTeam(player.username, "1", activeSession);
					document.getElementsByTagName("section")[1].innerHTML = "";
					document.getElementsByTagName("section")[0].innerHTML = "";
					printTerminalText([
						"Under den sista fasen ska du och ditt lag klara så många utmaningar ni kan innan tiden har runnit ut. ",
						"Utmaningarna är uppdelade i tre svårighetsgrader.Du kan välja fritt mellan vilka utmaningar du vill göra.",
						"Tänk smart och använd tiden väl.",
						"Må bästa lag vinna.",
						{
							txt: "Fortsätt",
							func: async () => {
								document.body.append(loadScreen(""));

								window.location.reload();
							},
						},
					]);
				},
				"Är du säker? Du kan inte ångra dig"
			);
			let destroy = createConfirmButton(
				"Förstöra världen",
				"förstöra",
				async () => {
					await joinTeam(player.username, "2", activeSession);
					document.getElementsByTagName("section")[1].innerHTML = "";
					document.getElementsByTagName("section")[0].innerHTML = "";
					printTerminalText([
						"Under den sista fasen ska du och ditt lag klara så många utmaningar ni kan innan tiden har runnit ut. ",
						"Utmaningarna är uppdelade i tre svårighetsgrader.Du kan välja fritt mellan vilka utmaningar du vill göra.",
						"Tänk smart och använd tiden väl.",
						"Må bästa lag vinna.",
						{
							txt: "Fortsätt",
							func: async () => {
								document.body.append(loadScreen(""));

								window.location.reload();
							},
						},
					]);
				},
				"Är du säker? Du kan inte ångra dig"
			);
			lobbyDiv.append(save, destroy);
		}
	}
}

async function joinTeam(username, teamID, sessionCode) {
	const playerFilter = { username: username, session: sessionCode };
	const playerUpdates = { $set: { team: teamID } };

	const teamFilter = { session: sessionCode, team: teamID };
	const teamUpdates = { $push: { users: username } };
	try {
		let resPlayer = await updatePlayer({
			filter: playerFilter,
			updates: playerUpdates,
		});
		saveToLS("user", resPlayer);
		let resTeam = await updateTeam({
			filter: teamFilter,
			updates: teamUpdates,
		});

		if (resTeam != null && resPlayer != null) {
			document.body.append(loadScreen(""));
			window.location.reload();
		}
	} catch (error) {}
}
