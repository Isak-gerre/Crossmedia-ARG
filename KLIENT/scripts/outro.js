async function renderOutro() {
	const outroDiv = document.getElementById("outro");
	const user = JSON.parse(getFromLS("user"));
	const session = await getSessions("sessionCode", user.session);
	console.log(session);
	if (session.winningTeam == "1") {
		unloadScreen();
		outroDiv.append(createVideo("https://www.youtube.com/embed/rmo7jZaSaPs"));
	}
	if (session.winningTeam == "2") {
		unloadScreen();
		outroDiv.append(createVideo("https://www.youtube.com/embed/QEUyO07UO_Q"));
	}
	printTerminalText([
		"Tack för att ni spelade!",
		"Spelet är skapat av:",
		"Melinda Sowole",
		"Pranvera Gerbeshi",
		"Bea Thanyalak",
		"Isak Gerre",
		"Ivan Knezevic",
	]);
}
renderOutro();
