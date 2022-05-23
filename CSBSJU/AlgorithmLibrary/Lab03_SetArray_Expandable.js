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

var ARRAY_START_X = 100;
var ARRAY_START_Y = 200;
var ARRAY_ELEM_WIDTH = 50;
var ARRAY_ELEM_HEIGHT = 50;

//original array size
var SIZE = DEFAULT_CAPACITY; //Number(prompt("Please enter the desired array size: ", 4));

//location for array display in animation
var ARRAY_ELEMS_PER_LINE = SIZE;
var ARRAY_LINE_SPACING = 130;

//location for size display info in animation
var SIZE_POS_X = 180;
var SIZE_POS_Y = 100;
var SIZE_LABEL_X = 130;
var SIZE_LABEL_Y =  100;

//location for added/removed elements in animation
var SET_LABEL_X = 50;
var SET_LABEL_Y = 30;
var SET_ELEMENT_X = 120;
var SET_ELEMENT_Y = 30;

//the color BLUE
var INDEX_COLOR = "#0000FF"
SET_MAX_RAND_INT = 20;
SetArray.prototype = new Algorithm();
SetArray.prototype.constructor = SetArray;
SetArray.superclass = Algorithm.prototype;

function SetArray(am, w, h){
	this.init(am, w, h);
}

//initialize page
SetArray.prototype.init = function(am, w, h){
	SetArray.superclass.init.call(this, am, w, h);
	this.addControls();
	this.nextIndex = 0;
	this.commands = [];
	this.setup();
	this.initialIndex = this.nextIndex;
}

//add menu GUI components
SetArray.prototype.addControls =  function(){
	this.controls = [];
	this.valField = addControlToAlgorithmBar("Text", nextRandInt(SET_MAX_RAND_INT));
	this.valField.onkeydown = this.returnSubmit(this.valField,  this.addCallback.bind(this), 6);
	this.controls.push(this.valField);

	this.addButton = addControlToAlgorithmBar("Button", "Add");
	this.addButton.onclick = this.addCallback.bind(this);
	this.controls.push(this.addButton);

	this.removeButton = addControlToAlgorithmBar("Button", "Remove");
	this.removeButton.onclick = this.removeCallback.bind(this);
	this.controls.push(this.removeButton);

	this.clearButton = addControlToAlgorithmBar("Button", "Clear Set");
	this.clearButton.onclick = this.clearCallback.bind(this);
	this.controls.push(this.clearButton);
}

//used to disable GUIs during an operation
SetArray.prototype.disableUI = function(event){
	for (var i = 0; i < this.controls.length; i++){
		this.controls[i].disabled = true;
	}
}

//used to enable GUIs after operation is over
SetArray.prototype.enableUI = function(event){
	for (var i = 0; i < this.controls.length; i++){
		this.controls[i].disabled = false;
	}
}

//create the needed variables and objects
SetArray.prototype.setup = function(){
	//used to generate unique IDs for animation objects
	this.nextIndex = 0;
	//store IDs for array cells in animation
	this.arrayID = new Array(SIZE);
	//store IDs for array labels in animation
	this.arrayLabelID = new Array(SIZE);
	//initialize IDs
	for (var i = 0; i < SIZE; i++){
		this.arrayID[i]= this.nextIndex++;
		this.arrayLabelID[i]= this.nextIndex++;
	}
	//create and place array cells for animation
	for (var i = 0; i < SIZE; i++){
		var xpos = (i  % ARRAY_ELEMS_PER_LINE) * ARRAY_ELEM_WIDTH + ARRAY_START_X;
		var ypos = Math.floor(i / ARRAY_ELEMS_PER_LINE) * ARRAY_LINE_SPACING +  ARRAY_START_Y;
		this.cmd("CreateRectangle", this.arrayID[i],"", ARRAY_ELEM_WIDTH, ARRAY_ELEM_HEIGHT,xpos, ypos);
		this.cmd("CreateLabel",this.arrayLabelID[i],  i,  xpos, ypos + ARRAY_ELEM_HEIGHT);
		this.cmd("SetForegroundColor", this.arrayLabelID[i], INDEX_COLOR);
	}

	//animation objects to store size info
	this.sizeID = this.nextIndex++;
	sizeLabelID = this.nextIndex++;
	this.cmd("CreateLabel", sizeLabelID, "Size", SIZE_LABEL_X, SIZE_LABEL_Y);
	this.cmd("CreateRectangle", this.sizeID, 0, ARRAY_ELEM_WIDTH, ARRAY_ELEM_HEIGHT, SIZE_POS_X, SIZE_POS_Y);

	//array to store data in set
	this.arrayData = new Array(SIZE);
	this.size = 0;

	//animation object to display messages
	this.leftoverLabelID = this.nextIndex++;
	this.cmd("CreateLabel", this.leftoverLabelID, "", SET_LABEL_X, SET_LABEL_Y,0);
	this.cmd("SetForegroundColor", this.leftoverLabelID, INDEX_COLOR);

	this.initialIndex = this.nextIndex;

	//used to highlight objects in animation where action is happening
	this.highlight1ID = this.nextIndex++;
	this.highlight2ID = this.nextIndex++;

	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();
}

