"use strict";

function makeDiv(arr) {
	let div = arr.map((image, index) => {
		let div = document.createElement("div");
		div.setAttribute("id", `divD${index + 1}`);
		div.setAttribute("class", `tile`);
		div.setAttribute("deg", `0`);
		div.setAttribute("style", `transform: rotate(0deg)`);
		if (image == "") {
			div.innerHTML = ``;
		} else {
			div.innerHTML = `<img src="../images/cableImages/${image}">`;
        }

        if (div.innerHTML !== `<img src="../images/cableImages/cross.svg">`){
            div.addEventListener("click", (e) => {
                    let element = e.target.parentElement;
                    let deg = parseInt(element.getAttribute("deg"));
                    element.style = `transform: rotate(${deg + 90}deg)`
                    if (deg + 90 == 360) {
                        element.setAttribute("deg", 0);
                        element.style = `transform: rotate(${0}deg)`;
                    } else {
                        element.setAttribute("deg", deg + 90);
                    }
                });   
            }
            return div;
        });

	console.log(div);
	return div;
}

function game(arr, level, divClass) {
	let div = document.createElement("div");
	let button = document.createElement("button");

    div.classList.add("divCableParent", divClass);
	button.classList.add("cableButton");
	button.setAttribute("game", level);
	button.addEventListener("click", (e) => {
		let element = e.target;
		let divs = document.querySelectorAll(".tile");
		let rotations = [];
		divs.forEach((tile) => {
			rotations.push(`${tile.style.transform}`);
		});
		let svar = getSvar(element.getAttribute("game"), rotations);
		console.log(svar);
	});

	document.querySelector("body").append(div);
	document.querySelector("body").append(button);
	let arrayOfDivs = makeDiv(arr);
	arrayOfDivs.forEach((element) => {
		div.append(element);
	});
}

function getSvar(level, rotations) {
    //EASY
    let svarE1 = ["180", "270", "90", "270", "0", "180", "180", "0", "270", "270", "90", "180"];
    let svarE2 = ["270", "90", "0", "0", "0", "180", "180", "180", "270", "0", "180", "270"];
    let svarE3 = ["180", "90", "0", "180", "180", "0", "180", "180", "180", "0", "270", "0"];
    let svarE4 = ["180", "0", "0", "180", "0", "270", "180", "0", "90", "90", "180", "90", "0", "180", "270", "180"];
    let svarE5 = ["0", "90", "180", "90", "0", "0", "0", "180", "90", "270", "180", "0", "90", "270", "180", "90"];
    let svarE6 = ["0", "180", "0", "180", "270", "270", "90", "270", "90", "270", "270", "180", "180", "0", "90", "180"];
    
    // MEDIUM
    let svarM1 = ["0", "180", "270", "90", "0", "270", "0", "0", "0", "180", "0", "90", "270", "0", "180", "0", "270", "0", "0", "90", "0", "270", "270", "90", "0"];
    let svarM2 = ["0", "270", "0", "0", "270", "270", "0", "180", "0", "180", "0", "0", "180", "0", "180", "180", "90", "0", "180", "0"];
    let svarM3 = ["0", "180", "0", "0", "90", "0", "90", "0", "270", "0", "90", "90", "0", "0", "270", "90", "0", "180", "90", "90", "90", "270", "0", "0", "0"];
    let svarM4 = ["180", "270", "0", "180", "0", "270", "90", "0", "180", "180", "0", "180", "90", "0", "270", "0", "180", "0", "0", "90", "0", "90", "270", "180", "0"];
    let svarM5 = ["270", "90", "180", "0", "180", "180", "0", "180", "180", "270", "90", "270", "270", "180", "180", "270", "0", "0", "180", "180", "0", "180", "90", "270", "0"];
    let svarM6 = ["0", "0", "180", "270", "90", "90", "180", "270", "0", "180", "90", "90", "270", "180", "180", "90", "180", "0", "0", "270", "0", "90", "270", "180", "0"];

    // HARD
    let svarH1 = ["0", "270", "180", "90", "90", "0", "270", "90", "270", "180", "90", "180", "90", "90", "270", "90", "270", "0", "180", "0", "270", "180", "90", "180", "90", "180", "270", "90", "270", "90", "270", "180", "270", "270", "0", "0"];
    let svarH2 = ["0", "270", "270", "180", "180", "0", "0", "180", "90", "180", "270", "180", "90", "90", "0", "180", "270", "90", "90", "270", "270", "90", "270", "270", "0", "90", "90", "270", "270", "0"];
    let svarH3 = ["0", "90", "270", "0", "180", "90", "90", "180", "180", "180", "270", "90", "0", "90", "180", "270", "270", "0", "180", "180", "270", "270", "180", "0", "270", "270", "180", "180", "0", "90", "180", "0", "270", "270", "0"];
    let svarH4 = ["270", "180", "270", "180", "0", "0", "90", "90", "180", "270", "180", "0", "270", "180", "90", "180", "0", "270", "90", "270", "180", "0", "0", "270", "270", "270", "0", "0", "0", "90", "90", "270", "90", "270", "270", "180", "270", "180", "90", "90", "90", "180"];
    let svarH5 = ["180", "180", "270", "90", "0", "270", "180", "90", "0", "180", "180", "180", "90", "90", "90", "270", "0", "180", "90", "180", "0", "90", "90", "90", "180", "270", "270", "270", "270", "0"];
    let svarH6 = ["0", "270", "90", "0", "270", "0", "180", "0", "270", "90", "0", "270", "0", "90", "180", "90", "0", "270", "180", "90", "270", "0", "90", "0", "270", "0", "0", "180", "180", "270", "0", "0", "0", "90", "180", "270", "270", "180", "270", "0", "90", "90"];

	let formatedSvar = formatSvar(svarE1); //Måste ändra manuellt
	console.log(formatedSvar);
	console.log(rotations);
	return JSON.stringify(rotations) == JSON.stringify(formatedSvar) ? true : false;
}

