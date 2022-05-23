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

var LINKED_LIST_INSERT_X = 250;
var LINKED_LIST_INSERT_Y = 50;

var SIZE = DEFAULT_CAPACITY;

var LINKED_LIST_ELEMS_PER_LINE = SIZE/2;
var LINKED_LIST_ELEM_SPACING = 100;
var LINKED_LIST_LINE_SPACING = 100;

var TOP_POS_X = 180;
var TOP_POS_Y = 100;

var TOP_LABEL_X = 130;
var TOP_LABEL_Y =  100;

var SIZE_X_ADJUSTMENT = 200;

var TOP_ELEM_WIDTH = 30;
var TOP_ELEM_HEIGHT = 30;

var TAIL_POS_X = 180;
var TAIL_LABEL_X = 130;

var PUSH_LABEL_X = 50;
var PUSH_LABEL_Y = 30;

var PUSH_ELEMENT_X = 120;
var PUSH_ELEMENT_Y = 30;

var INDEX_COLOR = "#0000FF"

function IndexedLinkedList(am, w, h)
{
	this.init(am, w, h);
}

IndexedLinkedList.prototype = new Algorithm();
IndexedLinkedList.prototype.constructor = IndexedLinkedList;
IndexedLinkedList.superclass = Algorithm.prototype;

IndexedLinkedList.prototype.init = function(am, w, h)
{
	IndexedLinkedList.superclass.init.call(this, am, w, h);
	this.addControls();
	this.nextIndex = 0;
	this.commands = [];
	this.setup();
	this.initialIndex = this.nextIndex;
}


IndexedLinkedList.prototype.addControls =  function()
{
	this.controls = [];

	this.insertButton = addControlToAlgorithmBar("Button", "Add Element: | Value | Location |");
	this.insertButton.onclick = this.insertCallback.bind(this);
	this.controls.push(this.insertButton);

	this.insertValue = addControlToAlgorithmBar("Text", "");
	this.insertLocation = addControlToAlgorithmBar("Text", "");
	this.controls.push(this.insertValue);
	this.controls.push(this.insertLocation);
	this.insertLocation.onkeydown = this.returnSubmit(this.insertLocation,  this.insertCallback.bind(this), 6);
	this.insertValue.onkeydown = this.returnSubmit(this.insertValue,  this.insertCallback.bind(this), 6);

	this.removeButton = addControlToAlgorithmBar("Button", "Remove Element: Location");
	this.removeButton.onclick = this.removeCallback.bind(this);
	this.controls.push(this.removeButton);

	this.removeLocation = addControlToAlgorithmBar("Text", "");
	this.removeLocation.onkeydown = this.returnSubmit(this.removeLocation,  this.removeCallback.bind(this), 6);
	this.controls.push(this.removeLocation);
}

IndexedLinkedList.prototype.enableUI = function(event)
{
	for (var i = 0; i < this.controls.length; i++)
	{
		this.controls[i].disabled = false;
	}
}

IndexedLinkedList.prototype.disableUI = function(event)
{
	for (var i = 0; i < this.controls.length; i++)
	{
		this.controls[i].disabled = true;
	}
}

IndexedLinkedList.prototype.setup = function()
{
	this.linkedListElemID = new Array(SIZE);
	this.arrayData = new Array(SIZE);
	for (var i = 0; i < SIZE; i++)
	{
		this.linkedListElemID[i]= this.nextIndex++;

	}
	this.headID = this.nextIndex++;
	this.headLabelID = this.nextIndex++;

	this.top = 0;
	this.leftoverLabelID = this.nextIndex++;

	this.cmd("CreateLabel", this.headLabelID, "Head", TOP_LABEL_X, TOP_LABEL_Y);
	this.cmd("CreateRectangle", this.headID, "", TOP_ELEM_WIDTH, TOP_ELEM_HEIGHT, TOP_POS_X, TOP_POS_Y);
	this.cmd("SetNull", this.headID, 1);

	this.sizeID = this.nextIndex++;
	this.sizeLabelID = this.nextIndex++;

	this.cmd("CreateLabel", this.sizeLabelID, "Size", TOP_POS_X + SIZE_X_ADJUSTMENT, TOP_POS_Y);
	this.cmd("CreateRectangle", this.sizeID, "0", TOP_ELEM_WIDTH, TOP_ELEM_HEIGHT, TOP_POS_X +SIZE_X_ADJUSTMENT+50, TOP_POS_Y);

	this.cmd("CreateLabel", this.leftoverLabelID, "", 5, PUSH_LABEL_Y,0);

	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();
}



