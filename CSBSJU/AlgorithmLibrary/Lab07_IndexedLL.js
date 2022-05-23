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

var LINKED_LIST_ELEMS_PER_LINE = SIZE;
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

function IndexedLinkedList_ZHS(am, w, h){
	this.init(am, w, h);
}

IndexedLinkedList_ZHS.prototype = new Algorithm();
IndexedLinkedList_ZHS.prototype.constructor = IndexedLinkedList_ZHS;
IndexedLinkedList_ZHS.superclass = Algorithm.prototype;

IndexedLinkedList_ZHS.prototype.init = function(am, w, h){
	IndexedLinkedList_ZHS.superclass.init.call(this, am, w, h);
	this.addControls();
	this.nextIndex = 0;
	this.commands = [];
	this.setup();
	this.initialIndex = this.nextIndex;
}

IndexedLinkedList_ZHS.prototype.addControls =  function(){
	this.controls = [];
	this.descLabel = addLabelToAlgorithmBar("Enter required parameters on the right before \n selecting an action from list below ","2");
	startNewLineInAlgorithmBar();
	this.text2Label = addLabelToAlgorithmBar("  ");
	this.text1Label = addLabelToAlgorithmBar(" (1) Element (if required) ");
	this.elementValue = addControlToAlgorithmBar("Text", nextRandInt() );
	this.controls.push(this.elementValue);
	this.elementValue.onkeydown = this.returnSubmit(this.elementValue,  null, 4);
	startNewLineInAlgorithmBar();
	var optionRadioList = addRadioButtonGroupToAlgorithmBar([	"Add Element at Index: (Element, Index)",
																														"Get Element at Index: (Index)",
																														"Set Element at Index: (Element, Index)",
																														"Index of Element: (Element)",
																														"Last Index of Element: (Element)",
																														"Remove Element at Index: (Index)",
																														"No Selection"], "ActionList");

	this.text2Label = addLabelToAlgorithmBar(" (2) Index (if required) ");
	this.elementLocation = addControlToAlgorithmBar("Text", "0");
	this.elementLocation.onkeydown = this.returnSubmit(this.elementLocation,  null, 4,true);
	this.controls.push(this.elementLocation);
	startNewLineInAlgorithmBar();

	this.insertButton = optionRadioList[0];
	this.controls.push(this.insertButton);
	this.insertButton.onclick = this.insertCallback.bind(this);

	this.removeButton = optionRadioList[5];
	this.controls.push(this.removeButton);
	this.removeButton.onclick = this.removeCallback.bind(this);

	this.getButton = optionRadioList[1];
	this.controls.push(this.getButton);
	this.getButton.onclick = this.getCallback.bind(this);

	this.setButton = optionRadioList[2];
	this.controls.push(this.setButton);
	this.setButton.onclick = this.setCallback.bind(this);

	this.indexOfButton = optionRadioList[3];
	this.controls.push(this.indexOfButton);
	this.indexOfButton.onclick = this.indexOfCallback.bind(this);

	this.lastIndexOfButton = optionRadioList[4];
	this.controls.push(this.lastIndexOfButton);
	this.lastIndexOfButton.onclick = this.lastIndexOfCallback.bind(this);

	this.clearButton = optionRadioList[6];
	this.controls.push(this.clearButton);
	this.clearButton.checked = true;
}

IndexedLinkedList_ZHS.prototype.enableUI = function(event){
	for (var i = 0; i < this.controls.length; i++){
		this.controls[i].disabled = false;
	}
}

IndexedLinkedList_ZHS.prototype.disableUI = function(event){
	for (var i = 0; i < this.controls.length; i++){
		this.controls[i].disabled = true;
	}
}

