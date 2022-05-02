
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

// createTabs(array[
        // {
        //     header: "",
        //     content: [

        //     ]
        // },
        // {
        //     header: "",
        //     content: [

        //     ]
        // },
    // ])
    // return DOM

// 

// createForm( [inputs] ; "method" ; "action" ; "id")
    // return DOM

//printTerminalText( "text" || array["string", {txt: "string", func: onclick action}])
    // appends text
//


// --------------------------------------------------------------------------------------

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




// --------------------------------------------------------------------------------------

// TEST CALLS

// document.body.append(createBalls());


document.body.append( createReadyButton("ready", "readyButton", "20/20 player ready") );
// printTerminalText(textArr);

createTabs(tabGroup)



// --------------------------------------------------------------------------------------


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

    let warning = document.createElement("div");
    warning.classList.add("fold");

    let initButton = createButton(initTxt, confirm);

    let confirmWrapper = document.createElement("section");
    confirmWrapper.classList.add("button-confirm-wrapper");

    confirmWrapper.append( createButton(ultTxt, callback), createButton("cancel", close) );


    const time = 200;

    async function close(){
        confirmWrapper.classList.remove("button-confirm-gap");
        confirmWrapper.lastChild.classList.remove("accent");

        wrapper.setAttribute("id", "mainCol");
        
        wrapper.setAttribute("id", "");
        
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
            confirmWrapper.lastChild.classList.add("accent");
        }, time*3)

    }   

    wrapper.append(warning, initButton)

    return wrapper
}

function createConditionalButton(txt, heardObj, condFunc, callback){
    let button = createButton(txt, callback);
    button.classList.add("button-disabled")
    
    // condFunc should check if condition is met. 
    //Returns true or false
    
    heardObj.addEventListener("keyup", ()=>{

        if( condFunc() ){
            button.classList.remove("button-disabled")
            console.log( condFunc )
        } else {
            button.classList.add("button-disabled")
            console.log("no")
        }
    });

    return button
}

function createReadyButton(initTxt, id, activeTxt){
    let button = createButton(initTxt, activate);
    button.setAttribute("id", id);

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
}   

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
    
    return wrapper;
}
