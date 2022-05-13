// FUNCTIONS AND DESCRIPTION

// BUTTONS ----------------------------

// createButton( "button text" ; func: callback)
// return DOM

// createConfirmButton( "button text" ; "button text after click" ; func: callback ; "warning text")
// return DOM

// createConditionalButton( "button text" ; obj: input ; func: return true/false for condition ; func: callback )
// return DOM

// createReadyButton( "text innan klick", "id", "text när knapp är aktiv")
// return DOM

// OTHER --------------------------

// createInput( "label text" ; "id" ; "name" ; ("value") )
// return DOM

// createTabs(array[ {header: "", content: []}, { header: "", content: []} ])
// return DOM

// createForm( [inputs] ; "method" ; "action" ; "id")
// return DOM

// createString("text")
// return DOM

//printTerminalText( "text" || array["string", {txt: "string", func: onclick action}])
// appends text

// createContentBlock( "header" ; "h-tagg" ; DOM: content )
// return DOM

// createList( [items] ; antal rader = 4 )
// "*" framför aktiv spelare ger accent-color
// return DOM

// createSection( [array av DOM] )
// skapar en wrapper för flera element som kan användas till createContentBlock Bl.a
// return DOM

//FAS 2 ---------------------------------

// createAccordion( "label text", DOM: content, open = false )
//return DOM

// createChallengeEntries( [challenges], [progress] )
// skapad utefter följande array struktur:
// let challenges = [
// 	{id: 1, stages: [4], func: ()=>{console.log("one")} },	<--**func kallas vid klick**
// 	{id: 2, stages: [4], func: ()=>{console.log("two")} },
// ]

// let progress = [
// 	{id: 2, prog:4, started: true},
// 	{id: 1, prog:4, started: true},
// ]

// return DOM

// createChallenge(challenge, answer)

// 	createInputBoxes("ord")
// skapar input boxar som kan skrivas i för att få fram svar
// används i
// return DOM

// FAS 3 ------------------

// createChallengeGrid([challenges], [teampogress], currentTime)
// renderar grid av challenges med filterknappar och timer
// OBS TIMER BEHÖVER ÄNDRAS FÖR ATT FUNGERA
// return DOM

// --------------------------------------------------------------------------------------

// EXEMPEL HUR TEXT OCH TEXTKNAPPAR SKAPAS
let textArr = [
	"Inga aktiva spelsessioner hittas i närområdet.",
	{
		txt: "Skapa nytt spel",
		func: async () => {
			console.log("skapa nytt");
			try {
				const user = JSON.parse(getFromLS("user"));
				const session = await createSession(user.username);
				const playerFilter = { username: user.username };
				const playerUpdates = { $set: { session: session.sessionCode } };
				let res = await updatePlayer({
					filter: playerFilter,
					updates: playerUpdates,
				});
				console.log(res);
				saveToLS("user", res);
				location.reload();
			} catch (error) {
				console.log(error);
			}
		},
	},
	"Eller",
	{
		txt: "Mata in spelkod",
		func: () => {
			document.querySelector("body").append(createInput("Mata in spelkod", "gamecode", "gamecode"));
			document.querySelector("body").append(
				createButton("gå med", async () => {
					console.log("test");
					let gamecode = document.getElementById("gamecode").value;
					const sessions = await getSessions();
					if (sessions.find((session) => session.sessionCode == gamecode)) {
						await joinSession(gamecode);
						window.location.href = "lobby.html";
					}
				})
			);
		},
	},
];

// EXEMPEL HUR TAB KAN SKAPAS
let create = {
	header: "Skapa konto",
	content: createForm(
		[
			createInput("användarnamn", "username", "username"),
			createInput("lösenord", "password", "password"),
			createInput("bekräfta lösenord", "password-heck", "password-check"),
			createButton("skapa"),
		],
		"post",
		"",
		"hello"
	),
};

let missions = {
	header: "uppdrag",
	content: "uppdrag",
};

// VARIABLES FOR TESTING ----------------------------

