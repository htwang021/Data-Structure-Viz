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
// THIS SOFTWARE IS PROVIDED BY David Galles ``AS IS'' AND ANY EXPRESS OR IMPLIED
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


// Constants.

BST.LINK_COLOR = "#BE0F34";
BST.BLUE_COLOR = "#0000FF";
BST.WHITE_COLOR = "#FFFFFF";
BST.HIGHLIGHT_CIRCLE_COLOR = "#BE0F34";
BST.FOREGROUND_COLOR = "#BE0F34";
BST.BACKGROUND_COLOR = "#F5D1D6";
BST.PRINT_COLOR = BST.FOREGROUND_COLOR;

BST.WIDTH_DELTA  = 50;
BST.HEIGHT_DELTA = 50;
BST.STARTING_Y = 50;

var SIZE_POS_X = 700;
var SIZE_POS_Y = 40;

var SIZE_LABEL_X = 660;
var SIZE_LABEL_Y =  40;

var SIZE_WIDTH = 30;
var SIZE_HEIGHT = 30;

BST.FIRST_PRINT_POS_X  = 50;
BST.PRINT_VERTICAL_GAP  = 20;
BST.PRINT_HORIZONTAL_GAP = 50;

var MAX_RAND_INT = DEFAULT_CAPACITY*11;

function BST(am, w, h){
	this.init(am, w, h);
}

BST.prototype = new Algorithm();
BST.prototype.constructor = BST;
BST.superclass = Algorithm.prototype;

BST.prototype.init = function(am, w, h){
	var sc = BST.superclass;
	this.startingX =  w / 2;
	this.first_print_pos_y  = h - 2 * BST.PRINT_VERTICAL_GAP;
	this.print_max  = w - 10;
	var fn = sc.init;
	fn.call(this,am);
	this.addControls();
	this.nextIndex = 0;
	this.commands = new Array();
	this.setup();
	this.initialIndex = this.nextIndex;
}

BST.prototype.addControls = function(){
	this.insertField = addControlToAlgorithmBar("Text", nextRandInt());
	this.insertField.onkeydown = this.returnSubmit(this.insertField,  this.insertCallback.bind(this), 4);
	this.insertButton = addControlToAlgorithmBar("Button", "Insert");
	this.insertButton.onclick = this.insertCallback.bind(this);
	this.deleteField = addControlToAlgorithmBar("Text", "");
	this.deleteField.onkeydown = this.returnSubmit(this.deleteField,  this.deleteCallback.bind(this), 4);
	this.deleteButton = addControlToAlgorithmBar("Button", "Delete");
	this.deleteButton.onclick = this.deleteCallback.bind(this);
	this.findField = addControlToAlgorithmBar("Text", "");
	this.findField.onkeydown = this.returnSubmit(this.findField,  this.findCallback.bind(this), 4);
	this.findButton = addControlToAlgorithmBar("Button", "Find");
	this.findButton.onclick = this.findCallback.bind(this);
	this.printButton = addControlToAlgorithmBar("Button", "Inorder Traversal");
	this.printButton.onclick = this.printCallback.bind(this);
}

BST.prototype.setup = function(){
	this.top = 0;

	var emptyRoot =  this.nextIndex++;
	this.treeRoot = new BSTNode(null, emptyRoot, this.startingX, BST.STARTING_Y)
	this.cmd("CreateCircle", emptyRoot, "null", this.startingX, BST.STARTING_Y);
	this.cmd("SetForegroundColor", emptyRoot, BST.FOREGROUND_COLOR);

	this.sizeID = this.nextIndex++;
	this.sizeLabelID = this.nextIndex++;
	this.cmd("CreateLabel", this.sizeLabelID, "Size", SIZE_LABEL_X, SIZE_LABEL_Y);
	this.cmd("CreateRectangle", this.sizeID, this.top, SIZE_WIDTH, SIZE_HEIGHT, SIZE_POS_X, SIZE_POS_Y);

	this.leftoverLabelID = this.nextIndex++;
	this.cmd("CreateLabel", this.leftoverLabelID, "", 20, 10, 0);
	this.cmd("SetForegroundColor", this.leftoverLabelID,BST.BLUE_COLOR);

	this.rootLabelID = this.nextIndex++;

	this.cmd("CreateLabel", this.rootLabelID, "root", this.startingX, BST.STARTING_Y-30);

	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();
}

BST.prototype.reset = function(){
	this.nextIndex = this.initialIndex;
	this.top = 0;
	this.treeRoot = new BSTNode(null, 0, this.startingX, BST.STARTING_Y)
}