function formatSvar(arr) {
	let format = arr.map((deg) => {
		return `rotate(${deg}deg)`;
	});
	return format;
}

// EASY GAMES

let easyGame1 = [
	"s3.svg",
	"c4.svg",
    "c2.svg",
    
	"t1.svg",
	"t3.svg",
    "t2.svg",
    
	"t4.svg",
	"t1.svg",
    "t3.svg",
    
	"c2.svg",
	"t4.svg",
	"c2.svg",
];

let easyGame2 = [
	"s1.svg",
	"T2.svg",
    "s2.svg",
    
	"",
	"c1.svg",
    "c1.svg",
    
	"s2.svg",
	"t3.svg",
    "t3.svg",
    
	"",
	"c4.svg",
	"c1.svg",
];

let easyGame3 = [
	"c3.svg",
	"c2.svg",
    "",
    
	"s1.svg",
	"t4.svg",
    "c4.svg",
    
	"c3.svg",
	"c2.svg",
    "s1.svg",
    
	"c1.svg",
	"s3.svg",
	"",
];

let easyGame4 = [
	"s2.svg",
	"c4.svg",
	"c2.svg",
    "c1.svg",
    
	"c2.svg",
	"c1.svg",
	"t4.svg",
    "c3.svg",
    
	"c3.svg",
	"c2.svg",
	"t4.svg",
    "c2.svg",
    
    "",
	"c4.svg",
	"c1.svg",
	"s1.svg",
];

let easyGame5 = [
	"",
    "c1.svg",
	"t3.svg",
    "s1.svg",
    
	"",
	"t2.svg",
	"t3.svg",
    "c1.svg",
    
	"s3.svg",
	"t3.svg",
	"c3.svg",
    "t4.svg",
    
    "s3.svg",
	"t2.svg",
	"c2.svg",
	"s2.svg",
];

let easyGame6 = [
	"c2.svg",
	"s4.svg",
	"c2.svg",
    "s4.svg",
    
	"t1.svg",
	"c3.svg",
	"t3.svg",
    "c3.svg",
    
	"t3.svg",
	"t2.svg",
	"t2.svg",
    "t2.svg",
    
    "c4.svg",
	"s2.svg",
	"s3.svg",
	"c2.svg",
];

// MEDIUM

let mediumGame1 = [
	"",
	"c3.svg",
    "t4.svg",
    "t2.svg",
    "c4.svg",
    
    "s1.svg",
	"cross.svg",
    "t3.svg",
    "cross.svg",
    "c2.svg",

    "s1.svg",
	"c3.svg",
    "t4.svg",
    "cross.svg",
    "c1.svg",

    "t2.svg",
	"t4.svg",
    "cross.svg",
    "cross.svg",
    "c4.svg",

    "s3.svg",
	"s4.svg",
    "s4.svg",
    "s2.svg",
    "",
];