let alpha = ["mittlånganamn", "finnick", "felicia", "paul"];
let beta = ["bill", "*sara", "corniellerine", "mina"];
let delta = ["clay", "zed", "mattiasguldklimp", "morphe"];
let omega = ["barry", "marinaskovnikov", "collin", "holly"];

let users = alpha.concat(beta, delta, omega);

function test() {
	console.log("click");

	document.body.style.backgroundColor = "var(--supp)";

	setTimeout(() => {
		document.body.style.backgroundColor = "";
	}, 200);
}

// HELP FUNCTIONS --------------------------------

function setBodyState(c) {
	if (Array.isArray(c)) {
		c.forEach((cls) => {
			document.body.classList.add(cls);
		});
	} else {
		document.body.classList.add(c);
	}
}

function createElemAndClass(type, className, classNameTwo) {
	let wrapper = document.createElement(type);
	wrapper.classList.add(className);
	if (classNameTwo) wrapper.classList.add(classNameTwo);
	return wrapper;
}

function setBodyId(id) {
	document.body.setAttribute("id", id);
}

// FUNCTIONS -------------------------------------

function createSection(array) {
	let section = document.createElement("section");

	array.forEach((item) => {
		section.append(item);
	});

	return section;
}

function createButton(text, callback) {
	let button = document.createElement("button");
	if (text) button.textContent = text;

	if (callback) button.addEventListener("click", callback);

	// click animation, remove?
	// button.addEventListener("click", ()=>{
	//     button.classList.add("button-active");
	//     setTimeout( ()=>{
	//         button.classList.remove("button-active");
	//     }, 500 )
	// });

	return button;
}

function createConfirmButton(initTxt, ultTxt, callback, warningTxt) {
	let wrapper = document.createElement("section");

	setBodyState("space-between");

	let warning = createElemAndClass("div", "fold", "small-txt");

	let initButton = createButton(initTxt, confirm);

	let confirmWrapper = createElemAndClass("section", "button-confirm-wrapper");

	confirmWrapper.append(createButton(ultTxt, callback), createButton("cancel", close));

	const time = 200;

	async function close() {
		confirmWrapper.classList.remove("button-confirm-gap");
		confirmWrapper.lastChild.classList.remove("button-accent");

		wrapper.setAttribute("id", "mainCol");

		warning.classList.remove("unfold");

		const time = 200;

		setTimeout(() => {
			wrapper.setAttribute("id", "");
			warning.innerHTML = "";
			wrapper.removeChild(wrapper.lastChild);
			wrapper.append(initButton);
			initButton.setAttribute("id", "");
		}, time);
	}

	async function confirm(ultText, callback) {
		wrapper.setAttribute("id", "mainCol");

		warning.innerHTML = warningTxt;

		setTimeout(() => {
			// Animation
			wrapper.removeChild(wrapper.lastChild);
			wrapper.append(confirmWrapper);
			warning.classList.add("unfold");
		}, time);

		setTimeout(() => {
			// Animation
			confirmWrapper.classList.add("button-confirm-gap");
		}, time * 2);

		setTimeout(() => {
			// Animation
			wrapper.setAttribute("id", "");
			confirmWrapper.lastChild.classList.add("button-accent");
		}, time * 3);
	}

	wrapper.append(warning, initButton);

	return wrapper;
}

function createConditionalButton(txt, heardObj, condFunc, callback) {
	let button = createButton(txt, callback);
	button.classList.add("button-disabled");

	// condFunc should check if condition is met.
	//Returns true or false

	heardObj.addEventListener("keyup", () => {
		if (condFunc()) {
			button.classList.remove("button-disabled");
		} else {
			button.classList.add("button-disabled");
		}
	});

	return button;
}

function createConditionalButton(txt, heardObj, condFunc, callback) {
	let button = createButton(txt, callback);
	button.classList.add("button-disabled");

	// condFunc should check if condition is met.
	//Returns true or false

	heardObj.addEventListener("keyup", () => {
		if (condFunc()) {
			button.classList.remove("button-disabled");
		} else {
			button.classList.add("button-disabled");
		}
	});

	return button;
}

