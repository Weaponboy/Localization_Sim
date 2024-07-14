
window.onload = function () {

    //id, label, containerId
    generateDivBox('1p1', 'P1', 'firstPath', true, true);
    generateDivBox('1p2', 'P2', 'firstPath', true, true);
    generateDivBox('1p3', 'P3', 'firstPath', false, false);
    generateDivBox('1p4', 'P4', 'firstPath', false, false);

    //id, label, containerId
    generateDivBox('2p1', 'P1', 'secondPath', true, true);
    generateDivBox('2p2', 'P2', 'secondPath', true, true);
    generateDivBox('2p3', 'P3', 'secondPath', false, false);
    generateDivBox('2p4', 'P4', 'secondPath', false, false);

    //id, label, containerId
    generateDivBox('3p1', 'P1', 'thirdPath', true, true);
    generateDivBox('3p2', 'P2', 'thirdPath', true, true);
    generateDivBox('3p3', 'P3', 'thirdPath', false, false);
    generateDivBox('3p4', 'P4', 'thirdPath', false, false);

    //id, label, containerId
    generateDivBox('4p1', 'P1', 'forthPath', true, true);
    generateDivBox('4p2', 'P2', 'forthPath', true, true);
    generateDivBox('4p3', 'P3', 'forthPath', false, false);
    generateDivBox('4p4', 'P4', 'forthPath', false, false);

    pathsChecked('Path1', 'Path2', 'Path3', 'Path4');

    thridPoint1('1p3tick', '1p4tick')
    thridPoint1('2p3tick', '2p4tick')
    thridPoint1('3p3tick', '3p4tick')
    thridPoint1('4p3tick', '4p4tick')

    const containerTest = document.getElementById('pointsStorage');

    function handleInputChange(event) {

        PlanPath();

        var point2 = document.getElementById("Path2");
        var point3 = document.getElementById("Path3");
        var point4 = document.getElementById("Path4");

        if (point2.checked) {
            var point32 = document.getElementById("1p3tick");
            var point42 = document.getElementById("1p4tick");

            startPoint(2, point32.checked, point42.checked)
        }

        if (point3.checked) {
            var point33 = document.getElementById("2p3tick");
            var point43 = document.getElementById("2p4tick");

            startPoint(3, point33.checked, point43.checked)
        }

        if (point4.checked) {
            var point34 = document.getElementById("3p3tick");
            var point44 = document.getElementById("3p4tick");

            startPoint(4, point34.checked, point44.checked)
        }


    }

    function updatePointsInput(event) {
        var point2 = document.getElementById("Path2");
        var point3 = document.getElementById("Path3");
        var point4 = document.getElementById("Path4");

        if (point2.checked) {
            var point32 = document.getElementById("1p3tick");
            var point42 = document.getElementById("1p4tick");

            startPoint(2, point32.checked, point42.checked)
        }

        if (point3.checked) {
            var point33 = document.getElementById("2p3tick");
            var point43 = document.getElementById("2p4tick");

            startPoint(3, point33.checked, point43.checked)
        }

        if (point4.checked) {
            var point34 = document.getElementById("3p3tick");
            var point44 = document.getElementById("3p4tick");

            startPoint(4, point34.checked, point44.checked)
        }

        updateBuildPatten();


        PlanPath();
    }


    if (containerTest) {
        containerTest.querySelectorAll('input[type="number"]').forEach(input => {
            console.log('Attaching listener to input:', input);
            input.addEventListener('input', handleInputChange);
        });

        containerTest.querySelectorAll('input[type="checkbox"]').forEach(input => {
            console.log('Attaching listener to input:', input);
            input.addEventListener('input', updatePointsInput);
        });
    } else {
        console.error('Container element not found.');
    }

};

var slider = document.getElementById("mySlider");
var output = document.getElementById("sliderValue");
var end = document.getElementById("end");
var start = document.getElementById("start");

output.innerHTML = slider.value;

var paths = 0;
var points = [];

var loopTime = [];

var xValues = [];
var yValues = [];
var headingValues = [];

var xVelo = [];
var yVelo = [];
var headingVelo = [];

