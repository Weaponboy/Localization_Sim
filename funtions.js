const container = document.getElementById('drop_zone');
const draggable = document.getElementById('robotPos');
const calculatedPosition = document.getElementById('calculatedPosition');
var slider = document.getElementById("mySlider");

const sensor1 = document.getElementById('sensor1');
const sensor2 = document.getElementById('sensor2');
const sensor3 = document.getElementById('sensor3');

const Xpos = document.getElementById('X');
const Ypos = document.getElementById('Y');

const GlobalError = document.getElementById('GlobalError');

const slidervalue = document.getElementById('sliderValue');

let isDragging = false;
let offsetX, offsetY;

const podTicks = 2000;
const wheelRadius = 2.4;
const trackWidth = 16;
const backPodOffset = 8;

let loopthroughs = 0;
let lastHeading = 0;

const ticksPerCM = podTicks / ((2.0 * Math.PI) * wheelRadius);
const cm_per_tick = ((2.0 * Math.PI) * wheelRadius) / podTicks;
const ticksPerDegreeVer = (((trackWidth)*3.14)/360)*ticksPerCM
const ticksPerDegreeHor = (((backPodOffset*2)*3.14)/360)*ticksPerCM;
let cmPerDegreeHor = ((backPodOffset*2)*3.14)/360
let degreesPerCM = 360/(trackWidth*3.14)

let testTotal = 0;

const minVW = 5; 
const maxVW = 40; 
const minVH = 5; 
const maxVH = 40;   

let firstRun = false;

let BackPod = 0, deltaBack = 0, lastBackPod = 0;
let LeftPod = 0, deltaLeft = 0, lastLeftPod = 0;
let RightPod = 0, deltaRight = 0, lastRightPod = 0;
let Heading = 0, deltaHeading = 0, lastTrackerHeading = 0;

let Xglobal = ((35)*9)*ticksPerCM, XdeltaGlobal = 0, lastXGlobal = 22.5;
let Yglobal = ((35)*9)*ticksPerCM, YdeltaGlobal = 0, lastYGlobal = 22.5;

let XCalced = 22.5, XCalcedGlobal = 0, lastXCalced = Xglobal;
let YCalced = 22.5, YCalcedGlobal = 0, lastYCalced = Yglobal;
let HCalced = 0, HCalcedGlobal = 0, lastHCalced = Xglobal;

var xpoints = [];
var ypoints = [];

var createdPoints = [];
var createdPointsStatic = [];

let millPerCm = 1000/192;

let vw = 0;
let vh = 0;

