//zZ(Object)
function FindiAmDiv() {
    var content = zZ('#iAmDiv').html();
    alert(content);
}

function FindClassiAmDiv() {
    var iAmDivArr = zZ('.iAmDiv').Elements();
    for (var i = 0; i < iAmDivArr.length; i++) {
        alert(iAmDivArr[i].innerHTML);
    }
}

function FindClassiAmDivOne() {
    alert(zZ('.iAmDiv').html());
}

function FindmyDiv() {
    var content = zZ(':divId=myDiv').html()
    alert(content);
}

function FindallmyDiv() {
    var myDiv = zZ(':divId=myDiv').Elements();
    for (var i = 0; i < myDiv.length; i++) {
        alert(myDiv[i].innerHTML);
    }

    
}