IndexedLinkedList_ZHS.prototype.setup = function(){
	this.top = 0;

	this.linkedListElemID = new Array(SIZE);
	this.arrayData = new Array(SIZE);
	for (var i = 0; i < SIZE; i++){
		this.linkedListElemID[i]= this.nextIndex++;
		this.arrayData[i]= null;
	}

	this.headID = this.nextIndex++;
	this.headLabelID = this.nextIndex++;
	this.cmd("CreateLabel", this.headLabelID, "Head", TOP_LABEL_X, TOP_LABEL_Y);
	this.cmd("CreateRectangle", this.headID, "", TOP_ELEM_WIDTH, TOP_ELEM_HEIGHT, TOP_POS_X, TOP_POS_Y);

	this.sizeID = this.nextIndex++;
	this.sizeLabelID = this.nextIndex++;
	this.cmd("CreateLabel", this.sizeLabelID, "Size", TOP_POS_X + SIZE_X_ADJUSTMENT, TOP_POS_Y);
	this.cmd("CreateRectangle", this.sizeID, "0", TOP_ELEM_WIDTH, TOP_ELEM_HEIGHT, TOP_POS_X +SIZE_X_ADJUSTMENT+40, TOP_POS_Y);

	this.leftoverLabelID = this.nextIndex++;
	this.cmd("CreateLabel", this.leftoverLabelID, "", TOP_POS_X +SIZE_X_ADJUSTMENT+50,PUSH_LABEL_Y);
	this.cmd("SetForegroundColor", this.leftoverLabelID,INDEX_COLOR);

	this.cmd("CreateLinkedList",this.linkedListElemID[0], "null" ,LINKED_LIST_ELEM_WIDTH, LINKED_LIST_ELEM_HEIGHT,
		LINKED_LIST_START_X, LINKED_LIST_START_Y, 0.25, 0, 1, 1);
	this.cmd("SetNull", this.linkedListElemID[0], 1);
	this.cmd("connect", this.headID, this.linkedListElemID[0]);

	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();
}

IndexedLinkedList_ZHS.prototype.resetLinkedListPositions = function(start){
	for (var i = this.top ; i > start; i--){
		var nextX = i * LINKED_LIST_ELEM_SPACING + LINKED_LIST_START_X;
		var nextY = LINKED_LIST_START_Y;
		this.cmd("Move", this.linkedListElemID[i], nextX, nextY);
	}
}

IndexedLinkedList_ZHS.prototype.reset = function(){
	this.top = 0;
	this.nextIndex = this.initialIndex;
	this.arrayData = new Array(SIZE);
	for (var i = 0; i < SIZE; i++){
		this.arrayData[i]= null;
	}
}

IndexedLinkedList_ZHS.prototype.getCallback = function(event){
	if (this.elementLocation.value != ""){
		var getLoc = this.elementLocation.value;
		this.implementAction(this.get.bind(this), getLoc);
	}
	this.getButton.checked = false;
}

IndexedLinkedList_ZHS.prototype.get = function(indexToGet){
	this.commands = new Array();
	indexToGet = Number(indexToGet);
	if (indexToGet<0 || indexToGet>=this.top){
		this.cmd("Step");
		this.cmd("SetText", this.leftoverLabelID, "Index out of range");
		this.cmd("Step");
		return this.commands;
	}
	this.cmd("SetText", this.leftoverLabelID, "");
	var labGetID = this.nextIndex++;
	var labGetValID = this.nextIndex++;
	this.cmd("CreateLabel", labGetID, "Getting Element at Index: ", PUSH_LABEL_X, PUSH_LABEL_Y);
	this.cmd("CreateLabel", labGetValID,indexToGet, PUSH_ELEMENT_X, PUSH_ELEMENT_Y);

	this.cmd("SetText", this.leftoverLabelID, "Step 1: Search for desired index "  + indexToGet );
	for (var i = 0; i<=indexToGet;i++){ // highlight nodes until we arrive at desired location
		this.cmd("Step");
		this.cmd("SetHighlight", this.linkedListElemID[i], 1);
		this.cmd("Step");
		this.cmd("SetHighlight", this.linkedListElemID[i], 0);
	}
	this.cmd("SetHighlight", this.linkedListElemID[indexToGet], 1);
	this.cmd("Step");
	this.cmd("SetText", this.leftoverLabelID, "Index found!" );
	this.cmd("Step");
	this.cmd("SetText", this.leftoverLabelID, "Step 2: Return value found: "  + this.arrayData[indexToGet] );
	this.cmd("Step");
	this.cmd("SetHighlight", this.linkedListElemID[indexToGet], 0);
	this.cmd("Delete", labGetID);
	this.cmd("Delete", labGetValID);
	this.cmd("Step");
	this.cmd("SetText", this.leftoverLabelID, "");

	return this.commands;
}

IndexedLinkedList_ZHS.prototype.indexOfCallback = function(event){
	if (this.elementValue.value != ""){
		var indexOfVal = this.elementValue.value;
		this.implementAction(this.indexOf.bind(this), indexOfVal);
	}
	this.indexOfButton.checked = false;
}

