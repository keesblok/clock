var canvas = document.getElementById("analog-clock");
var clock = canvas.getContext("2d");
var radius = canvas.height / 2;

var outerColor = [];

clock.translate(radius, radius);
radius = radius * 0.90
setInterval(drawClock, 1000);

function drawClock() {
  drawFace(clock, radius);
  setTime();
  drawOuterRing(clock, radius);
//  drawInnerRing(clock, radius);
}

function drawFace(clock, radius) {
  var grad;
  clock.beginPath();
  clock.arc(0, 0, radius, 0, 2*Math.PI);
//  clock.fillStyle = 'white';
//  clock.fill();
  clock.lineWidth = 5;
  clock.stroke();
}

function setTime(){
  var now = new Date();
  var hour = now.getHours()-now.getTimezoneOffset()/60;
  var minute = now.getMinutes();
  var second = now.getSeconds();
  for (var i = 0; i < 24; i++) {
    outerColor[i] = "white"
  }
  //hour
  hour = hour%12;
  outerColor[hour] = "red";
  //minute
  minute = Math.round(minute / 2.5);
  if(minute == 24) minute = 0;
  outerColor[minute] = "green"
  // second
  second = Math.round(second / 2.5);
  if(second == 24) second = 0;
  outerColor[second] = "blue"
}

function drawOuterRing(clock, radius) {
  var ang;
  var num;
  for(num = 0; num < 24; num++){
    ang = num * Math.PI / 12;
    clock.rotate(ang);
    clock.translate(0, -radius*0.9);
    clock.rotate(-ang);
    clock.beginPath();
    clock.arc(0, 0, radius*0.06, 0, 2*Math.PI)
    clock.fillStyle = outerColor[num];
    clock.fill();
    clock.stroke();
    clock.rotate(ang);
    clock.translate(0, radius*0.9);
    clock.rotate(-ang);
  }
}