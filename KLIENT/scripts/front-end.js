
// FUNCTIONS AND DESCRIPTION

// createButton( "button text" ; func: callback)
// return DOM

document.body.append( createButton("knapp", ()=>{console.log("hello")}) ) 

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

// createAccordion( "label text", DOM: content )
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

// --------------------------------------------------------------------------------------

// VARS FOR TEST
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
					filter: { user: user.username, password: user.password },
					updates: { session: session.sessionCode },
				};
				await updatePlayer(update);
				location.reload();
			} catch (error) {
				console.log(error);
			}
		},
	},
];

let create = {
	header: "Skapa konto",
	content: createForm(
		[createInput("användarnamn", "username", "username"),
		createInput("lösenord", "password", "password"),
		createInput("bekräfta lösenord", "password-heck", "password-check"),
		createButton("skapa")], 
		"post", 
		"", 
		"hello"
	)
	
};

let signIn = {
	header: "Logga in",
	content: createForm(
		[createInput("användarnamn", "username", "username"),
		createInput("lösenord", "password", "password"),
		createButton("logga in")], 
		"post", 
		"", 
		"hello"
	)
};

const infoIcon = `<svg class="icon" xmlns="http://www.w3.org/2000/svg"><path d="M22.65 34H25.65V22H22.65ZM24 18.3Q24.7 18.3 25.175 17.85Q25.65 17.4 25.65 16.7Q25.65 16 25.175 15.5Q24.7 15 24 15Q23.3 15 22.825 15.5Q22.35 16 22.35 16.7Q22.35 17.4 22.825 17.85Q23.3 18.3 24 18.3ZM24 44Q19.75 44 16.1 42.475Q12.45 40.95 9.75 38.25Q7.05 35.55 5.525 31.9Q4 28.25 4 24Q4 19.8 5.525 16.15Q7.05 12.5 9.75 9.8Q12.45 7.1 16.1 5.55Q19.75 4 24 4Q28.2 4 31.85 5.55Q35.5 7.1 38.2 9.8Q40.9 12.5 42.45 16.15Q44 19.8 44 24Q44 28.25 42.45 31.9Q40.9 35.55 38.2 38.25Q35.5 40.95 31.85 42.475Q28.2 44 24 44ZM24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24ZM24 41Q31 41 36 36Q41 31 41 24Q41 17 36 12Q31 7 24 7Q17 7 12 12Q7 17 7 24Q7 31 12 36Q17 41 24 41Z"/></svg>`;

let info = {
	header: "info",
	content: "this is how you play the game"

}

let missions = {
	header: "uppdrag",
	content: "uppdrag"
}

// createForm([createInput("användarnamn", "username", "username"), createInput("lösenord", "password", "password"), createButton("logga in")], "post", "", "hello");



let tabGroup = [create, signIn];

let alpha = ["mittlånganamn", "finnick", "felicia", "paul"];
let beta = ["bill", "*sara", "corniellerine", "mina",];
let delta = ["clay", "zed", "mattiasguldklimp", "morphe"]
let omega = ["barry", "marinaskovnikov", "collin", "holly"]

let users = alpha.concat(beta, delta, omega);

function test(){
	console.log("click");

	document.body.style.backgroundColor = "var(--supp)";
	
	setTimeout( ()=>{
		document.body.style.backgroundColor = "";
	}, 200 );
}



// --------------------------------------------------------------------------------------

function setBodyState( c ){

	if( Array.isArray(c) ){
		c.forEach(cls => {
			document.body.classList.add( cls )
		});
	} else {
		document.body.classList.add(c);
	}


}

function createSection(array){
	let section = document.createElement("section");

	array.forEach(item => {
		section.append(item)
	});

	return section;
}

function createButton(text, callback){
    let button = document.createElement("button");
    if(text) button.textContent = text;

    if(callback) button.addEventListener("click", callback);

    // click animation, remove?
    // button.addEventListener("click", ()=>{
    //     button.classList.add("button-active");
    //     setTimeout( ()=>{
    //         button.classList.remove("button-active");
    //     }, 500 )
    // });

    return button;
}

