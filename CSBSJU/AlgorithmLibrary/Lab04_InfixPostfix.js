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

var SIZE = 22;

var INFIX_EXPR_START_X = 20;
var INFIX_EXPR_START_Y = 20;

var ARRAY_ELEM_WIDTH = 20;
var ARRAY_ELEM_HEIGHT = 20;

var INFIXQ_ELEMS_PER_LINE = SIZE;
var ARRAY_LINE_SPACING = 130;

var NEXT_TOKEN_LABEL_X = INFIX_EXPR_START_X;
var NEXT_TOKEN_LABEL_Y = INFIX_EXPR_START_Y+35;
var NEXT_TOKEN_X = NEXT_TOKEN_LABEL_X+60;
var NEXT_TOKEN_Y = NEXT_TOKEN_LABEL_Y+ARRAY_ELEM_HEIGHT+2;

var ERROR_LABEL_X = INFIX_EXPR_START_X;
var ERROR_LABEL_Y = NEXT_TOKEN_Y+35;

var INFIX_Q_START_X = NEXT_TOKEN_X + 100;
var INFIX_Q_START_Y = NEXT_TOKEN_Y;
var INFIX_Q_LABEL_X = INFIX_Q_START_X-12 ;
var INFIX_Q_LABEL_Y = INFIX_Q_START_Y-22;

var POSTFIX_Q_START_X = INFIX_Q_START_X + 150;
var POSTFIX_Q_START_Y = INFIX_Q_START_Y;
var POSTFIX_Q_LABEL_X = POSTFIX_Q_START_X-12 ;
var POSTFIX_Q_LABEL_Y = POSTFIX_Q_START_Y-22;

var POSTFIX_S_START_X = POSTFIX_Q_START_X + 100;
var POSTFIX_S_START_Y = POSTFIX_Q_START_Y;
var POSTFIX_S_LABEL_X = POSTFIX_S_START_X -12;
var POSTFIX_S_LABEL_Y = POSTFIX_S_START_Y- 22;

var EVAL_LABEL_X = POSTFIX_S_LABEL_X+50;
var EVAL_LABEL_Y = POSTFIX_S_LABEL_Y+200;
var EVAL_X = EVAL_LABEL_X+60;
var EVAL_Y = EVAL_LABEL_Y+ARRAY_ELEM_HEIGHT+2;

var ALGO_DETAILS_START_X = POSTFIX_S_LABEL_X + 100;
var ALGO_DETAILS_START_Y = POSTFIX_S_LABEL_Y  ;

var INDEX_COLOR = "#0000FF";
var ERROR_COLOR = "#FF0000";
var ALL_WHITE = "#FFFFFF";
var ALL_BLACK = "#000000";
var INITIAL_EXP = "344+6*90/ 3+  (9-3)%5";

var numTokens = 0;
var stepNumber = Number(0);

function InfixPostfix(am, w, h){
	this.init(am, w, h);
}

InfixPostfix.prototype = new Algorithm();
InfixPostfix.prototype.constructor = InfixPostfix;
InfixPostfix.superclass = Algorithm.prototype;

InfixPostfix.prototype.init = function(am, w, h){
	InfixPostfix.superclass.init.call(this, am, w, h);
	this.addControls();
	this.nextIndex = 0;
	this.commands = [];
	this.setup();
	this.initialIndex = this.nextIndex;
}

InfixPostfix.prototype.addControls =  function(){
	this.controls = [];
	//this.clearButton = addControlToAlgorithmBar("Button", "Reset All");
	//this.clearButton.onclick = this.clearCallback.bind(this);
	//this.controls.push(this.clearButton);

	this.expressionField = addControlToAlgorithmBar("Text", INITIAL_EXP);
	this.expressionField.onkeydown = this.returnSubmit(this.expressionField,  this.tokenizeCallback.bind(this), SIZE-2);
	this.controls.push(this.expressionField);

	this.tokenizeButton = addControlToAlgorithmBar("Button", "(1) TOKENIZER (Tokenize Infix Expression)");
	this.tokenizeButton.onclick = this.tokenizeCallback.bind(this);
	this.controls.push(this.tokenizeButton);

	this.convertButton = addControlToAlgorithmBar("Button", "(2) CONVERTER (from Infix to Postfix)");
	this.convertButton.onclick = this.convertCallback.bind(this);
	this.controls.push(this.convertButton);

	this.evaluateButton = addControlToAlgorithmBar("Button", "(3) EVALUATOR (Evaluate Postfix Expression)");
	this.evaluateButton.onclick = this.evaluateCallback.bind(this);
	this.controls.push(this.evaluateButton);
}