function createReadyButton(initTxt, id, activeTxt, sessionCode) {
	let button = createButton(initTxt, activate, "start-button");
	button.setAttribute("id", id);

	setBodyId("space-between");

	// HUR ÄNDRA KNAPPTEXT?
	var sessionC = sessionCode;
	function UnLoadWindow() {
		return "We strongly recommends NOT closing this window yet.";
	}

	window.onbeforeunload = UnLoadWindow;

	async function activate(sessionCode) {
		setTimeout(() => {
			const getSessionsLive = new EventSource(
				`http://localhost:8000/sessions/live?sessionCode=${String(activeSession)}`
			);

			getSessionsLive.onmessage = async function (event) {
				let numberOfReadyPlayers = JSON.parse(event.data).readyPlayers;
				document.querySelector("#ready-btn").textContent = `${numberOfReadyPlayers}/${
					JSON.parse(event.data).users.length - 1
				} spelare redo`;
				if (numberOfReadyPlayers == JSON.parse(event.data).users.length - 1) {
					const sessionFilter = { sessionCode: activeSession };
					const sessionUpdates = { $set: { phase: 1, lobby: false } };
					let res = await updateSession({
						filter: sessionFilter,
						updates: sessionUpdates,
					});
				}
			};
			getSessionsLive.onerror = function () {
				getSessionsLive.close();
			};
		}, 0000);
		// deactivate button
		if (checkClassExistance(button, "ready-button-activated")) {
			button.classList.remove("ready-button-activated", "button-active");
			button.textContent = initTxt;

			// PING SERVER: PLAYER NOT READY
			const sessionFilter = { sessionCode: sessionC };
			const sessionUpdates = { $inc: { readyPlayers: -1 } };

			let sUpdated = await updateSession({
				filter: sessionFilter,
				updates: sessionUpdates,
			});

			return;
		}

		// activate button
		button.classList.add("ready-button-activated", "button-active");
		button.textContent = activeTxt;

		// PING SERVER: PLAYER READY
		const sessionFilter = { sessionCode: sessionC };
		const sessionUpdates = { $inc: { readyPlayers: 1 } };

		console.log(sessionFilter);
		let sUpdated = await updateSession({
			filter: sessionFilter,
			updates: sessionUpdates,
		});
	}

	return button;
}

function checkClassExistance(item, check) {
	return item.classList.contains(check);
}

function createInput(labelText, id, name, value = false) {
	let wrapper = createElemAndClass("section", "input-wrapper");

	let label = document.createElement("label");
	label.textContent = labelText + ":";
	label.setAttribute("for", id);

	let input = document.createElement("input");
	input.setAttribute("type", "text");
	input.setAttribute("id", id);
	input.setAttribute("name", name);

	if (value) {
		input.setAttribute("value", value);
	}

	wrapper.append(label, input);

	return wrapper;
}

function createTabs(tabArr) {
	let wrapper = createElemAndClass("div", "tab-wrapper");

	let tabHeadWrapper = createElemAndClass("div", "tab-head-wrapper", "header");

	let tabContent = document.createElement("section");
	tabContent.setAttribute("id", "tabContent");

	let count = "one";
	tabArr.forEach((tab) => {
		let tabTitle = createElemAndClass("p", "tab-header");

		tabTitle.innerHTML = tab.header;

		if (count == "one") {
			tabTitle.classList.add("active");
			tabContent.append(tab.content);
		}

		tabTitle.setAttribute("id", `tab-button-${count}`);

		tabHeadWrapper.append(tabTitle);

		tabTitle.addEventListener("click", () => {
			if (tabTitle.classList.contains("active")) return;

			document.querySelector(".active").classList.remove("active");

			tabTitle.classList.add("active");

			tabContent.innerHTML = ``;
			tabContent.append(tab.content);
		});

		count = "two";
	});

	wrapper.append(tabHeadWrapper, tabContent);

	return wrapper;
}

function createForm(inputs, method, action, id) {
	let form = document.createElement("form");
	form.setAttribute("action", action);
	form.setAttribute("method", method);
	form.setAttribute("id", id);

	inputs.forEach((input) => {
		form.append(input);
	});

	return form;
}

// not done
function loadingScreen() {
	let wrapper = createElemAndClass("div", "loading-screen-wrapper");
	wrapper.setAttribute("id", "loading");

	document.body.innerHTML = ``;

	return wrapper;
}

