    list_of_dbs = []
		filebucket = []         //file gets loaded into this array
    authbucket = []
    savitri_list = []
		booklist = []
    db = ""
		matchingbooks = []

		getBookList()

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
    if (event.keyCode == 13) { 																			// ENTER KEYPRESS
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
		if (userInput == "lib") { window.location.replace("http://157.230.133.200/the_library.php"); }
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
		console.log("event: "+event)
		console.log(document)
    if (userInput[0] == "!" && savitri_list.length > 0) { // SAVITRI SECTIONAL PRINT
        new_removeChildren("output")
        indexNum = userInput.slice(1)
        target = savitri_list[indexNum] // = savitri passage
        brIndex = savitri_list[indexNum].indexOf("<br>")
        stem = savitri_list[indexNum].slice(1,brIndex)
        file = setUp("33-34Savitri")
        sectionalPrint(file, stem, "33-34Savitri")
    }
    else if (userInput.length < 2 && db == "keys") { quickPrint(req, userInput, db) } //still too slow, maybe partial releasing?
    /// acacacac 
    else if ( userInput.toLowerCase() == "ac keys" ) { authCount(event, "keys", 0) }
    else if ( userInput.toLowerCase() == "ac major" ) { authCount(event, "major", 5) }
    else if ( userInput.toLowerCase() == "ac fulldatabase" ) { authCount(event, "fulldatabase", 2) }
    // links
    else if ( userInput == "lib") { window.location.replace("file:///home/oem/Documents/Code/KEYS/the_lib.html"); }
    /// dbdbdbdbdb
    else if ( db == "fulldatabase" || db == "major") { quickPrint( req, oldInputForm, db ) } // QUICKPRINT FOR BIG DATABASES
    else { 
				regexPrint( req, oldInputForm, db );
		}

}

function clickRegexPrint(db, clickInput) {
	req = setUp(db)
	regexPrint(req, clickInput, db)
}

function clickToLibrary(clickInput) {

	// > python libsearcher.py clickInput

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
		console.log("check address: filename: "+filename)
    if (address == "/home/oem/Documents/Code/KEYS/lum.html") { console.log("LOCAL"); return filename; } 
		else if (filename == "booklist") { newfilename = "textfiles/booklist"; return newfilename; }
		else if (filename.includes(".txt")) { newfilename = "textfiles/"+filename.slice(1); return newfilename; }
		else { console.log("check address: else, use local"); newfilename = "dbs/"+filename; console.log("newfilename: "+newfilename); return newfilename; }
		//else { 
     //   console.log("ONLINE");    
      //  newfilename = "https://raw.githubusercontent.com/integralyogin/data-for-lum/master/"+filename
        //if (filename.includes('fulldatabase')) { newfilename = "dbs/fulldatabase" } 
		//		return newfilename
   // }
}

// ---------------------------------------------------------------------//
//  PREPRINT --> (REGEXPRINT, QUICKPRINT, SECTIONALPRINT, AUTHCOUNT)    //
//  AUTHCOUNT --> MAKEDIV --> MOUSECLICK                                //
// ---------------------------------------------------------------------//

