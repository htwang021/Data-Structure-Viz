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


var LINKED_LIST_START_X = 100;
var LINKED_LIST_START_Y = 200;
var LINKED_LIST_ELEM_WIDTH = 70;
var LINKED_LIST_ELEM_HEIGHT = 30;

var LINKED_LIST_INSERT_X = 200;
var LINKED_LIST_INSERT_Y = 100;

var SIZE = DEFAULT_CAPACITY;

var LINKED_LIST_ELEMS_PER_LINE = SIZE+1; //one spot reserved for terminal node
var LINKED_LIST_ELEM_SPACING = 100;
var LINKED_LIST_LINE_SPACING = 100;

var TOP_POS_X = 100;
var TOP_POS_Y = 110;

var TOP_LABEL_X = 60;
var TOP_LABEL_Y =  110;

var SIZE_X_ADJUSTMENT = 200;

var TOP_ELEM_WIDTH = 30;
var TOP_ELEM_HEIGHT = 30;

var TAIL_POS_X = 180;
var TAIL_LABEL_X = 130;

var PUSH_LABEL_X = 100;
var PUSH_LABEL_Y = 40;

var PUSH_ELEMENT_X = 180;
var PUSH_ELEMENT_Y = 40;

var INDEX_COLOR = "#0000FF"

function StackLL_ZHS(am, w, h){
	this.init(am, w, h);
}

StackLL_ZHS.prototype = new Algorithm();
StackLL_ZHS.prototype.constructor = StackLL_ZHS;
StackLL_ZHS.superclass = Algorithm.prototype;

StackLL_ZHS.prototype.init = function(am, w, h){
	StackLL_ZHS.superclass.init.call(this, am, w, h);
	this.addControls();
	this.nextIndex = 0;
	this.commands = [];
	this.setup();
	this.initialIndex = this.nextIndex;
}

StackLL_ZHS.prototype.addControls =  function(){
	this.controls = [];
	this.pushField = addControlToAlgorithmBar("Text",nextRandInt() );
	this.pushField.onkeydown = this.returnSubmit(this.pushField,  this.pushCallback.bind(this), 6);

	this.pushButton = addControlToAlgorithmBar("Button", "Push");
	this.pushButton.onclick = this.pushCallback.bind(this);

	this.controls.push(this.pushField);
	this.controls.push(this.pushButton);

	this.peekButton = addControlToAlgorithmBar("Button", "Peek");
	this.peekButton.onclick = this.peekCallback.bind(this);
	this.controls.push(this.peekButton);

	this.popButton = addControlToAlgorithmBar("Button", "Pop");
	this.popButton.onclick = this.popCallback.bind(this);
	this.controls.push(this.popButton);

	this.clearButton = addControlToAlgorithmBar("Button", "Clear Stack");
	this.clearButton.onclick = this.clearCallback.bind(this);
	this.controls.push(this.clearButton);
}

StackLL_ZHS.prototype.enableUI = function(event){
	for (var i = 0; i < this.controls.length; i++){
		this.controls[i].disabled = false;
	}
}

StackLL_ZHS.prototype.disableUI = function(event){
	for (var i = 0; i < this.controls.length; i++){
		this.controls[i].disabled = true;
	}
}

StackLL_ZHS.prototype.setup = function(){
	this.top = 0;

	this.linkedListElemID = new Array(SIZE);
	this.arrayData = new Array(SIZE);
	for (var i = 0; i < SIZE; i++){
		this.linkedListElemID[i]= this.nextIndex++;
		this.arrayData[i]= null;
	}

	this.headID = this.nextIndex++;
	this.headLabelID = this.nextIndex++;
	this.cmd("CreateLabel", this.headLabelID, "Top", TOP_LABEL_X, TOP_LABEL_Y);
	this.cmd("CreateRectangle", this.headID, "", TOP_ELEM_WIDTH, TOP_ELEM_HEIGHT, TOP_POS_X, TOP_POS_Y);

	this.sizeID = this.nextIndex++;
	this.sizeLabelID = this.nextIndex++;
	this.cmd("CreateLabel", this.sizeLabelID, "Size", TOP_POS_X + SIZE_X_ADJUSTMENT, TOP_POS_Y);
	this.cmd("CreateRectangle", this.sizeID, "0", TOP_ELEM_WIDTH, TOP_ELEM_HEIGHT, TOP_POS_X +SIZE_X_ADJUSTMENT+40, TOP_POS_Y);

	this.leftoverLabelID = this.nextIndex++;
	this.cmd("CreateLabel", this.leftoverLabelID, "", TOP_POS_X +SIZE_X_ADJUSTMENT+50,PUSH_LABEL_Y);
	this.cmd("SetForegroundColor", this.leftoverLabelID,INDEX_COLOR);

	this.cmd("CreateLinkedList",this.linkedListElemID[this.top], "null" ,LINKED_LIST_ELEM_WIDTH, LINKED_LIST_ELEM_HEIGHT,
		LINKED_LIST_START_X, LINKED_LIST_START_Y, 0.25, 0, 1, 1);
	this.cmd("SetNull", this.linkedListElemID[this.top], 1);
	this.cmd("connect", this.headID, this.linkedListElemID[this.top]);

	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();
}