// not done
function loadingButton() {
	let wrapper = createElemAndClass("div", "loading-icon-wrapper");
	wrapper.setAttribute("id", "loading");

	return wrapper;
}

function createContentBlock(label, labelType, content, wrapperClass, grayed = false) {
	let wrapper = document.createElement("div");


	if(wrapperClass){
		wrapper.classList.add(wrapperClass);
	}
	
	let header = document.createElement(labelType);
	header.textContent = label;
	wrapper.append(header);
	if (typeof content == "object") {
		content.forEach((cont) => {
			let br = document.createElement("br");
			wrapper.append(cont, br);
		});
	} else {
		wrapper.append(content);
	}

	if (grayed) {
		wrapper.classList.add("grayed");
	}

	return wrapper;
}

function createList(items, height = 4) {
	let wrapper = createElemAndClass("div", "list-wrapper");

	let section = document.createElement("section");
	wrapper.append(section);

	let count = 0;

	items.forEach((item) => {
		if (count == height) {
			section = document.createElement("section");
			wrapper.append(section);

			count = 0;
		}

		let li = createElemAndClass("p", "no-margin");
		li.textContent = item;

		if (item[0] == "*") {
			// text "du" istället?
			li.classList.add("acc-color");
			li.textContent = item.substr(1);
		}

		section.append(li);

		count++;
	});

	return wrapper;
}

function printTerminalText(input) {
	if (Array.isArray(input)) {
		input.forEach((message) => {
			document.querySelector("body").append(createString(message));
		});
	} else {
		document.querySelector("body").append(createString(input));
	}
}

function createString(string) {
	let p = document.createElement("p");

	p.textContent = string;

	if (typeof string == "object") {
		p.classList.add("string-button");
		p.textContent = string.txt;

		p.addEventListener("click", () => {
			string.func();
			p.style.pointerEvents = "none";
		});
	}

	return p;
}

function createAccordion(header, content, open = false) {
	let wrapper = createElemAndClass("section", "accordion-wrapper");
	if( open ) wrapper.classList.add("open")

	let accordionHead = createElemAndClass("section", "accordion-head");
	accordionHead.innerHTML = `
		<div class="accordion-arrow no-margin">></div>
		<label >${header}</label>
	`;

	let accordionBody = createElemAndClass("section", "accordion-body");
	accordionBody.innerHTML = `<div class="accordion-line" ><div class="line"></div></div>`;

	accordionBody.append(content);
	content.classList.add("accordion-content");

	accordionHead.addEventListener("click", () => {
		if (wrapper.classList.contains("open")) {
			wrapper.classList.remove("open");
			return;
		}
		wrapper.classList.add("open");
	});

	wrapper.append(accordionHead, accordionBody);

	return wrapper;
}

function createProgressionSection(data, max) {
	let wrapper = document.createElement("div");

	data.forEach((team) => {
		let wrap = createElemAndClass("div", "progress-wrapper");

		let name = document.createElement("span");
		name.style.textTransform = "capitalize";
		name.textContent = team[0];

		if (team[0][0] == "*") {
			name.textContent = team[0].substr(1);
			wrap.classList.add("sub-color");
		}

		let line = createElemAndClass("hr", "line");

		let prog = document.createElement("span");
		prog.style.textAlign = "right";
		percent = (team[1] / max) * 100;

		prog.textContent = Math.floor(percent) + "%";

		wrap.append(name, line, prog);

		wrapper.append(wrap);
	});

	return wrapper;
}

function createChallengeEntry(progressInfo, challengeInfo) {
	let wrapper = createElemAndClass("div", "challenge-entry");

	let completed = progressInfo.prog == challengeInfo.stages;
	let started = progressInfo.started;

	if (started) wrapper.classList.add("active");
	if (completed) {
		wrapper.classList.add("completed");
		wrapper.classList.remove("active");
	}

	let text = document.createElement("span");
	text.textContent = "Uppdrag " + progressInfo.count;

	let num = document.createElement("span");
	num.textContent = progressInfo.prog + " / " + challengeInfo.stages;

	wrapper.append(text, num);

	wrapper.addEventListener("click", () => {
		if (completed || !started) return;

		challengeInfo.func();
	});

	return wrapper;
}

