// document.addEventListener("DOMContentLoaded", () => {
// 	var gate = 0;
// 	setTimeout(() => {
// 		const getSessionsLive = new EventSource("http://localhost:8000/sessions/live");

// 		getSessionsLive.onmessage = function (event) {
// 			if (checkPlayerInSession(JSON.parse(event.data))) {
// 				window.location.href = "lobby.html";
// 			}
// 			if (JSON.parse(event.data).length == 0 && gate == 0) {
// 				printTerminalText(textArr);
// 				document.getElementById("join-session").remove();
// 				gate = 1;
// 			}
// 			if (gate == 0) {
// 				document.getElementById("session-div").innerHTML = "";
// 				makeSessionButton(event.data);
// 				gate = 1;
// 			}
// 			if (localStorage.getItem("sessions") != event.data || localStorage.getItem("sessions") == null) {
// 				saveToLS("sessions", event.data);
// 				document.getElementById("session-div").innerHTML = "";
// 				makeSessionButton(event.data);
// 			}
// 		};
// 		getSessionsLive.onerror = function () {
// 			getSessionsLive.close();
// 		};
// 	}, 0000);
// });
document.addEventListener("DOMContentLoaded", async () => {
	let session = await getSessions();
	if (checkPlayerInSession(session)) {
		window.location.href = "lobby.html";
	}
	if (session == []) {
		printTerminalText(textArr);
	} else {
		textArr.shift();
		printTerminalText(textArr);
	}
	makeSessionButton(session);
});

// makeSessionPage();
// function makeSessionPage() {
// 	const sessionDiv = `
//     <div id="session-div">
//     </div>
//     <button id="join-session" disabled>Join Session´
//     </button>
//     `;
// }

function checkPlayerInSession(sessions) {
	let savedPlayer = JSON.parse(getFromLS("user")).username;
	let inSession = sessions.find((session) => session.users.includes(savedPlayer)) ? true : false;
	return inSession;
}

function makeSessionButton(sessionsJSON) {
	let arrayOfSessions = typeof sessionsJSON == "string" ? JSON.parse(sessionsJSON) : sessionsJSON;
	arrayOfSessions.forEach((element) => {
		let p = document.createElement("p");
		p.className = "session-code";
		p.innerText = element.sessionCode;
		if (element.phase != 0) {
			p.className += " started";
			p.innerText += " (Alredy Started)";
		} else {
			p.addEventListener("click", () => {
				document.querySelectorAll(".selected-session").forEach((selectedSession) => {
					selectedSession.classList.remove("selected-session");
				});
				p.classList.toggle("selected-session");
				document.getElementById("join-session").disabled = false;
			});
		}
		document.getElementById("session-div").append(p);
	});
}

document.getElementById("join-session").addEventListener("click", async () => {
	const selectedSession = document.querySelectorAll(".selected-session");
	if (selectedSession.length != 1) return;

	const sessionCode = selectedSession[0].innerText;
	if (await joinSession(sessionCode)) {
		console.log(true);
		window.location.href = "lobby.html";
	}
});
