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
const PathLength = document.getElementById('PathLength');

const slidervalue = document.getElementById('sliderValue');

let isDragging = false;
let offsetX, offsetY;

const podTicks = 2000;
const wheelRadius = 2.4;
const trackWidth = 16;
const backPodOffset = 8;

let sampleX = 0;
let sampleY = 0;

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

let distanceTravelled = 0;

var xpoints = [];
var ypoints = [];

var createdPoints = [];
var createdPointsStatic = [];
let positionHistory = []; 

let millPerCm = 1000/210;

let vw = 0;
let vh = 0;

let startTime = performance.now();
let lastTime = startTime;

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

function addPosition(x, y, theta, time) {
  positionHistory.push({ x, y, theta, time });
  
  if (positionHistory.length > 4) {
      positionHistory.shift();
  }
}

function calculateDerivatives() {
  if (positionHistory.length < 4) return { velX: 0, velY: 0, velTheta: 0, accX: 0, accY: 0, accTheta: 0, jerkX: 0, jerkY: 0, jerkTheta: 0 };

  const [p1, p2, p3, p4] = positionHistory;

  const deltaT1 = p2.time - p1.time;
  const deltaT2 = p3.time - p2.time;
  const deltaT3 = p4.time - p3.time;

  const velX1 = (p2.x - p1.x) / deltaT1;
  const velX2 = (p3.x - p2.x) / deltaT2;
  const velX3 = (p4.x - p3.x) / deltaT3;
  const velY1 = (p2.y - p1.y) / deltaT1;
  const velY2 = (p3.y - p2.y) / deltaT2;
  const velY3 = (p4.y - p3.y) / deltaT3;
  const velTheta1 = (p2.theta - p1.theta) / deltaT1;
  const velTheta2 = (p3.theta - p2.theta) / deltaT2;
  const velTheta3 = (p4.theta - p3.theta) / deltaT3;

  const accX1 = (velX2 - velX1) / deltaT2;
  const accX2 = (velX3 - velX2) / deltaT3;
  const accY1 = (velY2 - velY1) / deltaT2;
  const accY2 = (velY3 - velY2) / deltaT3;
  const accTheta1 = (velTheta2 - velTheta1) / deltaT2;
  const accTheta2 = (velTheta3 - velTheta2) / deltaT3;

  const jerkX = (accX2 - accX1) / deltaT3;
  const jerkY = (accY2 - accY1) / deltaT3;
  const jerkTheta = (accTheta2 - accTheta1) / deltaT3;

  return {
      velX: velX3,
      velY: velY3,
      velTheta: velTheta3,
      accX: accX2,
      accY: accY2,
      accTheta: accTheta2,
      jerkX,
      jerkY,
      jerkTheta
  };
}

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