function createConfirmButton(initTxt, ultTxt, callback, warningTxt){
    let wrapper = document.createElement("section");

	setBodyState("space-between")

    let warning = document.createElement("div");
    warning.classList.add("fold", "small-txt");

    let initButton = createButton(initTxt, confirm);

    let confirmWrapper = document.createElement("section");
    confirmWrapper.classList.add("button-confirm-wrapper");

    confirmWrapper.append( createButton(ultTxt, callback), createButton("cancel", close) );


    const time = 200;

    async function close(){
        confirmWrapper.classList.remove("button-confirm-gap");
        confirmWrapper.lastChild.classList.remove("accent-button");

        wrapper.setAttribute("id", "mainCol");
        
        warning.classList.remove("unfold");

        const time = 200;
        
        setTimeout(()=>{
            wrapper.setAttribute("id", "");
            warning.innerHTML = "";
            wrapper.removeChild(wrapper.lastChild);
            wrapper.append(initButton);
            initButton.setAttribute("id", "");
        }, time)
        
    }

    async function confirm(ultText, callback){     
        wrapper.setAttribute("id", "mainCol");

        warning.innerHTML = warningTxt;

        setTimeout(()=>{
            // Animation
            wrapper.removeChild(wrapper.lastChild)
            wrapper.append(confirmWrapper);
            warning.classList.add("unfold")
        }, time)

        setTimeout(()=>{
            // Animation
            confirmWrapper.classList.add("button-confirm-gap");
        }, time*2)

        setTimeout(()=>{
            // Animation
            wrapper.setAttribute("id", "");
            confirmWrapper.lastChild.classList.add("accent-button");
        }, time*3)

    }   

    wrapper.append(warning, initButton)

    return wrapper
}

function createConditionalButton(txt, heardObj, condFunc, callback){
    let button = createButton(txt, callback);
    button.classList.add("button-disabled");

    // condFunc should check if condition is met. 
    //Returns true or false
    
    heardObj.addEventListener("keyup", ()=>{

        if( condFunc() ){
            button.classList.remove("button-disabled")
        } else {
            button.classList.add("button-disabled")
        }
    });

    return button
}

function createReadyButton(initTxt, id, activeTxt){
    let button = createButton(initTxt, activate);
    button.setAttribute("id", id);

	setBodyState("space-between");

    // HUR ÄNDRA KNAPPTEXT?

    function activate(){
        // deactivate button
        if(checkClassExistance(button, "ready-button-activated")){
            button.classList.remove("ready-button-activated", "button-active");
            button.textContent = initTxt;

            // PING SERVER: PLAYER NOT READY

            return
        }
        
        // activate button
        button.classList.add("ready-button-activated", "button-active");
        button.textContent = activeTxt;

        // PING SERVER: PLAYER READY
    }   

    return button

}

function checkClassExistance(item, check){
    return item.classList.contains(check);
}   0