var leftPod = [];
var rightPod = [];
var centerPod = [];

var createdPoints = [];
var createdPointsStatic = [];

var xpoints = [];
var ypoints = [];

async function autoReplay() {

    slider.value = 0

    for (var i = 0; i < slider.max; i++) {

        slider.value = i + 1;
        output.innerHTML = slider.value;

        updateDisplay();
        createPoints();

        await sleep(loopTime[i]);
    }

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function thridPoint1(point3, point4) {
    var Point3 = document.getElementById(point3);
    var Point4 = document.getElementById(point4);

    Point3.addEventListener('change', function () {

        if (Point3.checked) {
        } else {
            Point4.checked = false;
        }

        updateBuildPatten();

    });

    Point4.addEventListener('change', function () {

        if (Point4.checked) {
            Point3.checked = true;
        } else {

        }

        updateBuildPatten();

    });

}

function pathsChecked(path1, path2, path3, path4) {

    var checkbox1 = document.getElementById(path1);
    var checkbox2 = document.getElementById(path2);

    var checkbox3 = document.getElementById(path3);
    var checkbox4 = document.getElementById(path4);

    checkbox1.addEventListener('change', function () {
        if (checkbox1.checked) {

        } else {
            checkbox2.checked = false;
            checkbox3.checked = false;
            checkbox4.checked = false;
        }
        updateBuildPatten();

    });

    checkbox2.addEventListener('change', function () {
        if (checkbox2.checked) {
            checkbox1.checked = true;

            // var point32 = document.getElementById("1p3tick");
            // var point42 = document.getElementById("1p4tick");

            // startPoint(2, point32.checked, point42.checked)

        } else {
            checkbox3.checked = false;
            checkbox4.checked = false;
        }
        updateBuildPatten();

    });

    checkbox3.addEventListener('change', function () {
        if (checkbox3.checked) {
            checkbox1.checked = true;
            checkbox2.checked = true;

            // var point32 = document.getElementById("1p3tick");
            // var point42 = document.getElementById("1p4tick");

            // startPoint(2, point32.checked, point42.checked)

            // var point33 = document.getElementById("2p3tick");
            // var point43 = document.getElementById("2p4tick");

            // startPoint(3, point33.checked, point43.checked)

        } else {
            checkbox4.checked = false;
        }
        updateBuildPatten();

    });

    checkbox4.addEventListener('change', function () {
        if (checkbox4.checked) {
            checkbox1.checked = true;
            checkbox2.checked = true;
            checkbox3.checked = true;

            // var point32 = document.getElementById("1p3tick");
            // var point42 = document.getElementById("1p4tick");

            // startPoint(2, point32.checked, point42.checked)

            // var point33 = document.getElementById("2p3tick");
            // var point43 = document.getElementById("2p4tick");

            // startPoint(3, point33.checked, point43.checked)

            // var point34 = document.getElementById("3p3tick");
            // var point44 = document.getElementById("3p4tick");

            // startPoint(4, point34.checked, point44.checked)
        } else {
        }

        updateBuildPatten();

    });

}

function startPoint(startNumber, third, forth) {

    var pointToInputX = document.getElementById(startNumber + "p1X");
    var pointToInputY = document.getElementById(startNumber + "p1Y");

    if (forth) {
        var pointToGetX = document.getElementById(startNumber - 1 + "p4X").value;
        var pointToGetY = document.getElementById(startNumber - 1 + "p4Y").value;

        console.log("third point added")

        pointToInputX.value = pointToGetX;
        pointToInputY.value = pointToGetY;
    } else if (third) {
        var pointToGetX = document.getElementById(startNumber - 1 + "p3X").value;
        var pointToGetY = document.getElementById(startNumber - 1 + "p3Y").value;

        console.log("forth point added")

        pointToInputX.value = pointToGetX;
        pointToInputY.value = pointToGetY;
    } else {
        var pointToGetX = document.getElementById(startNumber - 1 + "p2X").value;
        var pointToGetY = document.getElementById(startNumber - 1 + "p2Y").value;

        console.log("third point added")

        pointToInputX.value = pointToGetX;
        pointToInputY.value = pointToGetY;
    }

}

slider.oninput = function () {
    output.innerHTML = this.value;
    updateDisplay();
    createPoints();
    if (this.value === 0) {
        var robotPosition = document.getElementById("robotPos");
        robotPosition.style.display = "none";
    }
}

function generateDivBox(id, label, containerId, isChecked = false, isDisabled = false) {

    const container = document.getElementById(containerId);

    const divBox = document.createElement('div');
    divBox.className = 'pointBox';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `${id}tick`;
    checkbox.className = 'pointChecks';
    checkbox.checked = isChecked;
    checkbox.disabled = isDisabled;

    const checkLabel = document.createElement('label');
    checkLabel.htmlFor = `${id}tick`;
    checkLabel.className = 'checkLabel';
    checkLabel.innerText = `${label}:`;

    const xLabel = document.createElement('label');
    xLabel.htmlFor = `${id}X`;
    xLabel.className = 'xLabel';
    xLabel.innerText = 'X';

    const xInput = document.createElement('input');
    xInput.type = 'number';
    xInput.min = 0;
    xInput.max = 360;
    xInput.id = `${id}X`;
    xInput.className = 'valueLabel';

    const yLabel = document.createElement('label');
    yLabel.htmlFor = `${id}Y`;
    yLabel.className = 'yLabel';
    yLabel.innerText = 'Y';

    const yInput = document.createElement('input');
    yInput.type = 'number';
    yInput.min = 0;
    yInput.max = 360;
    yInput.id = `${id}Y`;
    yInput.className = 'valueLabel';

    divBox.appendChild(checkbox);
    divBox.appendChild(checkLabel);

    divBox.appendChild(xLabel);
    divBox.appendChild(xInput);

    divBox.appendChild(yLabel);
    divBox.appendChild(yInput);

    container.appendChild(divBox);
}

function updateDisplay() {
    var LoopTime = document.getElementById("loopTimeDis");

    var XPosition = document.getElementById("XPosition");
    var YPosition = document.getElementById("YPosition");
    var Heading = document.getElementById("Heading");

    var LeftPod = document.getElementById("LeftPod");
    var RightPod = document.getElementById("RightPod");
    var CenterPod = document.getElementById("CenterPod");

    var XVelo = document.getElementById("XVelo");
    var YVelo = document.getElementById("YVelo");
    var HeadingVelo = document.getElementById("HeadingVelo");

    LoopTime.innerHTML = loopTime[slider.value]

    XPosition.innerHTML = xValues[slider.value].toFixed(4)
    YPosition.innerHTML = yValues[slider.value].toFixed(4)
    Heading.innerHTML = headingValues[slider.value].toFixed(2)

    LeftPod.innerHTML = leftPod[slider.value]
    RightPod.innerHTML = rightPod[slider.value]
    CenterPod.innerHTML = centerPod[slider.value]

    XVelo.innerHTML = xVelo[slider.value]
    YVelo.innerHTML = yVelo[slider.value]
    HeadingVelo.innerHTML = headingVelo[slider.value]

}

function dragOverHandler(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
}

function dropHandler(event) {
    event.preventDefault();
    var files = event.dataTransfer.files;
    if (files.length > 0) {
        var file = files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            var content = e.target.result;
            parseFileContent(content);
            slider.max = loopTime.length - 1;
            end.innerHTML = loopTime.length - 1;
        };
        reader.readAsText(file);
    }
}

