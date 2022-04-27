document.addEventListener("DOMContentLoaded", () => {
  var test = 0;
  setTimeout(() => {
    const getSessionsLive = new EventSource("http://localhost:8000/sessions/live");

    getSessionsLive.onmessage = function (event) {
      console.log(event.data);
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
  }, 2000);
});

makeSessionPage();
function makeSessionPage() {
  const sessionDiv = `
    <div id="session-div">
    </div>
    <button id="join-session" disabled>Join Session
    </button>
    `;
}

function makeSessionButton(sessionsJSON) {
  arrayOfSessions = JSON.parse(sessionsJSON);
  console.log(arrayOfSessions);
  arrayOfSessions.forEach((element) => {
    let p = document.createElement("p");
    p.className = "session-code";
    p.innerText = element.sessionCode;
    p.addEventListener("click", () => {
      p.classList.toggle("selected-session");
      document.getElementById("join-session").disabled = false;
    });
    document.getElementById("session-div").append(p);
  });
}

document.getElementById("join-session").addEventListener("click", () => {
  if (document.querySelectorAll(".selected-session").length == 1) {
  }
});
