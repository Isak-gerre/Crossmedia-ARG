// VARS FOR TEST
let textArr = [
    "Inga aktiva spelsessioner hittas i närområdet.",
    {
        txt: "Skapa nytt spel",
        func: () => {
            console.log("skapa nytt");
        }

    },
    "Eller",
    {
        txt: "Mata in spelkod",
        func: () =>{
            document.querySelector("main").append( createInput("Mata in spelkod", "gamecode", "gamecode") ); 
            document.querySelector("main").append( createButton("gå med") ); 

        }
    }
]

let create = {
    header: "Skapa konto",
    content: [
        createInput("användarnamn", "username", "username"), 
        createInput("lösenord", "password", "password"), 
        createInput("bekräfta lösenord", "password-heck", "password-check"),
        createButton("skapa")
    ]
}

let signIn = {
    header: "Logga in",
    content: [
        createInput("användarnamn", "username", "username"),
        createInput("lösenord", "password", "password"),
        createButton("logga in")
    ]
}

let tabGroup = [create, signIn];






function createButton(string, callback = false){
    let button = document.createElement("button");
    button.textContent = string;

    button.addEventListener("click", ()=>{
        button.classList.add("button-active");
        setTimeout( ()=>{
            button.classList.remove("button-active");
        }, 500 )
    });

    return button;
}

function createInput(labelText, id, name, value = false){
    let wrapper = document.createElement("div");
    wrapper.classList.add("input-wrapper")

    let label = document.createElement("label");
    label.textContent = labelText + ":";
    label.setAttribute("for", id);

    let input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("id", id);
    input.setAttribute("name", name);

    if( value){
        input.setAttribute("value", value);
    }

    wrapper.append(label, input);

    return wrapper;
}

function createTabs(tabArr){
    let wrapper = document.createElement("div");
    wrapper.classList.add("tab-wrapper");

    let tabHeadWrapper = document.createElement("div");
    tabHeadWrapper.classList.add("tab-head-wrapper", "header");

    let tabContent = document.createElement("section");
    tabContent.setAttribute("id", "tabContent");

    let count = "one";
    tabArr.forEach(tab => {
        let tabTitle = document.createElement("span");
        tabTitle.classList.add("tab-header");

        tabTitle.textContent = tab.header;

        if(count == "one"){
            tabTitle.classList.add("active");
            tabContent.append( createForm(tab.content, "post", "", "hello") );

        } 

        tabTitle.setAttribute("id", `tab-button-${count}`);

        tabHeadWrapper.append(tabTitle);

        tabTitle.addEventListener("click", ()=>{
            if(tabTitle.classList.contains("active")) return

            document.querySelector(".active").classList.remove("active");

            tabTitle.classList.add("active");

            tabContent.innerHTML = ``;
            tabContent.append( createForm(tab.content, "post", "/", "hello") );
        });

        count = "two";
    });

    wrapper.append(tabHeadWrapper, tabContent);

    return wrapper

}

function createForm(inputs, method, action, id){
    let form = document.createElement("form");
    form.setAttribute("action", action);
    form.setAttribute("method", method);
    form.setAttribute("id", id);

    inputs.forEach(input => {
        form.append(input);
    });

    return form

}


function printTerminalText(input){

    if(Array.isArray( input ) ) {
        input.forEach(message => {
            document.querySelector("body").append( createString(message) )
            
        });
    } else {
        document.querySelector("body").append( createString(input) )
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
}

printTerminalText(textArr);


// Ignore
document.getElementById("button").addEventListener("click", async(event) =>{
    let button = event.target
    button.style.color ="var(--main)";
    
    await new Promise( (resolve, reject) =>{
        setTimeout( ()=>{
            button.style.color ="";
            button.classList.add("button-disabled");
            resolve()

        }, 1000)
    } )

    //create new buttons
    let wrap = document.createElement("div");
    wrap.classList.add("button-confirm"); 
    let proceed = createButton("Starta", ()=>{
        console.log("hello")
    });
    let cancel = createButton("Avbryt");
    wrap.append( proceed, cancel);
        
    button.append(wrap);
    
    await new Promise( (resolve, reject) => {
        setTimeout( ()=>{
            wrap.classList.add("button-confirm-gap");
            cancel.classList.add("accent");
            resolve();
        }, 500)
    })
    

})






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
      .map(c => flipTable[c] || c)
      .reverse()
      .join("")
  }
  
  var flipTable = {
  '\u0021' : '\u00A1',
  '\u0022' : '\u201E',
  '\u0026' : '\u214B',
  '\u0027' : '\u002C',
  '\u0028' : '\u0029',
  '\u002E' : '\u02D9',
  '\u0033' : '\u0190',
  '\u0034' : '\u152D',
  '\u0036' : '\u0039',
  '\u0037' : '\u2C62',
  '\u003B' : '\u061B',
  '\u003C' : '\u003E',
  '\u003F' : '\u00BF',
  '\u0041' : '\u2200',
  '\u0042' : '\u10412',
  '\u0043' : '\u2183',
  '\u0044' : '\u25D6',
  '\u0045' : '\u018E',
  '\u0046' : '\u2132',
  '\u0047' : '\u2141',
  '\u004A' : '\u017F',
  '\u004B' : '\u22CA',
  '\u004C' : '\u2142',
  '\u004D' : '\u0057',
  '\u004E' : '\u1D0E',
  '\u0050' : '\u0500',
  '\u0051' : '\u038C',
  '\u0052' : '\u1D1A',
  '\u0054' : '\u22A5',
  '\u0055' : '\u2229',
  '\u0056' : '\u1D27',
  '\u0059' : '\u2144',
  '\u005B' : '\u005D',
  '\u005F' : '\u203E',
  '\u0061' : '\u0250',
  '\u0062' : '\u0071',
  '\u0063' : '\u0254',
  '\u0064' : '\u0070',
  '\u0065' : '\u01DD',
  '\u0066' : '\u025F',
  '\u0067' : '\u0183',
  '\u0068' : '\u0265',
  '\u0069' : '\u0131',
  '\u006A' : '\u027E',
  '\u006B' : '\u029E',
  '\u006C' : '\u0283',
  '\u006D' : '\u026F',
  '\u006E' : '\u0075',
  '\u0072' : '\u0279',
  '\u0074' : '\u0287',
  '\u0076' : '\u028C',
  '\u0077' : '\u028D',
  '\u0079' : '\u028E',
  '\u007B' : '\u007D',
  '\u203F' : '\u2040',
  '\u2045' : '\u2046',
  '\u2234' : '\u2235'
  }
  
  Object.keys(flipTable).forEach(i => flipTable[flipTable[i]] = i)