function createInput(labelText, id, name, value = false){
    let wrapper = document.createElement("section");
    wrapper.classList.add("input-wrapper")

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
		let tabTitle = document.createElement("p");
		tabTitle.classList.add("tab-header");

		tabTitle.innerHTML = tab.header;

		if (count == "one") {
			tabTitle.classList.add("active");
			tabContent.append( tab.content );
		}

		tabTitle.setAttribute("id", `tab-button-${count}`);

		tabHeadWrapper.append(tabTitle);

		tabTitle.addEventListener("click", () => {
			if (tabTitle.classList.contains("active")) return;

			document.querySelector(".active").classList.remove("active");

			tabTitle.classList.add("active");

			tabContent.innerHTML = ``;
			tabContent.append( tab.content );
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
function loadingScreen(){
    let wrapper = document.createElement("div");
    wrapper.setAttribute("id", "loading")
    wrapper.classList.add("loading-screen-wrapper");
    
    document.body.innerHTML = ``;

    return wrapper;
}

// not done
function loadingButton(){
    let wrapper = document.createElement("div");
    wrapper.setAttribute("id", "loading");
    wrapper.classList.add("loading-icon-wrapper");
    
    return wrapper
}

function createContentBlock(label, labelType, content, grayed = false){
	let wrapper = document.createElement("div");

	let header = document.createElement(labelType);
	header.textContent = label;

	wrapper.append( header, content );

	if( grayed ){
		wrapper.classList.add("grayed")
	} 

	return wrapper;
}

function createList(items, height = 4){
	let wrapper = document.createElement("div");
	wrapper.classList.add("list-wrapper")

	let section = document.createElement("section");
	wrapper.append(section);

	let count = 0;

	items.forEach(item => {
		if( count == height ){
			section = document.createElement("section");
			wrapper.append(section);

			count = 0;
		}

		let li = document.createElement("p");
		li.classList.add("no-margin");
		li.textContent = item;

		if( item[0] == "*" ){
			// text "du" istället?
			li.classList.add("acc-color");
			li.textContent = item.substr(1);
		}

		section.append(li);

		count++;
	});

	return wrapper;
}

function printTerminalText(input){

    if(Array.isArray( input ) ) {
        input.forEach(message => {
            document.querySelector("body").append( createString(message) )
            
        });
    } else {
        document.querySelector("body").append( createString(input) )
    }
}

function createString(string){
	let p = document.createElement("p");

	p.textContent = string;

	if(typeof(string) == "object"){
		p.classList.add("string-button");
		p.textContent = string.txt;
		
		p.addEventListener("click", ()=>{
			string.func();
			p.style.pointerEvents = "none";
		})
	}

	return p
}

function createAccordion(header, content){
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

	accordionHead.addEventListener("click", ()=>{
		if( wrapper.classList.contains("open") ){
			wrapper.classList.remove("open");
			return
		}
		wrapper.classList.add("open");
	})

	wrapper.append(accordionHead, accordionBody);

	return wrapper;

}


function createProgressionSection(data, max){
	let wrapper = document.createElement("div");

	data.forEach(team => {

		let wrap = document.createElement("div");
		wrap.classList.add("progress-wrapper");

		let name = document.createElement("span");
		name.style.textTransform = "capitalize";
		name.textContent = team[0];

		if( team[0][0] == "*" ){
			name.textContent = team[0].substr(1);
			wrap.classList.add("sub-color");
		}

		let line = document.createElement("hr");
		line.classList.add("line");

		let prog = document.createElement("span");
		prog.style.textAlign = "right";
		percent = (team[1] / max) * 100;

		prog.textContent = Math.floor(percent) + "%";

		wrap.append(name, line, prog);

		wrapper.append(wrap);
	});

	return wrapper
}

function createChallengeEntry(progressInfo, challengeInfo){
	let wrapper = document.createElement("div");
	wrapper.classList.add("challenge-entry");

	let completed = progressInfo.prog == challengeInfo.stages;
	let started = progressInfo.started;

	if( started ) wrapper.classList.add("active");
	if( completed ) {
		wrapper.classList.add("completed");
		wrapper.classList.remove("active");
	} 

	let text = document.createElement("span");
	text.textContent = "Uppdrag " + progressInfo.count;

	let num = document.createElement("span");
	num.textContent = progressInfo.prog + " / " + challengeInfo.stages;

	wrapper.append(text, num);

	wrapper.addEventListener("click", () =>{
		if( completed || !started ) return
		
		challengeInfo.func();

	});

	return wrapper;
}

function createChallengeEntries(challenges, progress ){
	let wrapper = document.createElement("section");
	wrapper.classList.add("challenges-wrapper");

	let count = 1;
	progress.forEach(entry => {
		entry['count'] = count;

		let challenge = challenges.find( challenge => { return challenge.id == entry.id } );

		wrapper.append( createChallengeEntry(entry, challenge) );

		count++;
	});

	return wrapper;
}

const chall = { 
	id: 4,
	title: "Lös gåtan",
	belongsTo: "Linje 1", 
	description: "Tux dafgå åv våxjs mjuxåxh hyg Dyese dsm eig pa åxbsf?",
	answer: "inga",
	answerLength: 4,
	övrigt: {}, 
}

const challTwo = {
	id: 5,
	title: "Lös sista delen av länken",
	belongsTo: "Linje 2", 
	description: "https://www.podplay.com/sv-se/podcasts/topp-1-i-sverige-747699/episodes/sveriges-basta-hacker-[][][][][][][][]",
	answer: "70235110",
	answerLength: 8,
	övrigt: ["juli, 0, februari, mars, maj, januari, oktober"],

}
	

function createChallenge(challenge){
	// createContentBlock( "header" ; "h-tagg" ; DOM: content )
	// createButton( "button text" ; func: callback)
	// createInput( "label text" ; "id" ; "name" ; ("value") )

	setBodyState(["body-challenge", "body-space-between"]);

	let input = createInputBoxes(challenge.answer, "answer", "answer");
	let text = createString( challenge.description );
	let button = createButton("skicka", checkAnswer);

	let objs = [text, input]

	if( challenge.övrigt ){
		let obj = document.createElement("div");
		objs.push( obj )
	}

	let content = createSection( objs );

	let block = createContentBlock(challenge.title, "h1", content);

	document.body.append( block )
	document.body.append( button )

	function checkAnswer(){
		let inputs = document.querySelectorAll(".box-input");

		let answer = "";

		inputs.forEach(input => {
			answer += input.value;
		});

		
		if( answer == challenge.answer ){
			button.textContent = "Rätt svar, bra jobbat";
			button.classList.add("button-active")

			setTimeout( ()=>{
				// Go to main menu?
			}, 1000 )

			// redirect till main page efter x sekunder?
		} else {
			button.textContent = "Fel svar, testa igen";
			button.classList.add("accent-button");
			button.style.pointerEvents = "none";
			
			setTimeout( ()=>{
				button.classList.remove("accent-button");
				button.textContent = "skicka";
				button.style.pointerEvents = "unset";
				
			}, 1000 )
		}
	}
}

function createInputBoxes(word){

	let wrap = document.createElement("section");
	wrap.classList.add("box-input-wrapper");

	for (let i = 0; i < word.length; i++) {
		let input = document.createElement("input");

		input.classList.add("box-input");
		input.setAttribute("maxlength", 1);

		input.addEventListener("keyup", (e)=>{

			if( e.code == "Backspace" ){
				if(!input.previousSibling) return;

				input.previousSibling.focus()
				return
			}

			if( input.value.length > 0 ){
				if(!input.nextElementSibling){
					input.blur();
					return
				}
				input.nextElementSibling.focus();
			}

		})

		input.addEventListener("keydown", ()=>{
			input.value = "";
		})

		wrap.append(input);
	}

	return wrap;
}

// createChallenge(challTwo);

document.body.append( createAccordion("Alpha", createList(users)) );



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
	"\u0021": "\u00A1", "\u0022": "\u201E", "\u0026": "\u214B", "\u0027": "\u002C", "\u0028": "\u0029", "\u002E": "\u02D9", "\u0033": "\u0190", "\u0034": "\u152D", "\u0036": "\u0039", "\u0037": "\u2C62",
	"\u003B": "\u061B", "\u003C": "\u003E", "\u003F": "\u00BF", "\u0041": "\u2200", "\u0042": "\u10412", "\u0043": "\u2183", "\u0044": "\u25D6", "\u0045": "\u018E", "\u0046": "\u2132", "\u0047": "\u2141", "\u004A": "\u017F", "\u004B": "\u22CA",
	"\u004C": "\u2142", "\u004D": "\u0057", "\u004E": "\u1D0E", "\u0050": "\u0500", "\u0051": "\u038C", "\u0052": "\u1D1A", "\u0054": "\u22A5", "\u0055": "\u2229",
	"\u0056": "\u1D27", "\u0059": "\u2144", "\u005B": "\u005D", "\u005F": "\u203E", "\u0061": "\u0250", "\u0062": "\u0071", "\u0063": "\u0254", "\u0064": "\u0070", "\u0065": "\u01DD",
	"\u0066": "\u025F", "\u0067": "\u0183", "\u0068": "\u0265", "\u0069": "\u0131", "\u006A": "\u027E", "\u006B": "\u029E", "\u006C": "\u0283", "\u006D": "\u026F", "\u006E": "\u0075", "\u0072": "\u0279", "\u0074": "\u0287",
	"\u0076": "\u028C", "\u0077": "\u028D", "\u0079": "\u028E", "\u007B": "\u007D", "\u203F": "\u2040", "\u2045": "\u2046", "\u2234": "\u2235",
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
		"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l","m", 
		"n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x","y", "z",
		"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
		"N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
		0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
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
