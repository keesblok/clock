var canvas = document.getElementById("analog-clock");
var clock = canvas.getContext("2d");
var radius = canvas.height / 2;

var innerColor = [];

radius = radius * 0.90
setInterval(drawAlarm, 1000);

//setInterval(loadJson, 10000);

function drawAlarm() {
    setAlarm();
    drawInnerRing(clock, radius);
}

function setAlarm() {
    for(var i = 0; i < 12; i++) {
        innerColor[i] = "white"
    }
}

function drawInnerRing(clock, radius) {
    var ang;
    var num;
    for(num = 0; num < 12; num++){
        ang = num * Math.PI / 6;
        clock.rotate(ang);
        clock.translate(0, -radius*0.45);
        clock.rotate(-ang);
        clock.beginPath();
        clock.arc(0, 0, radius*0.06, 0, 2*Math.PI)
        clock.stroke();
        clock.rotate(ang);
        clock.translate(0, radius*0.45);
        clock.rotate(-ang);
    }
}

function getDataFromJSON() {
    var repeatingAlarms;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alarms = JSON.parse(this.responseText);
            alarmOn = alarms["alarmOn"];
            repeatingAlarms = alarms["repeatingAlarms"];

            document.getElementById("alarmSwitch").checked = alarmOn;

            var col = [];
            for (var i = 0; i < repeatingAlarms.length; i++) {
                for (var key in repeatingAlarms[i]) {
                    if (col.indexOf(key) === -1) {
                        col.push(key);
                    }
                }
            }

            var table = document.createElement("table");
            table.id = "alarmTable"
            table.classList.add("table");
            var thead = table.createTHead();
            thead.classList.add("thead-dark");
            var tr = thead.insertRow(-1);
            tr.classList.add("align-middle");

            for (var i = 0; i < col.length; i++) {
                var th = document.createElement("th");
                th.innerHTML = col[i];
                tr.appendChild(th);
                thead.appendChild(tr);
            }

            for (var i = 0; i < repeatingAlarms.length; i++) {
                tr = table.insertRow(-1);
                for (var j = 0; j < col.length; j++) {
                    var tabCell = tr.insertCell(-1);
                    //tabCell.innerHTML = repeatingAlarms[i][col[j]];
                    var inputElement = document.createElement("INPUT");
                    inputElement.setAttribute("type", "text");
                    inputElement.required = true;
                    inputElement.setAttribute("value", repeatingAlarms[i][col[j]]);
                    tabCell.appendChild(inputElement);
                }
            }

            var divContainer = document.getElementById("alarmTablePlaceholder");
            divContainer.innerHTML = "";
            divContainer.appendChild(table);

            var button = document.getElementById("GetSetAlarm");
            button.setAttribute("onClick", "javascript: sendAlarmData();");
            button.textContent = "Update alarm data";
        }
    }
    xmlhttp.open("GET", "/json/alarm.json", true);
    xmlhttp.send();
};

function createJSON() {
    var error = "";

    var table = document.getElementById("alarmTable");
    var tableContent = [];
    for (var i = 0; i < table.rows.length-1; i++) {
        tableContent[i] = {};
        for (var j = 0; j < table.rows[i].cells.length; j++) {
            var columnName = table.rows[0].cells[j].innerHTML;
            //tableContent[i][columnName] = table.rows[i+1].cells[j].innerHTML;
            tableContent[i][columnName] = table.rows[i+1].cells[j].firstElementChild.value;
            if (tableContent[i][columnName] == "") {
                if (error != "") {
                    error += "<br>"
                }
                error += "Empty fields are not allowed!"
            }
        }
    }

    var obj = {
        "alarmOn": document.getElementById("alarmSwitch").checked,
        "repeatingAlarms": tableContent
    };

    var jsonString = JSON.stringify(obj, null, 2);
    console.log(jsonString);
    card3 = document.getElementById("card3-content");
    card3.innerHTML = jsonString.replace(/\n/g, "<br>");

    return {
        json: JSON.stringify(obj),
        error: error
    };
    //return JSON.stringify(obj, null, 2); // Print pretty
}

function sendAlarmData() {
    errorField = document.getElementById("errorPlaceholder");
    errorField.innerHTML = "";

    values = createJSON();
    
    if (values.error == "") {
        var xmlhttp = new XMLHttpRequest();

        xmlhttp.open("POST", "/setAlarms");
        xmlhttp.setRequestHeader("Content-type", "application/json");
        xmlhttp.send(values.json);
    } else {
        errorField.innerHTML = values.error;
    }
}