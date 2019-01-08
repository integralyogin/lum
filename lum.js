wikit_list = []
filebucket = []
authbucket = []
savitri_list = []
db = ""
addEventListener("keyup", getInput); // document.getElementById("myinput").addEventListener("keyup", authCount); 


window.addEventListener('keyup', function (event) { // disables some keys
    if (event.keyCode === 9) { event.preventDefault(); return false; }      // left tab
    if (event.keyCode === 16) { event.preventDefault(); return false; }     // left shift
    if (event.keyCode === 36) { //home
        active = document.activeElement.tagName
        if (active == "INPUT") { console.log("addEventListener: INPUT: "+active) } 
        if (active == "home") { console.log("addEventListener: home: "+active); scroll(0,0) }
    }
});
   

function check_address(filename, req) { 
    console.log("check_address: filename: ", filename)
    address = String(window.location.pathname)
    if (address == "/home/oem/Documents/Code/KEYS/lum.html") { console.log("LOCAL");
        return filename
    } else { 
        console.log("ONLINE");    
        newfilename = "https://raw.githubusercontent.com/integralyogin/data-for-lum/master/"+filename
        if (filename.includes('fulldatabase')) {
            newfilename = "https://gitlab.com/integralyogin/fulldatabase/blob/master/"+filename
            newfilename = "https://gitlab.com/integralyogin/fulldatabase/raw/0f997955e3a092d8062556eb0e4658e291ff43bf/"+filename
        } return newfilename
    }
}

function consoleInfo(text) {
    console.log("consoleInfo(): \""+text+"\"")
}

function setUp(filename) {
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
            console.log("getInput: savitri_list[indexNum]: "+savitri_list[indexNum])
            brIndex = savitri_list[indexNum].indexOf("<br>")
            stem = savitri_list[indexNum].slice(1,brIndex)
            console.log("getInput: STEM: "+stem)
            file = setUp("33-34Savitri")
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
    if (event.keyCode == 20) { removeChildren() } // LEFT SHIFT KEYPRESS (16) && CAPS (20)
    if (event.keyCode == 36) { console.log("home") } // or 33 (home keypress, pgup)
}



function Parser(userInput) {  
    if ((userInput.split(" ").length) > 1) { return userInput.split(" "); }
    if ((userInput.split(" ").length) < 2) { return userInput; }
} 

