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

var SIZE = Number(prompt("Please enter the desired array size: ", 4));

var ARRAY_ELEMS_PER_LINE = SIZE;

var ARRAY_LINE_SPACING = 130;

var HEAD_POS_X = 180;
var HEAD_POS_Y = 100;
var HEAD_LABEL_X = 130;
var HEAD_LABEL_Y =  100;

var SET_LABEL_X = 50;
var SET_LABEL_Y = 30;
var SET_ELEMENT_X = 120;
var SET_ELEMENT_Y = 30;

SetArray.prototype = new Algorithm();
SetArray.prototype.constructor = SetArray;
SetArray.superclass = Algorithm.prototype;

var INDEX_COLOR = "#0000FF"

function SetArray(am, w, h)
{
	this.init(am, w, h);
}

SetArray.prototype.init = function(am, w, h)
{
	SetArray.superclass.init.call(this, am, w, h);
	this.addControls();
	this.nextIndex = 0;
	this.commands = [];
	this.setup();
	this.initialIndex = this.nextIndex;
}

SetArray.prototype.addControls =  function()
{
	this.controls = [];
	this.valField = addControlToAlgorithmBar("Text", "");
	this.valField.onkeydown = this.returnSubmit(this.valField,  this.addCallback.bind(this), 6);

	this.addButton = addControlToAlgorithmBar("Button", "Add");
	this.addButton.onclick = this.addCallback.bind(this);
	this.controls.push(this.valField);
	this.controls.push(this.addButton);

	this.removeButton = addControlToAlgorithmBar("Button", "Remove");
	this.removeButton.onclick = this.removeCallback.bind(this);
	this.controls.push(this.removeButton);

	this.clearButton = addControlToAlgorithmBar("Button", "Clear Set");
	this.clearButton.onclick = this.clearCallback.bind(this);
	this.controls.push(this.clearButton);
}

SetArray.prototype.enableUI = function(event)
{
	for (var i = 0; i < this.controls.length; i++)
	{
		this.controls[i].disabled = false;
	}
}

SetArray.prototype.disableUI = function(event)
{
	for (var i = 0; i < this.controls.length; i++)
	{
		this.controls[i].disabled = true;
	}
}

SetArray.prototype.setup = function()
{
	this.nextIndex = 0;

	this.arrayID = new Array(SIZE);
	this.arrayLabelID = new Array(SIZE);
	for (var i = 0; i < SIZE; i++)
	{
		this.arrayID[i]= this.nextIndex++;
		this.arrayLabelID[i]= this.nextIndex++;
	}
	this.headID = this.nextIndex++;
	headLabelID = this.nextIndex++;

	this.arrayData = new Array(SIZE);
	this.head = 0;
	this.leftoverLabelID = this.nextIndex++;

	for (var i = 0; i < SIZE; i++)
	{
		var xpos = (i  % ARRAY_ELEMS_PER_LINE) * ARRAY_ELEM_WIDTH + ARRAY_START_X;
		var ypos = Math.floor(i / ARRAY_ELEMS_PER_LINE) * ARRAY_LINE_SPACING +  ARRAY_START_Y;
		this.cmd("CreateRectangle", this.arrayID[i],"", ARRAY_ELEM_WIDTH, ARRAY_ELEM_HEIGHT,xpos, ypos);
		this.cmd("CreateLabel",this.arrayLabelID[i],  i,  xpos, ypos + ARRAY_ELEM_HEIGHT);
		this.cmd("SetForegroundColor", this.arrayLabelID[i], INDEX_COLOR);
	}

	this.cmd("CreateLabel", headLabelID, "Size", HEAD_LABEL_X, HEAD_LABEL_Y);
	this.cmd("CreateRectangle", this.headID, 0, ARRAY_ELEM_WIDTH, ARRAY_ELEM_HEIGHT, HEAD_POS_X, HEAD_POS_Y);

	this.cmd("CreateLabel", this.leftoverLabelID, "", SET_LABEL_X, SET_LABEL_Y,0);

	this.initialIndex = this.nextIndex;

	this.highlight1ID = this.nextIndex++;
	this.highlight2ID = this.nextIndex++;

	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();
}