InfixPostfix.prototype.setup = function(){
	this.errorMessageID = this.nextIndex++;
	this.cmd("CreateLabel", this.errorMessageID, "", ERROR_LABEL_X, ERROR_LABEL_Y,0);
	this.cmd("SetTextColor",this.errorMessageID, ERROR_COLOR);
	this.infixExpressionLabelID = this.nextIndex++;
	this.cmd("CreateLabel", this.infixExpressionLabelID, "Infix Expression: ", INFIX_EXPR_START_X, INFIX_EXPR_START_Y,0);

	this.algoMessageID = this.nextIndex++;
	this.cmd("CreateLabel", this.algoMessageID, "Do not exceed 20 characters in your expression", ALGO_DETAILS_START_X, ALGO_DETAILS_START_Y,0);
	this.cmd("SetTextColor",this.algoMessageID, INDEX_COLOR);

	this.expressionCharID = new Array(SIZE);
	this.expressionCharLabelID = new Array(SIZE);
	for (var i = 0; i < SIZE; i++){
		this.expressionCharID[i] = this.nextIndex++;
		this.expressionCharLabelID[i] = this.nextIndex++;
		var xpos = (i+4.5) * ARRAY_ELEM_WIDTH + INFIX_EXPR_START_X;
		var ypos = 1.2*INFIX_EXPR_START_Y;
		this.cmd("CreateRectangle", this.expressionCharID[i], "",ARRAY_ELEM_WIDTH, ARRAY_ELEM_HEIGHT,xpos, ypos); // ,"#FFFFFF","#FFFFFF");
		this.cmd("CreateLabel",this.expressionCharLabelID[i], "",  xpos, ypos);
		this.cmd("SetForegroundColor", this.expressionCharID[i], ALL_WHITE);
	}

	this.infixQID = new Array(SIZE);
	this.infixQLabelID = new Array(SIZE);
	this.infixQLabel = this.nextIndex++;
	this.infixQData = new Array(SIZE);
	this.cmd("CreateLabel",this.infixQLabel, "Tokenized Infix Queue",  INFIX_Q_LABEL_X, INFIX_Q_LABEL_Y,0 );
	for (var i = 0; i < SIZE; i++){
		this.infixQID[i] = this.nextIndex++;
		this.infixQLabelID[i] = this.nextIndex++;
		var xpos = INFIX_Q_START_X;
		var ypos = i * ARRAY_ELEM_HEIGHT + INFIX_Q_START_Y;
		this.cmd("CreateRectangle", this.infixQID[i],"", ARRAY_ELEM_WIDTH, ARRAY_ELEM_HEIGHT,xpos, ypos);
		this.cmd("CreateLabel",this.infixQLabelID[i], "",  xpos, ypos );
	}

	this.nextTokenID = this.nextIndex++;
	this.nextTokenDataID = this.nextIndex++;
	this.nextTokenLabelID = this.nextIndex++;
	this.cmd("CreateRectangle", this.nextTokenID, "",ARRAY_ELEM_WIDTH*6, ARRAY_ELEM_HEIGHT,NEXT_TOKEN_X, NEXT_TOKEN_Y);
	this.cmd("CreateLabel",this.nextTokenLabelID, "Next Token ",  NEXT_TOKEN_LABEL_X, NEXT_TOKEN_LABEL_Y,0);
	this.cmd("CreateLabel",this.nextTokenDataID, "",  NEXT_TOKEN_X, NEXT_TOKEN_Y);
	this.cmd("SetForegroundColor", this.nextTokenID, ALL_BLACK);
	this.cmd("SetTextColor",this.nextTokenLabelID, ALL_BLACK);

	this.postfixQID = new Array(SIZE);
	this.postfixQLabelID = new Array(SIZE);
	this.postfixQLabel = this.nextIndex++;
	this.postfixQData = new Array(SIZE);
	this.cmd("CreateLabel",this.postfixQLabel, "Postfix Queue",  POSTFIX_Q_LABEL_X, POSTFIX_Q_LABEL_Y,0 );
	this.cmd("SetForegroundColor", this.postfixQLabel, ALL_WHITE);
	for (var i = 0; i < SIZE; i++){
		this.postfixQID[i] = this.nextIndex++;
		this.postfixQLabelID[i] = this.nextIndex++;
		var xpos = POSTFIX_Q_START_X;
		var ypos = i * ARRAY_ELEM_HEIGHT + POSTFIX_Q_START_Y;
		this.cmd("CreateRectangle", this.postfixQID[i],"", ARRAY_ELEM_WIDTH, ARRAY_ELEM_HEIGHT,xpos, ypos);
		this.cmd("CreateLabel",this.postfixQLabelID[i], "",  xpos, ypos );
		this.cmd("SetForegroundColor", this.postfixQID[i], ALL_WHITE);
	}

	this.postfixSID = new Array(SIZE);
	this.postfixSLabelID = new Array(SIZE);
	this.postfixSLabel = this.nextIndex++;
	this.postfixSData = new Array(SIZE);
	this.cmd("CreateLabel",this.postfixSLabel, "Operator Stack",  POSTFIX_S_LABEL_X, POSTFIX_S_LABEL_Y,0 );
	this.cmd("SetForegroundColor", this.postfixSLabel, ALL_WHITE);
	for (var i = 0; i < SIZE; i++){
		this.postfixSID[i] = this.nextIndex++;
		this.postfixSLabelID[i] = this.nextIndex++;
		var xpos = POSTFIX_S_START_X;
		var ypos = i * ARRAY_ELEM_HEIGHT + POSTFIX_S_START_Y;
		this.cmd("CreateRectangle", this.postfixSID[i],"", ARRAY_ELEM_WIDTH, ARRAY_ELEM_HEIGHT,xpos, ypos);
		this.cmd("CreateLabel",this.postfixSLabelID[i], "",  xpos, ypos );
		this.cmd("SetForegroundColor", this.postfixSID[i], ALL_WHITE);
	}

	this.evaluateID = this.nextIndex++;
	this.evaluateDataID = this.nextIndex++;
	this.evaluateLabelID = this.nextIndex++;
	this.cmd("CreateRectangle", this.evaluateID, "",ARRAY_ELEM_WIDTH*6, ARRAY_ELEM_HEIGHT,EVAL_X, EVAL_Y);
	this.cmd("CreateLabel",this.evaluateLabelID, "Evaluation Box ", EVAL_LABEL_X, EVAL_LABEL_Y,0);
	this.cmd("CreateLabel",this.evaluateDataID, "",  EVAL_X, EVAL_Y);
	this.cmd("SetForegroundColor", this.evaluateID, ALL_WHITE);
	this.cmd("SetTextColor",this.evaluateLabelID, ALL_WHITE);
	this.numTokens = 0;
	this.stepNumber = 0;
	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();
}