function newParser(userInput, event) {  // listlist
    list_of_dbs = ["keys", "major", "fulldatabase", "33-34Savitri", "gloss", "auth", "wikiauthors", "san", "iye", "aqal", "occ", "cats", "syn", "jbkeys", "todo", "most"]

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

function new_removeChildren(id) { // like output, or demo
 for (x = 0; x < document.getElementById(id).childNodes.length; x++) { 
        document.getElementById(id).removeChild(document.getElementById(id).childNodes[x])
    }
    if ( document.getElementById(id).childNodes.length > 0) { 
        new_removeChildren()
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


function prePrint(event, db, userInput, oldInputForm) {
    req = setUp(db)
    consoleInfo("userInput: "+userInput)
    consoleInfo("typeof(oldInputForm): "+typeof(oldInputForm))

    if (userInput.length < 3 && db == "keys") {
        console.log("prePrint: IF"+userInput)
        quickPrint(req, userInput, db)
    }

    //acacacac
    else if ( userInput == "ac keys" ) { authCount(event, "keys", 3) }
    else if ( userInput == "ac major" ) { authCount(event, "major", 5) }
    else if ( userInput == "ac fulldatabase" ) { authCount(event, "fulldatabase", 15) }
    else if ( userInput == "Savitri" ) {
        consoleInfo("prePrint: Savitri ")
        db = "33-34Savitri"
        regexPrint(req, userInput, db)
    }
    else if (userInput == "lib") { window.location.replace("file:///home/oem/Documents/Code/KEYS/the_lib.html"); }
    // dbdbdbdbdb
    else if (db == "fulldatabase" || db == "major" ) { quickPrint(req, userInput, db) }
    else if (db == "todo" || db == "cats" || db == "keys" ) { consoleInfo("prePrint: todo || cats || keys: ")
        regexPrint(req, userInput, db)
    }

    else if (userInput.match("\\.")) {
        regexPrint(req, userInput, db)
    }

    else if (db == "keys") { console.log("prePrint: ELSEIF"+db)
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
    var sav_index = 0
    var count = 0
    var query = new RegExp(".*"+input+".*", "gim");
	values = file.responseText.match(query);
    savitri_list = []

    for (var x = 0; x < values.length; x++) {
        //document.getElementById("output").appendChild(document.createTextNode(values[x]));

        if (db == "arex") {
            document.getElementById("output").appendChild(document.createTextNode(values[x]));
        }

        else if (values[x].includes(", Savitri")) { // QUERY FOR SAVITRI?
            console.log("regexPrint: db != 33-34Savitri")
            console.log(sav_index.length+"sav_index||savitri_list"+savitri_list.length)
            document.getElementById("output").innerHTML += values[x]+" "+"[!"+sav_index+"]";
            savitri_list.push(values[x]);
            sav_index ++
            //console.log("savitri_list[\"5\"]: "+savitri_list[5])
        }

        else if (db == "33-34Savitri") { //
            console.log("regexPrint: db == 33-34Savitri")
            document.getElementById("output").innerHTML += values[x];
//            document.getElementById("output").innerHTML += "<div onmouseover=\"myOverFunction("+values[x]+")\">"
  //          document.getElementById("output").innerHTML += "<p id=\"demo3\">:"+x+"</p></div>"
        }

        else { document.getElementById("output").innerHTML += values[x]; }

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

function quickListAFile(file, input) { // (file, ".", db)

    var query = new RegExp(".*"+input+".*", "gim");
    values = file.responseText.match(query);

    for (var x = 0; x < values.length; x++) {
        filebucket.push(values[x]);
    }
}


function quickPrint(file, input, db) {
    var count = 0
    var query = new RegExp(".*"+input+".*", "gim");
	values = file.responseText.match(query);

    for (var x = 0; x < values.length; x++) {       
        document.getElementById("output").appendChild(document.createTextNode(values[x]));
        if (db != "todo" && values[x] != "") { 
            document.getElementById("output").appendChild(document.createElement("br"));
            //document.getElementById("output").appendChild(document.createElement("br"));
        }
        //lblblblblb
        if (db == "todo" || db == "super" || db == "fulldatabase" || db == "major" || db == "cleaned" && values[x] != "") {
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
        if (x == location) { document.getElementById("output").innerHTML += "<b>"+newvalues[x]+"</b>" }

        else if (newvalues[x] != "<br>") {document.getElementById("output").appendChild(document.createTextNode(newvalues[x].replace('<br>','').replace('<p>','')));}

        if (newvalues[x].match("<br>")) {document.getElementById("output").appendChild(document.createElement("br"));}
        //document.getElementById("output").appendChild(document.createTextNode(values[x]));
    }
}


function superCount(arr) {
    var a = [], b = [], prev;
    arr.sort();
    for ( var i = 0; i < arr.length; i++ ) {
        if ( arr[i] !== prev ) {
            a.push(arr[i]);
            b.push(1);
        } else {
            b[b.length-1]++;
        }
        prev = arr[i];
    } return [a, b]; 
}

function WhichButton(event) {
  alert("You pressed button: " + event.button)
}


function makeDiv(auth, x) {
    var div = document.createElement("div"+x);
    console.log("f makeDiv: x/auth: "+x+"::"+auth)  // 19: camus

    div.innerHTML = '<div id="demo" onmouseup="mouseOn('+x+')" onmouseout="mouseOff('+x+')"><p><b>'+auth+'</b> (<span id="demo'+x+'"></span>)</p></div>'

    document.getElementById("output").appendChild(div);
}


function authCount(event, db, moreCountsThen) {
    file = setUp(db)
    quickListAFile(file, ".")
    r = 0
    for (x = r; x < filebucket.length; x++) { 
        i = filebucket[x].indexOf("~")
        comma = filebucket[x].indexOf(",")
        relative_comma = filebucket[x].slice(i, filebucket[x].length).indexOf(",")
        tag = filebucket[x].indexOf("#")

        if ( comma == "-1" ) { comma = filebucket[x].length }
        if ( relative_comma == "-1" ) { relative_comma = filebucket[x].length }
        if ( tag == "-1" ) { tag = filebucket[x].length }
 
        the_cut = filebucket[x].slice(i+2, Math.min(filebucket[x].length-1, relative_comma+i, tag))
        the_cut = the_cut.trim()
        authbucket.push(the_cut);
    } 
    superArray = superCount(authbucket)

    for (x = 0; x < authbucket.length; x++) {
        if (superArray[1][x] > moreCountsThen) {
            //document.getElementById("output").appendChild(document.createTextNode(superArray[0][x]+" :: "+superArray[1][x]));
            //document.getElementById("output").appendChild(document.createElement("br"));
            //document.getElementById("output").appendChild(document.createTextNode());
            makeDiv(superArray[0][x], x)
            //console.log("authbucket.length "+authbucket.length+authbucket[x])
        }
    }
    //window.stop();
}


function mouseOn(x) {
    wikit = setUp("wikiauthors")
    var node = document.getElementById('demo')
    textContent = node.childNodes[0].innerHTML
    text_length = textContent.length
    var query = new RegExp("^"+""+".*", "img");
    entry = (wikit.responseText.match(query, "img"));
    authName = textContent.slice(1, text_length-4)

    console.log("f mouseOn: node.attributes.length: "+node.attributes.length) 
    console.log("f mouseOn: node.attributes.name: "+node.attributes[1].name)
    console.log("f mouseOn: node.childNodes: "+node.childNodes)  //>>> [object NodeList]
    console.log("f mouseOn: node.childNodes[0]: "+node.childNodes[0]) //>>> [object HTMLParagraphElement]
    console.log("f mouseOn: node.childElementCount: "+node.childElementCount) //>>> 1
    console.log("f mouseOn: node.childNodes[0]: "+node.childNodes[0].innerHTML)  //>>> <b>?</b> (<span id="demo5"></span>)
    console.log("f mouseOn: entry.length/wikit.length: "+entry.length+"/"+wikit.length) //860
    console.log("f mouseOn: x: "+x)    //>>> 19 (on camus)
    console.log("f mouseOn: node: "+node)
    console.log("f mouseOn: textContent: "+textContent)  //>>> textContent: <b>?</b> (<span id="demo5"></span>)
    console.log("f mouseOn: authName ::: "+authName)  //>>> f mouseOn: authName ::: b>?</b> (<span id="demo5"></sp
    //for (x=0; x < node.attributes.length; x++) { console.log("f mouseOn: node.attributes[x]: "+node.attributes[x]) }

    for (var i = 0; i < entry.length; i++) {
        if (authName != "") {
            //console.log("f mouseOn: i/entry[i]: "+i+"/"+entry[i]) //prints out 800 things.. i=19 = crowley
            if (entry[i].includes("Aleister Crowley")) {
                //console.log("authName :"+authName)
                //console.log("match "+entry[i])
                //console.log(entry[i])
            }
        }
    } document.getElementById("demo"+x).appendChild(document.createTextNode("values"+x+": "+entry[x]));
}

function mouseOff(x) { new_removeChildren("demo"+x) }
