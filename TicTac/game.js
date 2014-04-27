var currentGame = null;

$(document).ready(function() {

	document.getElementById('buttonNewGame').addEventListener('click', function(e) {newGame(e);}, false);
	newGame();

})

function newGame() {

	if(currentGame != null) {
		clearInterval(currentGame.gameLoop);
	}

	var canvas = document.getElementById('gameCanvas');
	currentGame = new Game(canvas, 10, 10, 80, 5);
	currentGame.gameState.logBoardState();
}

function Game(canvas, xPos, yPos, cellSize, gameSize) {

	var self = this;

	this.canvas = canvas;
	this.canvasContext = this.canvas.getContext('2d');
	this.canvasWidth = this.canvas.width;
	this.canvasHeight = this.canvas.height;
	this.xPos = xPos;
	this.yPos = yPos;
	this.cellSize = cellSize;
	this.gameSize = gameSize;
	
	
	this.gameLoop = setInterval(function() {paint(self);}, 60);
	
	// this.canvas.click(function() { console.log('test');})
	this.canvas.addEventListener('click', function(e) {canvasClick(e, self);}, false);
	this.gameState = new GameState(gameSize);

	document.getElementById('buttonLeft').addEventListener('click', function(e) {gravitySwitch(e, self, 'l');}, false);
	document.getElementById('buttonRight').addEventListener('click', function(e) {gravitySwitch(e, self, 'r');}, false);
	document.getElementById('buttonUp').addEventListener('click', function(e) {gravitySwitch(e, self, 'u');}, false);
	document.getElementById('buttonDown').addEventListener('click', function(e) {gravitySwitch(e, self, 'd');}, false);

}

Game.prototype.canvas = null;
Game.prototype.canvasContext = null;

function canvasClick(e, game) {
	var xPos = e.layerX - 10;
	var yPos = e.layerY - 10;
	console.log(xPos + "," + yPos);

	var xCell = Math.floor(xPos / game.cellSize);
	var yCell = Math.floor(yPos / game.cellSize);
	console.log("Click pos: " + xCell + ',' + yCell);

	if(xCell >= 0 && xCell < game.gameSize && yCell >= 0 && yCell < game.gameSize) {
		console.log('piece');
		game.gameState.addPiece(xCell, yCell);
	}
}

function gravitySwitch(e, game, gravityDir) {
	game.gameState.changeGravityDir(gravityDir);
}




function paintCanvas(canvasContext, width, height) {
	canvasContext.fillStyle = "white";
	canvasContext.fillRect(0,0,width,height);

	canvasContext.lineWidth = "1";
	canvasContext.strokeStyle = "black";
	canvasContext.strokeRect(0,0,width,height);
}

function paintBoard(canvasContext, startX, startY, gameState, cellSize, gameSize) {


	var lineLength = cellSize * gameSize;
	
	canvasContext.strokeStyle = "black";
	canvasContext.lineWidth = "2";

	canvasContext.beginPath();

	for(var i=1; i < gameSize; i++) {
		canvasContext.moveTo(startX+(cellSize*i), startY);
		canvasContext.lineTo(startX+(cellSize*i), startY+lineLength);
	}

	for(var i=1; i < gameSize; i++) {
		canvasContext.moveTo(startX, startY+(cellSize*i));
		canvasContext.lineTo(startX+lineLength, startY+(cellSize*i));
	}

	canvasContext.stroke();

	for(var i=0; i < gameSize; i++) {
		for (var j=0; j < gameSize; j++) {
			var xPos = startX + (cellSize * j);
			var yPos = startY + (cellSize * i);
			if(gameState.gameBoard[j][i] == 'x') {
				paintX(canvasContext, xPos, yPos, cellSize);
			} else if (gameState.gameBoard[j][i] == 'o') {
				paintO(canvasContext, xPos, yPos, cellSize);
			}
		}
	}

	if(gameState.gameFinished == true && gameState.winningLine != null) {
		var winStart = gameState.winningLine.startPos;
		var winEnd = gameState.winningLine.endPos;

		canvasContext.strokeStyle = "green";
		canvasContext.lineWidth = "5";
		canvasContext.beginPath();
		canvasContext.moveTo(startX + (cellSize * winStart.x) + (cellSize / 2), startY + (cellSize * winStart.y) + (cellSize / 2));
		canvasContext.lineTo(startX + (cellSize * winEnd.x) + (cellSize / 2), startY + (cellSize * winEnd.y) + (cellSize / 2));
		canvasContext.stroke();

	}
}


function paintX(canvasContext, x, y, cellSize) {

	canvasContext.strokeStyle ="red";
	canvasContext.beginPath();

	canvasContext.moveTo(x+10, y+10);
	canvasContext.lineTo(x+cellSize-10, y+cellSize-10);

	canvasContext.moveTo(x+cellSize-10, y+10);
	canvasContext.lineTo(x+10, y+cellSize-10);

	canvasContext.stroke();

}

function paintO(canvasContext, x, y, cellSize) {
	canvasContext.strokeStyle="blue";

	canvasContext.beginPath();
	canvasContext.arc(x+(cellSize/2),y+(cellSize/2),(cellSize/2)-8,0,2*Math.PI);
	canvasContext.stroke();
}

function paintStatus(canvasContext, x, y, gameState) {
	canvasContext.fillStyle = "#000";
	canvasContext.fillText("Next Move: " + gameState.nextMove, x,y);
	canvasContext.fillText("Gravity: " + gameState.gravityDir, x, y+20);
	canvasContext.fillText("Winner: " + gameState.winner, x,y+40);
}


function paint(game) {

	canvasWidth = (game.gameSize * game.cellSize) + 20;
	canvasHeight = (game.gameSize * game.cellSize) + 100;

	paintCanvas(game.canvasContext, canvasWidth, canvasHeight);
	paintBoard(game.canvasContext, 10,10, game.gameState, game.cellSize, game.gameSize);
	paintStatus(game.canvasContext, 10, game.gameSize * game.cellSize + 50, game.gameState);
}


