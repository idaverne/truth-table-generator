'use strict'
$(document).ready(function(){

	var logic;
	var fromUser //= $('input').val().toLowerCase();
	var assertion //= fromUser;
	var operators = ['&', 'v', '>','%', '~'];
	var allowedVar ='qwertyuiopasdfghjklzxcbnm'
	var firstVar = undefined;	
	var usedVar = [];
	var startingValues = {};
	var formulaLog = [];
	var parseTree = {};
	var numRows;

	$('.ttform-input').keypress(function (evt) {var charCode = evt.charCode || evt.keyCode;if(charCode  == 13) {return false;}}); //Turn off the enter key for form submit

//classical-----------------------------------------------------
	$('#classical').on('click', function(){
		logic = 'classical';console.log(logic);
		fromUser = $('input').val().toLowerCase();
		assertion = fromUser;

		$('#truthtable').empty();
		$('.tterror').remove();
		$('.numrows').remove();

		firstVar = undefined;
		usedVar = [];	
		startingValues = {};	
		formulaLog = []; 
		parseTree = {};
		
		removeWhiteSpace();
		removeDoubleNegation();
		countVar(assertion);
		if(!isWellFormed(assertion)){return false};
		removeDuplicates(formulaLog);
		varValuesBinary();
		assignValues();
		truthTable();


		console.log('full assertion: ' + assertion)
		console.log('starting values: ');console.log(startingValues)
		console.log('parseTree:');console.log(parseTree);
		console.log('formulas: '); console.log(formulaLog);
		
		return false; 				//This is to keep the button handler from immediately refreshing the page. 
	})

//kleene-----------------------------------------------------
	$('#kleene').on('click', function(){

		logic = 'kleene(K3)';console.log(logic);
		
		fromUser = $('input').val().toLowerCase();
		assertion = fromUser;

		$('#truthtable').empty();
		$('.tterror').remove();
		$('.numrows').remove();

		firstVar = undefined;
		usedVar = [];	
		startingValues = {};	
		formulaLog = []; 
		parseTree = {};

		removeWhiteSpace();
		removeDoubleNegation();
		countVar(assertion);
		if(!isWellFormed(assertion)){return false};
		varValuesTernary();
		assignValues();
		truthTable();

		console.log('full assertion: ' + assertion)
		console.log('starting values: ');console.log(startingValues)
		console.log('parseTree:');console.log(parseTree);
		console.log('formulas: '); console.log(formulaLog);
		
		return false; 				//This is to keep the button handler from immediately refreshing the page. 
	})

//godel-----------------------------------------------------	
	$('#godel').on('click', function(){
		logic = 'godel(G3)';console.log(logic);
		fromUser = $('input').val().toLowerCase();
		assertion = fromUser;

		$('#truthtable').empty();
		$('.tterror').remove();
		$('.numrows').remove();

		firstVar = undefined;
		usedVar = [];	
		startingValues = {};	
		formulaLog = []; 
		parseTree = {};
		
		removeWhiteSpace();
		removeDoubleNegation();
		countVar(assertion);
		if(!isWellFormed(assertion)){return false};
		varValuesTernary();
		assignValues();
		truthTable();

		console.log('full assertion: ' + assertion)
		console.log('starting values: ');console.log(startingValues)
		console.log('parseTree:');console.log(parseTree);
		console.log('formulas: '); console.log(formulaLog);
		
		return false; 				//This is to keep the button handler from immediately refreshing the page. 
	})
	
//lukasiewicz-----------------------------------------------------
	$('#lukasiewicz').on('click', function(){
		logic = 'lukasiewicz(L3)';console.log(logic);
		fromUser = $('input').val().toLowerCase();
		assertion = fromUser;

		$('#truthtable').empty();
		$('.tterror').remove();
		$('.numrows').remove();

		firstVar = undefined;
		usedVar = [];	
		startingValues = {};	
		formulaLog = []; 
		parseTree = {};
		
		removeWhiteSpace();
		removeDoubleNegation();
		countVar(assertion);
		if(!isWellFormed(assertion)){return false}
		varValuesTernary();
		assignValues();
		truthTable();

		console.log('full assertion: ' + assertion)
		console.log('starting values: ');console.log(startingValues)
		console.log('parseTree:');console.log(parseTree);
		console.log('formulas: '); console.log(formulaLog);
		
		return false; 				//This is to keep the button handler from immediately refreshing the page. 
	});

//-----------------------------------------------------------------------------------------------------------------------------//

		function removeWhiteSpace(){
			if(assertion.match(/\s/)){
				assertion = assertion.replace(/\s/, '');
				removeWhiteSpace();
		}}
//------------------------------------------------------------------------------

		function removeDoubleNegation(){
			if(assertion.match(/\~{2}/)){
				assertion = assertion.replace(/\~\~/, '');
				removeDoubleNegation();
		}}
//------------------------------------------------------------------------------

		function negation(value){
		let newValue;	
		if(logic=='godel(G3)'){
			if(value == 1){
				newValue = 0;
			}else if(value == 0){
				newValue = 1;
			}else if(value == 0.5){
				newValue = 0
			}return newValue;
		}else {if(value == 1){
				newValue = 0;
			}else if(value == 0){
					newValue = 1;
			}else if(value == 0.5){
					newValue = 0.5
			}return newValue;}
		}
//------------------------------------------------------------------------------

		function removeDuplicates(assertionArray){

			let uniqueForms =[];
			for(let i of assertionArray){
				if($.inArray(i, uniqueForms) == -1){
					uniqueForms.push(i)
				}
			}formulaLog = uniqueForms; 
		}

//------------------------------------------------------------------------------
		function countVar(assertion){
			for(let i of assertion){
				if($.inArray(i, allowedVar) !== -1){
					if ($.inArray(i, usedVar) !== -1){
						i++
					}else{usedVar.push(i);}
		}}usedVar.sort();
	}

//------------------------------------------------------------------------------
/* Called by input submission. Creates appends an array of T F values (1=T, 0=F) to each variable. Length of array =
2^n for classical and 3^n for Kleene, where n = number of variables. Order of array for lexical first variable is
determined by the formula if index < 2^n/2, push 1, else push 0 (so first half true, second half false). Subsequent 
variables determined by recursion ((2^(n-index+1))/2) many times. So for ((2^(n-index+1))/4) many times push 1, 
then for ((2^(n-index+1))/4) many times push 0. Check if current length of array = 2^n. If not call self and repeat. */

		function varValuesBinary(){
			let n = usedVar.length;
			let x = Math.pow(2, n);
			let w = 0;
			let u = 0;
			
			console.log('2^n = ' + x);

			emptyArrays();
			firstValue();
			negArrays();

			function emptyArrays(){
				let y=startingValues;
				for(let i of usedVar){
					y[i]=[];
			}}
			
			function firstValue(){
				let firstVal = usedVar[0].charAt();
				let firstValArray = startingValues[firstVal];
				
				for(let i = 0; i < x; i++){
					if(i < x/2){firstValArray.push(1)}
						else{firstValArray.push(0)}

				}
				if(n>1){itTFOuter()}
			}
			
			function itTFOuter(){
				let b = 0;
				let currentVar = usedVar[u].charAt();
				let currentVarArray = startingValues[currentVar];
				
				if(currentVarArray.length > 0){u++; b++}
	
				if(b<1){u++;itTFInner();w++;}
				
				if(u==n){return true}else{itTFOuter()}
				
				function itTFInner(){
					let z = Math.pow(2, n-(w+1))
					let e = z/2;
					for(let a = 0; a < e; a++){
						currentVarArray.push(1);
						//console.log('pushing 1');
					}

					for(let a = 0; a < e; a++){
						currentVarArray.push(0);
						//console.log('pushing 0');
					}
					//console.log(currentVar);
					if(currentVarArray.length==x){return true} else{itTFInner()}
				}}

			function negArrays(){
				for(let i in assertion){
					if (i>0){
						if($.inArray(assertion[i].charAt(), usedVar) !== -1){
							let j = i-1;
							if(assertion[j].charAt()=== '~'){
								startingValues['~' + assertion[i].charAt()]=[]; //creates empty array for negated variable
								
								for (let k of startingValues[assertion[i].charAt()]){
									startingValues['~' + assertion[i].charAt()].push(negation(k))
								}
							}
						}
					}else(i++)
				}	
			}
		}
//------------------------------------------------------------------------------
		function varValuesTernary(){
			let n = usedVar.length;
			let x = Math.pow(3, n);
			let w = 0;
			let u = 0;
			
			console.log('3^n = ' + x);

			emptyArrays();
			firstValue();
			negArrays();

			function emptyArrays(){
				let y=startingValues;
				for(let i of usedVar){
					y[i]=[];
			}}
			
			function firstValue(){
				let firstVal = usedVar[0].charAt();
				let firstValArray = startingValues[firstVal];
				
				for(let i = 0; i < x; i++){
					if(i < x/3){firstValArray.push(1)}
						else if(i>=x/3 && i<((x/3)*2)){firstValArray.push(0.5)}
						else{firstValArray.push(0)}

				}
				if(n>1){itTFOuter()}
			}
			
			function itTFOuter(){
				let b = 0;
				let currentVar = usedVar[u].charAt();
				let currentVarArray = startingValues[currentVar];
				
				if(currentVarArray.length > 0){u++; b++}
	
				if(b<1){u++;itTFInner();w++;}
				
				if(u==n){return true}else{itTFOuter()}
				
				function itTFInner(){
					let z = Math.pow(3, n-(w+1))
					let e = z/3;
					for(let a = 0; a < e; a++){
						currentVarArray.push(1);	
					}

					for(let a = 0; a < e; a++){
						currentVarArray.push(0.5);	
					}
					

					for(let a = 0; a < e; a++){
						currentVarArray.push(0);	
					}
					
					if(currentVarArray.length==x){return true} else{itTFInner()}
				}}

			function negArrays(){
				for(let i in assertion){
					if (i>0){
						if($.inArray(assertion[i].charAt(), usedVar) !== -1){
							let j = i-1;
							if(assertion[j].charAt()=== '~'){
								startingValues['~' + assertion[i].charAt()]=[]; //creates empty array for negated variable
								
								for (let k of startingValues[assertion[i].charAt()]){
									startingValues['~' + assertion[i].charAt()].push(negation(k))
								}
							}
						}
					}else(i++)
				}	
			}
		}

//------------------------------------------------------------------------------
	function assignValues (){
			
			let expo;
			if(logic == 'classical'){expo=2;}
			else{expo=3;}
			
			numRows = Math.pow(expo,usedVar.length);
			console.log('numRows '+numRows)
			let var1 = null;
			let var2 = null;
			let startingIndex;
			let endingIndex;
	
			for(let z of formulaLog){
				var1 = null;
				var2 = null;
				startingIndex=0;
				endingIndex=0;
				
				let currentForm = z; console.log('currentFormula: '+ currentForm);
				
				alreadySolved(currentForm);
				variables(currentForm);
				parseTree[currentForm]=[];
	
				let primOp = primaryOp(currentForm); console.log('primaryOp: ' + primOp);
				let neg = negatedForm(currentForm); console.log('neg: ' + neg);
	
				console.log('var1: ' + var1 + ' length: '+ var1.length)
				console.log('var2: '+ var2 + ' length: '+ var2.length)
	
				for(let j = 0; j < numRows; j++){
					if(var1.length < 3 && var2.length < 3){combine(currentForm, startingValues[var1][j], startingValues[var2][j], primOp, neg); console.log('singles')}
					else if(var1.length < 3 && var2.length > 2){combine(currentForm, startingValues[var1][j], parseTree[var2][j], primOp, neg); console.log('one single, one compound')}
					else if(var1.length > 2 && var2.length < 3){combine(currentForm, parseTree[var1][j], startingValues[var2][j], primOp, neg); console.log('one compound followed by a single')}
					else if(var1.length > 2 && var2.length > 2){combine(currentForm, parseTree[var1][j], parseTree[var2][j], primOp, neg); console.log('all multiples')}
				}
			}
	
			function negatedForm(currentForm){		//check if ~ before left parentheses
				let justNeg1 = currentForm.replace(var1, '');
				let justNeg2 = justNeg1.replace(var2,'');
				if(justNeg2.includes('~(')){return true}else{return false}
			}
	
			function primaryOp(currentForm){
				let primOp;
				let justOp1 = currentForm.replace(var1, '');
				let justOp2 = justOp1.replace(var2, '');
				for(let i of justOp2){
					if(i.match(/&|v|>|%/)){
						primOp=i;
						return primOp;
					}
				}
			}
	
			function variables(currentForm){
				for(let i=startingIndex; i<endingIndex;i++){
					if($.inArray(currentForm[i], usedVar) !== -1 && (var1 === null)){
						if(currentForm[i-1]==='~'){var1='~'+currentForm[i]} else{var1 = currentForm[i]}	
					}else if($.inArray(currentForm[i], usedVar) !== -1 && (var1 !== null)){
						if(var2 === null){
							if(currentForm[i-1]==='~'){var2='~'+currentForm[i]} else{var2 = currentForm[i]}
						}else{i++}
					}
				}
			}
	
			function combine (currentForm, var1Val, var2Val, operator, neg){
				//classical
				if(logic=='classical'){
					let answer;
					if(operator === 'v'){answer = Math.max(var1Val,var2Val)}
					if(operator === '&'){answer = Math.min(var1Val,var2Val)}
					if(operator === '>'){answer = Math.max(negation(var1Val),var2Val)}
					if(operator === '%'){answer = Number(var1Val == var2Val)}
					
					if(neg){parseTree[currentForm].push(negation(answer))}
					else if(!neg){parseTree[currentForm].push(answer)}
				}
	
				//Kleene
				if(logic=='kleene(K3)'){
					let answer;
					if(operator === 'v'){if((var1Val===0.5||var2Val===0.5)&&(var1Val!==1 && var2Val!==1)){answer=0.5;
						}else{answer = Math.max(var1Val,var2Val)}}
					if(operator === '&'){if((var1Val===0.5||var2Val===0.5)&&(var1Val!==0 && var2Val!==0)){answer=0.5;
						}else{answer = Math.min(var1Val,var2Val)}}
					if(operator === '>'){answer = Math.max(negation(var1Val),var2Val)}
					if(operator === '%'){if(var1Val===0.5||var2Val===0.5){answer=0.5;
						}else{answer = Number(var1Val == var2Val)}}
					
					if(neg){parseTree[currentForm].push(negation(answer))}
					else if(!neg){parseTree[currentForm].push(answer)}
				}
	
				//L3
				if(logic=='lukasiewicz(L3)'){
					let answer;
					if(operator === 'v'){if((var1Val===0.5||var2Val===0.5)&&(var1Val!==1 && var2Val!==1)){answer=0.5;
						}else{answer = Math.max(var1Val,var2Val)}}
					if(operator === '&'){if((var1Val===0.5||var2Val===0.5)&&(var1Val!==0 && var2Val!==0)){answer=0.5;
						}else{answer = Math.min(var1Val,var2Val)}}
					if(operator === '>'){if(var1Val== 0.5 && (var2Val==0.5)){answer=1;
						}else{answer = Math.max(negation(var1Val),var2Val)}}
					if(operator === '%'){if(var1Val== 0.5 && (var2Val==0.5)){answer=1;
						}else if((var1Val===0.5||var2Val===0.5)&&(var1Val!==0.5||var2Val!==0.5)){answer=0.5;
						}else{answer = Number(var1Val == var2Val)}}
					
					if(neg){parseTree[currentForm].push(negation(answer))}
					else if(!neg){parseTree[currentForm].push(answer)}
				}
	
				//Godel
				if(logic=='godel(G3)'){
					let answer;
					if(operator === 'v'){if((var1Val===0.5||var2Val===0.5)&&(var1Val!==1 && var2Val!==1)){answer=0.5;
						}else{answer = Math.max(var1Val,var2Val)}}
					if(operator === '&'){if((var1Val===0.5||var2Val===0.5)&&(var1Val!==0 && var2Val!==0)){answer=0.5;
						}else{answer = Math.min(var1Val,var2Val)}}
					
					if(operator === '>'){if(var1Val== 0.5 && (var2Val==0.5)){answer= 1;
						}else if((var1Val===0)&&(var2Val==0.5)){answer=1;
						}else{answer = Math.max(negation(var1Val),var2Val)}}
					
					if(operator === '%'){if(var1Val== 0.5 && (var2Val==0.5)){answer= 1;
						}else if((var1Val===0.5||var2Val===0.5)&&(var1Val==0||var2Val==0)){answer=0;
						}else if((var1Val===0.5||var2Val===0.5)&&(var1Val==1||var2Val==1)){answer=0.5;
						}else{answer = Number(var1Val == var2Val)}}
					
					if(neg){parseTree[currentForm].push(negation(answer))}
					else if(!neg){parseTree[currentForm].push(answer)}
				}
			}
	
			function alreadySolved(currentForm){
	
				let leftPar = 0;
				for(let i of currentForm){
						if(i.match(/\(/)){leftPar++}
					}
				
				if(leftPar>1){
					let subCount = leftPar-1;
	
					let order = Object.getOwnPropertyNames(parseTree)
					console.log('array of property names: '+ order + ' length '+ order.length +' ' + Array.isArray(order))
					console.log('type of: '+ typeof currentForm)
					for (let i = 0; i < subCount; i++){ //counting down parentheses from currentForm
						console.log('i: '+ i)
						
						for(let j = order.length-1; j > -1; j--){ // iterating through formulas in parsetree in reverse
						
							let sub = order[j]; console.log('sub: '+ sub);
							let subLeft = 0; for(let i of sub){if(i.match(/\(/)){subLeft++}}; console.log('subleft: '+ subLeft + ' subCount ' + subCount)
							
							if(subLeft===subCount && (currentForm.indexOf(sub)!==-1)){
								console.log('one down ' + sub);
								let subIndex = currentForm.indexOf(sub);
								let subPrior = subIndex - 1;
							
								if(($.inArray(currentForm[subPrior], '&v>%') !== -1)){
									console.log('sub of current: ' + sub); var2 = sub;
									startingIndex = 0; endingIndex = subIndex; console.log('ending index: ' + subIndex)
								 
								}else{
									var1=sub; 
									startingIndex = subIndex + sub.length;console.log('starting index: ' + startingIndex)
									endingIndex = currentForm.length;
									console.log('ending index: ' + endingIndex)
								}return true;
	
							}else if(subLeft===subCount-i && (currentForm.indexOf(sub)!==-1)){
								let formCopy = currentForm.replace(sub, '');console.log('edited: '+formCopy)
								for(let k = order.length-1; k > -1; k--){
									let sub2 = order[k]; console.log('sub2: '+ sub2) 
								
									if(formCopy.indexOf(sub2) !== -1 && ((formCopy.length - sub2.length == 3)||(formCopy.length - sub2.length == 4))){
										console.log('sub2 MATCH: ' + sub2 + ' index: '+ formCopy.indexOf(sub2)); console.log('sub2 length: '+ sub2.length + ' formCopy length: '+ formCopy.length);
										let tempIndex = formCopy.indexOf(sub2); console.log('tempIndex-1: ' + formCopy[tempIndex-1])
											if($.inArray(formCopy[tempIndex-1], operators) !== -1){var1 = sub; var2=sub2} else{var1=sub2; var2 = sub}	
	
										break;
									}
								}return true;
							}
						}
					}
				}else{endingIndex = currentForm.length;}
			}
		}
//------------------------------------------------------------------------------

		function opCountFunc(currentForm){
			let count = 0;
			for(let i of currentForm){
					if(i.match(/&|v|>|%/)){count++}
			}return count;
		}
//------------------------------------------------------------------------------

		function formatAnswers(value){
			if(value === 1){return 'T'}
			else if(value === 0.5){return 'U'}
			else{return 'F'}
		}
//------------------------------------------------------------------------------

		function formatFormulas(current){
			let formatted = '';
			for(let i = 0; i < current.length; i++){
				if(current[i] === '&'){formatted=formatted+'&#8896;'}
				else if(current[i] === 'v'){formatted=formatted+'&#8897;'}
				else if(current[i] === '>'){formatted=formatted+'&#8594;'}
				else if(current[i]=== '%'){formatted=formatted+'&#8596;'}
				else if(current[i]==='~'){formatted=formatted+'&#172;'}
				else{formatted=formatted+current[i]}
			}formatted=formatted.toUpperCase();
			return formatted;
		}
//------------------------------------------------------------------------------
 		function truthTable(){
			
			$('#truthtable').append('<table class=\'ttable\'><thead></thead><tbody></tbody></table>');						 			
 			
			let singleVars = Object.getOwnPropertyNames(startingValues);
			let headerItems = singleVars.concat(formulaLog); console.log(headerItems);
			let tempRow = '<tr>';
			let tempForm;
			let headerWidth;
			let currentCol;

 			//create header
 			for(let i=0; i<headerItems.length; i++){			
 				tempForm = formatFormulas(headerItems[i]);
 				tempRow = tempRow + '<th class=\'col'+i+'\' id=\'headForm'+i+'\'>'+ tempForm+'</th>';
 			}tempRow =tempRow+'</tr>';//console.log(tempRow);
			
			$('#truthtable').find('thead').append(tempRow); 
 			
 			//Populate Values
			for(let j=0; j<numRows; j++){
				tempRow = '<tr>';
				for(let k=0; k<headerItems.length; k++){
					if(startingValues[headerItems[k]] !== undefined){
						tempForm = formatAnswers(startingValues[headerItems[k]][j]);
						tempRow = tempRow + '<td class=\'col'+k+'\'>' + tempForm +'</td>';
					}else if(parseTree[headerItems[k]] !== undefined){
						tempForm = formatAnswers(parseTree[headerItems[k]][j]);
						tempRow = tempRow + '<td class=\'col'+k+'\'>' + tempForm +'</td>';
					}
				}tempRow = tempRow + '</tr>';//console.log(tempRow);
				$('#truthtable').find('tbody').append(tempRow)
			}
			for(let i=0; i<headerItems.length; i++){
				currentCol = 'col'+i; console.log('currentCol '+currentCol)
				$('.'+currentCol).outerWidth($('#headForm'+i).outerWidth())
			}$('<p class =\'numrows\'> Total Rows: '+ numRows +' &emsp;&emsp; Total columns: '+headerItems.length+'</p>').insertAfter('#truthtable');
 		}

//------------------------------------------------------------------------------

		function isWellFormed (assertion){
			if (assertion.length === 0){
				$('<p class =\'tterror\'>Please enter a formula.</p>').insertAfter('.buttons');
				return false;
			}else{

				if(!checkString(assertion)){$('<p class =\'tterror\'>Your formula contains a disallowed character. Only letters, operators and parentheses are allowed. Please revise and try again.</p>').insertAfter('.buttons');
				return false;}

				if (assertion.length === 1){
					if($.inArray(assertion[0], '&v>%()~') !== -1){
						$('<p class =\'tterror\'>It looks like you don\'t have any variables. Please revise your formula and try again.</p>').insertAfter('.buttons');
						return false;
					}else{return true;}


				}if (assertion.length === 2 && (assertion[0]!== '~')|assertion[1]=='~'){
					$('<p class =\'tterror\'>I think you are aiming for something of the form \'~p\'. Please revise your formula and try again.</p>').insertAfter('.buttons');
					return false;
				}else if (assertion.length === 2 && (assertion[0]=== '~')&& assertion[1]!=='~'){
					return true;
				}else{
					
					find_first_var:{ 
						for(let i in assertion){
							let x = assertion[i].charAt();
							for (var j in allowedVar){
								let y = allowedVar[j].charAt();
								if(y===x){
									firstVar = i;
									break find_first_var;
								}
							}
						}
					
					}if(firstVar===undefined){
						$('<p class =\'tterror\'>It looks like you don\'t have any variables. Please revise your formula and try again.</p>').insertAfter('.buttons');
						return false;
					}
					if(!checkParCount(assertion)){$('<p class =\'tterror\'>Your parentheses are off. Remember a well-formed formula has twice the number parentheses as binary operators, and an equal number of left and right parentheses. Please revise and try again.</p>').insertAfter('.buttons');return false}
					if(!itLeft(assertion)){return false}
					if(!itRight(assertion)){return false}
					if(opCountFunc(assertion)===0){$('<p class =\'tterror\'>Your formula has parentheses but no binary operators. For single variable assertions of the form \'C\', or \'~C\', parentheses are not required. Please revise your formula and try again.</p>').insertAfter('.buttons');return false}
					if(!findInnermostParenthes(assertion)){$('<p class =\'tterror\'>Your parentheses are distributed improperly. Remember, each sub-formula must be bracketed by its own pair of parentheses. Please revise and try again.</p>').insertAfter('.buttons');return false}
						else{return true}
				}	
			}
		}
//------------------------------------------------------------------------------
/* Called by isWellFormed(). Iterates through assertion from first to last and ensures that doesn't have illegal characters. */

		function checkString(assertion){
			var string = '0123456789`!@#$^*_-+=:<;"\',./\\[]{}|?'
			for(var i=0; i<assertion.length; i++){
				var x = assertion[i].charAt();
				for (var j in string){
					var y = string[j].charAt();
					if(y==x){
					//console.log('maybe?');
					return false;
						}
					}	
				}return true;
			}

//------------------------------------------------------------------------------

/* Called by isWellFormed() and findNextParentheses(). Checks that left parentheses counts match right parentheses counts, and that
together they are always equal to the operator count * 2. */

		function checkParCount(assertion){
			let firstPassL = 0; 
			let firstPassR = 0;
			let opCount = 0;
				for(let i of assertion){
					if(i.match(/\(/)){firstPassL++}
					if(i.match(/\)/)){firstPassR++}
					if(i.match(/&|v|>|%/)){opCount++}
				}if(opCount > 0 && ((firstPassL !== firstPassR)|firstPassL + firstPassR !== opCount*2)){return false}
				else{return true}
		}

//------------------------------------------------------------------------------

/* Called by isWellFormed(). Iterates from the user assertion's first variable backwards to its first character, 
checking for illegal character combinations. Ex. Iterating left, after the first variable, the next character, 
if there is one has to be either a negation or a parentheses, which can only be preceeded by a negation or parentheses. Etc. */

		function itLeft(assertion){
			let x = firstVar;
			let y = firstVar-1;
				if(y<0){$('<p class =\'tterror\'>Every binary operator, must be preceded and followed by a variable. For example, assertions of the form (Cv~B), or (F%F) are allowed; assertions of the form (%C) are not. Please revise your formula and try again.</p>').insertAfter('.buttons');
				return false}
				x--;
				
				isFinLeft(assertion);
	
				if(x<0){return true}

			function isFinLeft(assertion){
				if (x < 0){return true}
				else{
					continueLeft(assertion);
				}
			}
			
			function continueLeft(assertion){
				let z = assertion[x]
				if($.inArray(z, '&v>%') !== -1){$('<p class =\'tterror\'>Every binary operator, must be preceded and followed by a variable. For example, assertions of the form (Cv~B), or (F%F) are allowed; assertions of the form (%C) are not. Please revise your formula and try again.</p>').insertAfter('.buttons');
					return false}else{x--; isFinLeft(assertion)}
			}
		}

//------------------------------------------------------------------------------

/* Called by isWellFormed(). Iterates from the user assertion's first variable through to its last character, 
checking for illegal character combinations. Ex. Iterating right, after the first variable, the next character, 
if there is one has to be an operator. After this, the next character has to be either a negation or a variable. Etc.*/

		function itRight(assertion){
			let x = firstVar;
			let y = firstVar-1;
				x++; y++;
				
				isFinRight(assertion);
				if(x==assertion.length){return true}
				
			function isFinRight(assertion){
				if (x==assertion.length){return true}
					else{
						continueRight(assertion);
					}
				}
			
			function continueRight(assertion){

				let z = assertion[x]
				let w = assertion[y]

				if($.inArray(z, '&v>%') !== -1){
					if($.inArray(w, '&v>%(~') !== -1){
						$('<p class =\'tterror\'> A binary operator may only be immediately preceded by a variable. Please revise your formula and try again.</p>').insertAfter('.buttons');
						console.log('Nope1');
						return false;
					}
				}if($.inArray(z, '(') !== -1){
					if($.inArray(w, ')qwertyuiopasdfghjklzxcbnm') !== -1){
						$('<p class =\'tterror\'>A left-hand parentheses may only be immediately preceded by a binary operator, a negation operator, or another left hand parentheses. Please revise your formula and try again.</p>').insertAfter('.buttons');
						console.log('Nope2');
						return false;
					}
				}if($.inArray(z, ')') !== -1){
					if($.inArray(w, '&v>%(~') !== -1){
						$('<p class =\'tterror\'>A right-hand parentheses may only be immediately preceded by a variable. Please revise your formula and try again.</p>').insertAfter('.buttons');
						console.log('Nope3');
						return false;
					}
				}if($.inArray(z, '~') !== -1){
					if($.inArray(w, ')qwertyuiopasdfghjklzxcbnm') !== -1){
						$('<p class =\'tterror\'> A negation operator may only be preceded by an operator, a left-hand parentheses or another negation operator. Please revise your formula and try again.</p>').insertAfter('.buttons');
						console.log('Nope4');
						return false;
					}
				}if($.inArray(z, allowedVar) !== -1){
					/*if(x == firstVar+1){
							$('<p class =\'tterror\'>Please revise your formula and try again.</p>').insertAfter('#truthtable');
							console.log('Nope5');
							return false;
						
					}*/if($.inArray(w, ')qwertyuiopasdfghjklzxcbnm') !== -1){
						$('<p class =\'tterror\'>A variable can only be immediately preceded by a negation operator, a left-hand parentheses or a binary operator. Please revise your formula and try again.</p>').insertAfter('.buttons');
						console.log('Nope6');
						return false;
					}
				}x++; y++;
				isFinRight(assertion);
			}
		}
//---------------------------------------------------------------------------------------------------

/* Called by isWellFormed(). If parentheses are distributed incorrectly, will return false, triggering isWellFormed() to return false.
Ex. If an assertion is of the form ((cv(cvd)vb)), the parentheses check won't catch this, but this function will. It does this by first
finding the innermost left parentheses and the first right parentheses following this. Then it takes everything between these and 
adds it to the global container object descendentLog. If this substatment is negated, then it takes the negation. Then it finds the next left parentheses one back from the first one, and the next right
parentheses after this second left one. Slice and add to descendentLog. Loop recurs until user assertion is fully parsed.*/

		function findInnermostParenthes(assertion, negationCheck){			
				let leftIndices = [];
				let rightIndices = [];
				let x = assertion.lastIndexOf('(');
				let y = assertion.indexOf(')'); 
				let startY = assertion.indexOf(')');
				
				///Statements of the form ((avb)v(avb)) will give a y index smaller than the x, which will parse incorrectly.
				if(y < x){for(let tempY = x; tempY < assertion.length; tempY++){
							let tempYChar = assertion[tempY].charAt();
							if(tempYChar==')'){
								y = tempY
								//console.log('tempy =' + tempY)
								break;}}}
					

				let singleVar = [].push(assertion)
				if(x>0){let aa = checkNegation(x);x=x-aa}

				leftIndices.push(x);
				rightIndices.push(y);
				
				if(!midCheck(assertion.slice(x, y+1))){return false};	
				
				formulaLog.push(assertion.slice(x, y+1))
				
				if(x==0){return true}
				else{return findNextParenthesesL(x)}

				function midCheck(q){
					let rightPar = 0;
					for(let i of q){
						if(i.match(/\)/)){rightPar++}
					}
					if(rightPar !== opCountFunc(q)){
						console.log('par count: ' + rightPar + 'opCount: '+ opCountFunc(q));
						return false}else{return true}
				}	
				
				function checkNegation(h){
					let l = h-1;
						if(assertion[l].charAt() == '~'){
							let k = l-1;
							if(assertion[l].charAt() == '('){return 2}
							else{return 1}
						}else{return 0}
					}

				function findNextParenthesesL(f){
					if (f==0){return true}
						
					let currentL = f;
					for(let a = f-1; a> -1; a--){
						let b = assertion[a].charAt();
						if(a>0){if(checkNegation(a)>0){
							a = a - checkNegation(a);
						}}

						if(b =='('){
							leftIndices.push(a);
							currentL=a;
							break;}
						let checkingForOp = assertion[a].charAt();	
						
						if(($.inArray(checkingForOp, '&v>%') !== -1)&& (!x>startY)){a--; currentL=a; console.log(currentL); break}}
					
					let clearlyAVar = assertion[currentL].charAt()
					if($.inArray(clearlyAVar, 'qwertyuiopasdfghjklzxcbnm') !== -1){return findNextParenthesesL(currentL)}	
					
					if(!findNextParenthesesR(currentL)){console.log('not leaving L');return false}
						else{return findNextParenthesesL(currentL)}
					
					function findNextParenthesesR(e){
						let found = false;
						for(let c = e; c < assertion.length; c++){
							let d = assertion[c].charAt();
							if(d==')'){
								if($.inArray(c, rightIndices) == -1){
									let p = assertion.slice(currentL, c+1)
									if(!checkParCount(p)){return false}
									else{rightIndices.push(c);
									found = true;
									if(!midCheck(assertion.slice(currentL, c+1))){return false};
									formulaLog.push(assertion.slice(currentL, c+1));
									break;}
								}
							}
							if(found){break}
						}
						if(found){return true}
					}
				}
			}
//----------------------------------------------------------------------------------
})
