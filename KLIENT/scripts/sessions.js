// document.addEventListener("DOMContentLoaded", (event) => {
//   setTimeout(() => {
//     const getSessionsLive = new EventSource("http://localhost:8000/sessions/live");

//     function updateSessions(message) {
//       document.getElementById("messages").textContent = message;
//     }

//     getSessionsLive.onmessage = function (event) {
//       console.log(event.data);
//       if (localStorage.getItem("sessions") != null) {
//         document.getElementById("session-div").innerHTML = "";
//         makeSessionButton(event.data);
//       }
//       if (localStorage.getItem("sessions") != event.data || localStorage.getItem("sessions") == null) {
//         saveToLS("sessions", event.data);
//         document.getElementById("session-div").innerHTML = "";
//         makeSessionButton(event.data);
//       } else {
//       }
//     };
//     getSessionsLive.onerror = function () {
//       updateSessions("Server Closed Connection");
//       getSessionsLive.close();
//     };
//   }, 2000);
// });

makeSessionPage();
function makeSessionPage() {
  const sessionDiv = `
    <div id="session-div">
    </div>
    `;
}

function makeSessionButton(sessionsJSON) {
  arrayOfSessions = JSON.parse(sessionsJSON);
  console.log(arrayOfSessions);
  arrayOfSessions.forEach((element) => {
    document.getElementById("session-div").innerHTML += `<p>${element.sessionCode}</p>`;
  });
}
