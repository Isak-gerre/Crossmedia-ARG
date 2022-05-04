// FUNCTIONS AND DESCRIPTION

// createButton( "button text" ; func: callback)
// return DOM

// createConfirmButton( "button text" ; "button text after click" ; func: callback ; "warning text")
// return DOM

// createConditionalButton( "button text" ; obj: input ; func: return true/false for condition ; func: callback )
// return DOM

// createReadyButton( "text innan klick", "id", "text när knapp är aktiv")
// return DOM

// createInput( "label text" ; "id" ; "name" ; ("value") )
// return DOM

// createTabs(array[ {header: "", content: []}, { header: "", content: []} ])
// return DOM
//

// createForm( [inputs] ; "method" ; "action" ; "id")
// return DOM

//printTerminalText( "text" || array["string", {txt: "string", func: onclick action}])
// appends text
//

// createContentBlock( "header" ; "h-tagg" ; DOM: content )
// return DOM

// createList( [items] ; antal rader = 4 )
// "*" framför aktiv spelare ger accent-color
// return DOM

// createAccordion( "label text", DOM: content )
//return DOM

// createSection( [array av DOM] )
// skapar en wrapper för flera element som kan användas till createContentBlock Bl.a
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
				const update = {
					filter: { username: user.username, password: user.password },
					updates: { session: session.sessionCode },
				};
				await updatePlayer(update);
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

function setBodyId(id) {
	document.body.setAttribute("id", id);
}

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

	setBodyId("space-between");

	let warning = document.createElement("div");
	warning.classList.add("fold", "small-txt");

	let initButton = createButton(initTxt, confirm);

	let confirmWrapper = document.createElement("section");
	confirmWrapper.classList.add("button-confirm-wrapper");

	confirmWrapper.append(createButton(ultTxt, callback), createButton("cancel", close));

	const time = 200;

	async function close() {
		confirmWrapper.classList.remove("button-confirm-gap");
		confirmWrapper.lastChild.classList.remove("accent");

		wrapper.setAttribute("id", "mainCol");

		warning.classList.remove("unfold");

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
			confirmWrapper.lastChild.classList.add("accent");
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

	heardObj.addEventListener("keyup", () => {
		if (condFunc()) {
			button.classList.remove("button-disabled");
			console.log(condFunc);
		} else {
			button.classList.add("button-disabled");
			console.log("no");
		}
	});

	return button;
}

function createReadyButton(initTxt, id, activeTxt) {
	let button = createButton(initTxt, activate);
	button.setAttribute("id", id);

	setBodyId("space-between");

	// HUR ÄNDRA KNAPPTEXT?

	function activate() {
		// deactivate button
		if (checkClassExistance(button, "ready-button-activated")) {
			button.classList.remove("ready-button-activated", "button-active");
			button.textContent = initTxt;

			// PING SERVER: PLAYER NOT READY

			return;
		}

		// activate button
		button.classList.add("ready-button-activated", "button-active");
		button.textContent = activeTxt;

		// PING SERVER: PLAYER READY
	}

	return button;
}

function checkClassExistance(item, check) {
	return item.classList.contains(check);
}

function createInput(labelText, id, name, value = false) {
	let wrapper = document.createElement("section");
	wrapper.classList.add("input-wrapper");

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
	let wrapper = document.createElement("div");
	wrapper.classList.add("tab-wrapper");

	let tabHeadWrapper = document.createElement("div");
	tabHeadWrapper.classList.add("tab-head-wrapper", "header");

	let tabContent = document.createElement("section");
	tabContent.setAttribute("id", "tabContent");

	let count = "one";
	tabArr.forEach((tab) => {
		let tabTitle = document.createElement("span");
		tabTitle.classList.add("tab-header");

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
	let wrapper = document.createElement("div");
	wrapper.setAttribute("id", "loading");
	wrapper.classList.add("loading-screen-wrapper");

	document.body.innerHTML = ``;

	return wrapper;
}

// not done
function loadingButton() {
	let wrapper = document.createElement("div");
	wrapper.setAttribute("id", "loading");
	wrapper.classList.add("loading-icon-wrapper");

	return wrapper;
}

function createContentBlock(label, labelType, content, grayed = false) {
	let wrapper = document.createElement("div");

	let header = document.createElement(labelType);
	header.textContent = label;

	wrapper.append(header, content);

	if (grayed) {
		wrapper.classList.add("grayed");
	}

	return wrapper;
}

function createList(items, height = 4) {
	let wrapper = document.createElement("div");
	wrapper.classList.add("list-wrapper");

	let section = document.createElement("section");
	wrapper.append(section);

	let count = 0;

	items.forEach((item) => {
		if (count == height) {
			section = document.createElement("section");
			wrapper.append(section);

			count = 0;
		}

		let li = document.createElement("li");
		li.classList.add("no-margin");
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
}

function createAccordion(header, content) {
	let wrapper = document.createElement("div");
	wrapper.classList.add("accordion-wrapper", "no-margin");

	let accordionHead = document.createElement("section");
	accordionHead.classList.add("accordion-head");
	accordionHead.innerHTML = `
		<div class="accordion-arrow no-margin">></div>
		<label >${header}</label>
	`;

	let accordionBody = document.createElement("section");
	accordionBody.classList.add("accordion-body");
	accordionBody.innerHTML = `<div class="accordion-line" ><div class="line"></div></div>`;
	accordionBody.append(content);
	content.classList.add("accordion-content");

	wrapper.addEventListener("click", () => {
		if (wrapper.classList.contains("open")) {
			wrapper.classList.remove("open");
			return;
		}
		wrapper.classList.add("open");
	});

	wrapper.append(accordionHead, accordionBody);

	return wrapper;
}

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
