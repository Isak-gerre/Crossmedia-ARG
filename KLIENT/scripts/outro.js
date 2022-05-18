const outroDiv = document.getElementById("outro");
const user = JSON.parse(getFromLS("user"));

async function renderOutro() {
	const session = await getSessions("sessionCode", user.session);
	console.log(session);
	if (session.winningTeam == "1") {
		outroDiv.append(createVideo("https://www.youtube.com/embed/rmo7jZaSaPs"));
	}
	if (session.winningTeam == "2") {
		outroDiv.append(createVideo("https://www.youtube.com/embed/QEUyO07UO_Q"));
	}
}
renderOutro();