function createChallengeEntries(challenges, progress) {
	let wrapper = createElemAndClass("section", "challenges-wrapper");

	let count = 1;
	progress.forEach((entry) => {
		entry["count"] = count;

		let challenge = challenges.find((challenge) => {
			return challenge.id == entry.id;
		});

		wrapper.append(createChallengeEntry(entry, challenge));

		count++;
	});

	return wrapper;
}

function createChallenge(challenge, answer) {
	// createContentBlock( "header" ; "h-tagg" ; DOM: content )
	// createButton( "button text" ; func: callback)
	// createInput( "label text" ; "id" ; "name" ; ("value") )

	setBodyState(["body-challenge", "body-space-between"]);

	let input = createInputBoxes(challenge.answer);
	let text = createString(challenge.description);
	let button = createButton("skicka", checkAnswer(answer));

	let objs = [text, input];

	if (challenge.övrigt) {
		let obj = document.createElement("div");
		objs.push(obj);
	}

	let content = createSection(objs);

	let block = createContentBlock(challenge.title, "h1", content);

	document.body.append(block);
	document.body.append(button);

	function checkAnswer() {
		let inputs = document.querySelectorAll(".box-input");

		let answer = "";

		inputs.forEach((input) => {
			answer += input.value;
		});

		if (answer == submission) {
			button.textContent = "Rätt svar, bra jobbat";
			button.classList.add("button-active");

			setTimeout(() => {
				// Go to main menu?
			}, 1000);

			// redirect till main page efter x sekunder?
		} else {
			button.textContent = "Fel svar, testa igen";
			button.classList.add("button-accent");
			button.style.pointerEvents = "none";

			setTimeout(() => {
				button.classList.remove("button-accent");
				button.textContent = "skicka";
				button.style.pointerEvents = "unset";
			}, 1000);
		}
	}
}

function createInputBoxes(array) {
	let wrap = createElemAndClass("div", "box-input-wrapper");

	array.forEach(element => {
		for (let i = 0; i < element; i++) {
			let input = createElemAndClass("input", "box-input", "no-margin");
			input.setAttribute("maxlength", 1);

			input.addEventListener("keyup", (e) => {

				if (e.code == "Backspace") {
					if (!input.previousSibling) return;
					if(input.previousSibling.tagName == "DIV"){
						input.previousSibling.previousSibling.focus();
					}
					input.previousSibling.focus();
					return;
				}
				
				setTimeout(() => {
					input.value = input.value.toUpperCase()
				}, 1);

				if (input.value.length > 0) {
					if (!input.nextElementSibling) {
						input.blur();
						return;
					}
					if(input.nextElementSibling.tagName == "DIV"){
						input.nextElementSibling.nextElementSibling.focus();
					}
					else{
						input.nextElementSibling.focus();
					}
				}
			});

			input.addEventListener("keydown", () => {
				input.value = "";
			});
			wrap.append(input);
		}

		if(array.indexOf(element) + 1 != array.length){
			let space = createElemAndClass("div", "box-space", "no-margin");
			wrap.append(space);
		}

	});

	return wrap;
}

const CHALL = [
	{
		id: 1,
		type: "kabel",
		difficulty: 1,
		func: () => {
			console.log("yes");
		},
	},
	{
		id: 2,
		type: "kod",
		difficulty: 2,
		func: () => {
			console.log("yes");
		},
	},
	{
		id: 3,
		type: "kod",
		difficulty: 2,
		func: () => {
			console.log("yes");
		},
	},
	{
		id: 4,
		type: "kabel",
		difficulty: 1,
		func: () => {
			console.log("yes");
		},
	},
	{
		id: 5,
		type: "kod",
		difficulty: 3,
		func: () => {
			console.log("yes");
		},
	},
	{
		id: 6,
		type: "kabel",
		difficulty: 3,
		func: () => {
			console.log("yes");
		},
	},
	{
		id: 1,
		type: "kabel",
		difficulty: 1,
		func: () => {
			console.log("yes");
		},
	},
	{
		id: 2,
		type: "kod",
		difficulty: 2,
		func: () => {
			console.log("yes");
		},
	},
	{
		id: 3,
		type: "kod",
		difficulty: 2,
		func: () => {
			console.log("yes");
		},
	},
	{
		id: 4,
		type: "kabel",
		difficulty: 1,
		func: () => {
			console.log("yes");
		},
	},
	{
		id: 5,
		type: "kod",
		difficulty: 3,
		func: () => {
			console.log("yes");
		},
	},
	{
		id: 6,
		type: "kabel",
		difficulty: 3,
		func: () => {
			console.log("yes");
		},
	},
];