function parseFileContent(content) {

    slider.value = 0;

    if (xValues.length > 0) {
        output.innerHTML = slider.value;
        updateDisplay();
        createPoints();
    }

    loopTime.length = 0;

    xValues.length = 0;
    yValues.length = 0;
    headingValues.length = 0;

    xVelo.length = 0;
    yVelo.length = 0;
    headingVelo.length = 0;

    leftPod.length = 0;
    rightPod.length = 0;
    centerPod.length = 0;

    var lines = content.split('\n');
    for (var i = 0; i < lines.length; i++) {

        var line = lines[i].trim();
        var parts = line.split(':');

        if (parts.length === 2) {

            if (parts[0].trim().startsWith('loop time')) {
                loopTime.push(parseFloat(parts[1]));
            }

            if (parts[0].trim().startsWith('X Position')) {
                xValues.push(parseFloat(parts[1]));
            } else if (parts[0].trim().startsWith('Y Position')) {
                yValues.push(parseFloat(parts[1]));
            } else if (parts[0].trim().startsWith('Heading Position')) {
                headingValues.push(parseFloat(parts[1]));
            }

            if (parts[0].trim().startsWith('X Velocity')) {
                xVelo.push(parseFloat(parts[1]));
            } else if (parts[0].trim().startsWith('Y Velocity')) {
                yVelo.push(parseFloat(parts[1]));
            } else if (parts[0].trim().startsWith('Heading Velocity')) {
                headingVelo.push(parseFloat(parts[1]));
            }

            if (parts[0].trim().startsWith('Left Pod')) {
                leftPod.push(parseFloat(parts[1]));
            } else if (parts[0].trim().startsWith('Right Pod')) {
                rightPod.push(parseFloat(parts[1]));
            } else if (parts[0].trim().startsWith('Center Pod')) {
                centerPod.push(parseFloat(parts[1]));
            }

        }
    }
}