InfixPostfix.prototype.enableUI = function(event){
	for (var i = 0; i < this.controls.length; i++){
		this.controls[i].disabled = false;
	}
}

InfixPostfix.prototype.disableUI = function(event){
	for (var i = 0; i < this.controls.length; i++){
		this.controls[i].disabled = true;
	}
}

InfixPostfix.prototype.reset = function(){
	this.numTokens = 0
	this.stepNumber--;
	this.nextIndex= this.initialIndex
	this.infixQData = new Array(SIZE);
	this.postfixQData = new Array(SIZE);
	this.postfixSData = new Array(SIZE);
	this.expressionField.value = INITIAL_EXP;
}

//clear not enabled for now
InfixPostfix.prototype.clearCallback = function(){
		this.implementAction(this.clearAll.bind(this));
}

InfixPostfix.prototype.clearAll = function(){
	this.commands = [];
	try{
		//this.cmd("Delete", this.infixExpressionLabelID);
		//this.cmd("Delete", this.errorMessageID);
		//this.cmd("Delete", this.evaluateID);
		//this.cmd("Delete",this.evaluateLabelID);
		//this.cmd("Delete",this.evaluateDataID);
		//this.cmd("Delete",this.algoMessageID);
		//this.cmd("Delete",this.infixQLabel);
		//this.cmd("Delete", this.nextTokenID);
		//this.cmd("Delete",this.nextTokenLabelID);
		//this.cmd("Delete",this.nextTokenDataID);
		this.cmd("Delete",this.postfixQLabel);
		this.cmd("Delete",this.postfixSLabel);
		for (var i = 0; i < SIZE; i++){
			//this.cmd("Delete",this.expressionCharID[i]);
			//this.cmd("Delete",this.expressionCharLabelID[i]);
		//	this.cmd("Delete", this.infixQID[i]);
		//	this.cmd("Delete",this.infixQLabelID[i]);
			this.cmd("Delete", this.postfixQID[i]);
			this.cmd("Delete",this.postfixQLabelID[i]);
			this.cmd("Delete", this.postfixSID[i]);
			this.cmd("Delete",this.postfixSLabelID[i]);
		}
		//this.nextIndex = 0;
		//this.setup();
		this.reset();
	}
	catch(error){
		alert(error);
	}

	this.expressionField.value = INITIAL_EXP;
	return this.commands;
}

