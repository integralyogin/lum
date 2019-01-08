    filebucket = []
    authbucket = []
    savitri_list = []
    db = ""

window.addEventListener("keyup", getInput); // document.getElementById("myinput").addEventListener("keyup", authCount); 
window.addEventListener('keyup', function (event) { // disables some keys
    if (event.keyCode === 9) { event.preventDefault(); return false; }      // left tab
    if (event.keyCode === 16) { event.preventDefault(); return false; }     // left shift
    if (event.keyCode === 36) { //home
        active = document.activeElement.tagName
        if (active == "INPUT") { console.log("addEventListener: INPUT: "+active) } 
        if (active == "home") { console.log("addEventListener: home: "+active); scroll(0,0) }
    }
});
   

function getInput(event) {
    userInput = document.getElementById("myinput").value;
    if (event.keyCode == 13) { // ENTER KEYPRESS
        db = ""
        new_removeChildren("output")
        arguments = newParser(userInput, event)
        scroll(0,0)
        document.getElementById("myinput").blur()
    }
    if (event.keyCode == 9) { document.getElementById("myinput").focus(); scroll(0,0); }    // TAB KEYPRESS
    if (event.keyCode == 20) { new_removeChildren("output") }                               // LEFT SHIFT KEYPRESS (16) && CAPS (20)
    if (event.keyCode == 36) { console.log("home") }                                        // or 33 (home keypress, pgup)
 //document.getElementById("myinput").scrollIntoView();
}


