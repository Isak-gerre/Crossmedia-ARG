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
		window.location.href = "phase.html";
	}
	if (session.phase == 0) {
		makeLobbyOne(user, activeSession, session, usersInSession);
	}
	if (session.phase == 2) {
		makeLobbyTwo(user, activeSession, session, usersInSession);
	}
});

function makeLobbyOne(user, activeSession, session, usersInSession) {
	sessionH1.innerText = activeSession;
	lobbyDiv.append(createList(usersInSession, 8));

	if (user.username == session.creator) {
		document.body.append(
			createConfirmButton(
				"Starta Spelet",
				"Starta",
				async () => {
					const sessionFilter = { sessionCode: activeSession };
					const sessionUpdates = { $set: { phase: 1, lobby: false } };

					let res = await updateSession({
						filter: sessionFilter,
						updates: sessionUpdates,
					});
					if (res.message == "Updated session") {
						window.location.href = "phase.html";
					}
				},
				"Efter spelet har startat kan inte nya spelare gå med. Är du säker på att du vill fortsätta?"
			)
		);
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
	sessionH1.innerText = "Lobby 2";
	let p = document.createElement("p");
	p.textContent = "Hej";
	lobbyDiv.append(createList(usersInSession, 1));
	let groupedPlayers = [[], [], [], []];
	let shuffeldUsers = shuffleArray(usersInSession);
	shuffeldUsers.forEach((user, index) => {
		groupedPlayers[`${(index + 1) % 4}`].push(user);
	});
	console.log(groupedPlayers);

	let groups = await getGroups("session", activeSession);
	groups.forEach((group, index) => {
		let list = createList(groupedPlayers[index], 1);
		lobbyDiv.append(createAccordion(group.groupName, list));
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
					if (res.ok) {
						console.log("test");
						window.location.href = "phase.html";
					}
				},
				"Efter spelet har startat kan inte nya spelare gå med. Är du säker på att du vill fortsätta?"
			)
		);
	}
}
function makeLobbyThree() {}