InfixPostfix.prototype.tokenizeCallback = function(){
	if (this.expressionField.value != "" && this.stepNumber==0){
		var originalExp = this.expressionField.value;
		this.expressionField.value = "";
		this.implementAction(this.tokenize.bind(this), originalExp);
		this.stepNumber++;
	}
	else if (this.stepNumber!=0){
		alert("TOKENIZER already executed!");
	}
}

InfixPostfix.prototype.tokenize = function(infixExp){
	this.commands = [];

	this.cmd("SetText",this.algoMessageID, "Tokenizing arithmetic expression");
	this.cmd("Step");

	var exp = infixExp;
	var len = exp.length;
	var i = 0;

	for (i = 0; i<len; i++){
		this.cmd("SetText",this.expressionCharLabelID[i], exp[i]);
		this.cmd("SetTextColor",this.expressionCharLabelID[i], ALL_BLACK);
		this.cmd("SetForegroundColor", this.expressionCharID[i], ALL_BLACK);
	}

	i = 0;
	var nextIndex = 0;
	var nextChar = "";
	var nextVal = "";
	var j = 0;
	var allowedChars = "+-*%/)(";

	while (nextIndex < len){
		nextChar = exp[nextIndex];
		var isNumber = !Number.isNaN(Number.parseInt(nextChar));
		if (allowedChars.indexOf(nextChar)!=-1){
			this.cmd("SetHighlight", this.expressionCharID[nextIndex], 1);
			this.cmd("SetText",this.algoMessageID, "Send valid operators to infix queue");
			this.cmd("Step");
			this.cmd("SetText",this.nextTokenDataID,nextChar);
			var xpos = INFIX_Q_START_X;
			var ypos = i * ARRAY_ELEM_HEIGHT + INFIX_Q_START_Y;
			this.cmd("SetHighlight", this.nextTokenDataID, 1);
			this.cmd("Step");
			this.cmd("Move",this.nextTokenDataID,xpos,ypos);
			this.cmd("Step");
			this.cmd("SetText", this.infixQLabelID[i],nextChar);
			this.infixQData[i] = nextChar;
			this.cmd("SetHighlight", this.expressionCharID[nextIndex], 0);
			this.cmd("SetHighlight", this.nextTokenDataID, 0);
			this.cmd("SetText", this.nextTokenDataID, "");
			this.cmd("Move",this.nextTokenDataID,NEXT_TOKEN_X, NEXT_TOKEN_Y);
			i++;
		}

		else if (isNumber){
			j = nextIndex;
			nextVal = "";
			this.cmd("SetHighlight", this.nextTokenDataID, 1);
			while (j < len && isNumber){
					nextVal += exp[j];
					this.cmd("SetHighlight", this.expressionCharID[j], 1);
					this.cmd("SetText",this.algoMessageID, "Encountered a digit! Continue until a non-digit \ncharacter is found. Send number to infix queue ");
					this.cmd("Step");
					this.cmd("SetText",this.nextTokenDataID,nextVal);
					this.infixQData[i] = Number(nextVal);
					this.cmd("Step");
					this.cmd("SetHighlight", this.expressionCharID[j], 0);
					j++;
					isNumber = !Number.isNaN(Number.parseInt(exp[j]));
			}
			var xpos = INFIX_Q_START_X;
			var ypos = i * ARRAY_ELEM_HEIGHT + INFIX_Q_START_Y;
			this.cmd("Move",this.nextTokenDataID,xpos,ypos);
			this.cmd("Step");
			this.cmd("SetText", this.infixQLabelID[i],nextVal);
			this.cmd("SetHighlight", this.nextTokenDataID, 0);
			this.cmd("SetText", this.nextTokenDataID, "");
			this.cmd("Move",this.nextTokenDataID,NEXT_TOKEN_X, NEXT_TOKEN_Y);
			i++;
			nextIndex = j - 1; // reconsider next token as it isn't a number
		}

		else if (nextChar == " "){
			this.cmd("SetHighlight", this.expressionCharID[nextIndex], 1);
			this.cmd("SetText",this.algoMessageID, "Ignore whitepsaces");
			this.cmd("Step");
			this.cmd("SetHighlight", this.expressionCharID[nextIndex], 0);
		}

		else {// error
			this.cmd("SetHighlight", this.expressionCharID[nextIndex], 1);
			this.cmd("SetText",this.algoMessageID, "Abort process ");
			this.cmd("Step");
			this.cmd("SetText",this.nextTokenDataID,nextChar);
			this.cmd("SetText", this.errorMessageID, "Illegal character encountered");
			break;
		}
		nextIndex++;
	}
	this.numTokens = i;
	this.cmd("step");
	this.cmd("SetText",this.algoMessageID, "");

	return this.commands;
}

