const main = document.getElementById("main");

main.append(
	createInput("När sitter du i 84 111 109 115 32 68 105 110 101 114?"),
	createButton("Skicka svar", async () => {
		let svar = document.getElementById("undefined").value;
		let isCorrect = await postSvar(svar);
		console.log(isCorrect);
		if (isCorrect) {
			main.innerHTML = "";
			main.append(
				createVideo("https://www.youtube.com/embed/UOIe18S1tmo"),
				createButton("Fortsätt", () => {
					main.innerHTML = "";
					printTerminalText([
						"Du har bevisat att du har potentialen att besitta otrolig intelligens",
						"Imorgon vill jag att du tar till Niagara för att hjälpa mig hitta kuben!",
						"Registrera dig för att få tillgång till min applikation som kan tolka kubens frekvenser. Du får mer information imorgon",
						"Du kommer bli rikligt belönad",
					]);
					main.append(
						createInput("Användarnamn", "username"),
						createInput("Password", "password"),
						createButton("Anmäl ditt konto", async () => {
							const username = document.querySelector("#username").value;
							const password = document.querySelector("#password").value;
							let res = await createPlayer(username, password);
							if (res) {
								document.body.innerHTML = "";
								document.body.append(createString("Niagara, 12:00, 18 Maj"));
							}
						})
					);
				})
			);
		} else {
			document.getElementsByTagName("button")[0].innerText = "Prova Igen";
		}
	})
);

async function postSvar(svar) {
	let res = await fetch(localhost + "challenges/intro", postData({ svar: svar }));
	if (res.ok) {
		let data = await res.json();
		return data;
	} else {
		return false;
	}
}
async function createPlayer(username, password) {
	let player = {
		username: username,
		password: password,
		group: "0",
		team: "0",
		session: "0",
		points: [],
		completed: [],
		power: "1",
	};

	let res = await fetch(localhost + "players", postData(player));
	if (res.ok) {
		let data = await res.json();
		return data;
	} else {
		return false;
	}
}