IndexedLinkedList_ZHS.prototype.indexOf = function(valueToIndex){
	this.commands = new Array();
	this.cmd("SetText", this.leftoverLabelID, "");
	var labIndexOfID = this.nextIndex++;
	var labIndexOfValID = this.nextIndex++;
	this.cmd("CreateLabel", labIndexOfID, "Searhing for Element value: ", PUSH_LABEL_X, PUSH_LABEL_Y);
	this.cmd("CreateLabel", labIndexOfValID,valueToIndex, PUSH_ELEMENT_X, PUSH_ELEMENT_Y);

	this.cmd("SetText", this.leftoverLabelID, "Step 1: Search for desired value "  + valueToIndex );
	var i = 0;

	while (i<this.top){ // highlight nodes until we arrive at desired value
		this.cmd("Step");
		this.cmd("SetHighlight", this.linkedListElemID[i], 1);
		if (valueToIndex==this.arrayData[i]){
			break;
		}
		this.cmd("Step");
		this.cmd("SetHighlight", this.linkedListElemID[i], 0);
		i++;
	}

	this.cmd("Step");

	if(i<this.top){// a match was found
		this.cmd("SetText", this.leftoverLabelID, "Value found at index " + i);
		this.cmd("Step");
		this.cmd("SetText", this.leftoverLabelID, "Step 2: Return index of match: "  + i );
		this.cmd("Step");
		this.cmd("SetHighlight", this.linkedListElemID[i], 0);
	}
	else{
		this.cmd("SetText", this.leftoverLabelID, "No matches found for value " + valueToIndex);
		this.cmd("Step");
		this.cmd("SetText", this.leftoverLabelID, "Step 2: Return -1 " );
	}
	this.cmd("Step");
	this.cmd("Delete", labIndexOfID);
	this.cmd("Delete", labIndexOfValID);
	this.cmd("Step");
	this.cmd("SetText", this.leftoverLabelID, "");
	return this.commands;
}

IndexedLinkedList_ZHS.prototype.lastIndexOfCallback = function(event){
	if (this.elementValue.value != ""){
		var lastIndexOfVal = this.elementValue.value;
		this.implementAction(this.lastIndexOf.bind(this), lastIndexOfVal);
	}
	this.lastIndexOfButton.checked = false;
}

IndexedLinkedList_ZHS.prototype.lastIndexOf = function(valueToIndex){
	this.commands = new Array();
	this.cmd("SetText", this.leftoverLabelID, "");
	var labLastIndexOfID = this.nextIndex++;
	var labLastIndexOfValID = this.nextIndex++;
	this.cmd("CreateLabel", labLastIndexOfID, "Searhing for Element value: ", PUSH_LABEL_X, PUSH_LABEL_Y);
	this.cmd("CreateLabel", labLastIndexOfValID,valueToIndex, PUSH_ELEMENT_X, PUSH_ELEMENT_Y);

	this.cmd("SetText", this.leftoverLabelID, "Step 1: Search for desired value "  + valueToIndex );
	var i = 0;
	var lastMatch = -1;

	while (i<this.top){ // highlight nodes until we arrive at desired value
		this.cmd("Step");
		this.cmd("SetHighlight", this.linkedListElemID[i], 1);
		if (valueToIndex==this.arrayData[i]){
			lastMatch = i;
			this.cmd("SetText", this.leftoverLabelID, "Value found at index " + i + "\nindex of last match updated accordingly");
		}
		this.cmd("Step");
		this.cmd("SetHighlight", this.linkedListElemID[i], 0);
		i++;
	}
	this.cmd("Step");

	if(lastMatch>-1){ // a match was found
		this.cmd("SetText", this.leftoverLabelID, "Step 2: Return index of last match: "  + lastMatch );
		this.cmd("Step");
		this.cmd("SetHighlight", this.linkedListElemID[i], 0);
	}
	else{
		this.cmd("SetText", this.leftoverLabelID, "No matches found for value " + valueToIndex);
		this.cmd("Step");
		this.cmd("SetText", this.leftoverLabelID, "Step 2: Return -1 " );
	}
	this.cmd("Step");
	this.cmd("Delete", labLastIndexOfID);
	this.cmd("Delete", labLastIndexOfValID);
	this.cmd("Step");
	this.cmd("SetText", this.leftoverLabelID, "");
	return this.commands;
}