//used to reset animation so that with can step/skip back and forth
SetArray.prototype.reset = function(){
	this.top = 0;
	this.size = 0;
	SIZE = DEFAULT_CAPACITY;
	this.arrayData = new Array(SIZE);
	this.nextIndex = this.initialIndex;
}

//event function to call during adding
SetArray.prototype.addCallback = function(event){
	//check that element added isn't empty and we have more room in array
	if (this.valField.value != ""){
		var addVal = this.valField.value;
		var found = this.arrayData.includes(addVal);
		if (!found){//added element is unique
			//method to handle the actual add operation
			this.implementAction(this.add.bind(this), addVal);
		}
		else{//added element is NOT unique
			alert("Set already contains value "+ addVal);
		}
		this.valField.value = nextRandInt(SET_MAX_RAND_INT);
	}
}

//do add operation
SetArray.prototype.add = function(elemToAdd){
	//store actions for animation
	this.commands = new Array();

	var found = this.arrayData.includes(elemToAdd);
	if (found){
		return this.commands;
	}
	//once we determine that the element is not already present, we need to check
	//whether base array is at capacity; if so, double size
	if (this.size == SIZE){
		this.cmd("SetText", this.leftoverLabelID, "Set is now full\nDoubling array size");
		this.cmd("Step");
		//create new array double original size
		SIZE = SIZE*2
		ARRAY_ELEMS_PER_LINE = SIZE;
		this.newArrayID = new Array(SIZE);
		this.newArrayLabelID = new Array(SIZE);
		this.newArrayData = new Array(SIZE);
		for (var i = 0; i < SIZE; i++){
			if (i < SIZE/2){//copy first half from old array
				this.newArrayID[i]= this.arrayID[i];
				this.newArrayLabelID[i]= this.arrayLabelID[i];
				this.newArrayData[i] = this.arrayData[i];
			}
			else{//generate IDs for second half
				this.newArrayID[i]= this.nextIndex++;
				this.newArrayLabelID[i]= this.nextIndex++;
			}
		}
		//update array with newArray
		this.arrayID = this.newArrayID ;
		this.arrayLabelID = this.newArrayLabelID;
		this.arrayData  = this.newArrayData;
		//add  newArray to screen
		for (var i = SIZE/2; i < SIZE; i++){
			var xpos = (i  % ARRAY_ELEMS_PER_LINE) * ARRAY_ELEM_WIDTH + ARRAY_START_X;
			var ypos = Math.floor(i / ARRAY_ELEMS_PER_LINE) * ARRAY_LINE_SPACING +  ARRAY_START_Y;
			this.cmd("CreateRectangle", this.arrayID[i],"", ARRAY_ELEM_WIDTH, ARRAY_ELEM_HEIGHT,xpos, ypos);
			this.cmd("CreateLabel",this.arrayLabelID[i],  i,  xpos, ypos + ARRAY_ELEM_HEIGHT);
			this.cmd("SetForegroundColor", this.arrayLabelID[i], INDEX_COLOR);
		}
	}
	// the actual add operation
	//to display info on added element
	var labAddID = this.nextIndex++;
	var labAddValID = this.nextIndex++;
	this.cmd("CreateLabel", labAddID, "Adding Value: ", SET_LABEL_X, SET_LABEL_Y);
	this.cmd("SetForegroundColor",labAddID, INDEX_COLOR);
	this.cmd("CreateLabel", labAddValID,elemToAdd, SET_ELEMENT_X, SET_ELEMENT_Y);

	//append new element to end of array
	this.arrayData[this.size] = elemToAdd;

	//clear old messages from animation
	this.cmd("SetText", this.leftoverLabelID, "");
	this.cmd("Step");

	//highlight new element
	this.cmd("CreateHighlightCircle", this.highlight1ID, INDEX_COLOR , SET_ELEMENT_X, SET_ELEMENT_Y);
	this.cmd("Step");

	//move highlight to location in base array
	var xpos = (this.size  % ARRAY_ELEMS_PER_LINE) * ARRAY_ELEM_WIDTH + ARRAY_START_X;
	var ypos = Math.floor(this.size / ARRAY_ELEMS_PER_LINE) * ARRAY_LINE_SPACING +  ARRAY_START_Y;
	this.cmd("Move", this.highlight1ID, xpos, ypos + ARRAY_ELEM_HEIGHT);
	this.cmd("Step");

	//move element to corrent array cell
	this.cmd("Move", labAddValID, xpos, ypos);
	this.cmd("Step");
	this.cmd("Settext", this.arrayID[this.size], elemToAdd);
	this.cmd("Delete", labAddValID);

	//remove highlight
	this.cmd("Delete", this.highlight1ID);

	//update size
	this.cmd("SetHighlight", this.sizeID, 1);
	this.cmd("Step");
	this.size = (this.size + 1);
	this.cmd("SetText", this.sizeID, this.size)
	this.cmd("Step");
	this.cmd("SetHighlight", this.sizeID, 0);

	//remove info on added element
	this.cmd("Delete", labAddID);

	return this.commands;
}

