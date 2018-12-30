function check_address(filename, req) { 
    address = window.location.pathname
    address = String(address)

    if (address == "/home/oem/Documents/Code/lum.html") {
        console.log("LOCAL")
        return filename
    } 
    else {
        console.log("ONLINE")
        newfilename = "https://raw.githubusercontent.com/integralyogin/data-for-lum/master/"+filename
        return newfilename
    }
}

function setUp(event, filename) {
    var req = new XMLHttpRequest();
    newfilename = check_address(filename, req)
    console.log("newFILENAME:")
    console.log(newfilename)
    req.open("GET", newfilename, false);
    req.send(null);
    var values;
    return req
}


function process(text) {
    for (var i = 0; i < text.length; i++) {
        new_text = text[i].split(" ")
        //console.log(i, new_text[1])
        if (new_text[1] == "1") {
            console.log(new_text)
            console.log(typeof new_text)
            return new_text
        }
    }
}


function new_getInput(event) {
    userInput = document.getElementById("myinput").value;
    // req = setUp(event, userInput, keys)
    if (event.keyCode == 13) { 
        console.log("enter")
        arguments = Parser(userInput)
        if (userInput.split(" ").length > 1) { //if 2+ args
            req = setUp(event, arguments[0].toLowerCase())
            new_arg = ""
            for (var x = 1; x < arguments.length; x++) { // prep 2nd part of arg
                new_arg += arguments[x]
                if (x < arguments.length-1) { new_arg += " " }
            console.log(new_arg)
            }
            regexPrint(req, new_arg)
        }
        if (userInput.split(" ").length == 1) { // if no arg
            req = setUp(event, "keys")
            regexPrint(req, userInput); 
        }
    }
    if (event.keyCode == 9) { // left tab
        document.getElementById("myinput").scrollIntoView();
    }
    if (event.keyCode == 16) { //left shift
        console.log("left shift")
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
    var para = document.createElement("P"); 
    var out = document.getElementById("output");

	values = file.responseText.match(query);

    for (var x = 0; x < values.length; x++) {
        out.appendChild(document.createTextNode(values[x]));
        if (values[x] != "") { 
            out.appendChild(document.createElement("br"));
            out.appendChild(document.createElement("br"));
        }
        count++;
    }
    out.appendChild(document.createTextNode(count));    
    //out.appendChild(document.createTextNode("<a href=\"#top\">top</a>"))
}



function Parser(userInput) {  
    if ((userInput.split(" ").length) > 1 ) { // 2+ args
        var argument = userInput.split(" ");
        return argument
    }
    if ((userInput.split(" ").length) < 2) { // 1 arg
        console.log("userInput.split.length:::")
        console.log(userInput.split(" ").length)
        return userInput
    }
} 


  
window.addEventListener('keydown', function (event) { //removes tabs previous functionality
    if (event.keyCode === 9) { //left tab
        event.preventDefault();
        return false;
    }
    if (event.keyCode === 16) { //left shift?
        event.preventDefault();
        return false;
    }
});

    //document.getElementById("myinput").addEventListener("keyup", new_getInput); 
  addEventListener("keyup", new_getInput);