SetArray.prototype.reset = function()
{
	this.top = 0;
	this.nextIndex = this.initialIndex;
}

SetArray.prototype.addCallback = function(event)
{
	if (this.head < SIZE && this.valField.value != "")
	{
		var addVal = this.valField.value;
		var found = this.arrayData.includes(addVal);
		this.valField.value = "";
		if (!found){
			this.implementAction(this.add.bind(this), addVal);
			if (this.head == SIZE)
			{
				this.cmd("SetText", this.leftoverLabelID, "Set is now full\nDoubling array size");
				this.cmd("Step");
				SIZE = SIZE*2
				ARRAY_ELEMS_PER_LINE = SIZE;
				this.newArrayID = new Array(SIZE);
				this.newArrayLabelID = new Array(SIZE);
				this.newArrayData = new Array(SIZE);
				this.cmd("Step");

				for (var i = 0; i < SIZE; i++)
				{
					if (i < SIZE/2)
					{//copy first half from old array
						this.newArrayID[i]= this.arrayID[i];
						this.newArrayLabelID[i]= this.arrayLabelID[i];
						this.newArrayData[i] = this.arrayData[i];
					}
					else
					{//generate IDs for second half
						this.newArrayID[i]= this.nextIndex++;
						this.newArrayLabelID[i]= this.nextIndex++;
					}
				}
				//update array with newArray
				this.arrayID = this.newArrayID ;
				this.arrayLabelID = this.newArrayLabelID;
				this.arrayData  = this.newArrayData;
				//add  newArray to screen
				this.cmd("Step");
				for (var i = SIZE/2; i < SIZE; i++)
				{
					var xpos = (i  % ARRAY_ELEMS_PER_LINE) * ARRAY_ELEM_WIDTH + ARRAY_START_X;
					var ypos = Math.floor(i / ARRAY_ELEMS_PER_LINE) * ARRAY_LINE_SPACING +  ARRAY_START_Y;
					this.cmd("CreateRectangle", this.arrayID[i],"", ARRAY_ELEM_WIDTH, ARRAY_ELEM_HEIGHT,xpos, ypos);
					this.cmd("CreateLabel",this.arrayLabelID[i],  i,  xpos, ypos + ARRAY_ELEM_HEIGHT);
					this.cmd("SetForegroundColor", this.arrayLabelID[i], INDEX_COLOR);
				}
			}
		}
		else
		{
			alert("Set already contains value "+ addVal);
		}
	}
}

SetArray.prototype.add = function(elemToAdd)
{
	this.commands = new Array();

	var labAddID = this.nextIndex++;
	var labAddValID = this.nextIndex++;
	this.arrayData[this.head] = elemToAdd;
	this.cmd("SetText", this.leftoverLabelID, "");

	this.cmd("CreateLabel", labAddID, "Adding Value: ", SET_LABEL_X, SET_LABEL_Y);
	this.cmd("CreateLabel", labAddValID,elemToAdd, SET_ELEMENT_X, SET_ELEMENT_Y);

	this.cmd("Step");
	this.cmd("CreateHighlightCircle", this.highlight1ID, INDEX_COLOR , SET_ELEMENT_X, SET_ELEMENT_Y);
	this.cmd("Step");

	var xpos = (this.head  % ARRAY_ELEMS_PER_LINE) * ARRAY_ELEM_WIDTH + ARRAY_START_X;
	var ypos = Math.floor(this.head / ARRAY_ELEMS_PER_LINE) * ARRAY_LINE_SPACING +  ARRAY_START_Y;

	this.cmd("Move", this.highlight1ID, xpos, ypos + ARRAY_ELEM_HEIGHT);
	this.cmd("Step");

	this.cmd("Move", labAddValID, xpos, ypos);
	this.cmd("Step");

	this.cmd("Settext", this.arrayID[this.head], elemToAdd);
	this.cmd("Delete", labAddValID);

	this.cmd("Delete", this.highlight1ID);

	this.cmd("SetHighlight", this.headID, 1);
	this.cmd("Step");
	this.head = (this.head + 1); //% SIZE;
	this.cmd("SetText", this.headID, this.head)
	this.cmd("Step");
	this.cmd("SetHighlight", this.headID, 0);
	this.cmd("Delete", labAddID);

	return this.commands;
}