BST.prototype.printCallback = function(event){
	this.implementAction(this.printTree.bind(this),"");
}

BST.prototype.printTree = function(unused){
	this.commands = new Array();

	if (this.treeRoot.data != null){
		this.highlightID = this.nextIndex++;
		var firstLabel = this.nextIndex;
		this.cmd("CreateHighlightCircle", this.highlightID, BST.HIGHLIGHT_CIRCLE_COLOR, this.treeRoot.x, this.treeRoot.y);
		this.xPosOfNextLabel = BST.FIRST_PRINT_POS_X;
		this.yPosOfNextLabel = this.first_print_pos_y;
		this.printTreeRec(this.treeRoot);
		this.cmd("Delete",  this.highlightID);
		this.cmd("Step");

		for (var i = firstLabel; i < this.nextIndex; i++){
			this.cmd("Delete", i);
		}
		this.nextIndex = this.highlightID;  /// Reuse objects.  Not necessary.
	}
	return this.commands;
}

BST.prototype.printTreeRec = function(tree){
	this.cmd("Step");

	if (tree.left != null){
		this.cmd("Move", this.highlightID, tree.left.x, tree.left.y);
		this.printTreeRec(tree.left);
		this.cmd("Move", this.highlightID, tree.x, tree.y);
		this.cmd("Step");
	}

	if(tree.data!=null){
		var nextLabelID = this.nextIndex++;
		this.cmd("CreateLabel", nextLabelID, tree.data, tree.x, tree.y);
		this.cmd("SetForegroundColor", nextLabelID, BST.PRINT_COLOR);
		this.cmd("Move", nextLabelID, this.xPosOfNextLabel, this.yPosOfNextLabel);
		this.cmd("Step");
		this.xPosOfNextLabel +=  BST.PRINT_HORIZONTAL_GAP;
		if (this.xPosOfNextLabel > this.print_max){
			this.xPosOfNextLabel = BST.FIRST_PRINT_POS_X;
			this.yPosOfNextLabel += BST.PRINT_VERTICAL_GAP;
		}
	}

	if (tree.right != null){
		this.cmd("Move", this.highlightID, tree.right.x, tree.right.y);
		this.printTreeRec(tree.right);
		this.cmd("Move", this.highlightID, tree.x, tree.y);
		this.cmd("Step");
	}

	return;
}

BST.prototype.findCallback = function(event){
	var findValue;
	findValue = this.normalizeNumber(this.findField.value, 4);
	this.findField.value = "";
	this.implementAction(this.findElement.bind(this),findValue);
}

BST.prototype.findElement = function(findValue){
	this.commands = new Array();
	this.highlightID = this.nextIndex++;
	this.cmd("CreateHighlightCircle", this.highlightID, BST.HIGHLIGHT_CIRCLE_COLOR, this.treeRoot.x, this.treeRoot.y);
	this.doFind(this.treeRoot, findValue);
	this.cmd("Step");
	this.cmd("Delete", this.highlightID);
	this.cmd("Step");
	this.cmd("SetText", this.leftoverLabelID, "");
	return this.commands;
}

BST.prototype.doFind = function(tree, value){
	this.cmd("SetText",this.leftoverLabelID, "Searching for "+value);
	if (tree != null){
		if (tree.data == value){
			this.cmd("SetText", this.leftoverLabelID, "Searching for "+value+" : " + value + " = " + value + " (Element found!)");
		}
		else{
			if (tree.data > value){
				this.cmd("SetText", this.leftoverLabelID, "Searching for "+value+" : " + value + " < " + tree.data + " (look in left subtree)");
				this.cmd("Step");
				if (tree.left!= null){
					this.cmd("Move", this.highlightID, tree.left.x, tree.left.y);
					this.cmd("Step");
				}
				this.doFind(tree.left, value);
			}
			else{
				this.cmd("SetText", this.leftoverLabelID, "Searching for "+value+" : " + value + " > " + tree.data + " (look in right subtree)");
				this.cmd("Step");
				if (tree.right!= null){
					this.cmd("Move", this.highlightID, tree.right.x, tree.right.y);
					this.cmd("Step");
				}
				this.doFind(tree.right, value);
			}
		}
	}
	else{
		this.cmd("SetText", this.leftoverLabelID, "Searching for "+value+" : " + " (Element not found)");
	}
}

BST.prototype.insertCallback = function(event){
	var insertedValue = this.insertField.value;
	insertedValue = this.normalizeNumber(insertedValue, 4);
	if (insertedValue != ""){
		this.insertField.value =nextRandInt();
		this.implementAction(this.insertElement.bind(this), insertedValue);
	}
}