function setRobotPosCalced(X, Y){

  let newX = (((360 - (X-22.5)))/9);
  let newY = ((Y+22.5)/9);

  let vwC = newY;
  let vhC = newX;

  if (vwC < minVW) vwC = minVW;
  if (vwC > maxVW) vwC = maxVW;
  if (vhC < minVH) vhC = minVH;
  if (vhC > maxVH) vhC = maxVH;

  calculatedPosition.style.left = `${vwC}vw`;
  calculatedPosition.style.top = `${vhC}vw`;
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

  // Xpos.innerHTML = Xglobal.toFixed(1);
  // Ypos.innerHTML = Yglobal.toFixed(1);

  let xdeltaticks = (Xglobal - lastXGlobal)*ticksPerCM;
  let ydeltaticks = (Yglobal - lastYGlobal)*ticksPerCM;

  lastXGlobal = Xglobal;
  lastYGlobal = Yglobal;

  RightPod += ydeltaticks * Math.sin(convertDegreesToRadians(slider.value)) + xdeltaticks * Math.cos(convertDegreesToRadians(slider.value));
  LeftPod += ydeltaticks * Math.sin(convertDegreesToRadians(slider.value)) + xdeltaticks * Math.cos(convertDegreesToRadians(slider.value));
  BackPod += ydeltaticks * Math.cos(convertDegreesToRadians(slider.value)) - xdeltaticks * Math.sin(convertDegreesToRadians(slider.value));

  sensor1.innerHTML = RightPod.toFixed(3);
  sensor2.innerHTML = LeftPod.toFixed(3);
  sensor3.innerHTML = BackPod.toFixed(3);

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

function roundTo(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

function sleeptime(index){
  let xdelta = xpoints[index] - xpoints[index-2];
  let ydelta = ypoints[index] - ypoints[index-2];
  let distance = Math.hypot(xdelta, ydelta);

  let value = (distance*0.25)*millPerCm;
  
  return value;
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
  calculateQuadraticBezier(23, 23, 23, 190, 140, 240)
  calculateQuadraticBezier(140, 240, 360, 260, 195, 220)
  calculateQuadraticBezier(195, 220, 60, 180, 340, 150)

  // calculateLinearBezier(0, 60, 60, 60)

  let TargetHeading = 0;

  let index = 0;
  let counter = 1;
  setRobotPos(xpoints[index], ypoints[index])

  console.log("X And Y" + xpoints[100])

  sampleX = Xglobal
  sampleY = Yglobal

  let startTime = performance.now();

  PathLength.innerHTML = calculatePathLength(xpoints, ypoints).toFixed(2)

  let waitTime = 0;

  while(index < xpoints.length){

    if(sleeptime(index) < 1){
      index++;
    }

    setRobotPos(xpoints[index], ypoints[index])
    // updateHeading(TargetHeading);

    let elapsedTime;
    
    let endTime = performance.now();
    elapsedTime = endTime - startTime;

    console.log(elapsedTime)

    if(elapsedTime >= 150){
      drawLineWithCSS(createPoint(Xglobal, Yglobal), createPoint(sampleX, sampleY), 'green', 2);

      tracker();
      
      sampleX = Xglobal
      sampleY = Yglobal
      
      startTime = performance.now();
    }

    index++;

    let timeToAdd = sleeptime(index);

    timeToAdd = parseFloat(timeToAdd) || 0;

    waitTime += timeToAdd;

    if(waitTime > 1){
      await sleep(waitTime);
      waitTime = 0;
      TargetHeading++;
    }

    GlobalError.innerHTML = distanceTravelled.toFixed(2)

  }

  //GlobalError.innerHTML = Math.hypot((Math.abs(XCalced-Xglobal)), (Math.abs(YCalced-Yglobal))).toFixed(2)

}

function calculatePathLength(pointsX, pointsY) {
  if (pointsX.length < 2) {
    return 0; 
  }

  let totalLength = 0;

  for (let i = 1; i < pointsX.length; i++) {
    const deltaX = pointsX[i] - pointsX[i - 1];
    const deltaY = pointsY[i] - pointsY[i - 1];
    const distance = Math.hypot(deltaX, deltaY);
    totalLength += distance;
  }

  return totalLength;
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

  const now = performance.now();

  const elapsedTime = now - startTime;

  deltaBack = BackPod - lastBackPod;
  deltaLeft = LeftPod - lastLeftPod;
  deltaRight = RightPod - lastRightPod;

  let deltaHeading = degreesPerCM * (((deltaLeft - deltaRight)/2)/ticksPerCM);
  HCalced += deltaHeading;

  let deltax = ((deltaLeft+deltaRight)/2)/ticksPerCM;
  let deltay = ((deltaBack)/ticksPerCM) + (deltaHeading * cmPerDegreeHor)

  distanceTravelled += Math.hypot(deltax, deltay)

  XCalced += deltax * Math.cos(convertDegreesToRadians(HCalced)) - deltay * Math.sin(convertDegreesToRadians(HCalced));
  YCalced += deltax * Math.sin(convertDegreesToRadians(HCalced)) + deltay * Math.cos(convertDegreesToRadians(HCalced));
  Xpos.innerHTML = XCalced.toFixed(1);
  Ypos.innerHTML = YCalced.toFixed(1);

  lastBackPod = BackPod
  lastLeftPod = LeftPod
  lastRightPod = RightPod
  lastTrackerHeading = HCalced

  console.log("deltaBack" + deltaBack)
  console.log("deltaLeft" + deltaLeft)
  console.log("deltaRight" + deltaRight)

  createPointsLinear(XCalced, YCalced)
  setRobotPosCalced(XCalced, YCalced)

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

function createPointsG(X, Y) {

  var dropZone = document.getElementById("drop_zone");

  var point = document.createElement("div");
  point.className = "point";
  point.style.top = (((360 - (X-45)))/9) + "vw";
  point.style.left = ((Y+45)/9) + "vw";
  dropZone.appendChild(point);

  createdPoints.push(point);

}

function createPoint(x, y) {
  return { x: ((360 - (x-45)))/9, y: ((y+45))/9 };
}

function createPointsLinear(X, Y) {

  var dropZone = document.getElementById("drop_zone");

  var point = document.createElement("div");
  point.className = "pointLinear";
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

function drawLineWithCSS(point1, point2, color = 'black', thickness = 2) {
  const line = document.createElement('div');
  line.className = 'line';

  // Calculate the line's length and angle
  const deltaX = point2.x - point1.x;
  const deltaY = point2.y - point1.y;
  const length = Math.sqrt(deltaX ** 2 + deltaY ** 2);
  const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

  console.log("Angle" + (angle))


  // Style the line
  line.style.height = `${length}vw`;
  line.style.left = `${point1.y}vw`;
  line.style.top = `${point1.x}vw`;
  line.style.backgroundColor = color;
  line.style.width = `${thickness}px`;
  line.style.transform = `rotate(${-angle}deg)`;

  // Add the line to the body
  container.appendChild(line);
}

function convertDegreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function radiansToDegrees(radians) {
  return radians * (180 / Math.PI);
}