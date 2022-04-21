let btn = document.getElementById("btn");
let findAllBtn = document.getElementById("findAllBtn");
let drawAgainBtn = document.getElementById("drawAgainBtn");
let nodeId = document.getElementById("nodeId");
let output = document.getElementById("output");
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

const numRows = 10;
const numCols = 10;



// VARIABLES FOR ANCHORS, RADIUS and DISTANCE DISTORTION, default 10A, 30R, 5E
const numAnchors = 10;
const radius = (c.width / 100) * 30; // 150, 30 percent of 500



// 1 distance = 50 px radius
const fixedDistance = radius / 50;
const arr = [];
const anchorNodes = [];
let normalNodes = [];
let found = 0;
let sumDistances = 0;


let testArray = [];
for (let i = 0; i < 100; i++) {
    testArray.push(Math.abs(Math.random(1) - 0.5));
}



//Create an array with 10 random indexes between 0-100
//This array is used for location of the anchor nodes
function createRandomArray() {
    const randomArr = [];
    while (randomArr.length < numAnchors) {
        let r = Math.floor(Math.random() * 100);
        if (randomArr.indexOf(r) === -1) randomArr.push(r);
    }
    return randomArr;
}

//Create an array filled with base stats
//Create the anchors
//Divide anchors and normal nodes in separate lists
function createBaseStatArray(randomArr) {
    let index = 0;
    for (let i = 0; i < numRows; i++) {
        arr[i] = [];
        for (let j = 0; j < numCols; j++) {
            index = i * 10 + j;
            let isAnchor = randomArr.includes(index) ? true : false; // check if anchor
            arr[i][j] = { id: index, x: (i + testArray[index]), y: (j + testArray[index - i]), isAnchor, found: false, xP: -1, yP: -1, inRange: [] }; // add to array
            isAnchor ? anchorNodes.push(arr[i][j]) : normalNodes.push(arr[i][j]); // divide anchors and normal nodes
        }
    }
}


//Checks each node if the node is in range of an anchor.
//If the node is in range of some anchors, push those anchors in a list that represents all the anchors that are
// in range of that node
function checkRange() {
    normalNodes.forEach(normalNode => {
        normalNode.inRange = [];
        anchorNodes.forEach(anchorNode => {
            let distance = Math.sqrt(Math.pow((normalNode.x - anchorNode.x), 2) + Math.pow((normalNode.y - anchorNode.y), 2));
            if (distance <= fixedDistance) {
                normalNode.inRange.push({ id: anchorNode.id, position: { x: anchorNode.x, y: anchorNode.y, distance} });
            }
        });

    });
}


function drawCanvas() {
    //Fill the circles in the array using canvas
    //Red circles are normal nodes, blue circles are anchor nodes
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            
            ctx.beginPath();
            //ctx.rect(i * 30 + 25, j * 30 + 25, 10, 10);
            ctx.arc(arr[i][j].x * (c.width / 10) + c.width / 50, arr[i][j].y * c.width / 10 + c.width / 50, 8, 0, 2 * Math.PI); //context.arc(x,y,r,startAngle,endAngle);

            //if the node is an anchor node, make the background blue and make a circle around it
            //if the node is normal node, make the background red
            if (arr[i][j].isAnchor) {
                console.log("anchor");
                ctx.fillStyle = 'blue';
                ctx.fill();
                ctx.beginPath();
                ctx.arc(arr[i][j].x * (c.width / 10) + c.width / 50, arr[i][j].y * c.width / 10 + c.width / 50, radius, 0, 2 * Math.PI); //context.arc(x,y,r,startAngle,endAngle);
                ctx.strokeStyle = 'black';
                ctx.stroke();
            } else {
                ctx.fillStyle = 'red';
                ctx.fill();
            }
            //add text on top of the node
            ctx.fillStyle = 'white';
            ctx.fillText(arr[i][j].id, arr[i][j].x * (c.width / 10) + c.width / 85, arr[i][j].y * c.width / 10 + c.width / 37);
        }
    }
}


function main() {

    const randomArray = createRandomArray();
    createBaseStatArray(randomArray);
    checkRange();
    drawCanvas();
    

}



// find a single node by id
// get trilateration
// display info about node
function findByid(id) {

    console.log(id);
    let node = normalNodes.find(node => node.id == id);
    console.log(node)

    

    //String formatting
    let string = `
    Node #${node.id} with position: (x: ${node.x}, y: ${node.y}) \n
    ${node.inRange.length ? `In range with ${node.inRange.length} ${node.inRange.length == 1 ? 'anchor' : 'anchors'}:
    ${node.inRange.map(anchor => {
        return `\t Anchor #${anchor.id}:
        Position: (x: ${anchor.position.x}, y: ${anchor.position.y})
        Distance: ${anchor.position.distance}
        `
    }).join('')}` : `There are no anchors in range.`} 
    `;

    //Object: ${JSON.stringify(anchor.position).replaceAll('"', '')} \n

    output.innerText = string;
    console.log(node);
    testTril(node);
    drawFound(node);
    nodeId.value = "";
}

