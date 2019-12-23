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

function CreateTableFromJSON() {
    var repeatingAlarms;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alarms = JSON.parse(this.responseText);
            repeatingAlarms = alarms["repeatingAlarms"];

            var col = [];
            for (var i = 0; i < repeatingAlarms.length; i++) {
                for (var key in repeatingAlarms[i]) {
                    if (col.indexOf(key) === -1) {
                        col.push(key);
                    }
                }
            }

            var table = document.createElement("table");
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
                    tabCell.innerHTML = repeatingAlarms[i][col[j]];
                }
            }

            var divContainer = document.getElementById("alarmTable");
            divContainer.innerHTML = "";
            divContainer.appendChild(table);
        }
    }
    xmlhttp.open("GET", "/json/alarm.json", true);
    xmlhttp.send();
};