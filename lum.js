    filebucket = []         //file gets loaded into this array
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
        //InputLog()
        //getIp()
        db = ""
        new_removeChildren("output")
        arguments = newParser(userInput, event)
        scroll(0,0)
        document.getElementById("myinput").blur()
    }
    if (event.keyCode == 9) { document.getElementById("myinput").focus(); scroll(0,0); }    // TAB KEYPRESS
    if (event.keyCode == 20) { new_removeChildren("output") }                               // LEFT SHIFT KEYPRESS (16) && CAPS (20)
		if (event.keyCode == 27) { document.getElementById("myinput").blur() }									// ESC
    if (event.keyCode == 36) { console.log("home") }                                        // or 33 (home keypress, pgup)
 //document.getElementById("myinput").scrollIntoView();
}


function newParser(userInput, event) {          // listlistlistlistdbdbdb
    list_of_dbs = ["keys", "major", "fulldatabase", "33-34Savitri", "gloss", "auth", "wikiauthors", "san", "iye", "aqal", "occ", "cats", "syn", "jbkeys", "todo", "most", "inv"]
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
    oldInputForm = String(oldInputForm).replace(/,/g, " ")
    prePrint(event, db, userInput, oldInputForm)
    return userInput
}


function prePrint(event, db, userInput, oldInputForm) {
    req = setUp(db)
    userInput = document.getElementById("myinput").value;
    console.log("userInput/oldInputForm: "+userInput+":"+oldInputForm)
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
    else if ( userInput.toLowerCase() == "ac fulldatabase" ) { authCount(event, "fulldatabase", 2) }
    // links
    else if ( userInput == "lib") { window.location.replace("file:///home/oem/Documents/Code/KEYS/the_lib.html"); }
    /// dbdbdbdbdb
    else if ( db == "fulldatabase" || db == "major" || db == "wikiauthors") { quickPrint( req, oldInputForm, db ) } // QUICKPRINT FOR BIG DATABASES
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
        //if (filename.includes('fulldatabase')) { newfilename = "dbs/fulldatabase" } 
				return newfilename
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
            //console.log("regexPrint: db != 33-34Savitri")
            //console.log(sav_index.length+"sav_index||savitri_list"+savitri_list.length)
            document.getElementById("output").innerHTML += values[x]+" "+"[!"+sav_index+"]";
            savitri_list.push(values[x]);
            sav_index ++
        } else if (db == "33-34Savitri") { document.getElementById("output").innerHTML += values[x];
        } else { document.getElementById("output").innerHTML += values[x]; }
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
        if (db == "todo" || db == "fulldatabase" || db == "major" || db == "wikiauthors" && values[x] != "") { //lblblblblb
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
    console.log(document)
    file = setUp(db)
    quickListAFile(file, ".")
    r = 0

    for (x = r; x < filebucket.length; x++) {           // FILL FILEBUCKET
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
        if (x < 3) { console.log("(n authCount) x:authbucket[x]:filebucket[x] >>> "+x+":"+authbucket[x]+":"+filebucket[x]); }    //>>> 2:Socrates:"Be as you wish to seem. ~ Socrates"
    } superArray = superCount(authbucket)
    if (typeof counterA === 'undefined') { counterA = 0 }
    for (x = 0; x < authbucket.length; x++) {           // MAKE DIV OF SUPERARRAY
        if (superArray[1][x] > moreCountsThen) { 
            makeDiv(superArray[0][x]+"</b>: ("+superArray[1][x]+" results in "+db+")", x) 
            counterA += 1
        } 
    } document.getElementById("output").appendChild(document.createTextNode(counterA+" authors listed with at least x results"));  //window.stop();
} 
function makeDiv(auth, x) {
    var div = document.createElement("div"+x);
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
    auth = ""
    for (var i = 0; i < document.all.namedItem("demo").length; i++) {  //860 entries
        if (authName != "") {
            if (document.all.namedItem("demo")[i].innerHTML.includes('"demo'+x+'"')) {
                auth = String(document.all.namedItem("demo")[i].innerText.split(":")[0])
            } 
        }
    }  
    for (i = 0; i < entry.length; i++) { if (entry[i].indexOf(auth) == 0) { r = i }}  // GETS ENTRIES THAT START WITH AUTH NAME (can be removed)
    if (r == "") {
        indexOfName = []
        ENTRIES = []
        for (i = 0; i < entry.length; i++) {
            if (entry[i].includes(auth)) {             
                ENTRIES.push(i)
                indexOfName.push(entry[i].indexOf(auth))
            }
        }
        idx=indexOfName.indexOf(Math.min.apply(null,indexOfName))
        r = ENTRIES[idx]
    } //soMuchInfo()
//   document.getElementById("demo"+x).appendChild(document.createTextNode(entry[r]));
   document.getElementById("demo"+x).innerHTML += "<p>"+entry[r]
   r = ""
   ENTRIES = []
   indexOfName = []
}


function quickListAFile(file, input) { // (file, ".", db)
    var query = new RegExp(".*"+input+".*", "gim");
    values = file.responseText.match(query);
    for (var x = 0; x < values.length; x++) { filebucket.push(values[x]); }
}


function soMuchInfo(x) { console.log(document.all) }


function new_removeChildren(id) {
    for (x = 0; x < document.getElementById(id).childNodes.length; x++) { 
        document.getElementById(id).removeChild(document.getElementById(id).childNodes[x])
    }
    if ( document.getElementById(id).childNodes.length > 0) { new_removeChildren(id) }
}


function InputLog() {

var mongo = require("./mongo_find_name_address.js");
mongo.a();

}


function getIp() {
$.getJSON('http://gd.geobytes.com/GetCityDetails', function(data) {
    //data is the JSON string
});
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


document.getElementById("endofhtml").innerHTML = "lastModified: "+document.lastModified