IndexedLinkedList.prototype.resetLinkedListPositions = function(startingFrom)
{
	let str= '';
	for (var i = this.top ; i >= 0; i--)
	{
		var nextX = i * LINKED_LIST_ELEM_SPACING + LINKED_LIST_START_X;
		//var nextX = i % LINKED_LIST_ELEMS_PER_LINE * LINKED_LIST_ELEM_SPACING + LINKED_LIST_START_X;
		var nextY = LINKED_LIST_START_Y;
		//var nextY = Math.floor(i/ LINKED_LIST_ELEMS_PER_LINE) * LINKED_LIST_LINE_SPACING + LINKED_LIST_START_Y;
		this.cmd("Move", this.linkedListElemID[i], nextX, nextY);
		str += ("index=" + i + " id=" + this.linkedListElemID[i] + " value=" + this.arrayData[i] + " to location " + nextX + ":" + nextY +"\n");
	}
	//alert(str);
}

IndexedLinkedList.prototype.reset = function()
{
	this.top = 0;
	this.nextIndex = this.initialIndex;
}

IndexedLinkedList.prototype.insertCallback = function(event)
{
	if (this.top < SIZE && this.insertValue.value != "" && this.insertLocation.value != "")
	{
		var insertVal = this.insertValue.value;
		var insertLoc = Number(this.insertLocation.value);
		this.insertValue.value = "";
		this.insertLocation.value = "";
		if (insertLoc>=0 && insertLoc<=this.top)
		{
			this.implementAction(this.insert.bind(this), [insertVal,insertLoc]);
		}
		else
		{
			this.cmd("SetText", this.leftoverLabelID, "Index is out of bounds");
			this.insertValue.value = "Index is out of bounds";
		}
	}
}

IndexedLinkedList.prototype.insert = function(dataToInsert)
{
	var elemToInsert=dataToInsert[0];
	var locToInsert=Number(dataToInsert[1]);
	this.commands = new Array();

	this.cmd("SetText", this.leftoverLabelID, "");

	var labInsertID = this.nextIndex++;
	var labInsertValID = this.nextIndex++;
	this.cmd("CreateLabel", labInsertID, "Inserting Value: ", PUSH_LABEL_X, PUSH_LABEL_Y);
	this.cmd("CreateLabel", labInsertValID,elemToInsert, PUSH_ELEMENT_X, PUSH_ELEMENT_Y);
	this.cmd("Delete", labInsertValID);
	this.cmd("CreateLinkedList",this.linkedListElemID[locToInsert], "" ,LINKED_LIST_ELEM_WIDTH, LINKED_LIST_ELEM_HEIGHT,
		LINKED_LIST_INSERT_X, LINKED_LIST_INSERT_Y, 0.25, 0, 1, 1);
	if (this.top == 0)
	{
		this.cmd("SetNull", this.headID, 0);
		this.cmd("connect", this.headID, this.linkedListElemID[this.top]);
		this.cmd("SetNull", this.linkedListElemID[locToInsert+1], 0);
		this.cmd("Connect",  this.linkedListElemID[locToInsert], this.linkedListElemID[locToInsert+1]);
		this.cmd("Step");
	}
	else if (this.top == locToInsert)
	{
		this.cmd("SetNull", this.linkedListElemID[locToInsert-1], 0);
		this.cmd("Connect",  this.linkedListElemID[locToInsert-1], this.linkedListElemID[locToInsert]);
		this.cmd("Step");
	}
	else if (locToInsert == 0)
	{
		this.cmd("Disconnect", this.headID, this.linkedListElemID[1]);
		this.cmd("Connect",  this.linkedListElemID[locToInsert], this.linkedListElemID[1]);
		this.cmd("connect", this.headID, this.linkedListElemID[locToInsert]);
		this.cmd("SetNull", this.linkedListElemID[locToInsert], 0);
		//this.cmd("SetNull", this.linkedListElemID[locToInsert-1], 0);
		this.cmd("Step");
		//this.cmd("Disconnect", this.tailID, this.linkedListElemID[1]);
	}
	else
	{
		this.cmd("SetNull", this.linkedListElemID[locToInsert], 0);
		this.cmd("Disconnect", this.linkedListElemID[locToInsert-1], this.linkedListElemID[locToInsert+1]);
		this.cmd("Step");
		this.cmd("Connect",  this.linkedListElemID[locToInsert-1], this.linkedListElemID[locToInsert]);
		this.cmd("Connect",  this.linkedListElemID[locToInsert], this.linkedListElemID[locToInsert+1]);
		this.cmd("Step");
	}
	/*
	var oldElem = this.arrayData[locToInsert];
	var newID = this.linkedListElemID[this.top+1];

	if (this.top == locToInsert)//inserting at an empty node
		{
			this.cmd("CreateLinkedList",newID, "" ,LINKED_LIST_ELEM_WIDTH, LINKED_LIST_ELEM_HEIGHT,
				LINKED_LIST_INSERT_X, LINKED_LIST_INSERT_Y, 0.25, 0, 1, 1);
			this.cmd("SetHighlight", newID, 1);
			this.cmd("SetText", newID, oldElem);
			this.cmd("SetNull", newID, 1);
			this.cmd("SetHighlight", newID, 0);
			this.cmd("Step");

			this.cmd("SetNull", this.linkedListElemID[locToInsert], 0);
			this.cmd("SetHighlight", this.linkedListElemID[locToInsert], 1);
			this.cmd("Step");

			this.cmd("SetText", this.linkedListElemID[locToInsert], elemToInsert);
			this.cmd("Step");

			this.cmd("SetHighlight", this.linkedListElemID[locToInsert], 0);
			this.cmd("Step");

			this.cmd("Disconnect",  this.linkedListElemID[locToInsert], newID);
			this.cmd("Connect",  this.linkedListElemID[locToInsert], this.linkedListElemID[locToInsert+1]);
			this.cmd("Step");
		}
		else
		{
			var nextID = this.linkedListElemID[locToInsert+1];
			for (var i  = this.top + 1; i > locToInsert; i--)
			{
					this.arrayData[i] = this.arrayData[i-1];
					this.linkedListElemID[i] = this.linkedListElemID[i-1];
			}
			this.cmd("CreateLinkedList",newID, "" ,LINKED_LIST_ELEM_WIDTH, LINKED_LIST_ELEM_HEIGHT,
				LINKED_LIST_INSERT_X, LINKED_LIST_INSERT_Y, 0.25, 0, 1, 1);
			this.cmd("SetHighlight", newID, 1);
			this.cmd("Step");

			this.cmd("SetText", newID, oldElem);
			this.cmd("Step");

			this.cmd("Connect", newID, nextID);
			this.cmd("SetHighlight",newID, 0);
			this.cmd("Step");

			this.cmd("SetHighlight", this.linkedListElemID[locToInsert], 1);
			this.cmd("Step");

			this.cmd("Disconnect", this.linkedListElemID[locToInsert], nextID);
			this.cmd("Connect", this.linkedListElemID[locToInsert], newID);
			this.cmd("Step");

			this.cmd("SetText", this.linkedListElemID[locToInsert], elemToInsert);
			this.cmd("Step");

			this.cmd("SetHighlight", this.linkedListElemID[locToInsert], 0);
			this.linkedListElemID[locToInsert+1] = newID;
	}*/

	this.arrayData[locToInsert] = elemToInsert;

	this.cmd("SetHighlight", this.sizeID, 1);
	this.cmd("Step");

	this.top = this.top + 1;
	this.cmd("SetText", this.sizeID, this.top)
	this.cmd("SetHighlight", this.sizeID, 0);
	this.cmd("Step");

	this.cmd("Delete", labInsertID);
	this.cmd("SetText", this.leftoverLabelID, "");
	this.resetLinkedListPositions(locToInsert);

	return this.commands;
}