BST.prototype.insertElement = function(insertedValue){
	this.commands = new Array();
	this.cmd("SetText", this.leftoverLabelID, "Inserting "+insertedValue);
	this.cmd("Step");

	var newNode =  this.nextIndex++;
	this.cmd("CreateCircle", newNode, insertedValue, 100, 100);
	this.cmd("Step");

	this.highlightID = this.nextIndex++;
	this.cmd("CreateHighlightCircle", this.highlightID, BST.HIGHLIGHT_CIRCLE_COLOR, this.treeRoot.x, this.treeRoot.y);
	this.insert(insertedValue, this.treeRoot)
	this.resizeTree();
	this.cmd("SetText", this.leftoverLabelID, "");
	this.cmd("Delete", newNode);

	return this.commands;
}

BST.prototype.insert = function(elem, tree){
	if (tree.data==null){ //arrived at an empty node
		this.cmd("SetText", this.leftoverLabelID, "Found an empty node. Inserting element");
		this.cmd("Step");

		tree.data = elem;
		this.cmd("SetText", tree.graphicID, elem);
		this.cmd("SetForegroundColor", tree.graphicID, BST.FOREGROUND_COLOR);
		this.cmd("SetBackgroundColor", tree.graphicID, BST.BACKGROUND_COLOR);
		this.cmd("Step");

		//add two empty children
		var leftEmptyChild = this.nextIndex++;
		tree.left = new BSTNode(null, leftEmptyChild, tree.x , tree.y );
		tree.left.parent = tree;
		this.cmd("CreateCircle", leftEmptyChild, "null", tree.x - BST.WIDTH_DELTA/2, tree.y + BST.HEIGHT_DELTA);
		this.cmd("SetForegroundColor", leftEmptyChild, BST.FOREGROUND_COLOR);
		this.cmd("Connect", tree.graphicID, leftEmptyChild, BST.LINK_COLOR);

		var rightEmptyChild = this.nextIndex++;
		tree.right = new BSTNode(null, rightEmptyChild, tree.x , tree.y);
		tree.right.parent = tree;
		this.cmd("CreateCircle", rightEmptyChild, "null",tree.x + BST.WIDTH_DELTA/2, tree.y + BST.HEIGHT_DELTA);
		this.cmd("SetForegroundColor", rightEmptyChild, BST.FOREGROUND_COLOR);
		this.cmd("Connect", tree.graphicID, rightEmptyChild, BST.LINK_COLOR)

		//increase size of tree by 1
		this.cmd("Step");
		this.cmd("SetText", this.leftoverLabelID,"Update size and make tree look pretty again.");
		this.cmd("Delete", this.highlightID);
		this.cmd("Step");
		this.cmd("SetHighlight", this.sizeID,1);
		this.cmd("Step");
		this.top = this.top + 1;
		this.cmd("SetText", this.sizeID, this.top)
		this.cmd("Step");
		this.cmd("SetHighlight", this.sizeID,0);
	}
	else{ //keep looking
		this.cmd("Step");
		if (elem < tree.data)	{
			this.cmd("SetText", this.leftoverLabelID,  elem + " < " + tree.data + ". Going to left subtree");
			this.cmd("Move", this.highlightID, tree.left.x,tree.left.y);
			this.insert(elem, tree.left);
		}
		else if (elem> tree.data){
			this.cmd("SetText", this.leftoverLabelID, elem + " > " + tree.data + ". Going to right subtree");
			this.cmd("Move", this.highlightID, tree.right.x,tree.right.y);
			this.insert(elem, tree.right);
		}
		else{
			this.cmd("SetText", this.leftoverLabelID,elem + " == " + tree.data + ". No duplicates allowed");
			this.cmd("Delete", this.highlightID);
		}
	}
}

BST.prototype.deleteCallback = function(event){
	var deletedValue = this.deleteField.value;
	if (deletedValue != ""){
		deletedValue = this.normalizeNumber(deletedValue, 4);
		this.deleteField.value = "";
		this.implementAction(this.deleteElement.bind(this),deletedValue);
	}
}

BST.prototype.deleteElement = function(deletedValue){
	this.commands = new Array();
	this.cmd("SetText", this.leftoverLabelID, "Deleting "+deletedValue);
	this.cmd("Step");
	this.highlightID = this.nextIndex++;
	this.cmd("CreateHighlightCircle", this.highlightID, BST.HIGHLIGHT_CIRCLE_COLOR, this.treeRoot.x, this.treeRoot.y);
	this.treeDelete(this.treeRoot, deletedValue);
	this.resizeTree();
	this.cmd("SetText", this.leftoverLabelID, "");
	this.cmd("Step");
	return this.commands;
}