InfixPostfix.prototype.convertCallback = function(){
	if(this.stepNumber==1){
		this.implementAction(this.convert.bind(this));
		this.stepNumber++;
	}
	else if (this.stepNumber<1){
		alert("Execute CONVERTER after TOKENIZER");
	}
	else if (this.stepNumber>1){
		alert("CONVERTER already executed!");
	}
}

InfixPostfix.prototype.convert = function(){
	var i = 0;
	this.commands = [];
	this.cmd("SetText",this.algoMessageID, "Converting infix to postfix ");
	this.cmd("Step");
	this.cmd("SetForegroundColor", this.postfixQLabel, ALL_BLACK);
	this.cmd("SetForegroundColor", this.postfixSLabel, ALL_BLACK);
	for (var i = 0; i < SIZE; i++){
		this.cmd("SetForegroundColor", this.postfixQID[i], ALL_BLACK);
		this.cmd("SetForegroundColor", this.postfixSID[i], ALL_BLACK);
	}
	var q=0;
	var s=0;
	for (var i = 0; i < this.numTokens; i++){
		this.cmd("SetHighlight", this.infixQLabelID[i], 1);
		this.cmd("Step");
		var nextToken = this.infixQData[i];
		var isNumber = !Number.isNaN(Number.parseInt(nextToken));
		if (isNumber){
			this.cmd("SetHighlight", this.postfixQLabelID[q], 1);
			this.cmd("SetText",this.algoMessageID, "Move operands to postfix queue ");
			this.cmd("Step");
			this.cmd("SetText", this.postfixQLabelID[q],nextToken);
			this.cmd("Step");
			this.cmd("SetHighlight", this.postfixQLabelID[q], 0);
			this.postfixQData[q++] = nextToken;
		}
		else if (nextToken==")"){
			this.cmd("SetText",this.algoMessageID, "Process right paranthesis ");
			this.cmd("Step");
			var updates = this.processRightParanthesis(s,q);
			s = updates[0];
			q = updates[1];
			if(s==q && s==-1){
					break;
			}
		}
		else{
			this.cmd("SetText",this.algoMessageID, "Process operator ");
			this.cmd("Step");
			var updates = this.processOperator(s,q, nextToken);
			s = updates[0];
			q = updates[1];
		}
		this.cmd("SetHighlight", this.infixQLabelID[i], 0);
		this.cmd("SetText",this.algoMessageID, "");
	}
	while (s>0){
		var opStackTop = SIZE-s;
		var topOpStackToken = this.postfixSData[opStackTop];
		this.cmd("SetText",this.algoMessageID, "Move remaining operators from stack to postfix queue ");
		this.cmd("SetHighlight",this.postfixSLabelID[opStackTop], 1);
		this.cmd("Step");
		if(topOpStackToken=="("){
			this.cmd("SetText",this.algoMessageID, "Abort process ");
			this.cmd("SetText", this.errorMessageID, "Unmatched left paranthesis");
			this.cmd("Step");
			break;
		}
		topOpStackToken = this.postfixSData[opStackTop];
		this.cmd("SetHighlight",this.postfixQLabelID[q], 1);
		this.cmd("SetText", this.postfixQLabelID[q],topOpStackToken);
		this.postfixQData[q++] = topOpStackToken;
		this.cmd("Step");
		this.cmd("SetText", this.postfixSLabelID[opStackTop],"");
		this.cmd("SetHighlight",this.postfixQLabelID[q-1], 0);
		this.postfixSData[opStackTop] = "";;
		s--;
		this.cmd("SetHighlight",this.postfixSLabelID[opStackTop], 0);
	}
	this.numTokens = q;
	this.cmd("step");
	this.cmd("SetText",this.algoMessageID, "");
	return this.commands;
}