let mediumGame2 = [
	"",
	"s2.svg",
    "s1.svg",
    "c2.svg",
    "c3.svg",
    
    "s2.svg",
	"t2.svg",
    "t1.svg",
    "t3.svg",
    "t2.svg",

    "c1.svg",
	"cross.svg",
    "c1.svg",
    "c2.svg",
    "c2.svg",

    "s2.svg",
	"c4.svg",
    "c1.svg",
    "c2.svg",
    "",
];

let mediumGame3 = [
	"",
	"c3.svg",
    "c4.svg",
    "c2.svg",
    "s1.svg",
    
    "",
	"c3.svg",
    "cross.svg",
    "t3.svg",
    "s1.svg",

    "s4.svg",
	"c1.svg",
    "t3.svg",
    "cross.svg",
    "c1.svg",

    "c3.svg",
	"c3.svg",
    "c3.svg",
    "t4.svg",
    "s1.svg",

    "s3.svg",
	"s3.svg",
    "c1.svg",
    "s2.svg",
    "",
];

let mediumGame4 = [
	"c3.svg",
	"s3.svg",
    "c2.svg",
    "s4.svg",
    "",
    
    "c2.svg",
	"c2.svg",
    "t2.svg",
    "c1.svg",
    "s3.svg",

    "",
	"t4.svg",
    "t4.svg",
    "cross.svg",
    "t3.svg",

    "",
	"c4.svg",
    "c4.svg",
    "t2.svg",
    "c4.svg",

    "",
	"s3.svg",
    "t2.svg",
    "c2.svg",
    "",
];

let mediumGame5 = [
	"s1.svg",
	"c2.svg",
    "c3.svg",
    "t1.svg",
    "c1.svg",
    
    "s2.svg",
	"t3.svg",
    "t1.svg",
    "t2.svg",
    "s4.svg",

    "c1.svg",
	"t4.svg",
    "t4.svg",
    "t1.svg",
    "c1.svg",

    "s4.svg",
	"t2.svg",
    "cross.svg",
    "c1.svg",
    "s1.svg",

    "",
	"c4.svg",
    "c4.svg",
    "s4.svg",
    "",
];

let mediumGame6 = [
	"",
	"",
    "s3.svg",
    "s2.svg",
    "s4.svg",
    
    "s4.svg",
	"c3.svg",
    "t3.svg",
    "c1.svg",
    "c2.svg",

    "t3.svg",
	"t4.svg",
    "t3.svg",
    "c3.svg",
    "c1.svg",

    "c3.svg",
	"c1.svg",
    "c1.svg",
    "cross.svg",
    "t3.svg",

    "s4.svg",
	"t4.svg",
    "s3.svg",
    "s1.svg",
    "s3.svg",
];

// HARD

let hardGame1 = [
	"",
	"s2.svg",
    "c3.svg",
    "c2.svg",
    "s4.svg",
    "",
    
    "s1.svg",
	"t1.svg",
    "t1.svg",
    "c2.svg",
    "t3.svg",
    "c1.svg",

    "c1.svg",
	"t1.svg",
    "c2.svg",
    "s1.svg",
    "c2.svg",
    "t4.svg",

    "t4.svg",
	"cross.svg",
    "t4.svg",
    "t3.svg",
    "c2.svg",
    "s1.svg",

    "t3.svg",
	"t2.svg",
    "s4.svg",
    "c3.svg",
    "t2.svg",
    "s1.svg",

    "s4.svg",
	"s1.svg",
    "s1.svg",
    "s3.svg",
    "",
    "",
];

let hardGame2 = [
	"",
	"s1.svg",
    "s3.svg",
    "c3.svg",
    "s4.svg",
    "",
    
    "",
	"c3.svg",
    "t2.svg",
    "t2.svg",
    "s1.svg",
    "c1.svg",

    "s3.svg",
	"t4.svg",
    "cross.svg",
    "c2.svg",
    "s2.svg",
    "s2.svg",

    "s3.svg",
	"t4.svg",
    "t2.svg",
    "t2.svg",
    "t3.svg",
    "s2.svg",

    "",
	"c3.svg",
    "s1.svg",
    "s4.svg",
    "c2.svg",
    "c3.svg",
];