BST.prototype.treeDelete = function(tree, valueToDelete){
	this.cmd("Step");
	if (tree.data == null){
		this.cmd("SetText", this.leftoverLabelID, "Element "+valueToDelete+" not found. Could not delete");
		this.cmd("Delete", this.highlightID);
		this.cmd("Step");
		return;
	}
	var isLeftchild = false;
	if (tree.parent != null){
		//"tree" is the left child of some node
		isLeftchild = tree.parent.left == tree;
	}

	if (valueToDelete == tree.data){
		if (tree.left.data == null && tree.right.data == null){
			this.cmd("SetText", this.leftoverLabelID, "Found match! Node to delete is a leaf node. Make it an empty node.");
			this.cmd("Step");

			this.cmd("SetText", tree.graphicID, "null");
			tree.data = null;
			this.cmd("Delete", tree.left.graphicID);
			tree.left = null;
			this.cmd("Delete", tree.right.graphicID);
			tree.right = null;
			this.cmd("Step")

			this.cmd("SetBackgroundColor", tree.graphicID, BST.WHITE_COLOR);
			this.cmd("Delete", this.highlightID);
			this.cmd("Step");
		}

		else if (tree.left.data == null){
			this.cmd("SetText", this.leftoverLabelID, "Found match! Node to delete has no left child. \nSet parent of deleted node to right child of deleted node.");
			this.cmd("Step");
			if (tree.parent != null){
				this.cmd("Disconnect",  tree.parent.graphicID, tree.graphicID);
				this.cmd("Connect",  tree.parent.graphicID, tree.right.graphicID, BST.LINK_COLOR);
				tree.right.parent = tree.parent;
				this.cmd("Step");

				if (isLeftchild){
					tree.parent.left = tree.right;
				}
				else{
					tree.parent.right = tree.right;
				}
			}
			else{
					this.treeRoot = tree.right;
					this.treeRoot.parent = null;
				}
				this.cmd("Delete", this.highlightID);
				this.cmd("Delete", tree.left.graphicID);
				this.cmd("Delete", tree.graphicID);
				this.cmd("Step");
		}

		else if (tree.right.data == null){
			this.cmd("SetText", this.leftoverLabelID, "Found match! Node to delete has no right child. \nSet parent of deleted node to left child of deleted node.");
			this.cmd("Step");
			if (tree.parent != null){
				this.cmd("Disconnect", tree.parent.graphicID, tree.graphicID);
				this.cmd("Connect", tree.parent.graphicID, tree.left.graphicID, BST.LINK_COLOR);
				tree.left.parent = tree.parent;
				this.cmd("Step");

				if (isLeftchild){
					tree.parent.left = tree.left;
				}
				else{
					tree.parent.right = tree.left;
				}
			}
			else{
				this.treeRoot = tree.left;
				this.treeRoot.parent = null;
			}
			this.cmd("Delete", this.highlightID);
			this.cmd("Delete", tree.right.graphicID);
		 	this.cmd("Delete",  tree.graphicID);
		 	this.cmd("Step");
		}

		else{ // tree.left != null && tree.right != null
			this.cmd("SetText", this.leftoverLabelID, "Found match! Node to delete has two childern. \nFind smallest node in right subtree.");
			this.highlightID2 = this.nextIndex;
			this.nextIndex += 1;
			this.cmd("Step");
			var tmp = tree;
			tmp = tree.right;
			this.cmd("CreateHighlightCircle", this.highlightID2, BST.BLUE_COLOR, tmp.x, tmp.y);
			this.cmd("Step");
			while (tmp.left.data != null){
				tmp = tmp.left;
				this.cmd("Move", this.highlightID2, tmp.x, tmp.y);
				this.cmd("Step");
			}
			this.cmd("SetText", this.leftoverLabelID, "Copy smallest value of right subtree into node to delete.");
			this.cmd("SetText", tree.graphicID, "");
			var labelID = this.nextIndex++;
			this.cmd("CreateLabel", labelID, tmp.data, tmp.x, tmp.y);
			tree.data = tmp.data;
			this.cmd("Move", labelID, tree.x, tree.y);
			this.cmd("Step");
			this.cmd("Delete", labelID);
			this.cmd("SetText", tree.graphicID, tree.data);
			this.cmd("SetText", this.leftoverLabelID, "Remove node whose value we copied.");
			this.cmd("Step");
			this.cmd("Delete", this.highlightID2);
			this.cmd("Disconnect", tmp.parent.graphicID,  tmp.graphicID);
			this.cmd("Connect", tmp.parent.graphicID, tmp.right.graphicID, BST.LINK_COLOR);
			this.cmd("Delete", this.highlightID);
			this.cmd("Step");
			this.cmd("Delete", tmp.left.graphicID);
			this.cmd("Delete", tmp.graphicID);
			if (tmp == tree.right){
				tree.right = tmp.right;
				tree.right.parent = tree;
			}
			else{
				tmp.parent.left = tmp.right;
				tmp.right.parent = tmp.parent
			}
		}
		this.cmd("Step");
		this.cmd("SetText", this.leftoverLabelID,"Update size and make tree look pretty again.");
		this.cmd("SetHighlight", this.sizeID, 1);
		this.cmd("Step");
		this.top = this.top - 1;
		this.cmd("SetText", this.sizeID, this.top)
		this.cmd("Step");
		this.cmd("SetHighlight", this.sizeID, 0);
	}
	else if (valueToDelete < tree.data){
		this.cmd("SetText", this.leftoverLabelID, valueToDelete + " < " + tree.data + ". Going to left subtree");
		this.cmd("Move", this.highlightID, tree.left.x, tree.left.y);
		this.treeDelete(tree.left, valueToDelete);
	}
	else{ // if (valueToDelete > tree.data)
		this.cmd("SetText", this.leftoverLabelID,valueToDelete + " > " + tree.data + ". Going to right subtree");
		this.cmd("Move", this.highlightID, tree.right.x, tree.right.y);
		this.treeDelete(tree.right, valueToDelete);
	}
}

