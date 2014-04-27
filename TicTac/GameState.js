function GameState(size) {
	this.nextMove = 'x';

	this.gameFinished = false;
	this.winner = '';
	this.winningLine = null;

	this.gravityDir = 'd';

	this.gameBoard = new Array();
	for(var i=0; i < size; i++) {
		var row = new Array();
		for(var j=0; j < size; j++) {
			row.push('');
		}
		this.gameBoard.push(row);
	}

	console.log('Game state initiated');
}

// GameState.prototype.temp = "2";
// GameState.prototype.gameBoard = [];

GameState.prototype.changeGravityDir = function(gravityDir) {

	if(!this.gameFinished) {
		this.gravityDir = gravityDir;
	}
	
	this.completeTurn();
}

GameState.prototype.addPiece = function(x, y) {

	if(!this.gameFinished) {

		if(this.gameBoard[x][y] == '') {
			console.log('Adding piece [' + this.nextMove + '] at (' + x + ',' + y + ')');
			this.gameBoard[x][y] = this.nextMove;

			this.completeTurn();
		}
	}
}

GameState.prototype.applyGravity = function() {

	//Iterate through each 'line' (could be a column or row)
	for(var i=0; i < this.gameBoard.length; i++) {
		var currentLine = new Array();
		//For each line, collect all elements from 'top to bottom' (in dir'n of gravity)
		for(var j=this.gameBoard.length - 1; j >= 0; j--) {
			var coords = getCoordinatesWithGravity(i,j,this.gameBoard.length,this.gravityDir);
			if(this.gameBoard[coords.x][coords.y] != '') {
				currentLine.push(this.gameBoard[coords.x][coords.y]);
			}
		}

		// Clear the line
		for(var j=0; j < this.gameBoard.length; j++) {
			var coords = getCoordinatesWithGravity(i,j,this.gameBoard.length,this.gravityDir);
			this.gameBoard[coords.x][coords.y] = '';
		}

		// Add back in all of the elements, now compressed in the direction of gravity.
		for(var k=0; k < currentLine.length; k++) {
			var coords = getCoordinatesWithGravity(i,this.gameBoard.length - 1 - k,this.gameBoard.length,this.gravityDir);
			this.gameBoard[coords.x][coords.y] = currentLine[k];
		}
	}
}

GameState.prototype.removePiece = function(x,y) {
	console.log('Removing piece [' + this.gameBoard[x][y] +'] at (' + x + ',' + y + ')');
	this.gameBoard[x][y] = '';
}

GameState.prototype.completeTurn = function() {

	this.applyGravity();

	winnerInfo = this.checkForWin();
	this.winner = winnerInfo.winner;

	if (this.winner != '') {
		this.gameFinished = true;
		this.winningLine = winnerInfo.winningLine ? winnerInfo.winningLine : null;
	}

	this.nextMove = this.nextMove == 'x' ? 'o' : 'x';
}

GameState.prototype.checkForWin = function() {

	var gameFinished = false;
	var gameWinner = '';
	var winningLine = null;

	//Check Columns:
	for(var i=0; i < this.gameBoard.length; i++) {
		var firstSpotPiece = this.gameBoard[i][0];
		if(firstSpotPiece != '') {
			var completeColumn = true;
			for (var j=0; j < this.gameBoard.length; j++) {
				if(this.gameBoard[i][j] != firstSpotPiece) {
					completeColumn = false;
					break;
				}
			}
			if(completeColumn) {
				gameFinished = true;
				gameWinner = firstSpotPiece;
				winningLine = new Line(new Coordinate(i,0), new Coordinate(i, this.gameBoard.length-1));
			}
		}
	}

	//Check Rows:
	for(var i=0; i < this.gameBoard.length; i++) {
		var firstSpotPiece = this.gameBoard[0][i];
		if(firstSpotPiece != '') {
			var completeRow = true;
			for (var j=0; j < this.gameBoard.length; j++) {
				if(this.gameBoard[j][i] != firstSpotPiece) {
					completeRow = false;
					break;
				}
			}
			if(completeRow) {
				gameFinished = true;
				gameWinner = firstSpotPiece;
				winningLine = new Line(new Coordinate(0,i), new Coordinate(this.gameBoard.length-1, i));
			}
		}
	}

	//Check Diagonal Top Right-> Bottom Left
	var firstSpotPiece = this.gameBoard[0][0];
	if(firstSpotPiece != '') {
		var completeDiag = true;
		for(var i=0; i < this.gameBoard.length; i++) {
			if(this.gameBoard[i][i] != firstSpotPiece) {
				completeDiag = false;
				break;
			}
		}
		if(completeDiag) {
			gameFinished = true;
			gameWinner = firstSpotPiece;
			winningLine = new Line(new Coordinate(0,0), new Coordinate(this.gameBoard.length-1, this.gameBoard.length-1));
		}
	}

	//Check Diagonal Top Left-> Bottom Right
	var firstSpotPiece = this.gameBoard[0][this.gameBoard.length-1];
	if(firstSpotPiece != '') {
		var completeDiag = true;
		for(var i=0; i < this.gameBoard.length; i++) {
			if(this.gameBoard[i][this.gameBoard.length - 1 - i] != firstSpotPiece) {
				completeDiag = false;
				break;
			}
		}
		if(completeDiag) {
			gameFinished = true;
			gameWinner = firstSpotPiece;
			winningLine = new Line(new Coordinate(0,this.gameBoard.length-1), new Coordinate(this.gameBoard.length-1, 0));
		}
	}

	//Check for Ties
	if(gameWinner == '') {
		var emptySpot = false;
		for(var i = 0; i < this.gameBoard.length; i++) {
			for(var j = 0; j < this.gameBoard.length; j++) {
				if(this.gameBoard[i][j] == '') {
					emptySpot = true;
				}
			}
		}

		if(!emptySpot) {
			gameWinner = 't';
		}
	}
	
	var winnerInfo = {
		"winner": gameWinner,
		"winningLine": winningLine
	};
	return winnerInfo;
}

//Log Current Board State
GameState.prototype.logBoardState = function() {
	console.log('Game Board:');
	for(var i=0; i < 3; i++) {
		var curLine = "";
		for(var j=0; j < 3; j++) {
			curPiece = this.gameBoard[j][i];
			curLine += (curPiece == '') ? '.' : curPiece;
		}
		console.log(curLine);
	}
}

function getCoordinatesWithGravity(x,y,gameBoardLength,gravityDir) {
	var coordinate = new Coordinate();
	switch(gravityDir) {
		case 'd':
			coordinate.x = x;
			coordinate.y = y;
			break;
		case 'u':
			coordinate.x = x;
			coordinate.y = gameBoardLength -1 -y;
			break;
		case 'l':
			coordinate.x = gameBoardLength -1 -y;
			coordinate.y = gameBoardLength -1 -x;
			break;
		case 'r':
			coordinate.x = y;
			coordinate.y = x;
			break;
	}

	return coordinate;
}

function Coordinate(x,y) {
	this.x = x;
	this.y = y;
}

function Line(startPos, endPos) {
	this.startPos = startPos;
	this.endPos = endPos;
}