function createVideo(link){
	let wrapper = createElemAndClass("div", "video-wrapper");

	let video = createElemAndClass("iframe", "video");
	
	wrapper.innerHTML = `
	<iframe src="${link} &autoplay=1" 
	title="YouTube video player" 
	width="720" height="405"
	frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
	allowfullscreen></iframe>
	`;

	return wrapper;
}

const PROG = [2, 5];

// document.body.append( createChallengeEntries(CHALL, PROG) );

function createChallengeGrid(challenges, progress, currentTime) {
	let wrapper = document.createElement("section");

	let filter = false;

	let gridWrapper = createElemAndClass("div", "challenges-grid");

	renderChallenges(challenges);

	wrapper.append(createChallengeHeader(), gridWrapper);

	return wrapper;

	function renderChallenges(chals) {
		gridWrapper.innerHTML = "";
		chals.forEach((challenge) => {
			createChallenge(challenge);
		});
	}

	function createChallenge(challenge) {
		let wrapper = document.createElement("section");
		if (progress.includes(challenge.id)) wrapper.classList.add("completed");

		let block = createElemAndClass("section", "challenge-block");

		let type = challenge.type == "kabel" ? "cable" : "code";

		block.classList.add(type + "-chall");

		let difficulty = document.createElement("section");
		block.append(difficulty);

		for (let i = 1; i <= 3; i++) {
			let star = i > challenge.difficulty ? "&#9734" : "&#9733";
			difficulty.innerHTML += star;
		}

		wrapper.addEventListener("click", challenge.func);

		wrapper.append(block, difficulty);
		gridWrapper.append(wrapper);
	}

	function createChallengeHeader() {
		let wrapper = createElemAndClass("section", "challenge-header");

		let time = createElemAndClass("div", "timer");
		time.innerHTML = currentTime;

		let difficultyWrapper = createElemAndClass("div", "button-confirm-wrapper", "button-confirm-gap");

		const difficulties = ["lätt", "medel", "svår"];
		let count = 1;

		difficulties.forEach((diff) => {
			let currentDifficulty = count;

			let text = "";

			for (let i = 0; i < count; i++) {
				text += "★";
			}

			let button = createButton(text, () => {
				// if there already is a filter
				if (gridWrapper.classList.contains("filter")) {
					// if currently filtered is clicked
					if (button.classList.contains("button-accent")) {
						renderChallenges(challenges);
						button.classList.remove("button-accent");
						gridWrapper.classList.remove("filter", diff[0]);

						return;
					}

					// if other filter is active
					document.querySelector(".button-accent").classList.remove("button-accent");
					button.classList.add("button-accent");

					gridWrapper.classList.remove("l");
					gridWrapper.classList.remove("s");
					gridWrapper.classList.remove("m");

					gridWrapper.classList.add(diff[0]);

					filter = challenges.filter((challenge) => challenge.difficulty == currentDifficulty);
					renderChallenges(filter);

					return;
				}

				// if there is no filter
				gridWrapper.classList.add("filter", diff[0]);

				filter = challenges.filter((challenge) => challenge.difficulty == currentDifficulty);
				renderChallenges(filter);

				button.classList.add("button-accent");
			});

			button.classList.add("button-small");
			difficultyWrapper.append(button);

			count++;
		});

		wrapper.append(time, difficultyWrapper);
		return wrapper;
	}
}

// document.body.append(createChallengeGrid(CHALL, PROG, "14:32"));