InfixPostfix.prototype.getOpPrecedence = function(op){
	if ("-+".indexOf(op)>-1){
		return 0;
	}
	return 1;
}

InfixPostfix.prototype.processRightParanthesis = function(s,q){
	while(s>0){
		var	opStackTop = SIZE-s;
		var topOpStackToken = this.postfixSData[opStackTop];
		this.cmd("SetHighlight", this.postfixSLabelID[opStackTop], 1);
		this.cmd("SetText",this.algoMessageID, "Search for a matching left paranthesis on the operator stack. Arithmetic \noperators along the way should be moved to postfix queue ");
		this.cmd("Step");
		if(topOpStackToken!="("){
			this.cmd("SetText", this.postfixQLabelID[q],topOpStackToken);
			this.cmd("SetHighlight", this.postfixQLabelID[q], 1);
			this.postfixQData[q++] = topOpStackToken;
			this.cmd("Step");
			this.cmd("SetHighlight", this.postfixSLabelID[opStackTop], 0);
			this.cmd("SetHighlight", this.postfixQLabelID[q-1], 0);
			this.cmd("SetText", this.postfixSLabelID[opStackTop],"");
			this.postfixSData[opStackTop] = "";
			s--;
		}
		else{
			this.cmd("SetText",this.algoMessageID, "Found matching left paranthesis. Pop from operator stack and ignore ");
			this.cmd("SetText", this.postfixSLabelID[opStackTop],"");
			this.postfixSData[opStackTop] = "";
			this.cmd("SetHighlight", this.postfixSLabelID[opStackTop], 0);
			this.cmd("SetHighlight", this.postfixQLabelID[q], 0);
			this.cmd("step");
			s--;
			break;
		}
	}

	if(topOpStackToken!="("){
		this.cmd("SetText",this.algoMessageID, "Abort process ");
		this.cmd("SetText", this.errorMessageID, "Unmatched right paranthesis");
		return[-1,-1];
	}
	return [s,q];
}

