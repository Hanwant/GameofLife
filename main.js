
function resizeCanvas(width, height){
    canvas.width=width;
    canvas.height=height;
};

function clearCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};

function getCanvasBuffer(){
    return new Uint32Array(ctx.getImageData(0, 0,
                                            canvas.width, canvas.height).data.buffer);
};

function getCellBuffer(x, y){
    x = x - x%creatureSize;
    y = y - y%creatureSize;
    return new Uint32Array(ctx.getImageData(x, y,
                                            creatureSize, creatureSize).data.buffer);
};

function drawCreature(x, y){
    x = x - x%creatureSize;
    y = y - y%creatureSize;
    ctx.fillRect(x, y, creatureSize, creatureSize);
};

function makeEmptyState(){
    var ncols = Math.floor(canvas.width/creatureSize);
    var nrows = Math.floor(canvas.height/creatureSize);
    state = new Array(ncols);
    for (var i=0; i<ncols; i++){
        state[i]=(new Array(nrows).fill(0));
    }
    return state;
}


function drawCurrentState(){
    clearCanvas();
    for(var i=0; i<currentState.length; i++){
        for (var j=0; j<currentState[0].length; j++){
            if (currentState[i][j] == 1){
                drawCreature(i*creatureSize, j*creatureSize);
            }
        }
    }
}

function isAlive(x, y){
    i = Math.floor(x  / creatureSize);
    j = Math.floor(y  / creatureSize);
    return currentState[i][j];
};

function onMouseClick(ev){
    i = Math.floor(ev.pageX  / creatureSize);
    j = Math.floor(ev.pageY  / creatureSize);
    currentState[i][j] = 1 - currentState[i][j];
    drawCurrentState();


};

function getNeighbourhood(i, j){
    left = Math.max(i-1, 0);
    right = Math.min(i+2, currentState.length);
    up = Math.max(j-1, 0);
    down = Math.min(j+2, currentState[0].length);
    var neighbours = 0;
    for (var x = left; x < right; x++){
        for (var y = up; y < down; y++){
            neighbours += currentState[x][y];
        }
    }
    return ((currentState[i][j]==0) ? neighbours : neighbours-1);
}

function gameStep(){
    for(var i=0; i<currentState.length; i++){
        for (var j=0; j<currentState[0].length; j++){
            neighbours = getNeighbourhood(i, j);
            if (currentState[i][j] == 1){ // alive
                if (neighbours == 2 || neighbours == 3){
                    nextState[i][j] = 1;
                }  else{
                    nextState[i][j] = 0;
                }
            }else{
                if (neighbours == 3){
                    nextState[i][j] = 1;
                }
            }
        }
    }
    currentState = nextState.map(function(arr){return arr.slice();});
}

function onStepClick(){
    gameStep();
    drawCurrentState();
}

function startGame(){
    interval = setInterval("onStepClick()", 500)
    ;
}

function pauseGame(){
    clearInterval(interval);
    interval=null;
}

function resetGame(){
    currentState = makeEmptyState();
    nextState = currentState.slice(0);
    drawCurrentState();
}

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
ctx.fillStyle="gray";

var creatureSize = 32;

var currentState = makeEmptyState();
var nextState = currentState.map(function(arr){return arr.slice();});

drawCreature(256, 256);

canvas.onclick = onMouseClick;

