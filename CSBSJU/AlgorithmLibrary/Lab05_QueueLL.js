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
var LINKED_LIST_START_Y = 270;
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

var TAIL_POS_X = TOP_POS_X ;
var TAIL_LABEL_X = TOP_LABEL_X;

var PUSH_LABEL_X = 100;
var PUSH_LABEL_Y = 40;

var PUSH_ELEMENT_X = 180;
var PUSH_ELEMENT_Y = 40;

var INDEX_COLOR = "#0000FF"

function QueueLL_ZHS(am, w, h){
	this.init(am, w, h);
}

QueueLL_ZHS.prototype = new Algorithm();
QueueLL_ZHS.prototype.constructor = QueueLL_ZHS;
QueueLL_ZHS.superclass = Algorithm.prototype;

QueueLL_ZHS.prototype.init = function(am, w, h){
	QueueLL_ZHS.superclass.init.call(this, am, w, h);
	this.addControls();
	this.nextIndex = 0;
	this.commands = [];
	this.tail_pos_y = h - 2*LINKED_LIST_ELEM_HEIGHT-50;
	this.tail_label_y = this.tail_pos_y;
	this.setup();
	this.initialIndex = this.nextIndex;
}

QueueLL_ZHS.prototype.addControls =  function(){
	this.controls = [];
	this.enqueueField = addControlToAlgorithmBar("Text", nextRandInt());
	this.enqueueField.onkeydown = this.returnSubmit(this.enqueueField,  this.enqueueCallback.bind(this), 6);

	this.enqueueButton = addControlToAlgorithmBar("Button", "Enqueue");
	this.enqueueButton.onclick = this.enqueueCallback.bind(this);

	this.controls.push(this.enqueueField);
	this.controls.push(this.enqueueButton);

	this.peekButton = addControlToAlgorithmBar("Button", "Peek");
	this.peekButton.onclick = this.peekCallback.bind(this);
	this.controls.push(this.peekButton);

	this.dequeueButton = addControlToAlgorithmBar("Button", "Dequeue");
	this.dequeueButton.onclick = this.dequeueCallback.bind(this);
	this.controls.push(this.dequeueButton);

	this.clearButton = addControlToAlgorithmBar("Button", "Clear Stack");
	this.clearButton.onclick = this.clearCallback.bind(this);
	this.controls.push(this.clearButton);
}

QueueLL_ZHS.prototype.enableUI = function(event){
	for (var i = 0; i < this.controls.length; i++){
		this.controls[i].disabled = false;
	}
}

QueueLL_ZHS.prototype.disableUI = function(event){
	for (var i = 0; i < this.controls.length; i++){
		this.controls[i].disabled = true;
	}
}

QueueLL_ZHS.prototype.setup = function(){
		this.rear = 0;
		this.front = 0

		this.linkedListElemID = new Array(SIZE);
		this.arrayData = new Array(SIZE);
		for (var i = 0; i < SIZE; i++){
			this.linkedListElemID[i]= this.nextIndex++;
			this.arrayData[i]= null;
		}

		this.headID = this.nextIndex++;
		this.headLabelID = this.nextIndex++;
		this.cmd("CreateLabel", this.headLabelID, "Front", TOP_LABEL_X, TOP_LABEL_Y+50);
		this.cmd("CreateRectangle", this.headID, "", TOP_ELEM_WIDTH, TOP_ELEM_HEIGHT, TOP_POS_X, TOP_POS_Y+50);

		this.tailID = this.nextIndex++;
		this.tailLabelID = this.nextIndex++;
		this.cmd("CreateLabel", this.tailLabelID, "Rear", TAIL_LABEL_X, this.tail_label_y);
		this.cmd("CreateRectangle", this.tailID, "", TOP_ELEM_WIDTH, TOP_ELEM_HEIGHT, TAIL_POS_X, this.tail_pos_y);

		this.sizeID = this.nextIndex++;
		this.sizeLabelID = this.nextIndex++;
		this.cmd("CreateLabel", this.sizeLabelID, "Size", TOP_POS_X + SIZE_X_ADJUSTMENT, TOP_POS_Y);
		this.cmd("CreateRectangle", this.sizeID, "0", TOP_ELEM_WIDTH, TOP_ELEM_HEIGHT, TOP_POS_X +SIZE_X_ADJUSTMENT+50, TOP_POS_Y);

		this.leftoverLabelID = this.nextIndex++;
		this.cmd("CreateLabel", this.leftoverLabelID, "", TOP_POS_X +SIZE_X_ADJUSTMENT+50,PUSH_LABEL_Y);
		this.cmd("SetForegroundColor", this.leftoverLabelID,INDEX_COLOR);

		this.cmd("CreateLinkedList",this.linkedListElemID[this.rear], "null" ,LINKED_LIST_ELEM_WIDTH, LINKED_LIST_ELEM_HEIGHT,
			LINKED_LIST_START_X, LINKED_LIST_START_Y, 0.25, 0, 1, 1);
		this.cmd("SetNull", this.linkedListElemID[this.rear], 1);
		this.cmd("connect", this.headID, this.linkedListElemID[this.rear]);
		this.cmd("connect", this.tailID, this.linkedListElemID[this.rear]);

		this.animationManager.StartNewAnimation(this.commands);
		this.animationManager.skipForward();
		this.animationManager.clearHistory();
}