function displayParsedData() {
    console.log("Numbers: ", loopTime);
    console.log("X Values: ", xValues);
    console.log("Y Values: ", yValues);
    console.log("left: ", leftPod);
    console.log("right: ", rightPod);
    console.log("center: ", centerPod);
}

function createPoints() {

    deletePoints();

    var dropZone = document.getElementById("drop_zone");

    for (var i = 0; i < slider.value; i++) {
        var point = document.createElement("div");
        point.className = "point";
        point.style.top = -((xValues[i] * 0.109)) + 42.8 + "vw";
        point.style.left = (yValues[i] * 0.109) + 3.5 + "vw";
        dropZone.appendChild(point);

        createdPoints.push(point);
    }

    var robotBorder = document.getElementById("robotBorder");
    robotBorder.style.top = -((xValues[slider.value] * 0.109)) + 40.7 + "vw";
    robotBorder.style.left = (yValues[slider.value] * 0.109) + 1.3 + "vw";
    var heading = headingValues[slider.value];
    robotBorder.style.transform = `rotate(${heading}deg)`;
    robotBorder.style.display = "block";


    var robotPosition = document.getElementById("robotPos");
    robotPosition.style.top = -((xValues[slider.value] * 0.109)) + 42.6 + "vw";
    robotPosition.style.left = (yValues[slider.value] * 0.109) + 3.3 + "vw";
    robotPosition.style.display = "block";
}

function deletePoints() {
    var dropZone = document.getElementById("drop_zone");
    createdPoints.forEach(function (point) {
        dropZone.removeChild(point);
    });
    createdPoints = [];
}

function PlanPath() {

    xpoints.length = 0;
    ypoints.length = 0;

    for (let i = 0; i < paths; i++) {

        console.log(i);

        if (points[i] == 2) {
            const startX = document.getElementById(i + 1 + 'p1X').value;
            const startY = document.getElementById(i + 1 + 'p1Y').value;

            const endX = document.getElementById(i + 1 + 'p2X').value;
            const endY = document.getElementById(i + 1 + 'p2Y').value;

            calculateLinearBezier(startX, startY, endX, endY);

        } else if (points[i] == 3) {
            const startX = document.getElementById(i + 1 + 'p1X').value;
            const startY = document.getElementById(i + 1 + 'p1Y').value;

            const secondX = document.getElementById(i + 1 + 'p2X').value;
            const secondY = document.getElementById(i + 1 + 'p2Y').value;

            const endX = document.getElementById(i + 1 + 'p3X').value;
            const endY = document.getElementById(i + 1 + 'p3Y').value;

            calculateQuadraticBezier(startX, startY, secondX, secondY, endX, endY);

        } else if (points[i] == 4) {
            const startX = document.getElementById(i + 1 + 'p1X').value;
            const startY = document.getElementById(i + 1 + 'p1Y').value;

            const secondX = document.getElementById(i + 1 + 'p2X').value;
            const secondY = document.getElementById(i + 1 + 'p2Y').value;

            const thirdX = document.getElementById(i + 1 + 'p3X').value;
            const thirdY = document.getElementById(i + 1 + 'p3Y').value;

            const endX = document.getElementById(i + 1 + 'p4X').value;
            const endY = document.getElementById(i + 1 + 'p4Y').value;

            calculateCubicBezier(startX, startY, secondX, secondY, thirdX, thirdY, endX, endY);

        }

    }

    // console.log(xpoints);
    // console.log(ypoints);
    createPointsStatic();

}