BST.prototype.resizeTree = function(){
	var startingPoint  = this.startingX;
	this.resizeWidths(this.treeRoot);
	if (this.treeRoot != null){
		if (this.treeRoot.leftWidth > startingPoint){
			startingPoint = this.treeRoot.leftWidth;
		}
		else if (this.treeRoot.rightWidth > startingPoint){
			startingPoint = Math.max(this.treeRoot.leftWidth, 2 * startingPoint - this.treeRoot.rightWidth);
		}
		this.setNewPositions(this.treeRoot, startingPoint, BST.STARTING_Y, 0);
		this.animateNewPositions(this.treeRoot);
		this.cmd("Step");
	}
	else{
		this.cmd("SetText", this.leftoverLabelID, "Having issues deleting tree head");
	}
}

BST.prototype.setNewPositions = function(tree, xPosition, yPosition, side){
	if (tree != null){
		tree.y = yPosition;
		if (side == -1){
			xPosition = xPosition - tree.rightWidth;
		}
		else if (side == 1){
			xPosition = xPosition + tree.leftWidth;
		}
		tree.x = xPosition;
		this.setNewPositions(tree.left, xPosition, yPosition + BST.HEIGHT_DELTA, -1)
		this.setNewPositions(tree.right, xPosition, yPosition + BST.HEIGHT_DELTA, 1)
	}
}

BST.prototype.animateNewPositions = function(tree){
	if (tree != null){
		this.cmd("Move", tree.graphicID, tree.x, tree.y);
		this.animateNewPositions(tree.left);
		this.animateNewPositions(tree.right);
	}
}

BST.prototype.resizeWidths = function(tree){
	if (tree == null){
		return 0;
	}
	tree.leftWidth = Math.max(this.resizeWidths(tree.left), BST.WIDTH_DELTA / 2);
	tree.rightWidth = Math.max(this.resizeWidths(tree.right), BST.WIDTH_DELTA / 2);
	return tree.leftWidth + tree.rightWidth;
}

function BSTNode(val, id, initialX, initialY){
	this.data = val;
	this.x = initialX;
	this.y = initialY;
	this.graphicID = id;
	this.left = null;
	this.right = null;
	this.parent = null;
}

BST.prototype.disableUI = function(event){
	this.insertField.disabled = true;
	this.insertButton.disabled = true;
	this.deleteField.disabled = true;
	this.deleteButton.disabled = true;
	this.findField.disabled = true;
	this.findButton.disabled = true;
	this.printButton.disabled = true;
}

BST.prototype.enableUI = function(event){
	this.insertField.disabled = false;
	this.insertButton.disabled = false;
	this.deleteField.disabled = false;
	this.deleteButton.disabled = false;
	this.findField.disabled = false;
	this.findButton.disabled = false;
	this.printButton.disabled = false;
}

var currentAlg;

function init(){
	var animManag = initCanvas();
	currentAlg = new BST(animManag, canvas.width, canvas.height);
}
