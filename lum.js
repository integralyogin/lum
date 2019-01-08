<script>


function mouseOn(x) {
    // check wikiauthors for author name
    wikit = setUp("wikiauthors")
    //input = "Sri Aurobindo"
    var node = document.getElementById('demo')
    var node2 = document.getElementById('output')
    //node2 = node.getChild(getElementById('demo'+x))
    console.log("node: "+node)
    console.log("node2: "+node2)
    textContent1 = node.childNodes[0].innerHTML
    textContent2 = node2.childNodes[0].innerHTML
    //var resBox=document.getElementById('demo'+x);
    //var strTrans=resBox.getElementsByTagName('span').textContent
    //console.log("strTrans: "+strTrans)
    //
    console.log("textContent1: "+textContent1)
    console.log("textContent2: "+textContent2)
    text_length = textContent1.length
    authName = textContent1.slice(1, text_length-4)
    console.log("authName ::: "+authName)
    authName = ""

    //console.log("documents.getelement "+document.getElementById('output').getChild(document.getElementById('demo')))
    //ele = document.getElementById('output')
    //ele = ele.getElementById('demo').textContent
    //ele = document.getElementById('demo'+x).textContent
   // console.log("ele: "+ele)
    


    //document.getElementById("demo2").appendChild(document.createTextNode(authName));
    var query = new RegExp("^"+authName+".*", "img");
    entry = (wikit.responseText.match(query));
    //savitri_list.push(values[x]);


    for (var i = 0; i < entry.length; i++) {
        if (authName != "") {
            if (entry[i].includes(authName)) {
                console.log("authName :"+authName)
                console.log("match "+entry[i])
                x = i
            }
        }
    }

    document.getElementById("demo"+x).appendChild(document.createTextNode("values"+x+": "+entry[x]));
    //console.log("mouseOn: entry[x]: "+entry[x])
    //console.log(entry)
    
}

function mouseOff(x) { 
    new_removeChildren("demo"+x) 
    //var x = document.getElementById("demo");    
    //x.style.color = "black";
    //var z = document.getElementById("demo2");  
    //document.getElementById("demo2").appendChild(document.createTextNode("+"));
}

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
        }
        return newfilename
    }

// https://gitlab.com/integralyogin/fulldatabase/blob/master/fulldatabase
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
            //stem = savitri_list[remains].split("\~")
            //console.log("STEM: "+stem)
            //document.getElementById("output").innerHTML += savitri_list[indexNum]
            console.log("getInput: savitri_list[indexNum]: "+savitri_list[indexNum])
            //console.log("savitri_list[indexNum]).indexOf(\"<br>\"): "+savitri_list[indexNum].indexOf("<br>"));
            brIndex = savitri_list[indexNum].indexOf("<br>")
            stem = savitri_list[indexNum].slice(1,brIndex)
            console.log("getInput: STEM: "+stem)
            file = setUp("33-34Savitri")
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

function newParser(userInput, event) {  // listlist
    list_of_dbs = ["keys", "arex", "argex", "good", "QQ", "gloss", "san", "iye", "aqal", "occ","auth", "cats", "syn", "jbkeys", "todo", "most", "33-34Savitri", "super", "fulldatabase", "cleaned", "major", "wikiauthors"]
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

function libraryProcessor() {

}

function prePrint(event, db, userInput, oldInputForm) {
    req = setUp(db)
    consoleInfo("userInput: "+userInput)
    consoleInfo("typeof(oldInputForm): "+typeof(oldInputForm))
    //consoleInfo(db)

    if (userInput.length < 3 && db == "keys") {
        // for long searches where input.length < 2
        console.log("prePrint: IF"+userInput)
        quickPrint(req, userInput, db)
    }

    //acacac
    //else if ( userInput.match("^ac ") { authCount(event, db, 7) }
    else if ( userInput == "ac arex" ) { authCount(event, "arex", 15) }
    else if ( userInput == "ac keys" ) { authCount(event, "keys", 3) }
    else if ( userInput == "ac good" ) { authCount(event, "good", 7) }
    else if ( userInput == "ac argex" ) { authCount(event, "argex", 7) }
    else if ( userInput == "ac super" ) { authCount(event, "super", 15) }
    else if ( userInput == "ac cleaned" ) { authCount(event, "cleaned", 3) }
    else if ( userInput == "ac major" ) { authCount(event, "major", 5) }
    else if ( userInput == "ac fulldatabase" ) { authCount(event, "fulldatabase", 15) }

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

    // ADDDDDDDDDD TO DATABASE!!!!
    // dbdbdbdbdb
    else if (db == "good" || db == "argex" || db == "super" || db == "fulldatabase" || db == "cleaned" || db == "major" ) {
        quickPrint(req, userInput, db)
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
        if (x == location) { 
            document.getElementById("output").innerHTML += "<b>"+newvalues[x]+"</b>"
                //document.getElementById("output").innerHTML += values[x]
        }

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
    }

    return [a, b];
}


function test_out(auth, x) {
    var div = document.createElement("div"+x);

    //div.style.width = "100px";
    //div.style.height = "100px";
    //div.style.background = "red";
    //div.style.color = "white";
    div.innerHTML = '<div id="demo" onmouseover="mouseOn('+x+')" onmouseout="mouseOff('+x+')"><p><b>'+auth+'</b> (<span id="demo'+x+'"></span>)</p></div>'

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
    bySize = []

    for (x = 0; x < authbucket.length; x++) {
        if (superArray[1][x] > moreCountsThen) {
            //bySize.push(superArray[1][x]+" :: "+superArray[0][x])

            //document.getElementById("output").appendChild(document.createTextNode(superArray[0][x]+" :: "+superArray[1][x]));
            //document.getElementById("output").appendChild(document.createElement("br"));
            //document.getElementById("output").appendChild(document.createTextNode());
            test_out(superArray[0][x], x)
            //console.log("authbucket.length "+authbucket.length+authbucket[x])

        }
    }
    //window.stop();
}
//document.getElementById("output").appendChild(document.createTextNode(values[x]));

//<div id="demo" onmouseover="MouseOn()" onmouseout="MouseOff()"><p><b>Sri Aurobindo</b> (<span id="demo2"></span>)</p></div>


// EVENT LISTENER
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

    wikit_list = []
    filebucket = []
    authbucket = []
    //document.getElementById("myinput").addEventListener("keyup", authCount); 

    savitri_list = []
    db = ""
    addEventListener("keyup", getInput);



//document.getElementById("myinput").addEventListener("keyup", getInput); 