function getFirstPathData() {

    var allPoints;

    var xText1 = '1p1X: ' + document.getElementById('1p1X').value;
    var xText2 = '1p2X: ' + document.getElementById('1p2X').value;
    var xText3 = '1p3X: ' + document.getElementById('1p3X').value;
    var xText4 = '1p4X: ' + document.getElementById('1p4X').value;

    var yText1 = '1p1Y: ' + document.getElementById('1p1Y').value;
    var yText2 = '1p2Y: ' + document.getElementById('1p2Y').value;
    var yText3 = '1p3Y: ' + document.getElementById('1p3Y').value;
    var yText4 = '1p4Y: ' + document.getElementById('1p4Y').value;

    allPoints = xText1 + '\n' + xText2 + '\n' + xText3 + '\n' + xText4 + '\n' + yText1 + '\n' + yText2 + '\n' + yText3 + '\n' + yText4;

    return allPoints;
}

function getSecondPathData() {

    var allPoints;

    var xText1 = '2p1X: ' + document.getElementById('2p1X').value;
    var xText2 = '2p2X: ' + document.getElementById('2p2X').value;
    var xText3 = '2p3X: ' + document.getElementById('2p3X').value;
    var xText4 = '2p4X: ' + document.getElementById('2p4X').value;

    var yText1 = '2p1Y: ' + document.getElementById('2p1Y').value;
    var yText2 = '2p2Y: ' + document.getElementById('2p2Y').value;
    var yText3 = '2p3Y: ' + document.getElementById('2p3Y').value;
    var yText4 = '2p4Y: ' + document.getElementById('2p4Y').value;

    allPoints = xText1 + '\n' + xText2 + '\n' + xText3 + '\n' + xText4 + '\n' + yText1 + '\n' + yText2 + '\n' + yText3 + '\n' + yText4;

    return allPoints;
}

function getThirdPathData() {

    var allPoints;

    var xText1 = '3p1X: ' + document.getElementById('3p1X').value;
    var xText2 = '3p2X: ' + document.getElementById('3p2X').value;
    var xText3 = '3p3X: ' + document.getElementById('3p3X').value;
    var xText4 = '3p4X: ' + document.getElementById('3p4X').value;

    var yText1 = '3p1Y: ' + document.getElementById('3p1Y').value;
    var yText2 = '3p2Y: ' + document.getElementById('3p2Y').value;
    var yText3 = '3p3Y: ' + document.getElementById('3p3Y').value;
    var yText4 = '3p4Y: ' + document.getElementById('3p4Y').value;

    allPoints = xText1 + '\n' + xText2 + '\n' + xText3 + '\n' + xText4 + '\n' + yText1 + '\n' + yText2 + '\n' + yText3 + '\n' + yText4;

    return allPoints;
}

function getForthPathData() {

    var allPoints;

    var xText1 = '4p1X: ' + document.getElementById('4p1X').value;
    var xText2 = '4p2X: ' + document.getElementById('4p2X').value;
    var xText3 = '4p3X: ' + document.getElementById('4p3X').value;
    var xText4 = '4p4X: ' + document.getElementById('4p4X').value;

    var yText1 = '4p1Y:' + document.getElementById('4p1Y').value;
    var yText2 = '4p2Y:' + document.getElementById('4p2Y').value;
    var yText3 = '4p3Y:' + document.getElementById('4p3Y').value;
    var yText4 = '4p4Y:' + document.getElementById('4p4Y').value;

    allPoints = xText1 + '\n' + xText2 + '\n' + xText3 + '\n' + xText4 + '\n' + yText1 + '\n' + yText2 + '\n' + yText3 + '\n' + yText4;

    return allPoints;
}

