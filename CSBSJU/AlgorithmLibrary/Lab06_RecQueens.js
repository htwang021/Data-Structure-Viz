// Copyright 2011 David Galles, University of San Francisco. All rights reserved.
//
// Redistribution and use in source and binary forms, with or without modification, are
// permitted provided that the following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice, this list of
// conditions and the following disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright notice, this list
// of conditions and the following disclaimer in the documentation and/or other materials
// provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY <COPYRIGHT HOLDER> ``AS IS'' AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
// FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> OR
// CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
// ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
// ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
// The views and conclusions contained in the software and documentation are those of the
// authors and should not be interpreted as representing official policies, either expressed
// or implied, of the University of San Francisco


function Queens(am, w, h){
	this.init(am, w, h);
}

Queens.prototype = new Recursive();
Queens.prototype.constructor = Queens;
Queens.superclass = Recursive.prototype;

Queens.CALC_QUEENS_ACTIVATION_FIELDS = ["  board size  "];
Queens.QUEENS_ACTIVATION_FIELDS = ["  currentColumn  ", "  currentRow  "];
Queens.CHECK_ACTIVATION_FIELDS = [ "  column  ", "  row  "];

Queens.RECURSIVE_DELTA_Y_CALC_QUEEN = Queens.CALC_QUEENS_ACTIVATION_FIELDS.length * Recursive.ACTIVATION_RECORD_HEIGHT;
Queens.RECURSIVE_DELTA_Y_QUEEN = Queens.QUEENS_ACTIVATION_FIELDS.length * Recursive.ACTIVATION_RECORD_HEIGHT;
Queens.RECURSIVE_DELTA_Y_CHECK = Queens.CHECK_ACTIVATION_FIELDS.length * Recursive.ACTIVATION_RECORD_HEIGHT;

Queens.ACTIVATION_RECORT_START_X = 450;
Queens.ACTIVATION_RECORT_START_Y = 60;

Queens.INTERNAL_BOARD_START_X = 500;
Queens.INTERNAL_BOARD_START_Y = 90;
Queens.INTERNAL_BOARD_WIDTH = 20;
Queens.INTERNAL_BOARD_HEIGHT = 20;

Queens.LOGICAL_BOARD_START_X = Queens.INTERNAL_BOARD_START_X;
Queens.LOGICAL_BOARD_START_Y = Queens.INTERNAL_BOARD_START_Y + Queens.INTERNAL_BOARD_HEIGHT * 1.5;
Queens.LOGICAL_BOARD_WIDTH = Queens.INTERNAL_BOARD_WIDTH;
Queens.LOGICAL_BOARD_HEIGHT = Queens.INTERNAL_BOARD_HEIGHT;
Queens.ACTIVATION_RECORD_SPACING = 400;

Queens.INDEX_COLOR = "#0000FF";
Queens.PINKISH_COLOR = "#F5D1D6";
Queens.WHITE_COLOR = "#FFFFFF";

Queens.prototype.init = function(am, w, h){
	Queens.superclass.init.call(this, am, w, h);
	this.nextIndex = 0;
	this.addControls();
	this.code = Queens.CODE;
	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();
	this.initialIndex = this.nextIndex;
	this.oldIDs = [];
	this.commands = [];
}

Queens.prototype.addControls =  function(){
	this.controls = [];
	addLabelToAlgorithmBar("Board size:  (1-8)");

	this.sizeField = addControlToAlgorithmBar("Text", 4);
	this.sizeField.onkeydown = this.returnSubmit(this.sizeField,  this.queensCallback.bind(this), 2, true);
	this.controls.push(this.sizeField);

	this.queensButton = addControlToAlgorithmBar("Button", "Play N Queens");
	this.queensButton.onclick = this.queensCallback.bind(this);
	this.controls.push(this.queensButton);
}

Queens.prototype.queensCallback = function(event){
	var queensValue;
	if (this.sizeField.value != ""){
		var queenSize =  parseInt(this.sizeField.value);
		queenSize = Math.min(queenSize, 8);
		this.sizeField.value = String(queenSize);
		this.implementAction(this.doQueens.bind(this),queenSize);
	}
}