StackLL_ZHS.prototype.reset = function(){
	this.top = 0;
	this.nextIndex = this.initialIndex;
	this.arrayData = new Array(SIZE);
	for (var i = 0; i < SIZE; i++){
		this.arrayData[i] = null;
	}
}

StackLL_ZHS.prototype.resetLinkedListPositions = function(){
	for (var i = this.top; i >= 0; i--){
		var nextX = (this.top-i) * LINKED_LIST_ELEM_SPACING + LINKED_LIST_START_X;
		var nextY = LINKED_LIST_START_Y;
		this.cmd("Move", this.linkedListElemID[i], nextX, nextY);
	}
}

StackLL_ZHS.prototype.peekCallback = function(event){
	this.implementAction(this.peek.bind(this), "");
}

StackLL_ZHS.prototype.peek = function(){
	this.commands = new Array();

	if (this.top == 0){
		this.cmd("SetText", this.leftoverLabelID, "Can't peek on an empty stack");
		this.cmd("Step");
		return this.commands;
	}
	var labPopID = this.nextIndex++;
	var labPopValID = this.nextIndex++;
	this.cmd("SetText", this.leftoverLabelID, "");
	this.cmd("CreateLabel", labPopID, "Peeking at stack ", PUSH_LABEL_X, PUSH_LABEL_Y);
	this.cmd("SetForegroundColor", labPopID, INDEX_COLOR);
	this.cmd("CreateLabel", labPopValID,this.arrayData[this.top],
			LINKED_LIST_START_X, LINKED_LIST_START_Y);
	this.cmd("Step");
	this.cmd("Move", labPopValID,  PUSH_ELEMENT_X, PUSH_ELEMENT_Y);
	this.cmd("Step");
	this.cmd("Delete", labPopValID)
	this.cmd("Delete", labPopID);
	this.cmd("Step");
	this.cmd("SetText", this.leftoverLabelID, "");
	return this.commands;
}

StackLL_ZHS.prototype.pushCallback = function(event){
	if (this.top == SIZE-1){
		alert ("This shouldn't happen but due to my limited ability, I am out of memory and can't fit more nodes. Please start over.");
	}
	else{
		if (this.pushField.value != "" ){
			var pushVal = this.pushField.value;
			this.implementAction(this.push.bind(this), pushVal);
		  this.pushField.value = nextRandInt();
		}
	}
}

StackLL_ZHS.prototype.push = function(elemToPush){
	this.commands = new Array();

	var labPushID = this.nextIndex++;
	var labPushValID = this.nextIndex++;

	this.top = this.top + 1;

	this.arrayData[this.top] = elemToPush;

	this.cmd("SetText", this.leftoverLabelID, "");
	this.cmd("CreateLabel", labPushID, "Pushing Value: ", PUSH_LABEL_X, PUSH_LABEL_Y);
	this.cmd("SetForegroundColor", labPushID, INDEX_COLOR);
	this.cmd("CreateLabel", labPushValID,elemToPush, PUSH_ELEMENT_X, PUSH_ELEMENT_Y);
	this.cmd("Step");

	this.cmd("CreateLinkedList",this.linkedListElemID[this.top], "" ,LINKED_LIST_ELEM_WIDTH, LINKED_LIST_ELEM_HEIGHT,
		LINKED_LIST_INSERT_X, LINKED_LIST_INSERT_Y, 0.25, 0, 1, 1);
	this.cmd("Move", labPushValID, LINKED_LIST_INSERT_X, LINKED_LIST_INSERT_Y);
	this.cmd("Step");

	this.cmd("SetText", this.linkedListElemID[this.top], elemToPush);
	this.cmd("Delete", labPushValID);
	this.cmd("Connect",  this.linkedListElemID[this.top], this.linkedListElemID[this.top-1]);
	this.cmd("Step");

	this.cmd("Disconnect", this.headID, this.linkedListElemID[this.top-1]);
	this.cmd("Connect", this.headID, this.linkedListElemID[this.top]);
	this.cmd("Step");

	this.cmd("SetHighlight", this.sizeID, 1);
	this.cmd("Step");
	this.cmd("SetText", this.sizeID, this.top)
	this.cmd("Step");
	this.cmd("SetHighlight", this.sizeID, 0);
	this.cmd("Step");

	this.resetLinkedListPositions();
	this.cmd("Delete", labPushID);
	this.cmd("Step");
	this.cmd("SetText", this.leftoverLabelID, "");
	return this.commands;
}