document.getElementById('downloadData').addEventListener('click', function () {

    var path1Points = getFirstPathData();
    var path2Points = getSecondPathData();
    var path3Points = getThirdPathData();
    var path4Points = getForthPathData();

    var filename = prompt("Please enter the filename", "Pathing Points");

    if (filename) {
        var combinedText = path1Points + '\n' + path2Points + '\n' + path3Points + '\n' + path4Points;

        var blob = new Blob([combinedText], { type: 'text/plain' });

        var link = document.createElement('a');

        link.download = filename;

        link.href = window.URL.createObjectURL(blob);

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
    }

});

document.getElementById('openPathFromFile').addEventListener('click', function () {
    document.getElementById('fileinput').click();
});

document.getElementById('fileinput').addEventListener('change', function (event) {
    var file = event.target.files[0];

    if (file) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var content = e.target.result;
            inputPathingPoints(content);
        };

        reader.readAsText(file);
    }
});

function inputPathingPoints(content) {

    var lines = content.split('\n');

    for (var i = 0; i < lines.length; i++) {

        var line = lines[i].trim();
        var parts = line.split(':');

        if (parts.length === 2) {

            //first points
            if (parts[0].trim().startsWith('1p1X')) {
                document.getElementById('1p1X').value = parseFloat(parts[1])
            } else if (parts[0].trim().startsWith('1p2X')) {
                var Text = document.getElementById('1p2X');
                Text.value = parseFloat(parts[1])
            } else if (parts[0].trim().startsWith('1p3X')) {
                var Text = document.getElementById('1p3X');
                Text.value = parseFloat(parts[1])
            } else if (parts[0].trim().startsWith('1p4X')) {
                var Text = document.getElementById('1p4X');
                Text.value = parseFloat(parts[1])
            }

            if (parts[0].trim().startsWith('1p1Y')) {
                var Text = document.getElementById('1p1Y');
                Text.value = parseFloat(parts[1])
            } else if (parts[0].trim().startsWith('1p2Y')) {
                var Text = document.getElementById('1p2Y');
                Text.value = parseFloat(parts[1])
            } else if (parts[0].trim().startsWith('1p3Y')) {
                var Text = document.getElementById('1p3Y');
                Text.value = parseFloat(parts[1])
            } else if (parts[0].trim().startsWith('1p4Y')) {
                var Text = document.getElementById('1p4Y');
                Text.value = parseFloat(parts[1])
            }

            //second points
            if (parts[0].trim().startsWith('2p1X')) {
                var Text = document.getElementById('2p1X');
                Text.innerHTML = parseFloat(parts[1])
            } else if (parts[0].trim().startsWith('2p2X')) {
                var Text = document.getElementById('2p2X');
                Text.innerHTML = parseFloat(parts[1])
            } else if (parts[0].trim().startsWith('2p3X')) {
                var Text = document.getElementById('2p3X');
                Text.innerHTML = parseFloat(parts[1])
            } else if (parts[0].trim().startsWith('2p4X')) {
                var Text = document.getElementById('2p4X');
                Text.innerHTML = parseFloat(parts[1])
            }

            if (parts[0].trim().startsWith('2p1Y')) {
                var Text = document.getElementById('2p1Y');
                Text.innerHTML = parseFloat(parts[1])
            } else if (parts[0].trim().startsWith('2p2Y')) {
                var Text = document.getElementById('2p2Y');
                Text.innerHTML = parseFloat(parts[1])
            } else if (parts[0].trim().startsWith('2p3Y')) {
                var Text = document.getElementById('2p3Y');
                Text.innerHTML = parseFloat(parts[1])
            } else if (parts[0].trim().startsWith('2p4Y')) {
                var Text = document.getElementById('2p4Y');
                Text.innerHTML = parseFloat(parts[1])
            }

            //third points
            if (parts[0].trim().startsWith('3p1X')) {
                var Text = document.getElementById('3p1X');
                Text.innerHTML = parseFloat(parts[1])
            } else if (parts[0].trim().startsWith('3p2X')) {
                var Text = document.getElementById('3p2X');
                Text.innerHTML = parseFloat(parts[1])
            } else if (parts[0].trim().startsWith('3p3X')) {
                var Text = document.getElementById('3p3X');
                Text.innerHTML = parseFloat(parts[1])
            } else if (parts[0].trim().startsWith('3p4X')) {
                var Text = document.getElementById('3p4X');
                Text.innerHTML = parseFloat(parts[1])
            }

            if (parts[0].trim().startsWith('3p1Y')) {
                var Text = document.getElementById('3p1Y');
                Text.innerHTML = parseFloat(parts[1])
            } else if (parts[0].trim().startsWith('3p2Y')) {
                var Text = document.getElementById('3p2Y');
                Text.innerHTML = parseFloat(parts[1])
            } else if (parts[0].trim().startsWith('3p3Y')) {
                var Text = document.getElementById('3p3Y');
                Text.innerHTML = parseFloat(parts[1])
            } else if (parts[0].trim().startsWith('3p4Y')) {
                var Text = document.getElementById('3p4Y');
                Text.innerHTML = parseFloat(parts[1])
            }

            //forth points
            if (parts[0].trim().startsWith('4p1X')) {
                var Text = document.getElementById('4p1X');
                Text.innerHTML = parseFloat(parts[1])
            } else if (parts[0].trim().startsWith('4p2X')) {
                var Text = document.getElementById('4p2X');
                Text.innerHTML = parseFloat(parts[1])
            } else if (parts[0].trim().startsWith('4p3X')) {
                var Text = document.getElementById('4p3X');
                Text.innerHTML = parseFloat(parts[1])
            } else if (parts[0].trim().startsWith('4p4X')) {
                var Text = document.getElementById('4p4X');
                Text.innerHTML = parseFloat(parts[1])
            }

            if (parts[0].trim().startsWith('4p1Y')) {
                var Text = document.getElementById('4p1Y');
                Text.innerHTML = parseFloat(parts[1])
            } else if (parts[0].trim().startsWith('4p2Y')) {
                var Text = document.getElementById('4p2Y');
                Text.innerHTML = parseFloat(parts[1])
            } else if (parts[0].trim().startsWith('4p3Y')) {
                var Text = document.getElementById('4p3Y');
                Text.innerHTML = parseFloat(parts[1])
            } else if (parts[0].trim().startsWith('4p4Y')) {
                var Text = document.getElementById('4p4Y');
                Text.innerHTML = parseFloat(parts[1])
            }

        }
    }
}

