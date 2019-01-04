
<script>
function check_address(filename, req) { 
    address = String(window.location.pathname)
    if (address == "/home/oem/Documents/Code/KEYS/lum.html") { console.log("LOCAL");
        return filename
    } else { console.log("ONLINE");    
        newfilename = "https://raw.githubusercontent.com/integralyogin/data-for-lum/master/"+filename
        return newfilename
    }
}


function consoleInfo(text) {
    console.log("consoleInfo(): \""+text+"\"")
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




function getInput(event) {
    userInput = document.getElementById("myinput").value;
    console.log("getInput(event): userInput[0]: "+userInput[0])

    if (event.keyCode == 13) { // ENTER KEYPRESS
        db = ""
        removeChildren()
        consoleInfo(userInput)
        if (userInput[0] == "!" && savitri_list.length > 0) {
            removeChildren()
            indexNum = userInput.slice(1)
            target = savitri_list[indexNum] // = savitri passage
            //stem = savitri_list[remains].split("\~")
            //console.log("STEM: "+stem)
            //document.getElementById("output").innerHTML += savitri_list[indexNum]
            console.log("getInput: savitri_list[indexNum]: "+savitri_list[indexNum])
            //console.log("savitri_list[indexNum]).indexOf(\"<br>\"): "+savitri_list[indexNum].indexOf("<br>"));
            brIndex = savitri_list[indexNum].indexOf("<br>")
            stem = savitri_list[indexNum].slice(1,brIndex)
            console.log("getInput: STEM: "+stem)
            file = setUp(event, "33-34Savitri")
            //console.log("getInput: DB: "+db)
            sectionalPrint(file, stem, "33-34Savitri")
        }
        arguments = newParser(userInput, event)
        scroll(0,0)
        document.getElementById("myinput").blur()
    }
    if (event.keyCode == 9) {       // TAB KEYPRESS
        //document.getElementById("myinput").scrollIntoView();
        document.getElementById("myinput").focus(); 
        scroll(0,0)
    }
    if (event.keyCode == 20) {      // LEFT SHIFT KEYPRESS (16) && CAPS (20)
        removeChildren()
    }
    if (event.keyCode == 36) { // or 33 (home keypress, pgup)
        console.log("home")
    }
}



function Parser(userInput) {  
    if ((userInput.split(" ").length) > 1) { return userInput.split(" "); }
    if ((userInput.split(" ").length) < 2) { return userInput; }
} 

function newParser(userInput, event) { 
    list_of_dbs = ["keys", "arex", "QQ", "gloss", "san", "iye", "aqal", "occ","auth", "cats", "syn", "jbkeys", "todo", "most", "33-34Savitri"]
    list_of_special_commands = ["process auth"]

    userInput = userInput.toLowerCase();
    userInput = Parser(userInput)
    if (db == "") { db = "keys" }
    consoleInfo("newParser: DB: "+db)
    //db = "33-34Savitri"
    for (x = 0; x < list_of_dbs.length; x++) { // check for DB and CLEAN ARG IF ONE EXISTS
        if (userInput[0] == list_of_dbs[x]) { 
            db = list_of_dbs[x]; 
            userInput = userInput.splice(1);
            console.log("newParser: FOUND DB")
        } 
    }
    new_arg = userInput
    oldInputForm = userInput
    userInput = String(userInput)
    if (userInput.split(",").length > 1) {
        for (var x = 0; x < Number(userInput.split(",").length)-1; x++) { // PREPRINT SET UP
            if (x < userInput.split(",").length-1) { new_arg += " " }
        }
    }
    userInput = userInput.replace(/,/g, " ")
    prePrint(event, db, userInput, oldInputForm)
    return userInput
}


function removeChildren() {
    for (x = 0; x < document.getElementById("output").childNodes.length; x++) { 
        document.getElementById("output").removeChild(document.getElementById("output").childNodes[x])
    }
    if ( document.getElementById("output").childNodes.length > 0) { 
        removeChildren()
    }
}


function myOverFunction(text) {
    //document.getElementById("demo3").innerHTML = y+=1;
    console.log("myOverFunction: "+text)
}

function libraryProcessor() {

}

function prePrint(event, db, userInput, oldInputForm) {
    req = setUp(event, db)
    consoleInfo("userInput: "+userInput)
    consoleInfo("typeof(oldInputForm): "+typeof(oldInputForm))
    //consoleInfo(db)

    if (userInput.length < 3 && db == "keys") {
        // for long searches where input.length < 2
        console.log("prePrint: IF"+userInput)
        quickPrint(req, userInput, db)
    }

    else if ( userInput == "Savitri" ) {
        //document.write("  _/\           /\_ ")
        //document.write("_/---\-_______-/---\_")
        //document.getElementById("output").innerHTML += "_/***\-______________-/***\_<br>"
        consoleInfo("prePrint: Savitri ")
        db = "33-34Savitri"
        regexPrint(req, userInput, db)
        //regexPrint("")
        //regexPrint("")
    }


    else if (userInput == "lib") {
        window.location.replace("file:///home/oem/Documents/Code/KEYS/the_lib.html");
    }

    else if (db == "todo" || db == "cats" || db == "keys" ) {
    // inner HTML print (cats and todo)
        consoleInfo("prePrint: todo || cats || keys: ")
        regexPrint(req, userInput, db)
    }

    else if (userInput.match("\\.")) {
        regexPrint(req, userInput, db)
    }

    else if (db == "keys") { 
        // color Print if simple expression (God, Sri Aurobindo)
        console.log("prePrint: ELSEIF"+db)
        try {
            colorPrint(req, userInput, db)
        }
        catch(err) {
            regexPrint(req, userInput, db)
        }
    }

    else {
        // regex Print if regular expression
        console.log("prePrint: ELSE")
        regexPrint(req, userInput, db)
    }

}



function colorPrint(file, input, db) {
    var count = 0
    var query = new RegExp(".*"+input+".*", "gim");
	values = file.responseText.match(query);    

    for (var x = 0; x < values.length; x++) {
        input_start = ""; 
        input_end = ""
        string_length = ""

        input_start = values[x].toLowerCase().indexOf(input);
        //console.log("input_start: "+input_start)
        input_end = input_start + input.length
        string_length = values[x].length

        // substr (start, length)

        pre = values[x].substr(0, input_start);
        boldinput = "<b>"+values[x].substr(input_start, input.length)+"</b>";
        post = values[x].substr(input_end, (string_length-input_end));

        //console.log(pre + post)

        document.getElementById("output").innerHTML += pre + boldinput + post
        //document.getElementById("output").innerHTML += values[x] + "<br>"
        //document.getElementById("output").innerHTML += "S:"+input_start+", E:"+input_end+", Input.L:"+input.length+", boldInput.L:"+boldinput.length+", PRE.L:"+pre.length+", POST.L:"+post.length+", S.L:"+string_length

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


function regexPrint(file, input, db) { 
    var count = 0
    var query = new RegExp(".*"+input+".*", "gim");
	values = file.responseText.match(query);
    savitri_list = []

    for (var x = 0; x < values.length; x++) {
        //document.getElementById("output").appendChild(document.createTextNode(values[x]));

        if (db == "arex") {
            document.getElementById("output").appendChild(document.createTextNode(values[x]));
        }

        else if (db != "33-34Savitri") {
            console.log("regexPrint: db != 33-34Savitri")
            document.getElementById("output").innerHTML += values[x]+" "+"[!"+x+"]";
            savitri_list.push(values[x]);
            //console.log("savitri_list[\"5\"]: "+savitri_list[5])
        }

        if (db == "33-34Savitri") {
            console.log("regexPrint: db == 33-34Savitri")
            document.getElementById("output").innerHTML += values[x];
//            document.getElementById("output").innerHTML += "<div onmouseover=\"myOverFunction("+values[x]+")\">"
  //          document.getElementById("output").innerHTML += "<p id=\"demo3\">:"+x+"</p></div>"
        }

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


function quickPrint(file, input, db) {
    var count = 0
    var query = new RegExp(".*"+input+".*", "gim");
	values = file.responseText.match(query);

    for (var x = 0; x < values.length; x++) {
        
        document.getElementById("output").appendChild(document.createTextNode(values[x]));
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


function sectionalPrint(file, input, db) {
    var count = 0
    var location = 0
    var query = new RegExp(".*"+input+".*", "gim");
    var setUp = new RegExp(".*"+"."+".*", "gim");
	newvalues = file.responseText.match(setUp);
    console.log("sectionalPrint: file: "+file)
    console.log("sectionalPrint: newvalues[38774]: "+newvalues[38774])
    console.log("sectionalPrint: newvalues.length: "+newvalues.length)
    console.log("sectionalPrint: input: "+input)
    console.log("sectionalPrint: $.trim(input): '"+$.trim(input)+"'")
    console.log("sectionalPrint: $.newvalues[19387]: "+newvalues[19387])
    console.log("sectionalPrint: $.newvalues[19387].length: "+newvalues[19387].length)
    console.log("sectionalPrint: $.trim(input).length: "+$.trim(input).length)

    // LOCATE IN SAVITRI
    for (x = 0; x < newvalues.length; x++) { 

        if (newvalues[x].includes($.trim(input))) { console.log("fixed mind: "+newvalues[x]+" + "+x); }

        //if (newvalues[x].match($.trim(input))) {
        if (newvalues[x].includes($.trim(input))) {
            location = x
            console.log("sectionalPrint: location: "+location)
            console.log("sectionalPrint: typeof location: "+(typeof location))
            console.log("sectionalPrint: values[location] & x:::: "+newvalues[location]+" & "+x)
        }
    }
    // PRINT
    s = 20;
    for (x = location-s; x < location+s; x++) { 
        if (x == location) { 
            document.getElementById("output").innerHTML += "<b>"+newvalues[x]+"</b>"
                //document.getElementById("output").innerHTML += values[x]
        }

        else if (newvalues[x] != "<br>") {document.getElementById("output").appendChild(document.createTextNode(newvalues[x].replace('<br>','').replace('<p>','')));}

        if (newvalues[x].match("<br>")) {document.getElementById("output").appendChild(document.createElement("br"));}
        //document.getElementById("output").appendChild(document.createTextNode(values[x]));
    }
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
            console.log("addEventListener: INPUT: "+active)
        } 
        if (active == "home") {
            console.log("addEventListener: home: "+active)
            scroll(0,0)
            //event.preventDefault();
            //return false;
        }
    }
});

    savitri_list = []
    db = ""
    //document.getElementById("myinput").addEventListener("keyup", getInput); 
  addEventListener("keyup", getInput);

</script>