function regexPrint(file, input, db) { 
    var sav_index = 0
    var count = 0
		//console.log("input: "+input)
    var query = new RegExp(".*"+input+".*", "gim");
		values = file.responseText.match(query); // values = search results?
    savitri_list = []
		//console.log("values, typeof values, length: "+values+":"+(typeof values))
		if (values == null ) { zeroHandler(input, db); }
    for (var x = 0; x < values.length; x++) {
				var rvalue = values[x].replace(/\s/g, '&nbsp;');
				var rvalue = strip(rvalue)
				var div = document.createElement("div"+x);
				div.innerHTML += '<div id="demo"><p>'+values[x]+'<a href=javascript:bookFinder("'+rvalue+'",'+x+')>...</a><span id="demo'+x+'"></span></p></div><br><br>' //bookfinder
				document.getElementById("output").appendChild(div);
						
	//					document.getElementById("output").innerHTML += "<a href=javascript:bookFinder("+values[x]+")...</a><br><br>"

			 	// CONTENT ADD

        if (db != "todo" && values[x] != "") { 
            document.getElementById("output").appendChild(document.createElement("br"));
            document.getElementById("output").appendChild(document.createElement("br"));
        }
        if (db == "todo" && values[x] != "") { document.getElementById("output").appendChild(document.createElement("br")); }
        count++;
    }
		document.getElementById("output").appendChild(document.createTextNode(count)); 
		document.getElementById("output").innerHTML += "<br><a href=javascript:new_removeChildren('output')>Clear Output</a><br>"
		var input = input.replace(/\s/g, '&nbsp;');
		document.getElementById("output").innerHTML += "<a href=javascript:clickRegexPrint('major','"+input+"')>Extend Search into Major DB (can take a while)*</a><br><br>"


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
 	// find book file address.

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

function quickListAFile(file, input) { // (file, ".", db)
    var query = new RegExp(".*"+input+".*", "gim");
    values = file.responseText.match(query);
    for (var x = 0; x < values.length; x++) { filebucket.push(values[x]); }
}

function authCount(event, db, moreCountsThen) {         // AC
    console.log(document)
    file = setUp(db) //keys, major, full
    quickListAFile(file, ".") // fill file bucket
    r = 0

    for (x = r; x < filebucket.length; x++) { // go through file bucket
				//get indexes
        i = filebucket[x].indexOf("~")
        comma = filebucket[x].indexOf(",")
        relative_comma = filebucket[x].slice(i, filebucket[x].length).indexOf(",")
        tag = filebucket[x].indexOf("#")

        if ( comma == "-1" ) { comma = filebucket[x].length } //if doesnt exist, you come in last place
        if ( relative_comma == "-1" ) { relative_comma = filebucket[x].length }
        if ( tag == "-1" ) { tag = filebucket[x].length }

        auth_cut = filebucket[x].slice(i+2, Math.min(filebucket[x].length, relative_comma+i, tag))
        auth_cut = auth_cut.trim()
        authbucket.push(auth_cut); // fill auth bucket

				// show head of both buckets:
        if (x < 3) { console.log("(n authCount) x:authbucket[x]:filebucket[x] >>> "+x+":"+authbucket[x]+":"+filebucket[x]); }    //>>> 2:Socrates:"Be as you wish to seem. ~ Socrates"

    } superArray = superCount(authbucket)

    if (typeof counterA === 'undefined') { counterA = 0 }
    for (x = 0; x < authbucket.length; x++) {  									// go through superarray (auth)
        if (superArray[1][x] > moreCountsThen) {  															//if its enough:
            makeDiv(superArray[0][x]+"</b>: ("+superArray[1][x]+" results in "+db+")", x)  // add it to the div
								console.log("superarray: 0x, 1x: "+superArray[0][x]+":"+superArray[1][x])
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
function mouseClick(x) { // x = authbucketLineNumber + demoID?
    wikit = setUp("wikiauthors")
    var node = document.getElementById('demo')
    textContent = node.childNodes[0].innerHTML
    text_length = textContent.length
    var query = new RegExp("^"+""+".*", "img");
    wikifile = (wikit.responseText.match(query, "img"));
    authName = textContent.slice(1, text_length-4)
    auth = ""
    for (var i = 0; i < document.all.namedItem("demo").length; i++) {  //860 entries
        if (authName != "") {
            if (document.all.namedItem("demo")[i].innerHTML.includes('"demo'+x+'"')) {
                auth = String(document.all.namedItem("demo")[i].innerText.split(":")[0])
            } 
        }
    }  
    for (i = 0; i < wikifile.length; i++) { if (wikifile[i].indexOf(auth) == 0) { r = i }}  // GETS ENTRIES THAT START WITH AUTH NAME (can be removed)
    if (r == "") {
        indexOfName = []
        ENTRIES = []
        for (i = 0; i < wikifile.length; i++) {
            if (wikifile[i].includes(auth)) {             
                ENTRIES.push(i)
                indexOfName.push(wikifile[i].indexOf(auth))
            }
        }
        idx=indexOfName.indexOf(Math.min.apply(null,indexOfName))
        r = ENTRIES[idx]
    } //soMuchInfo()
//   document.getElementById("demo"+x).appendChild(document.createTextNode(entry[r]));
   document.getElementById("demo"+x).innerHTML += "<p>"+wikifile[r]
	console.log("wikifile[r]: "+wikifile[r])
   r = ""
   ENTRIES = []
   indexOfName = []
}



function soMuchInfo(x) { console.log(document.all) }


function new_removeChildren(id) {
    for (x = 0; x < document.getElementById(id).childNodes.length; x++) { 
        document.getElementById(id).removeChild(document.getElementById(id).childNodes[x])
    }
    if ( document.getElementById(id).childNodes.length > 0) { new_removeChildren(id) }
		document.getElementById("myinput").focus(); //scroll(0,0); (scroll here broke ac keys scrolling)
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

function zeroHandler(input, db) {
	for (var i = 0; i < list_of_dbs.length; i++ ) {
		console.log("input, db: "+input+":"+db)
		console.log("typeof input/db: "+(typeof input)+":"+(typeof db))
		if (input == list_of_dbs[i]) {
				var input = input.replace(/\s/g, '&nbsp;');
			document.getElementById("output").innerHTML += "Input '"+input +"' is a database named '"+list_of_dbs[i]+"'<br>"
			document.getElementById("output").innerHTML += "If you wished to search for '"+input+"' you can try 'keys "+input+"'<br><br>"
			document.getElementById("output").innerHTML += "<a href=javascript:clickRegexPrint('major','"+input+"')>Search for '"+input+"' in 'major'</a><br><br>"
					
		} 
	} 
	var input = input.replace(/\s/g, '&nbsp;');
	document.getElementById("output").innerHTML += "Sorry there were no results for '"+input+"' in database '"+db+"'.<br>"
	document.getElementById("output").innerHTML += "<a href=javascript:clickRegexPrint('major','"+input+"')>Search for '"+input+"' in 'major'</a><br><br>"
}

function getBookList() {
	req = setUp("booklist")
  var query = new RegExp(".*/.*", "gim");
	values = req.responseText.match(query); // values = search results?
	//console.log("getBookList: values.length: "+values.length)
	booklist.push(values)
	//console.log("getBookList: booklist[0].length: "+booklist[0].length)
}

function bookFinder(line, xloc) {
//		console.log("bookfinder: line: "+line)
//	console.log("left side::: "+line.split("~")[0])
	matchingbooks = []
	if (line.includes("~")) { 
			leftside = line.split("~")[0];
			rightside = line.split("~")[1];	
//		console.log("rightside: "+rightside) 
			if (rightside.includes(",")) { 
				var count = (rightside.match(/,/g) || []).length;
		//	console.log(", count: "+count)
				for (var x = 0; x <= count; x++) {
					if (x == 0) { auth = rightside.split(",")[0];	}
					if (x == 1) { book = rightside.split(",")[1]; book = book.slice(1, book.length); console.log("book"); }
					if (x == 1) { console.log("auth/book: "+auth+":"+book); }
				}
				if (book.includes("#")) { book = book.slice(0, book.indexOf("#")); book = book.trim() }
				if (book.includes("-")) { book = book.slice(0, book.indexOf("-")); book = book.trim() }
				if (book.includes(":")) { book = book.slice(0, book.indexOf(":")); book = book.trim() }
				console.log("book: '"+book+"'")
				if (typeof auth !== 'undefined' && typeof book !== 'undefined') {
					for (var x = 0; x < booklist[0].length; x++) {
						var spaceless = book.replace(/\s/g, '');
						var underscoredtitle = book.replace(/\s/g, '_');
						var hyphened = book.replace(/\s/g, '-');
						authfront = auth.trim();
						authfront = authfront.replace(/\s/g, '_');
						authfront = authfront.split("_")[1];
						console.log('authfront: "'+authfront+'"')
						if (booklist[0][x].includes(spaceless) || booklist[0][x].includes(underscoredtitle) || booklist[0][x].includes(hyphened)) {
								if (booklist[0][x].includes(authfront.toUpperCase())) {
								 if (booklist[0][x].indexOf("DUPLICATES") == -1) {
										console.log("found book!: "+booklist[0][x])
										matchingbooks.push(booklist[0][x])
								 }
								}
					 	}
					} 
					if (matchingbooks.length > 0) { 
							console.log("matchingbooks.length: "+matchingbooks.length); 
	//							matchingbooks.sort()[0]
								inBook(matchingbooks.sort()[0], leftside, xloc); 
					} 
				}
			}
	//parse right side for auth, and book.
	// verify auth from auth list
	// verify book from book list
	}

}

function inBook(booklocation, leftside, xloc) {
	found = 0;
	for (var y = 0; y <= matchingbooks.length; y++) {
		req = setUp(matchingbooks[y])
		var query = new RegExp(".*", "gim");
		values = req.responseText.match(query); // values = search results?
		cleanleft = leftside.replace(/\s/g, ' ');
		if (cleanleft.split(" ").length > 4) { cleanleft = cleanleft.slice(cleanleft.indexOf(cleanleft.split(" ")[1]), cleanleft.indexOf(cleanleft.split(" ")[1])+32); console.log("small space splitted") }
		if (cleanleft.split(" ").length > 8) { cleanleft = cleanleft.slice(cleanleft.indexOf(cleanleft.split(" ")[3]), cleanleft.indexOf(cleanleft.split(" ")[3])+32); console.log("space splitted") } 
		if (found == 0) {
			for (s = 0; s < cleanleft.length-1; s++) {
				if (s == 0) { console.log("s == 0"); cleanslice = cleanleft.slice(s, cleanleft.length-s) }
				if (s == 1) { console.log("s == 1"); cleanslice = cleanleft.slice(1, 20) } 
				if (s > 1 && s < 6) { console.log("s > 1"); cleanslice = cleanleft.slice(s, cleanleft.length-s) }
				console.log("cleanslice--s: "+cleanslice+"--"+s)
					for (var x = 0; x <= values.length; x++) {
						if (typeof cleanslice === "undefined") { console.log("break, its undefined") }
						//console.log("typeof cleanslice: "+typeof cleanslice+":"+cleanslice+":"+x)
						if (x == values.length) { console.log("EOF pre break") } 
						if (typeof values[x] !== "undefined") { 
							if (values[x].includes(cleanslice)) {
								for (var z = -16; z < 16; z++) {
									if (values[x+z] != "") {
										if (z != 0) { document.getElementById("demo"+xloc).innerHTML += "<p>"+values[x+z] }
										if (z == 0) { document.getElementById("demo"+xloc).innerHTML += "<p><b>"+values[x+z]+"</b>" }
										}
									}
								found = 1;
								break;
						}
					}
			}
			if (found == 1) { break; }
		}
		}
	}
}

function strip(html) {
	var tmp = document.createElement("DIV");
	tmp.innerHTML = html;
	return tmp.textContent || tmp.innerText || "";
}



document.getElementById("endofhtml").innerHTML = "lastModified: "+document.lastModified
