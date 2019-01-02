function check_address(filename, req) { 
    address = String(window.location.pathname)
    if (address == "/home/oem/Documents/Code/lum.html") { console.log("LOCAL");
        return filename
    } else { console.log("ONLINE");    
        newfilename = "https://raw.githubusercontent.com/integralyogin/data-for-lum/master/"+filename
        return newfilename
    }
}


function setUp(event, filename) {
    var req = new XMLHttpRequest();
    newfilename = check_address(filename, req)
    req.open("GET", newfilename, false);
    req.send(null);
    return req
}


function process(text) {
    for (var i = 0; i < text.length; i++) {
        new_text = text[i].split(" ")
        if (new_text[1] == "1") { return new_text; }
    }
}


function auth_list(event) { 
    setUp(event, "keys")
}


function Parser(userInput) {  
    if ((userInput.split(" ").length) > 1) { return userInput.split(" "); }
    if ((userInput.split(" ").length) < 2) { return userInput; }
} 


function newParser(userInput, event) { 
    list_of_dbs = ["keys", "arex", "QQ", "gloss", "san", "iye", "aqal", "occ","auth", "cats", "syn", "jbkeys", "todo"]
    list_of_special_commands = ["process auth"]

    userInput = userInput.toLowerCase();
    userInput = Parser(userInput)
    db = "keys"
    for (x = 0; x < list_of_dbs.length; x++) { // check for DB and CLEAN ARG IF ONE EXISTS
        if (userInput[0] == list_of_dbs[x]) { 
            db = list_of_dbs[x]; 
            userInput = userInput.splice(1);
            console.log("FOUND DB")
        } 
    }
    new_arg = userInput
    userInput = String(userInput)
    if (userInput.split(",").length > 1) {
        for (var x = 0; x < Number(userInput.split(",").length)-1; x++) { // PREPRINT SET UP
            if (x < userInput.split(",").length-1) { new_arg += " " }
        }
    }
    userInput = userInput.replace(/,/g, " ")
    prePrint(event, db, userInput)
    return userInput
}


function prePrint(event, db, userInput) {
    req = setUp(event, db)
    regexPrint(req, userInput, db)
}

function consoleInfo(text) {
    console.log("consoleInfo()")    
    console.log("text:")
    console.log(text)
}

function getInput(event) {
    userInput = document.getElementById("myinput").value;


    if (event.keyCode == 13) { // ENTER KEYPRESS
        consoleInfo(userInput)
        arguments = newParser(userInput, event)
    }
    if (event.keyCode == 9) {       // TAB KEYPRESS
        document.getElementById("myinput").scrollIntoView();
        document.getElementById("myinput").focus(); 
    }
    if (event.keyCode == 16) {      // LEFT SHIFT KEYPRESS
        removeChildren()
    }
    if (event.keyCode == 36) { // or 33 (home keypress, pgup)
        console.log("home")
    }
}


function removeChildren() {
    for (x = 0; x < document.getElementById("output").childNodes.length; x++) { 
        document.getElementById("output").removeChild(document.getElementById("output").childNodes[x])
    }
    if ( document.getElementById("output").childNodes.length > 0) { 
        removeChildren()
    }
}


function regexPrint(file, input, db) { 
    var count = 0
    var query = new RegExp(".*"+input+".*", "gim");
	values = file.responseText.match(query);

    for (var x = 0; x < values.length; x++) {
        //document.getElementById("output").appendChild(document.createTextNode(values[x]));
        document.getElementById("output").innerHTML += values[x];
        if (db != "todo" && values[x] != "") { 
            document.getElementById("output").appendChild(document.createElement("br"));
            document.getElementById("output").appendChild(document.createElement("br"));
        }
        if (db == "todo" && values[x] != "") {
            document.getElementById("output").appendChild(document.createElement("br"));
        }

        count++;
    }
    document.getElementById("output").appendChild(document.createTextNode(count));
}



window.addEventListener('keyup', function (event) { // disables some keys
    if (event.keyCode === 9) { //left tab
        event.preventDefault();
        return false;
    }
    if (event.keyCode === 16) { //left shift
        event.preventDefault();
        return false;
    }
    if (event.keyCode === 36) { //home
        active = document.activeElement.tagName
        if (active == "INPUT") { 
            console.log("INPUT ACTIVE:")
            console.log(active)
        } 
        if (active == "home") {
            console.log("home ACTIVE")
            console.log(active)
            scroll(0,0)
            //event.preventDefault();
            //return false;
        }
    }
});

    //document.getElementById("myinput").addEventListener("keyup", getInput); 
  addEventListener("keyup", getInput);
