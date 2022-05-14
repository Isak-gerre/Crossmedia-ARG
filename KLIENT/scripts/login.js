// document.getElementById("sign-up").addEventListener("click", async (e) => {
// 	e.preventDefault();
// 	const username = document.querySelector("#username");
// 	const password = document.querySelector("#password");
// 	const confirmPassword = document.querySelector("#confirm-password");
// 	if (password.value == confirmPassword.value && username != "") {
// 		await createPlayer();
// 		window.location.href = "html/sessions.html";
// 	} else {
// 		if (password.value != confirmPassword.value) {
// 			displayLoginErrorMessage("Passwords do not match!");
// 		}
// 		if (username.value == "") {
// 			displayLoginErrorMessage("Please fill in your username!");
// 		}
// 		console.log("does not match");
// 	}
// });

// document.getElementById("login").addEventListener("click", async (e) => {
// 	e.preventDefault();
// 	let formData = new FormData(document.getElementById("login-form"));
// 	if (await logInPlayer(postFormData(formData))) {
// 		console.log(true);
// 		window.location.replace("html/sessions.html");
// 	} else {
// 		console.log(false);
// 		displayLoginErrorMessage("Username and Passwords does not match!");
// 	}
// });

// document.querySelector("#confirm-password").addEventListener("keyup", () => {
// 	checkPasswordFields();
// });
// document.querySelector("#password").addEventListener("keyup", () => {
// 	checkPasswordFields();
// });

// function checkPasswordFields() {
// 	const password = document.querySelector("#password");
// 	const confirmPassword = document.querySelector("#confirm-password");
// 	if (password.value != confirmPassword.value) {
// 		confirmPassword.style.outline = "3px solid red";
// 		password.style.outline = "3px solid red";
// 		displayLoginErrorMessage("Passwords do not match!");
// 	} else {
// 		confirmPassword.style.outline = "3px solid green";
// 		password.style.outline = "3px solid green";
// 		displayLoginErrorMessage("");
// 	}
// }

function createLogin() {
	const usernameLogin = createInput("Användarnamn", "username", "username", "");
	const passwordLogin = createInput("Lösenord", "password", "password", "");
	const username = createInput("Användarnamn", "username", "username", "");
	const password = createInput("Lösenord", "password", "password", "");
	const confirmPassword = createInput("Bekräfta lösenord", "confirm-password", "confirmPassword", "");
	const signInButton = createButton("Skapa Konto", async (e) => {
		e.preventDefault();
		loadButton(e.target);
		const username = document.querySelector("#username");
		const password = document.querySelector("#password");
		const confirmPassword = document.querySelector("#confirm-password");
		if (username == "" || confirmPassword == "" || password == "") {
			displayLoginErrorMessage("Please fill in every field");
			return false;
		}
		if (password.value == confirmPassword.value && username != "") {
			await createPlayer();
			unloadButton("Välkommen");
			window.location.href = "html/sessions.html";
		} else {
			if (password.value != confirmPassword.value) {
				displayLoginErrorMessage("Passwords do not match!");
			}
			if (username.value == "") {
				displayLoginErrorMessage("Please fill in your username!");
			}
			console.log("does not match");
		}
	});
	const loginButton = createButton("Logga in", async (e) => {
		e.preventDefault();
		loadButton(e.target);
		let formData = new FormData(document.getElementById("login-form"));
		const loginData = await logInPlayer(postFormData(formData));
		const player = loginData.player;
		let loginToLocation = await whereTo(player);
		if (loginData.loggedin) {
			unloadButton("Välkommen");
			document.body.append(loadScreen("Välkommen"));
			setTimeout(() => {
				window.location.replace(loginToLocation);
			}, 2000);
		} else {
			console.log(false);
			displayLoginErrorMessage("Username and Passwords does not match!");
		}
	});

	const signInForm = createForm([username, password, confirmPassword, signInButton], "POST", "#", "sign-in-form");
	const loginForm = createForm([usernameLogin, passwordLogin, loginButton], "POST", "#", "login-form");

	const tabs = createTabs([
		{ header: "Skapa Användare", content: signInForm },
		{ header: "Logga in", content: loginForm },
	]);
	document.body.append(tabs);
}
createLogin();