function newParser(userInput, event) {          // listlistlistlistdb
    list_of_dbs = ["keys", "major", "fulldatabase", "33-34Savitri", "gloss", "auth", "wikiauthors", "san", "iye", "aqal", "occ", "cats", "syn", "jbkeys", "todo", "most"]
    userInput = userInput.toLowerCase();
    if ((userInput.split(" ").length) > 1) { userInput = userInput.split(" "); }
    if (db == "") { db = "keys" }
    for (x = 0; x < list_of_dbs.length; x++) {  // if userInput[0] is database
        if (userInput[0] == list_of_dbs[x]) { 
            db = list_of_dbs[x]; userInput = userInput.splice(1); 
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


function prePrint(event, db, userInput, oldInputForm) {
    req = setUp(db)
    userInput = document.getElementById("myinput").value;
    if (userInput[0] == "!" && savitri_list.length > 0) { // SAVITRI SECTIONAL PRINT
        new_removeChildren("output")
        indexNum = userInput.slice(1)
        target = savitri_list[indexNum] // = savitri passage
        brIndex = savitri_list[indexNum].indexOf("<br>")
        stem = savitri_list[indexNum].slice(1,brIndex)
        file = setUp("33-34Savitri")
        sectionalPrint(file, stem, "33-34Savitri")
    }
    else if (userInput.length < 2 && db == "keys") { quickPrint(req, userInput, db) }
    /// acacacac 
    else if ( userInput.toLowerCase() == "ac keys" ) { authCount(event, "keys", 3) }
    else if ( userInput.toLowerCase() == "ac major" ) { authCount(event, "major", 5) }
    else if ( userInput.toLowerCase() == "ac fulldatabase" ) { authCount(event, "fulldatabase", 15) }
    // links
    else if ( userInput == "lib") { window.location.replace("file:///home/oem/Documents/Code/KEYS/the_lib.html"); }
    /// dbdbdbdbdb
    else if ( db == "fulldatabase" || db == "major" ) { quickPrint( req, oldInputForm, db ) } // QUICKPRINT FOR BIG DATABASES
    else { regexPrint( req, oldInputForm, db ) }

}


function setUp(filename) {
    var req = new XMLHttpRequest();
    newfilename = check_address(filename, req)
    req.open("GET", newfilename, false);
    req.send(null);
    return req
}


function check_address(filename, req) { 
    address = String(window.location.pathname)
    if (address == "/home/oem/Documents/Code/KEYS/lum.html") { console.log("LOCAL");
        return filename
    } else { 
        console.log("ONLINE");    
        newfilename = "https://raw.githubusercontent.com/integralyogin/data-for-lum/master/"+filename
        if (filename.includes('fulldatabase')) {
            newfilename = "https://gitlab.com/integralyogin/fulldatabase/raw/0f997955e3a092d8062556eb0e4658e291ff43bf/"+filename
        } return newfilename
    }
}

// ---------------------------------------------------------------------//
//  PREPRINT --> (REGEXPRINT, QUICKPRINT, SECTIONALPRINT, AUTHCOUNT)    //
//  AUTHCOUNT --> MAKEDIV --> MOUSECLICK                                //
// ---------------------------------------------------------------------//

function regexPrint(file, input, db) { 
    var sav_index = 0
    var count = 0
    var query = new RegExp(".*"+input+".*", "gim");
	values = file.responseText.match(query);
    savitri_list = []
    for (var x = 0; x < values.length; x++) {
        if (values[x].includes(", Savitri")) { // QUERY FOR SAVITRI?
            console.log("regexPrint: db != 33-34Savitri")
            console.log(sav_index.length+"sav_index||savitri_list"+savitri_list.length)
            document.getElementById("output").innerHTML += values[x]+" "+"[!"+sav_index+"]";
            savitri_list.push(values[x]);
            sav_index ++
        }
        else if (db == "33-34Savitri") { document.getElementById("output").innerHTML += values[x]; }
        else { document.getElementById("output").innerHTML += values[x]; }
        if (db != "todo" && values[x] != "") { 
            document.getElementById("output").appendChild(document.createElement("br"));
            document.getElementById("output").appendChild(document.createElement("br"));
        }
        if (db == "todo" && values[x] != "") { document.getElementById("output").appendChild(document.createElement("br")); }
        count++;
    } document.getElementById("output").appendChild(document.createTextNode(count));
} // QUICKPRINT
function quickPrint(file, input, db) {              
    var count = 0
    var query = new RegExp(".*"+input+".*", "gim");
	values = file.responseText.match(query);
    for (var x = 0; x < values.length; x++) {       
        document.getElementById("output").appendChild(document.createTextNode(values[x]));
        if (db != "todo" && values[x] != "") { document.getElementById("output").appendChild(document.createElement("br")); }
        if (db == "todo" || db == "fulldatabase" || db == "major" && values[x] != "") { //lblblblblb
            document.getElementById("output").appendChild(document.createElement("br"));
        } count++;
    } document.getElementById("output").appendChild(document.createTextNode(count));
} // SECTIONAL PRINT
function sectionalPrint(file, input, db) {             
    var count = 0
    var location = 0
    var query = new RegExp(".*"+input+".*", "gim");
    var setUp = new RegExp(".*"+"."+".*", "gim");
	newvalues = file.responseText.match(setUp);
    for (x = 0; x < newvalues.length; x++) {            // LOCATE IN BOOK
        if (newvalues[x].includes($.trim(input))) { console.log("fixed mind: "+newvalues[x]+" + "+x); }
        if (newvalues[x].includes($.trim(input))) {
            location = x
        }
    } s = 20;
    for (x = location-s; x < location+s; x++) {         // PRINT
        if (x == location) { document.getElementById("output").innerHTML += "<b>"+newvalues[x]+"</b>" }
        else if (newvalues[x] != "<br>") {document.getElementById("output").appendChild(document.createTextNode(newvalues[x].replace('<br>','').replace('<p>','')));}
        if (newvalues[x].match("<br>")) {document.getElementById("output").appendChild(document.createElement("br"));}
    }
}

function authCount(event, db, moreCountsThen) {         // AC
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
    } superArray = superCount(authbucket)

    for (x = 0; x < authbucket.length; x++) {
        if (superArray[1][x] > moreCountsThen) {
            //document.getElementById("output").appendChild(document.createTextNode(superArray[0][x]+" :: "+superArray[1][x]));
            //document.getElementById("output").appendChild(document.createElement("br"));
            //document.getElementById("output").appendChild(document.createTextNode());
            makeDiv(superArray[0][x]+"</b>: ("+superArray[1][x]+")", x)
            //console.log("authbucket.length "+authbucket.length+authbucket[x])
        }
    } //window.stop();
}
function makeDiv(auth, x) {
    var div = document.createElement("div"+x);
    console.log("f makeDiv: x/auth: "+x+"::"+auth)  // 19: camus
    div.innerHTML = '<div id="demo" onmouseup="mouseClick('+x+')" onmouseout="mouseOff('+x+')"><p><b>'+auth+' (+<span id="demo'+x+'"></span>)</p></div>'
    document.getElementById("output").appendChild(div);
}
function mouseOff(x) { new_removeChildren("demo"+x) }
function mouseClick(x) {
    wikit = setUp("wikiauthors")
    var node = document.getElementById('demo')
    textContent = node.childNodes[0].innerHTML
    text_length = textContent.length
    var query = new RegExp("^"+""+".*", "img");
    entry = (wikit.responseText.match(query, "img"));
    authName = textContent.slice(1, text_length-4)

    console.log("f mouseClick: node.attributes.length: "+node.attributes.length) 
    console.log("f mouseClick: node.attributes.name: "+node.attributes[1].name)
    console.log("f mouseClick: node.childNodes: "+node.childNodes)  //>>> [object NodeList]
    console.log("f mouseClick: node.childNodes[0]: "+node.childNodes[0]) //>>> [object HTMLParagraphElement]
    console.log("f mouseClick: node.childElementCount: "+node.childElementCount) //>>> 1
    console.log("f mouseClick: node.childNodes[0]: "+node.childNodes[0].innerHTML)  //>>> <b>?</b> (<span id="demo5"></span>)
    console.log("f mouseClick: entry.length/wikit.length: "+entry.length+"/"+wikit.length) //860
    console.log("f mouseClick: x: "+x)    //>>> 19 (on camus)
    console.log("f mouseClick: node: "+node)
    console.log("f mouseClick: textContent: "+textContent)  //>>> textContent: <b>?</b> (<span id="demo5"></span>)
    console.log("f mouseClick: authName ::: "+authName)  //>>> f mouseClick: authName ::: b>?</b> (<span id="demo5"></sp
    //for (x=0; x < node.attributes.length; x++) { console.log("f mouseClick: node.attributes[x]: "+node.attributes[x]) }

    for (var i = 0; i < entry.length; i++) {
        if (authName != "") {
            //console.log("f mouseClick: i/entry[i]: "+i+"/"+entry[i]) //prints out 800 things.. i=19 = crowley
            if (entry[i].includes("Aleister Crowley")) {
                //console.log("authName :"+authName)
                //console.log("match "+entry[i])
                //console.log(entry[i])
            }
        }
    } document.getElementById("demo"+x).appendChild(document.createTextNode("values"+x+": "+entry[x]));
}


function quickListAFile(file, input) { // (file, ".", db)
    var query = new RegExp(".*"+input+".*", "gim");
    values = file.responseText.match(query);
    for (var x = 0; x < values.length; x++) { filebucket.push(values[x]); }
}



function new_removeChildren(id) {
    for (x = 0; x < document.getElementById(id).childNodes.length; x++) { 
        document.getElementById(id).removeChild(document.getElementById(id).childNodes[x])
    }
    if ( document.getElementById(id).childNodes.length > 0) { new_removeChildren(id) }
}


function superCount(arr) {
    var a = [], b = [], prev;
    arr.sort();
    for ( var i = 0; i < arr.length; i++ ) {
        if ( arr[i] !== prev ) { a.push(arr[i]); b.push(1); }
        else { b[b.length-1]++; } 
    prev = arr[i];
    } return [a, b]; 
}