let hardGame3 = [
	"",
	"c1.svg",
    "t4.svg",
    "c4.svg",
    "s2.svg",
    "t2.svg",
    "c2.svg",
    
    "s2.svg",
	"t2.svg",
    "t4.svg",
    "t3.svg",
    "c1.svg",
    "cross.svg",
    "c4.svg",

    "s2.svg",
	"t3.svg",
    "t1.svg",
    "cross.svg",
    "c2.svg",
    "t4.svg",
    "c3.svg",

    "c4.svg",
	"t2.svg",
    "c1.svg",
    "t2.svg",
    "t4.svg",
    "c2.svg",
    "s1.svg",

    "c1.svg",
	"t4.svg",
    "s4.svg",
    "s4.svg",
    "t2.svg",
    "s3.svg",
    "",
];

let hardGame4 = [
	"s2.svg",
	"s3.svg",
    "s1.svg",
    "s4.svg",
    "",
    "",
    
    "t3.svg",
	"t1.svg",
    "c3.svg",
    "t4.svg",
    "c1.svg",
    "",

    "t1.svg",
	"c2.svg",
    "s2.svg",
    "c4.svg",
    "cross.svg",
    "c3.svg",

    "s2.svg",
	"s2.svg",
    "s3.svg",
    "",
    "t2.svg",
    "t3.svg",

    "s1.svg",
	"c1.svg",
    "c1.svg",
    "t1.svg",
    "cross.svg",
    "t1.svg",
    
    "c1.svg",
	"t4.svg",
    "t2.svg",
    "t3.svg",
    "t1.svg",
    "c2.svg",

    "c2.svg",
	"c2.svg",
    "c3.svg",
    "c4.svg",
    "c3.svg",
    "s4.svg",
];



let hardGame5= [
	"s3.svg",
	"c3.svg",
    "t4.svg",
    "c2.svg",
    "",
    
    "c2.svg",
	"t2.svg",
    "c3.svg",
    "cross.svg",
    "c1.svg",

    "c3.svg",
	"t2.svg",
    "c1.svg",
    "t4.svg",
    "t1.svg",

    "t1.svg",
	"cross.svg",
    "c2.svg",
    "c1.svg",
    "t2.svg",

    "t2.svg",
	"t4.svg",
    "s1.svg",
    "t3.svg",
    "c2.svg",

    "c2.svg",
	"s3.svg",
    "s1.svg",
    "c1.svg",
    "",
];

let hardGame6 = [
	"",
	"s1.svg",
    "c2.svg",
    "c2.svg",
    "c3.svg",
    "",
    
    "s3.svg",
	"",
    "c2.svg",
    "t4.svg",
    "cross.svg",
    "c3.svg",

    "c1.svg",
	"s1.svg",
    "c3.svg",
    "t2.svg",
    "t4.svg",
    "s4.svg",

    "c3.svg",
	"c2.svg",
    "t1.svg",
    "cross.svg",
    "c4.svg",
    "s1.svg",

    "t1.svg",
	"t4.svg",
    "t2.svg",
    "t2.svg",
    "s2.svg",
    "t3.svg",
    
    "t2.svg",
	"t4.svg",
    "t2.svg",
    "t4.svg",
    "t3.svg",
    "t3.svg",

    "c2.svg",
	"t1.svg",
    "c1.svg",
    "",
    "s2.svg",
    "s2.svg",
];




// EASY

//game(easyGame1, "E1", "divEasy34");
//game(easyGame2, "E2", "divEasy34");
//game(easyGame3, "E3", "divEasy34");
//game(easyGame4, "E4", "divEasy44");
//game(easyGame5, "E5", "divEasy44");
//game(easyGame6, "E6", "divEasy44");

// MEDIUM

//game(mediumGame1, "M1", "divMedium55");
//game(mediumGame2, "M2", "divMedium54");
//game(mediumGame3, "M3", "divMedium55");
//game(mediumGame4, "M4", "divMedium55");
//game(mediumGame5, "M5", "divMedium55");
//game(mediumGame6, "M6", "divMedium55");

// HARD

//game(hardGame1, "H1", "divHard66");
//game(hardGame2, "H2", "divHard65");
//game(hardGame3, "H3", "divHard75");
//game(hardGame4, "H4", "divHard67");
//game(hardGame5, "H5", "divHard56");
//game(hardGame6, "H6", "divHard67");