Queens.prototype.doQueens = function(size){
	this.commands = [];
	this.clearOldIDs();
	this.boardData = new Array(size);
	this.boardInternalID = new Array(size);
	this.boardLogicalID = new Array(size);
	this.boardInternalIndexID = new Array(size);
	this.currentY = Queens.ACTIVATION_RECORT_START_Y;
	this.currentX = Queens.ACTIVATION_RECORT_START_X;
	this.activationLeft = true;
	var activationRec = this.createActivation("***NQueens***", Queens.CALC_QUEENS_ACTIVATION_FIELDS,
				this.currentX, this.currentY, this.activationLeft);
	this.currentY += Queens.RECURSIVE_DELTA_Y_CALC_QUEEN;
	this.cmd("SetText", activationRec.fieldIDs[0], size);
	this.cmd("Step");

	for (var i = 0; i < size; i++){
		this.boardInternalID[i] = this.nextIndex++;
		this.oldIDs.push(this.boardInternalID[i])
		this.cmd("CreateRectangle", this.boardInternalID[i],
				 "-1",
				 Queens.INTERNAL_BOARD_WIDTH,
				 Queens.INTERNAL_BOARD_HEIGHT,
				 Queens.INTERNAL_BOARD_START_X  + (i +5) * Queens.INTERNAL_BOARD_WIDTH,
				 Queens.INTERNAL_BOARD_START_Y);

		this.boardInternalIndexID[i] = this.nextIndex++;
		this.oldIDs.push(this.boardInternalIndexID[i]);
		this.cmd("CreateLabel", this.boardInternalIndexID[i], i,Queens.INTERNAL_BOARD_START_X  + (i +5) * Queens.INTERNAL_BOARD_WIDTH,
				 Queens.INTERNAL_BOARD_START_Y - Queens.INTERNAL_BOARD_HEIGHT);
		this.cmd("SetForegroundColor", this.boardInternalIndexID[i], Queens.INDEX_COLOR);

		this.boardLogicalID[i] = new Array(size);
		for (var j = 0; j < size; j++){
			this.boardLogicalID[i][j] = this.nextIndex++;
			this.oldIDs.push(this.boardLogicalID[i][j]);

			this.cmd("CreateRectangle", this.boardLogicalID[i][j],
					 "",
					 Queens.LOGICAL_BOARD_WIDTH,
					 Queens.LOGICAL_BOARD_HEIGHT,
					 Queens.LOGICAL_BOARD_START_X  + (j+5) * Queens.LOGICAL_BOARD_WIDTH,
					 Queens.LOGICAL_BOARD_START_Y  + i * Queens.LOGICAL_BOARD_HEIGHT);
		}
	}
	board = new Array(size);
	this.cmd("Step");
	this.queens(board, 0, size);
	this.cmd("Delete", this.nextIndex);
	this.deleteActivation(activationRec);
	return this.commands;
}