draggable.addEventListener('mousedown', (event) => {
  isDragging = true;

  offsetX = event.clientX - draggable.getBoundingClientRect().left;
  offsetY = event.clientY - draggable.getBoundingClientRect().top;

  draggable.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (event) => {
  if (isDragging) {
    let newX = event.clientX - offsetX;
    let newY = event.clientY - offsetY;

    vw = (newX / window.innerWidth) * 100;
    vh = (newY / window.innerWidth) * 100;

    if (vw < minVW) vw = minVW;
    if (vw > maxVW) vw = maxVW;
    if (vh < minVH) vh = minVH;
    if (vh > maxVH) vh = maxVH;

    updatePosition();
    
  }
});

function setRobotPos(X, Y){

  let newX = (((360 - (X-22.5)))/9);
  let newY = ((Y+22.5)/9);

  vw = newY;
  vh = newX;

  if (vw < minVW) vw = minVW;
  if (vw > maxVW) vw = maxVW;
  if (vh < minVH) vh = minVH;
  if (vh > maxVH) vh = maxVH;

  updatePosition();

}

function setHeading(Heading){
  updateHeading(Heading);
}

document.addEventListener('mouseup', () => {
  isDragging = false;
  draggable.style.cursor = 'grab';
});

function updatePosition(){

  XdeltaGlobal = ((((40 - vh))*9)) - lastXGlobal;

  YdeltaGlobal = ((((vw)-5)*9)) - lastYGlobal;

  Xglobal = (lastXGlobal + XdeltaGlobal)+22.5;
  Yglobal = (lastYGlobal + YdeltaGlobal)+22.5;

  Xpos.innerHTML = Xglobal.toFixed(1);
  Ypos.innerHTML = Yglobal.toFixed(1);

  let xdeltaticks = (Xglobal - lastXGlobal)*ticksPerCM;
  let ydeltaticks = (Yglobal - lastYGlobal)*ticksPerCM;

  lastXGlobal = Xglobal;
  lastYGlobal = Yglobal;

  RightPod += ydeltaticks * Math.sin(convertDegreesToRadians(slider.value)) + xdeltaticks * Math.cos(convertDegreesToRadians(slider.value));
  LeftPod += ydeltaticks * Math.sin(convertDegreesToRadians(slider.value)) + xdeltaticks * Math.cos(convertDegreesToRadians(slider.value));
  BackPod += ydeltaticks * Math.cos(convertDegreesToRadians(slider.value)) - xdeltaticks * Math.sin(convertDegreesToRadians(slider.value));

  sensor1.innerHTML = RightPod.toFixed(1);
  sensor2.innerHTML = LeftPod.toFixed(1);
  sensor3.innerHTML = BackPod.toFixed(1);

  sliderValue.innerHTML = slider.value

  createPointsG(Xglobal, Yglobal);

  draggable.style.left = `${vw}vw`;
  draggable.style.top = `${vh}vw`;

}

function updateHeadingSlider(){
  var heading = slider.value;
  updateHeading(heading);
}

function updateHeadingFromText(){
  var heading = sliderValue.value;
  updateHeading(heading);
}

function updateHeading(heading){
  lastHeading = slidervalue.value;
  robotPos.style.transform = `rotate(${heading}deg)`;
  slider.value = heading;
  sliderValue.value = heading;
  Heading = heading;

  let deltaHeading = heading - lastHeading;

  RightPod += -deltaHeading * ticksPerDegreeVer;
  LeftPod += deltaHeading * ticksPerDegreeVer;
  BackPod += -deltaHeading * ticksPerDegreeHor;

  sensor1.innerHTML = RightPod.toFixed(1);
  sensor2.innerHTML = LeftPod.toFixed(1);
  sensor3.innerHTML = BackPod.toFixed(1);

}

function convertDegreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function roundTo(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

function sleeptime(index){
  let xdelta = xpoints[index] - xpoints[index-2];
  let ydelta = ypoints[index] - ypoints[index-2];
  let distance = Math.hypot(xdelta, ydelta);
  
  return (distance*0.25)*millPerCm;
}

function calculateCubicBezier(startX, startY, controlFirstX, controlFirstY, controlSecondX, controlSecondY, endX, endY) {

  let t = 0;

  while (t <= 1) {
      const u = 1 - t;
      const tt = t * t;
      const ttt = t * t * t;
      const uu = u * u;
      const uuu = u * u * u;

      xpoints.push(uuu * startX + 3 * uu * t * controlFirstX + 3 * u * tt * controlSecondX + ttt * endX);
      ypoints.push(uuu * startY + 3 * uu * t * controlFirstY + 3 * u * tt * controlSecondY + ttt * endY);

      t += 0.001;
  }

}

function calculateQuadraticBezier(startX, startY, controlX, controlY, endX, endY) {

  let t = 0;

  while (t <= 1) {
      const u = 1 - t;
      const tt = t * t;
      const uu = u * u;

      const x = uu * startX + 2 * u * t * controlX + tt * endX;
      const y = uu * startY + 2 * u * t * controlY + tt * endY;

      xpoints.push(x);
      ypoints.push(y);

      t += 0.001;
  }

  return { xpoints, ypoints };
}

function calculateLinearBezier(startX, startY, endX, endY) {

  let t = 0;

  while (t <= 1) {
      const x = (1 - t) * startX + t * endX;
      const y = (1 - t) * startY + t * endY;

      xpoints.push(x);
      ypoints.push(y);

      t += 0.001;
  }

}

async function testLoc(){
  calculateQuadraticBezier(23, 23, 23, 190, 180, 180)
  calculateQuadraticBezier(180, 180, 360, 20, 195, 220)

  let TargetHeading = 0;

  let index = 0;
  let counter = 1;
  setRobotPos(xpoints[index], ypoints[index])

  let startTime = performance.now();

  while(index < xpoints.length){

    if(sleeptime(index) < 1){
      index++;
    }

    setRobotPos(xpoints[index], ypoints[index])
    updateHeading(TargetHeading);

    let elapsedTime;
    
    let endTime = performance.now();
    elapsedTime = endTime - startTime;

    if(elapsedTime >= 4){
      tracker();
      // console.log(elapsedTime)
      startTime = performance.now();
    }

    index++;
    counter++;
    if(counter > 1 && TargetHeading < 200 && index > 200){   
      counter = 0; 
      TargetHeading+= 5;
    }
    
    await sleep(sleeptime(index));

  }

  console.log(loopthroughs);
  console.log(XCalced);
  console.log(YCalced);
  console.log(HCalced);

  GlobalError.innerHTML = Math.hypot((Math.abs(XCalced-Xglobal)), (Math.abs(YCalced-Yglobal))).toFixed(2)

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function preciseSleep(targetTime) {
  return new Promise((resolve) => {
    const startTime = performance.now();

    function checkTime() {
      const elapsedTime = performance.now() - startTime;
      if (elapsedTime >= targetTime) {
        resolve();
      } else {
        requestAnimationFrame(checkTime);
      }
    }

    requestAnimationFrame(checkTime);
  });
}

function tracker(){

  deltaBack = BackPod - lastBackPod;
  deltaLeft = LeftPod - lastLeftPod;
  deltaRight = RightPod - lastRightPod;

  let deltaHeading = degreesPerCM * (((deltaLeft - deltaRight)/2)/ticksPerCM);
  HCalced += deltaHeading;

  let deltax = ((deltaLeft+deltaRight)/2)/ticksPerCM;
  let deltay = ((deltaBack)/ticksPerCM) + (deltaHeading * cmPerDegreeHor)

  XCalced += deltax * Math.cos(convertDegreesToRadians(HCalced)) - deltay * Math.sin(convertDegreesToRadians(HCalced));
  YCalced += deltax * Math.sin(convertDegreesToRadians(HCalced)) + deltay * Math.cos(convertDegreesToRadians(HCalced));

  console.log(deltaHeading);

  lastBackPod = BackPod
  lastLeftPod = LeftPod
  lastRightPod = RightPod
  lastTrackerHeading = HCalced

  calculatedPosition.style.top = `${((360-(XCalced-22.5))/9)}vw`;
  calculatedPosition.style.left = `${((YCalced+22.5)/9)}vw`;
  calculatedPosition.style.transform = `rotate(${HCalced}deg)`;

  createPointsP(XCalced, YCalced);

  loopthroughs++;


}

function createPointsG(X, Y) {

  var dropZone = document.getElementById("drop_zone");

  var point = document.createElement("div");
  point.className = "point";
  point.style.top = (((360 - (X-45)))/9) + "vw";
  point.style.left = ((Y+45)/9) + "vw";
  dropZone.appendChild(point);

  createdPoints.push(point);

}

function createPointsP(X, Y) {

  var dropZone = document.getElementById("drop_zone");

  var point = document.createElement("div");
  point.className = "pointStatic";
  point.style.top = ((360-(X-45))/9) + "vw";
  point.style.left = ((Y+45)/9) + "vw";
  dropZone.appendChild(point);

  createdPoints.push(point);

}

function deletePoints() {
  var dropZone = document.getElementById("drop_zone");
  createdPoints.forEach(function (point) {
      dropZone.removeChild(point);
  });
  createdPoints = [];
}