InfixPostfix.prototype.processOperator = function(s,q,nextToken){
	var opStackTop = SIZE-s;
	if (")(".indexOf(nextToken)==-1 && s>0){
		this.cmd("SetText",this.algoMessageID, "Arithmetic operators currently on the operator stack with higher \nor equal precedence should be moved to postfix queue first ");
		var nextTokenPrecedence = this.getOpPrecedence(nextToken);
		var topOpStackToken = this.postfixSData[opStackTop];
		var topOpStackTokenPrecedence = this.getOpPrecedence(topOpStackToken);
		while((")(").indexOf(topOpStackToken)==-1
					&& s>0
					&& nextTokenPrecedence <= topOpStackTokenPrecedence){
			this.cmd("SetHighlight",this.postfixSLabelID[opStackTop], 1);
			this.cmd("Step");
			this.cmd("SetHighlight",this.postfixQLabelID[q], 1);
			this.cmd("SetText", this.postfixQLabelID[q],topOpStackToken);
			this.cmd("Step");
			this.cmd("SetHighlight",this.postfixQLabelID[q], 0);
			this.postfixQData[q++] = topOpStackToken;
			this.cmd("SetHighlight",this.postfixSLabelID[opStackTop], 0);
			this.cmd("SetText", this.postfixSLabelID[opStackTop],"");
			this.postfixSData[opStackTop] = "";
			s--;
			opStackTop = SIZE-s;
			if(s>0){
				topOpStackToken = this.postfixSData[opStackTop];
				topOpStackTokenPrecedence = this.getOpPrecedence(topOpStackToken);
			}
		}
	}
	s++;
	opStackTop = SIZE-s;
	if(nextToken=="("){
		this.cmd("SetText",this.algoMessageID, "Push left paranthesis onto the operator stack ");
	}
	else{
		this.cmd("SetText",this.algoMessageID, "Order of precedence on the operator stack is correct. \nPush new arithmetic operator onto operator stack");
	}
	this.cmd("SetHighlight",this.postfixQLabelID[q], 1);
	this.cmd("SetHighlight",this.postfixSLabelID[opStackTop], 1);
	this.cmd("SetText", this.postfixSLabelID[opStackTop],nextToken);
	this.cmd("Step");
	this.cmd("SetHighlight",this.postfixSLabelID[opStackTop], 0);
	this.cmd("SetHighlight",this.postfixQLabelID[q], 0);
	this.postfixSData[opStackTop] = nextToken;
	return[s,q];
}

InfixPostfix.prototype.evaluateCallback = function(){
	if(this.stepNumber==2){
		this.implementAction(this.evaluate.bind(this));
		this.stepNumber++;
	}
	else if (this.stepNumber<2){
		alert("Execute EVALUATOR after CONVERTER");
	}
	else if (this.stepNumber>2){
		alert("EVALUATOR already executed!");
	}
}

