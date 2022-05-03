const activeSession = JSON.parse(getFromLS("user")).session;
const player = JSON.parse(getFromLS("user"));
const sessionH1 = document.getElementById("session-code");
const lobbyDiv = document.getElementById("lobby-one-div");
const lobbyPlayers = document.getElementById("lobby-one-players");

sessionH1.innerText = activeSession;

console.log(activeSession);

async function createGroupDiv() {
	const div = document.createElement("div");
	div.classList = "group-div";
	const groupID = await createGroup(activeSession);
	div.addEventListener("click", async () => {
		const groupFilter = { _id: groupID.groupID };
		const groupUpdates = { user: player.username };
		await updateGroup({
			filter: groupFilter,
			updates: groupUpdates,
		});
	});
	lobbyDiv.append(div);
}
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
	printTerminalText(usersInSession);
});

function makeLobbyOne(user, activeSession, session, usersInSession) {
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
					if (res.ok) {
						window.location.href = "phase.html";
					}
				},
				"Efter spelet har startat kan inte nya spelare gå med. Är du säker på att du vill fortsätta?"
			)
		);
	}
}
function makeLobbyTwo() {}
function makeLobbyThree() {}