//Text bak o fram
function reverseString(string) {
	// Split string till array
	var splitString = string.split("");

	// reverse array
	var reverseArray = splitString.reverse();

	// array till string
	var joinArray = reverseArray.join("");

	return joinArray;
}

//Text upponer
function flipString(aString) {
	return String(aString)
		.split("")
		.map((c) => flipTable[c] || c)
		.reverse()
		.join("");
}

var flipTable = {
	"\u0021": "\u00A1",
	"\u0022": "\u201E",
	"\u0026": "\u214B",
	"\u0027": "\u002C",
	"\u0028": "\u0029",
	"\u002E": "\u02D9",
	"\u0033": "\u0190",
	"\u0034": "\u152D",
	"\u0036": "\u0039",
	"\u0037": "\u2C62",
	"\u003B": "\u061B",
	"\u003C": "\u003E",
	"\u003F": "\u00BF",
	"\u0041": "\u2200",
	"\u0042": "\u10412",
	"\u0043": "\u2183",
	"\u0044": "\u25D6",
	"\u0045": "\u018E",
	"\u0046": "\u2132",
	"\u0047": "\u2141",
	"\u004A": "\u017F",
	"\u004B": "\u22CA",
	"\u004C": "\u2142",
	"\u004D": "\u0057",
	"\u004E": "\u1D0E",
	"\u0050": "\u0500",
	"\u0051": "\u038C",
	"\u0052": "\u1D1A",
	"\u0054": "\u22A5",
	"\u0055": "\u2229",
	"\u0056": "\u1D27",
	"\u0059": "\u2144",
	"\u005B": "\u005D",
	"\u005F": "\u203E",
	"\u0061": "\u0250",
	"\u0062": "\u0071",
	"\u0063": "\u0254",
	"\u0064": "\u0070",
	"\u0065": "\u01DD",
	"\u0066": "\u025F",
	"\u0067": "\u0183",
	"\u0068": "\u0265",
	"\u0069": "\u0131",
	"\u006A": "\u027E",
	"\u006B": "\u029E",
	"\u006C": "\u0283",
	"\u006D": "\u026F",
	"\u006E": "\u0075",
	"\u0072": "\u0279",
	"\u0074": "\u0287",
	"\u0076": "\u028C",
	"\u0077": "\u028D",
	"\u0079": "\u028E",
	"\u007B": "\u007D",
	"\u203F": "\u2040",
	"\u2045": "\u2046",
	"\u2234": "\u2235",
};

Object.keys(flipTable).forEach((i) => (flipTable[flipTable[i]] = i));

// text-encryption

//Exempel
// cipher(4.2, "sweet") =  swcct
// 4 = e	2 = c
// e bytts ut till c

//https://blog.cloudboost.io/create-your-own-cipher-using-javascript-cac216d3d2c
function cipher(key, data) {
	key = key.toString();
	data = data.toString();

	const signature = [
		"a",
		"b",
		"c",
		"d",
		"e",
		"f",
		"g",
		"h",
		"i",
		"j",
		"k",
		"l",
		"m",
		"n",
		"o",
		"p",
		"q",
		"r",
		"s",
		"t",
		"u",
		"v",
		"w",
		"x",
		"y",
		"z",
		"A",
		"B",
		"C",
		"D",
		"E",
		"F",
		"G",
		"H",
		"I",
		"J",
		"K",
		"L",
		"M",
		"N",
		"O",
		"P",
		"Q",
		"R",
		"S",
		"T",
		"U",
		"V",
		"W",
		"X",
		"Y",
		"Z",
		0,
		1,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9,
	];

	let arr = [];

	let sets = key.split(".");

	for (let i = 0; i < sets.length; i++) {
		if (i % 2 == 0) {
			arr.push({ a: sets[i], b: sets[i + 1] });
		}
	}

	arr.forEach((elem) => {
		let char1 = signature[elem.a];
		let char2 = signature[elem.b];

		let regex1 = new RegExp(char1, "g");
		let regex2 = new RegExp(char2, "g");

		data = data.replace(regex1, "!&").replace(regex2, char1).replace(/!&/g, char2);
	});

	return data;
}