Queens.prototype.queens = function(board, current, size){
	var oldX  = this.currentX;
	var oldY = this.currentY;
	var oldLeft = this.activationLeft;
	var activationRec = this.createActivation("***placeQueens***", Queens.QUEENS_ACTIVATION_FIELDS,
					this.currentX, this.currentY, this.activationLeft);
	this.cmd("SetText", activationRec.fieldIDs[0], current);
	this.currentY += Queens.RECURSIVE_DELTA_Y_QUEEN;
	if (this.currentY + Queens.RECURSIVE_DELTA_Y_QUEEN > this.canvasHeight){
		this.currentY =  Queens.ACTIVATION_RECORT_START_Y;
		this.currentX += Queens.ACTIVATION_RECORD_SPACING;
		this.activationLeft = false;
	}

	if (current == size){
		this.cmd("Step");
		this.deleteActivation(activationRec);
		this.cmd("Step");
		this.currentX = oldX;
		this.currentY = oldY;
		this.activationLeft = oldLeft;
		this.cmd("CreateLabel", this.nextIndex, "We've placed all the queens!\nplaceQueens returns TRUE", this.currentX, this.currentY);
		this.cmd("SetForegroundColor", this.nextIndex, Recursive.CODE_HIGHLIGHT_COLOR);
		return true;
	}

	for (var i = 0; i < size; i++)	{
		board[current] = i;
		this.cmd("SetText", activationRec.fieldIDs[1], i);
		this.cmd("SetText", this.boardLogicalID[i][current], "Q");
		this.cmd("SetText", this.boardInternalID[current], i);
		this.cmd("Step");
		var moveLegal = this.legal(board,current,i);
		this.cmd("Step");
		this.cmd("Delete",this.nextIndex);
		if (moveLegal){
			this.cmd("Step");
			var done = this.queens(board, current+1, size);
			this.cmd("Step");
			this.cmd("Delete", this.nextIndex);
			if (done){
				this.cmd("Step");
				this.currentX = oldX;
				this.currentY = oldY;
				this.activationLeft = oldLeft;
				this.deleteActivation(activationRec);
				this.cmd("CreateLabel", this.nextIndex, "placeQueens returns TRUE " , this.currentX, this.currentY);
				this.cmd("SetForegroundColor", this.nextIndex, Recursive.CODE_HIGHLIGHT_COLOR);
				return true;
			}
		}
		this.cmd("SetText", this.boardLogicalID[i][current], "");
	}
	this.currentX = oldX;
	this.currentY = oldY;
	this.activationLeft = oldLeft;
	this.cmd("Step");
	this.deleteActivation(activationRec);
	this.cmd("Step");

	this.cmd("CreateLabel", this.nextIndex, "placeQueens in column " + (current) + " fails; reconsider queen in previous \ncolumn (or quit if none is left)" , this.currentX, this.currentY);
	this.cmd("SetForegroundColor", this.nextIndex, Recursive.CODE_HIGHLIGHT_COLOR);
	return false;
}

Queens.prototype.legal = function(board, column, row){
	var activationRec = this.createActivation("***isUnderAttack***", Queens.CHECK_ACTIVATION_FIELDS,
				this.currentX, this.currentY, this.activationLeft);
	this.cmd("SetText", activationRec.fieldIDs[0], column);
	this.cmd("SetText", activationRec.fieldIDs[1], row);
	this.cmd("Step")
	var OK = true;
	for (var i = 0; i < column; i++){
		this.cmd("SetBackgroundColor", this.boardLogicalID[board[column]][column], Queens.PINKISH_COLOR);
		this.cmd("SetBackgroundColor", this.boardLogicalID[board[i]][i], Queens.PINKISH_COLOR);
		this.cmd("Step")
		if ((board[i] == board[column]) ||  (column - i == Math.abs(board[column] - board[i]))){
			this.cmd("SetBackgroundColor", this.boardLogicalID[board[column]][column], Recursive.CODE_HIGHLIGHT_COLOR);
			this.cmd("SetBackgroundColor", this.boardLogicalID[board[i]][i], Recursive.CODE_HIGHLIGHT_COLOR);
			this.cmd("Step");
			OK = false;
			break;
		}
		else{
			this.cmd("SetBackgroundColor", this.boardLogicalID[board[column]][column], Queens.WHITE_COLOR);
			this.cmd("SetBackgroundColor", this.boardLogicalID[board[i]][i], Queens.WHITE_COLOR);
			this.cmd("Step");
		}
	}
	this.deleteActivation(activationRec);
	this.cmd("Step");
	this.cmd("CreateLabel", this.nextIndex, "isUnderAttack returns " + String(!OK).toUpperCase(),
				this.currentX, this.currentY);
	this.cmd("SetForegroundColor", this.nextIndex, Recursive.CODE_HIGHLIGHT_COLOR);
	this.cmd("SetBackgroundColor", this.boardLogicalID[board[column]][column], Queens.WHITE_COLOR);
	this.cmd("SetBackgroundColor", this.boardLogicalID[board[i]][i], Queens.WHITE_COLOR);
	return OK;
}

var currentAlg;

function init(){
	var animManag = initCanvas();
	currentAlg = new Queens(animManag, canvas.width, canvas.height);
}