IndexedLinkedList_ZHS.prototype.setCallback = function(event){
	if (this.elementValue.value != "" && this.elementLocation.value != ""){
		var setVal = this.elementValue.value;
		var setLoc = this.elementLocation.value;
		this.implementAction(this.set.bind(this), [setVal,setLoc]);
	}
	this.setButton.checked = false;
}

IndexedLinkedList_ZHS.prototype.set = function(dataToSet){
	var elemToSet=dataToSet[0];
	var locToSet=Number(dataToSet[1]);
	this.commands = new Array();

	if (locToSet<0 || locToSet>=this.top){
		this.cmd("SetText", this.leftoverLabelID, "Index out of range");
		this.cmd("Step");
		return this.commands;
	}
	this.cmd("SetText", this.leftoverLabelID, "");
	var labSetID = this.nextIndex++;
	var labSetValID = this.nextIndex++;
	this.cmd("CreateLabel", labSetID, "Finding Element at Index: ", PUSH_LABEL_X, PUSH_LABEL_Y);
	this.cmd("CreateLabel", labSetValID,locToSet, PUSH_ELEMENT_X, PUSH_ELEMENT_Y);

	this.cmd("SetText", this.leftoverLabelID, "Step 1: Search for desired index "  + locToSet );
	for (var i = 0; i<=locToSet;i++){ // highlight nodes until we arrive at desired location
		this.cmd("Step");
		this.cmd("SetHighlight", this.linkedListElemID[i], 1);
		this.cmd("Step");
		this.cmd("SetHighlight", this.linkedListElemID[i], 0);
	}
	this.cmd("SetHighlight", this.linkedListElemID[locToSet], 1);
	this.cmd("Step");
	this.cmd("SetText", this.leftoverLabelID, "Index found!" );
	this.cmd("Step");
	this.cmd("SetText", this.leftoverLabelID, "Step 2: Update old value: "  + this.arrayData[locToSet] + " to new value: " +elemToSet );
	this.arrayData[locToSet] = elemToSet;
	this.cmd("Step");
	this.cmd("SetText", this.linkedListElemID[locToSet], elemToSet);
	this.cmd("Step");
	this.cmd("SetHighlight", this.linkedListElemID[locToSet], 0);
	this.cmd("Delete", labSetID);
	this.cmd("Delete", labSetValID);
	this.cmd("Step");
		this.cmd("SetText", this.leftoverLabelID, "");
	return this.commands;
}

IndexedLinkedList_ZHS.prototype.insertCallback = function(event){
	if (this.top >= SIZE){
		alert ("This shouldn't happen but due to my limited ability, I am out of memory and can't fit more nodes");
	}
	else{
		if (this.elementValue.value != "" && this.elementLocation.value != ""){
			var insertVal = this.elementValue.value;
			var insertLoc = Number(this.elementLocation.value);
			this.implementAction(this.insert.bind(this), [insertVal,insertLoc]);
		}
		this.insertButton.checked = false;
		this.elementValue.value = nextRandInt();
		this.elementLocation.value = this.top;
	}
}