//event function to call during removing
SetArray.prototype.removeCallback = function(event){
	//check that set as well as element to be removed aren't empty
	if (this.size > 0 && this.valField.value != ""){
		var removeVal = this.valField.value;
		var removeLoc = this.arrayData.indexOf(removeVal);
		this.valField.value = "";
		if (removeLoc!=-1){//element exists in set
			//method to handle the actual remove operation
			this.implementAction(this.remove.bind(this), removeLoc);
		}
		else {//removed element is NOT is set
			alert("Set does not contain value "+ removeVal);
		}
	}
}

//do remove operation
SetArray.prototype.remove = function(locToRem)
{
	//store actions for animation
	this.commands = new Array();

	//to display info on removed element
	var labRemoveID = this.nextIndex++;
	var labRemoveValID = this.nextIndex++;
	this.cmd("CreateLabel", labRemoveID, "Removed Value: ", SET_LABEL_X, SET_LABEL_Y);
	this.cmd("SetForegroundColor",labRemoveID, INDEX_COLOR);
	this.cmd("Step");

	//clear old messages from animation
	this.cmd("SetText", this.leftoverLabelID, "");

	//highlight removed element in array
	var xpos = (locToRem  % ARRAY_ELEMS_PER_LINE) * ARRAY_ELEM_WIDTH + ARRAY_START_X;
	var ypos = Math.floor(this.size / ARRAY_ELEMS_PER_LINE) * ARRAY_LINE_SPACING +  ARRAY_START_Y;
  this.cmd("CreateHighlightCircle", this.highlight1ID, INDEX_COLOR,  xpos, ypos);
	var valToRem = this.arrayData[locToRem]

	//display removed element
	this.cmd("CreateLabel", labRemoveValID,valToRem, xpos, ypos);
	this.cmd("Step");

	//move element from array to message
	this.cmd("Move", labRemoveValID, SET_ELEMENT_X, SET_ELEMENT_Y);
	this.cmd("Move",this.highlight1ID,SET_ELEMENT_X, SET_ELEMENT_Y);
	this.cmd("Step");

	//remove highlight and update array
	this.cmd("Delete", this.highlight1ID);

	//replace removed with last; first highlight cells
	this.cmd("SetHighlight", this.arrayID[this.size-1], 1);
	this.cmd("Step");
	this.cmd("SetHighlight", this.arrayID[locToRem], 1);
	this.cmd("Step");

	//replace removed element in array with last element
	this.cmd("Settext", this.arrayID[locToRem], this.arrayData[this.size-1]);
	this.cmd("Step");
	this.cmd("SetHighlight", this.arrayID[this.size-1], 0);
	this.cmd("SetHighlight", this.arrayID[locToRem], 0);
	this.arrayData[locToRem] = this.arrayData[this.size-1];
	this.arrayData[this.size-1] = "";
	this.cmd("Step");

	//update size
	this.cmd("SetHighlight", this.sizeID, 1);
	this.size = (this.size -1);
	this.cmd("Step");
	this.cmd("SetText", this.sizeID, this.size)
	this.cmd("SetHighlight", this.sizeID, 0);
	this.cmd("Step");

	//remove last element in array
	this.cmd("Settext", this.arrayID[this.size], "");
	this.cmd("Step");

	//remove info on removed element
	this.cmd("Delete", labRemoveID)
	this.cmd("Delete", labRemoveValID);

	return this.commands;
}

//event function to call during reseting
SetArray.prototype.clearCallback = function(event){
	this.implementAction(this.clearAll.bind(this), "");
}

//do reset operation
SetArray.prototype.clearAll = function(){
	this.commands = new Array();
	this.cmd("SetText", this.leftoverLabelID, "");

	for (var i = 0; i < SIZE; i++){
		this.cmd("SetText", this.arrayID[i], "");
	}
	this.size = 0;
	this.cmd("SetText", this.leftoverLabelID, "Set cleared");
	this.cmd("SetText", this.sizeID, "0");
	return this.commands;
}

var currentAlg;

function init(){
	var animManag = initCanvas();
	currentAlg = new SetArray(animManag, canvas.width, canvas.height);
}