StackLL_ZHS.prototype.popCallback = function(event){
	this.implementAction(this.pop.bind(this), "");
}

StackLL_ZHS.prototype.pop = function(){
	this.commands = new Array();

	if (this.top == 0){
		this.cmd("SetText", this.leftoverLabelID, "Can't pop from an empty stack");
		this.cmd("Step");;
		return this.commands;
	}

	var labPopID = this.nextIndex++;
	var labPopValID = this.nextIndex++;

	this.cmd("SetText", this.leftoverLabelID, "");
	this.cmd("CreateLabel", labPopID, "Popped Value: ", PUSH_LABEL_X, PUSH_LABEL_Y);
	this.cmd("SetForegroundColor", labPopID, INDEX_COLOR);
	this.cmd("CreateLabel", labPopValID,this.arrayData[this.top],
			LINKED_LIST_START_X, LINKED_LIST_START_Y);
	this.cmd("Step");

	this.cmd("Move", labPopValID,  PUSH_ELEMENT_X, PUSH_ELEMENT_Y);
	this.cmd("Step");

	this.cmd("Disconnect", this.headID, this.linkedListElemID[this.top]);
	this.cmd("Connect", this.headID, this.linkedListElemID[this.top-1]);
	this.cmd("Step");

	this.top = this.top - 1;
	this.cmd("SetHighlight", this.sizeID, 1);
	this.cmd("Step");
	this.cmd("SetText", this.sizeID, this.top)
	this.cmd("Step");
	this.cmd("SetHighlight", this.sizeID, 0);
	this.cmd("Delete", this.linkedListElemID[this.top+1]);
	this.cmd("Step");
	this.resetLinkedListPositions();

	this.cmd("Delete", labPopValID)
	this.cmd("Delete", labPopID);
	this.cmd("SetText", this.leftoverLabelID, "Popped Value: " + this.arrayData[this.top]);
	this.cmd("Step");
	this.cmd("SetText", this.leftoverLabelID, "");
	return this.commands;
}

StackLL_ZHS.prototype.clearCallback = function(event){
	this.implementAction(this.clearAll.bind(this), "");
}

StackLL_ZHS.prototype.clearAll = function(){
	this.commands = new Array();
	for (var i = 0; i <= this.top; i++){
		this.cmd("Delete", this.linkedListElemID[i]);
	}
	this.arrayData = new Array(SIZE);
	for (var i = 0; i < SIZE; i++){
		this.arrayData[i] = null;
	}
	this.top = 0;
	this.cmd("SetText", this.sizeID, this.top);
	this.cmd("CreateLinkedList",this.linkedListElemID[this.top], "null" ,LINKED_LIST_ELEM_WIDTH, LINKED_LIST_ELEM_HEIGHT,
		LINKED_LIST_START_X, LINKED_LIST_START_Y, 0.25, 0, 1, 1);
	this.cmd("SetNull", this.linkedListElemID[this.top], 1);
	this.cmd("connect", this.headID, this.linkedListElemID[this.top]);
	this.resetLinkedListPositions();
	this.cmd("SetText", this.leftoverLabelID, "Stack cleared");
	return this.commands;
}

var currentAlg;

function init(){
	var animManag = initCanvas();
	currentAlg = new StackLL_ZHS(animManag, canvas.width, canvas.height);
}