IndexedLinkedList_ZHS.prototype.insert = function(dataToInsert){
	var elemToInsert=dataToInsert[0];
	var locToInsert=Number(dataToInsert[1]);
	this.commands = new Array();

	if (locToInsert<0 || locToInsert>this.top){
		this.cmd("SetText", this.leftoverLabelID, "Index out of range");
		this.cmd("Step");
		return this.commands;
	}

	this.cmd("SetText", this.leftoverLabelID, "");
	var labInsertID = this.nextIndex++;
	var labInsertValID = this.nextIndex++;
	this.cmd("CreateLabel", labInsertID, "Inserting Element: ", PUSH_LABEL_X, PUSH_LABEL_Y);
	this.cmd("CreateLabel", labInsertValID,elemToInsert, PUSH_ELEMENT_X, PUSH_ELEMENT_Y);

	var oldElem = this.arrayData[locToInsert];
	var newID = this.nextIndex++; //this.linkedListElemID[this.top+1];

	this.cmd("SetText", this.leftoverLabelID, "Step 1: Search for desired index "  + locToInsert );
	for (var i = 0; i<=locToInsert;i++){ // highlight nodes until we arrive at desired location
		this.cmd("Step");
		this.cmd("SetHighlight", this.linkedListElemID[i], 1);
		this.cmd("Step");
		this.cmd("SetHighlight", this.linkedListElemID[i], 0);
	}
	this.cmd("SetHighlight", this.linkedListElemID[locToInsert], 1);
	this.cmd("SetText", this.leftoverLabelID, "Index found!" );
	this.cmd("Step");

	this.cmd("SetText", this.leftoverLabelID, "Step 2: Create a new node containing \n 'element' and 'next' from current node" );
	this.cmd("Step");
	this.cmd("SetHighlight", this.linkedListElemID[locToInsert], 0);

	this.cmd("Step");

	this.cmd("CreateLinkedList",newID, "" ,LINKED_LIST_ELEM_WIDTH, LINKED_LIST_ELEM_HEIGHT,
			LINKED_LIST_INSERT_X, LINKED_LIST_INSERT_Y, 0.25, 0, 1, 1);
	if (this.top == locToInsert){//inserting at an empty node
			this.cmd("SetHighlight", newID, 1);
			this.cmd("Step");
			this.cmd("SetText", newID, oldElem);
			this.cmd("SetNull", newID, 1);
			this.cmd("Step");
			this.cmd("SetHighlight", newID, 0);
			this.cmd("Step");

			this.cmd("SetText", this.leftoverLabelID, "Step 3: Update current node to point \n to new node and contain new 'element'" );
			this.cmd("Step");

			this.cmd("SetHighlight", this.linkedListElemID[locToInsert], 1);
			this.cmd("Step");
			this.cmd("SetNull", this.linkedListElemID[locToInsert], 0);
			this.cmd("Connect",  this.linkedListElemID[locToInsert], newID);

			var destX =  locToInsert * LINKED_LIST_ELEM_SPACING + LINKED_LIST_START_X;
			var destY = LINKED_LIST_START_Y;
			this.cmd("Move", labInsertValID, destX, destY);
			this.cmd("SetText", this.linkedListElemID[locToInsert], "");
			this.cmd("Step");
			this.cmd("SetText", this.linkedListElemID[locToInsert], elemToInsert);
			this.cmd("Delete", labInsertValID);
			this.cmd("SetHighlight", this.linkedListElemID[locToInsert], 0);
		}
		else{
			var nextID = this.linkedListElemID[locToInsert+1];
			for (var i  = this.top + 1; i > locToInsert; i--){
					this.arrayData[i] = this.arrayData[i-1];
					this.linkedListElemID[i] = this.linkedListElemID[i-1];
			}
			this.cmd("SetHighlight", newID, 1);
			this.cmd("Step");
			this.cmd("SetText", newID, oldElem);
			this.cmd("Connect", newID, nextID);
			this.cmd("Step");
			this.cmd("SetHighlight",newID, 0);
			this.cmd("Step");
			this.cmd("SetText", this.leftoverLabelID, "Step 3: Update current node to point \n to new node and contain new 'element'" );
			this.cmd("Step");

			this.cmd("SetHighlight", this.linkedListElemID[locToInsert], 1);
			this.cmd("Step");
			this.cmd("Disconnect", this.linkedListElemID[locToInsert], nextID);
			this.cmd("Connect", this.linkedListElemID[locToInsert], newID);
			var destX =  locToInsert * LINKED_LIST_ELEM_SPACING + LINKED_LIST_START_X;
			var destY = LINKED_LIST_START_Y;
			this.cmd("Move", labInsertValID, destX, destY);
			this.cmd("SetText", this.linkedListElemID[locToInsert], "");
			this.cmd("Step");
			this.cmd("SetText", this.linkedListElemID[locToInsert], elemToInsert);
			this.cmd("Delete", labInsertValID);
			this.cmd("SetHighlight", this.linkedListElemID[locToInsert], 0);
	}
	this.linkedListElemID[locToInsert+1] = newID;
	this.arrayData[locToInsert] = elemToInsert;
	this.cmd("Step");
	this.cmd("SetText", this.leftoverLabelID, "Step 4: Increase size and make things pretty again!");
	this.cmd("Step");
	this.cmd("SetHighlight", this.sizeID, 1);
	this.cmd("Step");

	this.top = this.top + 1;
	this.cmd("SetText", this.sizeID, this.top);
	this.cmd("SetHighlight", this.sizeID, 0);
	this.cmd("Step");

	this.cmd("Delete", labInsertID);
	this.resetLinkedListPositions(locToInsert-1);
	this.cmd("Step");
	this.cmd("SetText", this.leftoverLabelID, "");
	return this.commands;
}

