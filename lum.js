function check_address(filename, req) { 
    address = String(window.location.pathname)
    if (address == "/home/oem/Documents/Code/lum.html") { // LOCAL
        return filename
    } else { // ONLINE
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


function Parser(userInput) {  
    if ((userInput.split(" ").length) > 1) { return userInput.split(" "); }
    if ((userInput.split(" ").length) < 2) { return userInput; }
} 


function newParser(userInput, event) { 
    list_of_dbs = ["keys", "arex", "QQ", "gloss", "san", "iye", "aqal", "occ","auth", "cats", "syn"]
    userInput = Parser(userInput)
    db = "keys"
    for (x = 0; x < list_of_dbs.length; x++) { // CLEAN DB_ARG IF ONE EXISTS
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
    regexPrint(req, userInput)
}

function getInput(event) {
    userInput = document.getElementById("myinput").value;
    document.getElementById("myinput").focus();

    if (event.keyCode == 13) { // ENTER KEYPRESS
        arguments = newParser(userInput, event)
    }
    if (event.keyCode == 9) {       // LEFT TAB KEYPRESS
        document.getElementById("myinput").scrollIntoView();
        document.getElementById("myinput").focus(); 
    }
    if (event.keyCode == 16) {      // LEFT SHIFT KEYPRESS
        removeChildren()
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


function regexPrint(file, input) { 
    var count = 0
    var query = new RegExp(".*"+input+".*", "gim");
	values = file.responseText.match(query);

    for (var x = 0; x < values.length; x++) {
        document.getElementById("output").appendChild(document.createTextNode(values[x]));
        if (values[x] != "") { 
            document.getElementById("output").appendChild(document.createElement("br"));
            document.getElementById("output").appendChild(document.createElement("br"));
        }
        count++;
    }
    document.getElementById("output").appendChild(document.createTextNode(count));
}



window.addEventListener('keydown', function (event) { // disables some keys
    if (event.keyCode === 9) { //left tab
        event.preventDefault();
        return false;
    }
    if (event.keyCode === 16) { //left shift
        event.preventDefault();
        return false;
    }
});

    //document.getElementById("myinput").addEventListener("keyup", getInput); 
  addEventListener("keyup", getInput);

