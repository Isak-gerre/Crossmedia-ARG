document.addEventListener("DOMContentLoaded", () => {
  var test = 0;
  setTimeout(() => {
    const getSessionsLive = new EventSource("http://localhost:8000/sessions/live");

    getSessionsLive.onmessage = function (event) {
      if (checkPlayerInSession(JSON.parse(event.data))) {
        window.location.href = "lobby.html";
      }
      if (test == 0) {
        document.getElementById("session-div").innerHTML = "";
        makeSessionButton(event.data);
        test = 1;
      }
      if (localStorage.getItem("sessions") != event.data || localStorage.getItem("sessions") == null) {
        saveToLS("sessions", event.data);
        document.getElementById("session-div").innerHTML = "";
        makeSessionButton(event.data);
      } else {
      }
    };
    getSessionsLive.onerror = function () {
      getSessionsLive.close();
    };
  }, 0000);
});

makeSessionPage();
function makeSessionPage() {
  const sessionDiv = `
    <div id="session-div">
    </div>
    <button id="join-session" disabled>Join Session´
    </button>
    `;
}

function checkPlayerInSession(sessions) {
  const player = JSON.parse(getFromLS("user")).username;
  return sessions.find((session) => session.users.includes(player)) ? true : false;
}

function makeSessionButton(sessionsJSON) {
  arrayOfSessions = JSON.parse(sessionsJSON);
  console.log(arrayOfSessions);
  arrayOfSessions.forEach((element) => {
    let p = document.createElement("p");
    p.className = "session-code";
    p.innerText = element.sessionCode;
    p.addEventListener("click", () => {
      document.querySelectorAll(".selected-session").forEach((selectedSession) => {
        selectedSession.classList.remove("selected-session");
      });
      p.classList.toggle("selected-session");
      document.getElementById("join-session").disabled = false;
    });
    document.getElementById("session-div").append(p);
  });
}

document.getElementById("join-session").addEventListener("click", async () => {
  const selectedSession = document.querySelectorAll(".selected-session");
  if (selectedSession.length != 1) return;

  const sessionCode = selectedSession[0].innerText;
  const player = JSON.parse(getFromLS("user"));
  const playerFilter = { username: player.username, password: player.password };
  const playerUpdates = { session: sessionCode };

  const sessionFilter = { session: sessionCode };
  const sessionUpdates = { user: player.username };

  try {
    await updatePlayer({
      filter: playerFilter,
      updates: playerUpdates,
    });
    await updateSession({
      filter: sessionFilter,
      updates: sessionUpdates,
    });
    await updatePlayerinLS();
  } catch (error) {
    console.log(error);
  }
});