QueueLL_ZHS.prototype.reset = function(){
	this.rear = 0;
	this.front = 0;
	this.nextIndex = this.initialIndex;
	this.arrayData = new Array(SIZE);
	for (var i = 0; i < SIZE; i++){
		this.arrayData[i] = null;
	}
}

QueueLL_ZHS.prototype.resetLinkedListPositions = function(){
	for (var i = this.rear; i >= this.front; i--){
		var nextX = (i-this.front) * LINKED_LIST_ELEM_SPACING + LINKED_LIST_START_X;
		var nextY = LINKED_LIST_START_Y;
		this.cmd("Move", this.linkedListElemID[i], nextX, nextY);
	}
	//adjust the rear a bit
	//if(this.rear!=0){
	var nextX = (this.rear-this.front) * LINKED_LIST_ELEM_SPACING + LINKED_LIST_START_X;
	this.cmd("Move", this.tailLabelID, nextX-40, this.tail_label_y);
	this.cmd("Move", this.tailID, nextX, this.tail_pos_y);
	//}
}

QueueLL_ZHS.prototype.peekCallback = function(event){
	this.implementAction(this.peek.bind(this), "");
}

QueueLL_ZHS.prototype.peek = function(){
	this.commands = new Array();

	if (this.rear == this.front){
		this.cmd("SetText", this.leftoverLabelID, "Can't peek on an empty queue");
		this.cmd("Step");
		return this.commands;
	}

	var labPopID = this.nextIndex++;
	var labPopValID = this.nextIndex++;
	this.cmd("SetText", this.leftoverLabelID, "");
	this.cmd("CreateLabel", labPopID, "Peeking at queue ", PUSH_LABEL_X, PUSH_LABEL_Y);
	this.cmd("SetForegroundColor", labPopID, INDEX_COLOR);
	this.cmd("CreateLabel", labPopValID,this.arrayData[this.front],
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

QueueLL_ZHS.prototype.enqueueCallback = function(event){
	if (this.rear == SIZE-1){
		alert ("This shouldn't happen but due to my limited ability, I am out of memory and can't fit more nodes. Please start over.");
	}
	else{
		if (this.enqueueField.value != "" ){
			var pushVal = this.enqueueField.value;
			this.implementAction(this.enqueue.bind(this), pushVal);
			this.enqueueField.value = nextRandInt();
		}
	}
}

QueueLL_ZHS.prototype.enqueue = function(elemToPush){
	this.commands = new Array();

	var labPushID = this.nextIndex++;
	var labPushValID = this.nextIndex++;

	this.arrayData[this.rear] = elemToPush;

	this.cmd("SetText", this.leftoverLabelID, "");
	this.cmd("CreateLabel", labPushID, "Enqueuing Value: ", PUSH_LABEL_X, PUSH_LABEL_Y);
	this.cmd("SetForegroundColor", labPushID, INDEX_COLOR);
	this.cmd("CreateLabel", labPushValID,elemToPush, PUSH_ELEMENT_X, PUSH_ELEMENT_Y);
	this.cmd("Step");

	var destX = this.rear * LINKED_LIST_ELEM_SPACING + LINKED_LIST_START_X;
	var destY = LINKED_LIST_START_Y;
	this.cmd("Move", labPushValID, destX, destY);
	this.cmd("SetText", this.linkedListElemID[this.rear], "")
	this.cmd("Step");

	this.cmd("SetText", this.linkedListElemID[this.rear], elemToPush)
	this.cmd("Delete", labPushValID);

	this.rear = this.rear + 1;
	this.linkedListElemID[this.rear] = this.nextIndex++;
	this.cmd("CreateLinkedList",this.linkedListElemID[this.rear], "null" ,LINKED_LIST_ELEM_WIDTH, LINKED_LIST_ELEM_HEIGHT,
		LINKED_LIST_INSERT_X, LINKED_LIST_INSERT_Y, 0.25, 0, 1, 1);
	this.cmd("SetNull", this.linkedListElemID[this.rear], 1);
	this.cmd("Step");

	this.cmd("SetNull", this.linkedListElemID[this.rear-1], 0);
	this.cmd("Connect",  this.linkedListElemID[this.rear-1], this.linkedListElemID[this.rear]);
	this.cmd("Step");

	this.cmd("Disconnect", this.tailID, this.linkedListElemID[this.rear-1]);
	this.cmd("Connect", this.tailID, this.linkedListElemID[this.rear]);
	this.cmd("Step");

	this.cmd("SetHighlight", this.sizeID, 1);
	this.cmd("Step");
	this.cmd("SetText", this.sizeID, (this.rear-this.front))
	this.cmd("Step");
	this.cmd("SetHighlight", this.sizeID, 0);
	this.cmd("Step");

	this.resetLinkedListPositions();
	this.cmd("Delete", labPushID);
	this.cmd("Step");
	this.cmd("SetText", this.leftoverLabelID, "");
	return this.commands;
}

QueueLL_ZHS.prototype.dequeueCallback = function(event){
	this.implementAction(this.dequeue.bind(this), "");
}

QueueLL_ZHS.prototype.dequeue = function(){
	this.commands = new Array();

	if (this.rear == this.front){
		this.cmd("SetText", this.leftoverLabelID, "Can't dequeue from an empty queue");
		this.cmd("Step");
		return this.commands;
	}
	var labPopID = this.nextIndex++;
	var labPopValID = this.nextIndex++;

	this.cmd("SetText", this.leftoverLabelID, "");
	this.cmd("CreateLabel", labPopID, "Dequeued Value: ", PUSH_LABEL_X, PUSH_LABEL_Y);
	this.cmd("SetForegroundColor", labPopID, INDEX_COLOR);
	this.cmd("CreateLabel", labPopValID,this.arrayData[this.front], LINKED_LIST_START_X,
			LINKED_LIST_START_Y);
	this.cmd("Step");

	this.cmd("Move", labPopValID,  PUSH_ELEMENT_X, PUSH_ELEMENT_Y);
	this.cmd("Step");

	this.cmd("Disconnect", this.headID, this.linkedListElemID[this.front]);
	this.cmd("Connect", this.headID, this.linkedListElemID[this.front+1]);
	this.cmd("Step");

	this.cmd("Delete", this.linkedListElemID[this.front]);

	this.cmd("SetHighlight", this.sizeID, 1);
	this.cmd("Step");
	this.front = this.front + 1;
	this.cmd("SetText", this.sizeID, (this.rear-this.front))
	this.cmd("Step");

	this.cmd("SetHighlight", this.sizeID, 0);
	this.cmd("Step");

	this.resetLinkedListPositions();
	this.cmd("Delete", labPopValID)
	this.cmd("Delete", labPopID);
	this.cmd("Step");
	this.cmd("SetText", this.leftoverLabelID, "");

	return this.commands;
}

QueueLL_ZHS.prototype.clearCallback = function(event){
	this.implementAction(this.clearAll.bind(this), "");
}

QueueLL_ZHS.prototype.clearAll = function(){
	this.commands = new Array();
	this.arrayData = new Array(SIZE);
	for (var i = 0; i < SIZE; i++){
		this.arrayData[i] = null;
	}
	for (var i = this.front ; i <= this.rear; i++){
		this.cmd("Delete", this.linkedListElemID[i]);
	}
	this.rear = 0;
	this.front = 0;
	this.cmd("SetText", this.sizeID, (this.rear-this.front));
	this.cmd("CreateLinkedList",this.linkedListElemID[this.rear], "null" ,LINKED_LIST_ELEM_WIDTH, LINKED_LIST_ELEM_HEIGHT,
		LINKED_LIST_INSERT_X, LINKED_LIST_INSERT_Y, 0.25, 0, 1, 1);
	this.cmd("connect", this.headID, this.linkedListElemID[this.rear]);
	this.cmd("connect", this.tailID, this.linkedListElemID[this.rear]);
	this.resetLinkedListPositions();
	this.cmd("SetText", this.leftoverLabelID, "Queue cleared");
	return this.commands;
}
var currentAlg;

function init(){
	var animManag = initCanvas();
	currentAlg = new QueueLL_ZHS(animManag, canvas.width, canvas.height);
}
