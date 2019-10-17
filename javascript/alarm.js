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

function loadJson() {
    var xmlhttp = new XMLHttpRequest();
    var txt = "";
    xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var alarmJson = JSON.parse(this.responseText);
        document.getElementById("card3-content").innerHTML = alarmJson.alarmOn;
        txt += '<table class="table"><thead class="thead-dark">'
            +  '<tr class="align-middle">'
            +  '<th>State</th>'
            +  '<th>Weekday</th>'
            +  '<th>Hour</th>'
            +  '<th>Minute</th>'
            +  '<th>Second</th>'
            +  '</tr></thead>'
            +  '<tbody>'
        for (x in alarmJson.repeatingAlarms) {
            txt += '<tr><td><button type="button" class="btn btn-outline-secondary square-btn '
                    + (alarmJson.repeatingAlarms[x].state ? 'active' : '') 
                    + '" data-toggle="button" aria-pressed="'
                    + alarmJson.repeatingAlarms[x].state
                    + '" autocomplete="off"></td><td>'
                    + alarmJson.repeatingAlarms[x].weekDay + "</td><td>"
                    + alarmJson.repeatingAlarms[x].hour + "</td><td>"
                    + alarmJson.repeatingAlarms[x].minute + "</td><td>"
                    + alarmJson.repeatingAlarms[x].second + "</td></tr>";
        }  
        txt += '</tbody></table>' 
        document.getElementById("alarmTable").innerHTML = txt;
    }
    };
    xmlhttp.open("GET", "/json/alarm.json", true);
    xmlhttp.send();
}