function updateBuildPatten() {
    points.length = 0;
    paths = 0;

    for (let i = 1; i < 5; i++) {

        var pathCheck = document.getElementById('Path' + i)
        console.log(pathCheck.checked + pathCheck.id)

        if (pathCheck.checked === true) {
            paths++;
        } else {
            i = 10;
        }

    }

    for (let i = 1; i < paths + 1; i++) {

        for (let j = 1; j < 5; j++) {

            var pathCheck = document.getElementById(i + 'p' + j + 'tick')

            console.log(pathCheck.checked + pathCheck.id)

            if (pathCheck.checked === true) {
            } else {
                points.push(j - 1)
                j = 10;
            }

            if (j === 4 && pathCheck.checked === true) {
                points.push(j)

            }
        }
    }

    console.log(paths)
    console.log(points)
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

function createPointsStatic() {

    deletePointsStatic();

    var dropZone = document.getElementById("drop_zone");

    for (var i = 0; i < xpoints.length; i++) {
        var point = document.createElement("div");
        point.className = "pointStatic";
        point.style.top = -((xpoints[i] * 0.109)) + 42.8 + "vw";
        point.style.left = (ypoints[i] * 0.109) + 3.5 + "vw";
        dropZone.appendChild(point);

        createdPointsStatic.push(point);
    }

}

function deletePointsStatic() {
    var dropZone = document.getElementById("drop_zone");
    createdPointsStatic.forEach(function (pointStatic) {
        dropZone.removeChild(pointStatic);
    });
    createdPointsStatic = [];
}