IndexedLinkedList.prototype.removeCallback = function(event)
{
	if (this.top > 0)
	{
		//this.implementAction(this.remove.bind(this), "");
	}
}

/*IndexedLinkedList.prototype.remove = function(ignored)
{
	this.commands = new Array();

	var labPopID = this.nextIndex++;
	var labPopValID = this.nextIndex++;

	this.cmd("SetText", this.leftoverLabelID, "");


	this.cmd("CreateLabel", labPopID, "Removed Value: ", PUSH_LABEL_X, PUSH_LABEL_Y);
	this.cmd("CreateLabel", labPopValID,this.arrayData[this.top - 1], LINKED_LIST_START_X, LINKED_LIST_START_Y);

	this.cmd("Move", labPopValID,  PUSH_ELEMENT_X, PUSH_ELEMENT_Y);
	this.cmd("Step");
	this.cmd("Disconnect", this.headID, this.linkedListElemID[this.top - 1]);

	if (this.top == 1)
	{
		this.cmd("SetNull", this.headID, 1);
	}
	else
	{
		this.cmd("Connect", this.headID, this.linkedListElemID[this.top-2]);
	}
	this.cmd("Step");
	this.cmd("Delete", this.linkedListElemID[this.top - 1]);

	this.cmd("SetHighlight", this.sizeID, 1);
	this.cmd("Step");
	this.top = this.top - 1;
	this.cmd("SetText", this.sizeID, this.top)
	this.cmd("Step");
	this.cmd("SetHighlight", this.sizeID, 0);

	this.resetLinkedListPositions(0);

	this.cmd("Delete", labPopValID)
	this.cmd("Delete", labPopID);
	this.cmd("SetText", this.leftoverLabelID, "");

	return this.commands;
}*/

var currentAlg;

function init()
{
	var animManag = initCanvas();
	currentAlg = new IndexedLinkedList(animManag, canvas.width, canvas.height);
}