SetArray.prototype.removeCallback = function(event)
{
	if (this.head > 0 && this.valField.value != "")
	{
		var removeVal = this.valField.value;
		var removeLoc = this.arrayData.indexOf(removeVal);
		this.valField.value = "";
		if (removeLoc!=-1){
			this.implementAction(this.remove.bind(this), removeLoc);
		}
		else {
			alert("Set does not contain value "+ removeVal);
		}
	}
}

SetArray.prototype.remove = function(locToRem)
{
	this.commands = new Array();

	var labRemoveID = this.nextIndex++;
	var labRemoveValID = this.nextIndex++;

	this.cmd("SetText", this.leftoverLabelID, "");

	this.cmd("CreateLabel", labRemoveID, "Removed Value: ", SET_LABEL_X, SET_LABEL_Y);

	this.cmd("Step");

	var xpos = (locToRem  % ARRAY_ELEMS_PER_LINE) * ARRAY_ELEM_WIDTH + ARRAY_START_X;
	var ypos = Math.floor(this.head / ARRAY_ELEMS_PER_LINE) * ARRAY_LINE_SPACING +  ARRAY_START_Y;

	this.cmd("CreateHighlightCircle", this.highlight1ID, INDEX_COLOR,  xpos, ypos);
	this.cmd("Step");
	this.cmd("Delete", this.highlight1ID);

	var valToRem = this.arrayData[locToRem]
	this.cmd("CreateLabel", labRemoveValID,valToRem, xpos, ypos);
	this.cmd("Settext", this.arrayID[this.head], "");
	this.cmd("Move", labRemoveValID, SET_ELEMENT_X, SET_ELEMENT_Y);
	this.cmd("Step");

	//shift back
	for (var i = locToRem; i < this.head-1; i++)
	{
		this.cmd("SetHighlight", this.arrayID[i], 1);
		this.cmd("Step");
		this.arrayData[i] = this.arrayData[i+1];
		this.cmd("Settext", this.arrayID[i], this.arrayData[i+1]);
		this.cmd("Step");
		this.cmd("SetHighlight", this.arrayID[i], 0);
		this.cmd("Step");
	}

	this.arrayData[this.head-1] = "";
	this.cmd("Settext", this.arrayID[this.head-1], "");

	this.cmd("Step");
	this.cmd("SetHighlight", this.headID, 1);
	this.head = (this.head -1); //% SIZE;
	this.cmd("Step");
	this.cmd("SetText", this.headID, this.head)
	this.cmd("SetHighlight", this.headID, 0);

	this.cmd("Step");
	this.cmd("Delete", labRemoveID)
	this.cmd("Delete", labRemoveValID);
	return this.commands;
}


SetArray.prototype.clearCallback = function(event)
{
	this.implementAction(this.clearAll.bind(this), "");
}

SetArray.prototype.clearAll = function()
{
	this.commands = new Array();
	this.cmd("SetText", this.leftoverLabelID, "");

	for (var i = 0; i < SIZE; i++)
	{
		this.cmd("SetText", this.arrayID[i], "");
	}
	this.head = 0;
	this.cmd("SetText", this.leftoverLabelID, "Set cleared");
	this.cmd("SetText", this.headID, "0");
	return this.commands;

}


var currentAlg;

function init()
{
	var animManag = initCanvas();
	currentAlg = new SetArray(animManag, canvas.width, canvas.height);
}