IndexedLinkedList_ZHS.prototype.removeCallback = function(event){
	if (this.elementLocation.value != ""){
		var removeLoc = this.elementLocation.value;
		this.implementAction(this.remove.bind(this), removeLoc);
	}
	this.removeButton.checked = false;
	this.elementLocation.value = (this.top-1>=0) ? this.top-1: 0;

}

IndexedLinkedList_ZHS.prototype.remove = function(indexToRemove){
	this.commands = new Array();
	indexToRemove=Number(indexToRemove);
	if (indexToRemove<0 || indexToRemove>=this.top){
		this.cmd("Step");
		this.cmd("SetText", this.leftoverLabelID, "Index out of range");
		this.cmd("Step");
		return this.commands;
	}

	this.cmd("SetText", this.leftoverLabelID, "");
	var labRemoveID = this.nextIndex++;
	var labRemoveValID = this.nextIndex++;
	this.cmd("CreateLabel", labRemoveID, "Removing Element at Index: ", PUSH_LABEL_X, PUSH_LABEL_Y);
	this.cmd("CreateLabel", labRemoveValID,indexToRemove, PUSH_ELEMENT_X, PUSH_ELEMENT_Y);

	this.cmd("SetText", this.leftoverLabelID, "Step 1: Search for desired index "  + indexToRemove );
	for (var i = 0; i<=indexToRemove;i++){ // highlight nodes until we arrive at desired location
		this.cmd("Step");
		this.cmd("SetHighlight", this.linkedListElemID[i], 1);
		this.cmd("Step");
		this.cmd("SetHighlight", this.linkedListElemID[i], 0);
	}

	this.cmd("SetHighlight", this.linkedListElemID[indexToRemove], 1);
	this.cmd("SetText", this.leftoverLabelID, "Index found!" );

	this.cmd("Step");
	this.cmd("SetText", this.leftoverLabelID, "Step 2: Copy information from next node to current node" );
	this.cmd("Step");
	//move next node in animation a bit higher to show changes
	var destX =  (indexToRemove+1) * LINKED_LIST_ELEM_SPACING + LINKED_LIST_START_X;
	var destY = LINKED_LIST_START_Y;
	this.cmd("Move", this.linkedListElemID[indexToRemove+1], destX, destY-30);
	this.cmd("Step");

	//Copy information from next node to current node
	var val = this.arrayData[indexToRemove+1];
//	if(val==undefined){
//		val=null;
//	}
	this.arrayData[indexToRemove] = val;
	this.cmd("SetText", this.linkedListElemID[indexToRemove], val);
	this.cmd("Step");
	this.cmd("Disconnect",this.linkedListElemID[indexToRemove], this.linkedListElemID[indexToRemove+1]);
	if (indexToRemove==this.top-1){ //removing last element
		this.cmd("SetNull", this.linkedListElemID[indexToRemove], 1);
	}
	else{
		this.cmd("Connect", this.linkedListElemID[indexToRemove], this.linkedListElemID[indexToRemove+2]);
	}
	this.cmd("Step");
	this.cmd("SetHighlight", this.linkedListElemID[indexToRemove], 0);

	this.cmd("SetText", this.leftoverLabelID, "Step 3: Decrease size and make things pretty again!");
	this.cmd("Step");
	this.cmd("SetHighlight", this.sizeID, 1);
	this.cmd("Step");
	this.top = this.top - 1;
	this.cmd("SetText", this.sizeID, this.top);
	this.cmd("SetHighlight", this.sizeID, 0);
	this.cmd("Step");
	//adjust all base array values to reflect node deletion
	this.cmd("Delete", this.linkedListElemID[indexToRemove+1]);
	for (var i  = indexToRemove+1; i <= this.top ; i++){
			this.arrayData[i] = this.arrayData[i+1];
			this.linkedListElemID[i] = this.linkedListElemID[i+1];
	}
	this.resetLinkedListPositions(indexToRemove);

	this.cmd("Delete", labRemoveValID);
	this.cmd("Delete", labRemoveID);
	this.cmd("Step");
	this.cmd("SetText", this.leftoverLabelID, "");
	return this.commands;
}

var currentAlg;

function init(){
	var animManag = initCanvas();
	currentAlg = new IndexedLinkedList_ZHS(animManag, canvas.width, canvas.height);
}