InfixPostfix.prototype.evaluate = function(){
	this.commands = [];
	this.cmd("SetText",this.algoMessageID, "Evaluating postfix expression ");
	this.cmd("Step");
	this.cmd("SetForegroundColor", this.evaluateID, ALL_BLACK);
	this.cmd("SetTextColor",this.evaluateLabelID, ALL_BLACK);
	this.cmd("SetText", this.postfixSLabel,"Evaluation Stack");
	var opStackTop = SIZE;

	for (var i = 0; i < this.numTokens; i++){
		this.cmd("SetHighlight", this.postfixQLabelID[i], 1);
		this.cmd("Step");
		var nextToken = this.postfixQData[i];
		var isNumber = !Number.isNaN(Number.parseInt(nextToken));
		if (isNumber){
			this.cmd("SetText",this.algoMessageID, "Push operands onto the evaluation stack ");
			this.postfixSData[--opStackTop] = nextToken;
			this.cmd("SetHighlight", this.postfixSLabelID[opStackTop], 1);
			this.cmd("SetText", this.postfixSLabelID[opStackTop],nextToken);
			this.cmd("Step");
			this.cmd("SetHighlight", this.postfixSLabelID[opStackTop], 0);
			this.cmd("SetHighlight", this.postfixQLabelID[i], 0);
			this.cmd("SetText",this.algoMessageID, "");
		}

		else { //it is an operator
			this.cmd("SetText",this.algoMessageID, "Evaluate operator ");
			var expression = nextToken;
			this.cmd("SetHighlight", this.evaluateDataID, 1);
			this.cmd("Step");
			this.cmd("SetText", this.evaluateDataID, expression);
			this.cmd("SetHighlight", this.postfixQLabelID[i], 0);
			this.cmd("Step");

			if(opStackTop==SIZE){	//get right operand from stack
				this.cmd("SetText",this.algoMessageID, "Abort process ");
				this.cmd("SetText", this.errorMessageID, "Operator with no operands");
				this.cmd("Step");
				return this.commands;
			}
			this.cmd("SetText",this.algoMessageID, "Get right operand ");
			this.cmd("SetHighlight", this.postfixSLabelID[opStackTop], 1);
			this.cmd("Step");
			var rightOperand = Number(this.postfixSData[opStackTop]);
			expression =  expression + " " + rightOperand ;
			this.cmd("SetText",this.evaluateDataID, expression)
			this.cmd("SetText",this.postfixSLabelID[opStackTop],"");
			this.cmd("SetHighlight", this.postfixSLabelID[opStackTop], 0);
			this.cmd("Step");
			opStackTop++;

			if(opStackTop==SIZE)	{	//get left operand from stack
				this.cmd("SetText",this.algoMessageID, "Abort process ");
				this.cmd("SetText", this.errorMessageID, "Operator with only one operand");
				this.cmd("Step");
				return this.commands;
			}
			this.cmd("SetText",this.algoMessageID, "Get left operand ");
			this.cmd("SetHighlight", this.postfixSLabelID[opStackTop], 1);
			this.cmd("Step");
			var leftOperand = Number(this.postfixSData[opStackTop]);
			expression = leftOperand + " " + expression;
			this.cmd("SetText",this.evaluateDataID, expression);
			this.cmd("SetText",this.postfixSLabelID[opStackTop],"");
			this.cmd("SetHighlight", this.postfixSLabelID[opStackTop], 0);
			this.cmd("Step");
			opStackTop++;

			this.cmd("SetText",this.algoMessageID, "Push result onto evaluation stack ");

			var result = this.evaluateOperator(leftOperand,rightOperand, nextToken);
			this.cmd("SetText",this.evaluateDataID, result);
			this.postfixSData[--opStackTop] = result;
			this.cmd("SetText", this.postfixSLabelID[opStackTop],result);
			this.cmd("SetHighlight", this.postfixSLabelID[opStackTop], 1);
			this.cmd("Step");
			this.cmd("SetHighlight", this.postfixSLabelID[opStackTop], 0);
			this.cmd("SetText",this.evaluateDataID, "");
			this.cmd("SetHighlight", this.evaluateDataID, 0);
			this.cmd("SetText",this.algoMessageID, "");
		}
	}

	this.cmd("Step");
	this.cmd("SetHighlight", this.postfixSID[opStackTop], 1);
	this.cmd("Delete", this.evaluateID);
	this.cmd("Delete", this.evaluateDataID);
	this.cmd("SetTextColor",this.evaluateLabelID, ERROR_COLOR);
	this.cmd("SetText", this.evaluateLabelID, "Final Answer");
	var xpos = POSTFIX_S_START_X+20;
	var ypos = (SIZE-1 ) * ARRAY_ELEM_HEIGHT + POSTFIX_S_START_Y-5;
	this.cmd("Move", this.evaluateLabelID,xpos,ypos);
	this.cmd("Step");
	this.cmd("SetText",this.algoMessageID, "Push result onto evaluation stack ");
	return this.commands;
}

InfixPostfix.prototype.evaluateOperator = function(left, right, op){
	switch (op){
		case "+":
			return (left+right);
		case "-":
			return (left-right);
		case "*":
			return (left*right);
		case "/":
			return (left/right);
		case "%":
			return (left%right);
	}
}

var currentAlg;

function init(){
	var animManag = initCanvas();
	currentAlg = new InfixPostfix(animManag, canvas.width, canvas.height);
}
