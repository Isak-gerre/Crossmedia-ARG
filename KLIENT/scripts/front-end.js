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