function findAll() {
    normalNodes.forEach(node => {
        let {x, y} = testTril(node);
        if (x && y){
            node.x = x;
            node.y = y;
        }
        drawFound(node);
    });
    console.log("Found nodes: ", found);
}

function drawAgain() {
    let anchors = [];
    anchors = normalNodes.filter(node => node.isAnchor);
    normalNodes = normalNodes.filter( node => !node.isAnchor);
    //console.log("Normals", normals);
    anchorNodes.push(...anchors);

    anchors.forEach(anchor => {
        ctx.beginPath();
        ctx.arc(anchor.x * (c.width / 10) + c.width / 50, anchor.y * c.width / 10 + c.width / 50, 8, 0, 2 * Math.PI);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.fillStyle = 'white';
        //ctx.fillText(anchor.id, (Math.floor(anchor.x)) * (c.width / 10) + c.width / 25, (Math.floor(anchor.y)) * c.width / 10 + c.width / 17);
        ctx.fillText(anchor.id, anchor.x * (c.width / 10) + c.width / 85, anchor.y * c.width / 10 + c.width / 37);
    })

    checkRange();
    drawCanvas();

}

function drawFound(node) {
    
        if (node.found) {
            ctx.beginPath();
            ctx.arc(node.x * (c.width / 10) + c.width / 50, node.y * c.width / 10 + c.width / 50, 8, 0, 2 * Math.PI);
            ctx.fillStyle = 'yellow';
            ctx.fill();
            ctx.fillStyle = 'black';
            //ctx.fillText(node.id, (Math.floor(node.x)) * (c.width / 10) + c.width / 25, (Math.floor(node.y)) * c.width / 10 + c.width / 17);
            ctx.fillText(node.id, (node.x) * (c.width / 10) + c.width / 85, node.y * c.width / 10 + c.width / 37);
        }
    
}


btn.addEventListener("click", () => findByid(nodeId.value));
findAllBtn.addEventListener("click", () => findAll());
drawAgainBtn.addEventListener("click", () => drawAgain());



// Trilateration algorithm
function testTril(node) {

    let { inRange } = node;

    if (inRange.length < 3) {
        //console.log("cannot be found");
        return node;
    }


    inRange.sort( (a, b) => a.position.distance - b.position.distance)



    position1 = inRange[0].position;
    position2 = inRange[1].position;
    position3 = inRange[2].position;

    let x1 = position1.x;
    let x2 = position2.x;
    let x3 = position3.x;
    let y1 = position1.y;
    let y2 = position2.y;
    let y3 = position3.y;

    let r1 = position1.distance;
    let r2 = position2.distance;
    let r3 = position3.distance;

    let A = 2 * x2 - 2 * x1
    let B = 2 * y2 - 2 * y1
    let C = r1 ** 2 - r2 ** 2 - x1 ** 2 + x2 ** 2 - y1 ** 2 + y2 ** 2
    let D = 2 * x3 - 2 * x2
    let E = 2 * y3 - 2 * y2
    let F = r2 ** 2 - r3 ** 2 - x2 ** 2 + x3 ** 2 - y2 ** 2 + y3 ** 2
    let x = (C * E - F * B) / (E * A - B * D)
    let y = (C * D - A * F) / (B * D - A * E)


    if (x != -1 && y != -1) {
        node.found = true;
        node.isAnchor = true;
        found++;
    }
    

    //output.innerText += `Location through trilateration for ${node.id} is: (x: ${Math.floor(x, 3)}, y: ${Math.floor(y, 3)}) \n`
    //output.innerText += `Location through trilateration for ${node.id} is: (x: ${x}, y: ${y}) \n`

    //output.innerText += `${node.id} ---- ${node.x.toFixed(5)} --- ${node.y.toFixed(5)} x: ${x.toFixed(5)}, y: ${y.toFixed(5)}) \n`
    output.innerText += `${node.id} ---- ${node.x.toFixed(5) == x.toFixed(5) ? "TRUE" : "FALSE"} --- ${node.y.toFixed(5) == y.toFixed(5) ? "TRUE" : "FALSE"} ---  x: ${x.toFixed(5)}, y: ${y.toFixed(5)} \n`
    //output.innerText += `Location through trilateration for ${node.id} is: (x: ${x}, y: ${y}) \n Distance between: ${distanceBetween} \n`
    
    

    return { x, y };
}

main();




