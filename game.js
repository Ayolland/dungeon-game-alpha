
// Helper functions


// Returns a random element from an array
function randomEntry(array){
	return array[Math.floor(Math.random()*array.length)];
}

// Rolls a number of dice using DnD shorthand (ie: 2d20) and returns the total;
function roll(diceStr){
	var diceNum = diceStr.slice(0,diceStr.indexOf("d"));
	var diceSides = diceStr.slice(diceStr.indexOf("d")+1);
	var totalRoll = 0;
	for (var i = diceNum - 1; i >= 0; i--) {
		totalRoll += (Math.floor(Math.random()*diceSides)+1);
	}
	return totalRoll;
}

// Rolls a number of dice using DnD shorthand and returns the number of dice that are equal or higher to the target.
function rollHits(diceStr,target){
	var diceNum = diceStr.slice(0,diceStr.indexOf("d"));
	var diceSides = diceStr.slice(diceStr.indexOf("d")+1);
	var totalHits = 0;
	for (var i = diceNum - 1; i >= 0; i--) {
		var diceRoll = roll("1d"+diceSides);
		if ( (diceRoll >= target) || (diceRoll === diceSides)){
			totalHits++;
		}
	}
	return totalHits;
}

// used to change the tense of used verbs
function thirdPerson(verb){
	switch (verb){
		case "bash":
		case "punch":
		case "slash":
		case "splash":
			verb += 'es';
			break;
		case "are":
			verb = "is";
			break;
		default:
			verb += 's';
			break;
	}
	return verb;
}

// Capitalizes first character of a string, other characters lowercase.
function firstCap(string){
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// Copied from MDN
// Hypothetically Enable the passage of the 'this' object through the JavaScript timers
 
var __nativeST__ = window.setTimeout;
 
window.setTimeout = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
  var oThis = this, aArgs = Array.prototype.slice.call(arguments, 2);
  return __nativeST__(vCallback instanceof Function ? function () {
    vCallback.apply(oThis, aArgs);
  } : vCallback, nDelay);
};

// Global Variables

// this is a global variable used to pass information between setIntervals
var intervalRelay = "";

var currentGame = new Game();
var interfaceElement = document.getElementById('interface');

function Game (){
	this.log = {
		element: document.getElementById('gameLog'),
		add: function(message){
			this.element.innerHTML += ('<p>'+ message + '</p>');
			this.element.scrollTop = this.element.scrollHeight;
		}
	};

	this.currentLocation = new Location();
	this.playerHero = new Hero('TEMP');
	this.currentMonster = new Monster();
	this.previousMonsterName = "";

	this.initialize = function(){
		currentGame.playerHero = new Hero('Sandra');
		currentGame.currentMonster = new Monster();
		currentGame.previousMonsterName = "";
		this.switchLocation();
		this.playerHero.initialize();
	};

	this.enterMonster = function(monsterType){
		this.previousMonsterName = this.currentMonster.displayName;
		var monsterClass = monsterType.slice(0,monsterType.indexOf(" "));
		var monsterVariant = monsterType.slice(monsterType.indexOf(" ") + 1);
		if (monsterType.indexOf(" ") === -1){
			monsterClass = monsterType;
			monsterVariant = "";
		}
		var newMonster = new window[monsterClass](monsterVariant);
		newMonster.div.className = "";
		if (newMonster.hand1){
			newMonster.equip1(newMonster.hand1);
		}
		newMonster.appear();
		currentGame.currentMonster = newMonster;
	};

	this.switchMonster = function(){
		var monsterType = randomEntry(currentGame.currentLocation.monsterArray);
		currentGame.enterMonster(monsterType);
	};

	this.switchLocation = function(locationName){
		var oldLocationName = (typeof(currentGame.currentLocation) === "undefined") ? "" : currentGame.currentLocation.shortName;
		var validLocations = ["Dungeon", "Volcano", "Forest", "Graveyard", "Mine"];
		validLocations.splice(validLocations.indexOf(oldLocationName),1);
		locationName = randomEntry(validLocations);
		currentGame.currentLocation = new Location(locationName);
		currentGame.currentLocation.switchTrigger = currentGame.playerHero.kills + 6 + roll('1d4');
		currentGame.currentLocation.draw(currentGame.currentLocation.canvas, currentGame.currentLocation.spriteCompressed);
		currentGame.currentLocation.canvas.fillRect(0,40,160,50);
		currentGame.log.add("You enter the " +locationName+'...');
		setTimeout(function(){currentGame.switchMonster()},2000);
	};

	// this.attack = function(){
	// 	interfaceElement.classList.add("wait");
	// 	var step = 0;
	// 	var stepsArr = ["player turn","monster turn","end"];
	// 	var turnInterval = setInterval(function(){
	// 		switch (stepsArr[step]){
	// 			case "player turn":
	// 				var heroAtkObj = currentGame.playerHero.useHand1();
	// 				if (currentGame.currentMonster.calcDodge()){
	// 					currentGame.currentMonster.dodge();
	// 				} else {
	// 					currentGame.currentMonster.hit(heroAtkObj);
	// 				}
	// 				break;
	// 			case "monster turn":
	// 				if (currentGame.currentMonster.HP > 0) {
	// 					var monsterAtkVal = currentGame.currentMonster.useHand1();
	// 					if (currentGame.playerHero.calcDodge()){
	// 						currentGame.playerHero.dodge();
	// 					} else {
	// 						currentGame.playerHero.hit(monsterAtkVal);
	// 					}
	// 				}
	// 				break;
	// 			case "end":
	// 				if (currentGame.playerHero.HP > 0){
	// 					interfaceElement.classList.remove("wait");
	// 				}
	// 				clearInterval(turnInterval);
	// 				break;
	// 		}
	// 		step ++;
	// 	},1000);
	// };

	this.everyoneIsAlive = function(){
		return ((this.playerHero.HP > 0)&&(this.currentMonster.HP >0));
	};

	this.runRound = function(playerChoice){
		intervalRelay = "Player turn";
		var gameLoop = setInterval(function(){
			if (intervalRelay === "Player turn"){
				intervalRelay = "wait";
				interfaceElement.classList.add("wait");
				if(currentGame.everyoneIsAlive()){
					currentGame.playerHero.runTurn(playerChoice);
				} else {
					intervalRelay = "End round";
				}
			} else if (intervalRelay === "Monster turn"){
				intervalRelay = "wait";
				var monsterChoice = currentGame.currentMonster.ai();
				if(currentGame.everyoneIsAlive()){
					currentGame.currentMonster.runTurn(monsterChoice);
				} else {
					intervalRelay = "End round";
				}
			} else if (intervalRelay === "End round"){
				clearInterval(gameLoop);
				intervalRelay = "wait";
				interfaceElement.classList.remove("wait");
			}
		},500);
	};

}

// A Displayable is an object with an associated canvas for drawing sprites
function Displayable (){
}

Displayable.prototype.constructor = Displayable;

Displayable.prototype.draw = function(canvas,sprite){
	var rawStr = LZString.decompressFromBase64(sprite);
    var trinary = (rawStr.slice( rawStr.indexOf('|') + 1));
    var spriteWidth = rawStr.slice( 0, rawStr.indexOf('x'));
    var spriteHeight = rawStr.slice( rawStr.indexOf('x') + 1 , rawStr.indexOf('|') );
    canvas.clearRect(0,0,spriteWidth,spriteHeight);
    canvas.fillStyle = this.color;
    for (var i=0; i < trinary.length; i+=1){
    	var row = Math.floor(i / spriteWidth );
        	if (trinary.slice(i,i+1) == 1){
        		canvas.fillStyle = this.color;
        		canvas.fillRect( (i - row * spriteWidth ), row, 1, 1 );
        	} else if (trinary.slice(i,i+1) == 2){
            	canvas.fillStyle = 'black';
            	canvas.fillRect( (i - row * spriteWidth ), row, 1, 1 );
			}
    }
};

// A Location is an object that stores the background image and the possible monsters

function Location(type){
	this.canvas = document.getElementById('level-sprite').getContext('2d');
	this.shortName = type;
	switch (type){
		case "Dungeon":
			this.spriteCompressed = "BwBgHgLCA+CM8MU5LVvRzCQi3/qORxJ2JuuBV1Z5xNDjTzLjOsFlhKnXrzFDojod2ddvwFCu40fXKSpg+LPFEhittLIqkvBX00FBM9WpESdGo8hO195+rvXabw13Idq5K0hsNGdtJi3q6UYs7WbtoBUU7y4WbhUW5BngmO6aKR0ZGmBo6JITm5aYXmWRJpNmUWfnEu7rGaQXwy6UkVHrkeGRWFJT3Knh11Xe09ur4hmaQKMZPDffPWhm3dgRtT0zPL2QvRteVjEXbN/K3Hqgl5pWFXJ5y3h/fl7u9xW4rV9iM+c8UDqlep0vLsvM9gUtvJ1Kn4fjVVjCTA4dtgvpIjqjGjxuMNEfjcW0ClVkoSWiCSflQU8gQSGgD2stlKdzgIUfYkilbJZJsZ5Gwut9ZPzkZlWG8dgogA==";
			this.monsterArray = ["Axedude", "Ball Goo", "Skele Bones", "Skele Footman", "Mage","Jelly"];
			break;
		case "Volcano":
			this.spriteCompressed = "BwBgHgLCA+CM8MUpJWpWz6308/sWBxJuRiIhWO6ZupF5peGTC1eLhD+Ht7fSgLZV6VfjlE9kg2XK5Txk7rSHTW8zW1XVGQ/uuFatRpQtOGZus8bJrlBvWssantxwedXHLuhs1iAhTM5r5eRnKBQezM0b7cBCYJesHEXuHx3pG8lM4ZUX6ZidmJij4FcUX+1qWeaWn5mSXeKLHFjS5MHQrlMSGhhgM5fCQdbiIMyqM9vcnSM+qzbhj1nRljlrPdYflLi43bO6NFU627J8fxuZfhGyGXm3uKMU8POYP2kzIVg22TdV8+j8eKdvl9JHcIalNkDhg9VPNxND5ulpuU8qD2n5XnZeKtPOlMVkOPtdgdscM9kQSf1Kb0JHMIh5BDYMSy7CMwT9jJyeXztMjWazqcyAvyWKiObj5P8ablOMSaRyFsKBhMmrJVWzleqqnT3Di9SdsJq7kbzfR5aggA==";
			this.monsterArray = ["Axedude","Ball Fire","Skele Monk","Skele Bruiser", "Were Hellbeast"];
			break;
		case "Forest":
			this.spriteCompressed = "IwNgDAHgLGA+ZmE5TEOOhiUrVj+ORWJhq2OpFlBtZxBm9R5V6y7lpLrjtPeJpx6M2IjlRH5p1GiVHjWYxcpZC8U3vPFtuapc1yCNArYa67huA+bq3rgvjstXiqrgpUY+9m5Of+DKKyDMK+we7WEa6oBl5hMUYuptEhsZFy2okSyQF6oYH6etl++QIZSdpqxkwqLmkUMiUV5BH8UvX6Zmnejfbq7D053FUcEp6hceVt3nnyo7GtC4sDPauKw01W1NjLs7tlRjMbYoc7SkGW5TUlmwNyFiEHNdfRG29ns8MdLXaH11tXLJ/nd+jchpV1jRIUVdK97nV5iCdntwYkZMETiNkTCCr9MMc5lMojZYfi0ISfoNliiaaCOulCgC/g07kE3tNekzqrUnNCOWM/Az6Yj2oY+kyJXtWiKAnygaDgbK3Iqsd0npDtsqPKU1al2QKxjdhYbNJjxftuRTueMhSdShrnnTjZzTYirZrHZSjnb3qkNdqViClm7LlcHqGndkCb9BbkHL6ovMflzpW5w2GcQohtJvQCWlGYk6vpMXViM9CKsWc708zy4V0q3E1rWbemK0mbVGSwmy3MC6TG8mk/w248Gyq292lVzB+6Jx4xy8Z1k0+Ou4y08vK4Rg+2m6nwhNBZ58hCfHvLUe6RdMYsU2Or+fbz6CXf3qsGhTj1SVXRiWqVbfmu3w6k4Z51ISfRPh+4oSsS55Qveb5rtBf7gfQiF1sOvhoWBu6YfEwY4ay6EkqeYSwQsuwUV0YHkau5zlswNGrnRjRmhR8HuuyxgniSHEpFxOTMbxEwBuB/HnJwwG3DKKR7txgn3rO6S8HqCkgVoXipoG1Q6ABD46Y4iYmkO17UZc6mbPanGPu+KkrNZhl0exl7tPyRQebafoGoezhCV5RbPgZDi2OFpEoq8vkMtG6KRT66YxbFIVJX5BxEj4PZBclfLkZamW5s+1rJVmnawfxxm5WVcYhTJvk0Q1M6eTKb65QFpXNflo7fu1Zl9aFA0DalfUjUNrnjZNU3TTNs0sEAA=";
			this.monsterArray =["Axedude","Scamp","Were Wolf","Skele Archer","Snek"];
			break;
		case "Graveyard":
			this.spriteCompressed = "IwNgDAHgLGA+wMU5LVjKzn3HXrCGBxJuRp2GeOB5F9ZDKV+1Ny7TFdXZbO+Zp2I9+fYb1zjWYsSVFtpkjtIGzF86lObblSGQfUy0/HoQnKWppaYkG9XQatVWt+tWYcj2RrbZdevMK+hqEWgd4citb+4Qxu8bYhSQmWTvQxKX7WEXJRSYzuyXmBGvku6eZZHhGESkUeqfnZ0Z6W9YitZUJdbm1BjbKahbTOub3impUmOV6Z3SZRtK5xTPNNQktYg6He6yuC0Z0+flVhVss2sQmzTjnZAd3Fjzd1x+lE5PuDDTsHK503mc6J93r1zi9wT9lv06t9/pCWkjYXwRBVrtV/hiUdwEZi/tj/HN8fDCSlAT0LJ8oVjSaSgb80MDyfDERC7Colqzuc9Mjp9Jt5pMWedDOi3tTQdp2QVkRMRQIJXClc4yXjeUNKhcqBKNTS2X8pFrUTrpcVdrK5YdWCMGgzGPrLaKATtbUaNszrY69X0Pe6bUUDervRoFoCjoG1UHo4rdBTTu5/VaYxrpfyE8ck1a1bF3YUWCoI4Lac7zTqaKDgv644mCeiy8ZOLGBUX7QSc+sHSD7Vma03JSHkWbbWo9KPwz6LeYRwW0iPPWKWV3l1LtrOuavF07XCvTc3KNN8yNk/th+WHbUCwPDafqUa8ziMheg4qvc/12s/dPXyETdaV6ijiHrWV6/uWhwAT2tQwkO4EVpBNbQdsiL5gGqwDI+OidhWaGYRk6EHsYJpYXhSGXI2AYtqRZGUH+gE0biQF0cBDGLJ+gGmqxXE1PeXHcdq1HtNwiR0XxUHYAMYlSVs0myXJ/JrPJjhBEpqlqepGmaVp2k6bpen6QZgRAA===";
			this.monsterArray = ["Were","Skele"];
			break;
		case "Mine":
			this.spriteCompressed = "IwNgDAHgLGA+wMU5LVvRzXs93/BhRxJpZ5FlV1Ntd9DjTzLrb7HnX3PvfwYJIITCyo0QP4lx7MIPlUFc2YgljJ9GSgWUdyLXT3k1Q46bTLVeCZdQ2zF3RhOlLc2wJf4P74R4eOrl5CwdbKvr6q/rjuURHy0YSJ+qFJsYbx6YqZycZZtDkp3rY5kbqlJbkWaoVBKbFlGmmeES1ZVdrirZmexF3hjSKpdiED7X0JFW7DnUNTCX1xY/ZJSw3pM9U9kw1EO+FtrXtz+yWLhz0ix/PxezeRm9prl49PJ7VNYRcVn9bfpb0CP0AVdVu9LqC/v9Cq9TPc3EDRiDfjgajtARQHuszt4lm18eV8f5Yb98vlzkd3lZcVS1pDpD5iXkQjRBoMUc56jZycyok59PShmlgSc+c1RQSWuLzCYSccGXE5mK7oqpULpFJqDVBXKBTK9ZrDUbjSbTWbzRbLVbrTbbXb7Q7HU7nS7XW73R7PV7vT7fX7/QggA=";
			this.monsterArray = ["Skele Footman","Were Goat","Jelly","Snek"];
			break;
	}
	document.body.className = this.shortName;
	document.getElementById('level-text').innerHTML = "LVL: " + this.shortName;
}

Location.prototype = new Displayable ();
Location.prototype.constructor = Location;

// A Character is either a Monster (NPC) or the Hero

function Character (){
	this.buffs = [];
}

Character.prototype = new Displayable ();
Character.prototype.constructor = Character;

Character.prototype.updateStatus = function(){
	if (this.HP < 1){
		this.HP = 0;
	} else if (this.HP > this.stats.maxHP){
		this.HP = this.stats.maxHP;
	}
	this.displayElement.hpText.innerHTML = this.HP + "/" + this.stats.maxHP;
	var percentage = Math.floor((this.HP / this.stats.maxHP)*100);
	this.displayElement.hpBar.style.width = percentage + "%";
	this.displayElement.hpBar.className = "hp-bar hp-" + (Math.round(percentage / 10)*10);
	if (this.HP === 0){
		this.die();
	}
};

Character.prototype.addClass = function(classStr){
	this.div.classList.add(classStr);
};

Character.prototype.wiggle = function(tempClass, time){
	this.div.classList.add(tempClass);
	var thisCharacter = this;
	setTimeout(function(){thisCharacter.div.classList.remove(tempClass);}, time);
};

Character.prototype.equip1 = function(item){
	item.owner = this;
	this.hand1 = item;
};

Character.prototype.equip2 = function(item){
	item.owner = this;
	this.hand2 = item;
};

Character.prototype.getEnemy = function(){
	if (this.constructor.name === 'Hero'){
		return currentGame.currentMonster;
	} else { 
		return currentGame.playerHero;
	}
};

Character.prototype.defense = function(attackType){
	switch (attackType){
		case 'white':
		case 'black':
			return this.stats.magi;
		case 'lightning':
		case 'fire':
			return Math.floor((this.stats.magi + this.stats.phys) /2);
		case 'poison':
			return 0;
		case 'physical':
		default:
			return this.stats.phys;
	}
};

Character.prototype.hit = function(atkObj){
	intervalRelay = 'wait';
	var defense = this.defense(atkObj.type);
	var afterDef = (atkObj.calculated - defense) < 0 ? 0 : (atkObj.calculated - defense);
	var totalAtk = atkObj.natural + afterDef;
	if (atkObj.targetStat === 'HP'){
		this.HP -= totalAtk;
	} else {
		// Any natural damage is ignored for non-HP damage;
		totalAtk = afterDef;
		this.stats[atkObj.targetStat] -= totalAtk;
	}
	this.effectController.displayDamage(atkObj.sprite, atkObj.color);
	this.wiggle('hit', 250);
	var verb = randomEntry(atkObj.verbs);
	var message = "";
	if (atkObj.buff){
		message = firstCap(this.selfStr()) + ' ' + this.conjugate(verb) + ' for ' + totalAtk + atkObj.targetStat.toUpperCase() + '.';
	} else {
		message = firstCap(this.getEnemy().selfStr())+' '+ this.getEnemy().conjugate(verb) +' '+ this.selfStr().toLowerCase() + ' for ' + totalAtk + atkObj.targetStat.toUpperCase() + '.';
	}
	currentGame.log.add(message);
	this.updateStatus();
	if (atkObj.buffArr.length > 1){
		var currentBuff = atkObj.buffArr[0];
		var chance = atkObj.buffArr[1];
		var gotBuffed = (rollHits('1d'+chance,chance) >= 1);
		if ((gotBuffed)&&(!this.buffs.includes(currentBuff))){
			verb = 'are';
			message = firstCap(this.selfStr())+' '+ this.conjugate(verb)+ ' ' + currentBuff + ".";
			this.buffs.push(currentBuff);
			setTimeout(function(){currentGame.log.add(message);},1000);
			setTimeout(function(){intervalRelay = "End turn";},2000);
		} else {
			setTimeout(function(){intervalRelay = "End turn";},1000);
		}
	} else {
		if (!atkObj.buff){
			setTimeout(function(){intervalRelay = "End turn";},1000);
		}
	}
};

Character.prototype.selfStr = function(){
	return (this.constructor.name === "Hero") ? "You" : "The " + this.shortName;
};

Character.prototype.conjugate = function(verb){
	return (this.constructor.name === "Hero") ? verb : thirdPerson(verb);
};

Character.prototype.runBuffs = function(){
	var nextStep = "Use equip";
	if (this.buffs.length < 1){
		intervalRelay = nextStep;
		return;
	}
	var buffsArr = this.buffs.slice();
	var thisCharacter = this;
	var counter = 0;
	var curedIt = false;
	var buffAtkObj = {};
	var goAhead = true;
	var buffInterval = setInterval(function(){
		if ((!curedIt)&&(goAhead)){
			buffAtkObj = thisCharacter.buffEffect(buffsArr[counter]);
			thisCharacter.hit(buffAtkObj);
			var cured = (roll('1d'+buffAtkObj.cureChance)===buffAtkObj.cureChance);
			if (cured){
				var curedIndex = thisCharacter.buffs.indexOf(buffsArr[counter]);
				if(curedIndex !== -1) {
					thisCharacter.buffs.splice(curedIndex, 1);
				}
				curedIt = true;
				setTimeout(function(){goAhead = true;},1000);
			} else {
				counter++;
				setTimeout(function(){goAhead = true;},1000);
			}
		} else if (goAhead) {
			currentGame.log.add(thisCharacter.selfStr() + ' ' + thisCharacter.conjugate('are') + ' no longer ' + buffsArr[counter].toLowerCase() + '.' );
			curedIt = false;
			counter++;
		}
		if ((counter >= (buffsArr.length))&&(!curedIt)&&(goAhead)){
			if (thisCharacter.HP <= 0){ nextStep = "End round";}
			clearInterval(buffInterval);
			setTimeout(function(){intervalRelay = nextStep;},1000);
		}
	},750);
};

Character.prototype.buffEffect = function(buffStr){
	var attck = {};
	attck.buff = true;
	attck.cureChance = 3;
	attck.natural = 0;
	attck.calculated = 0;
	attck.type = 'physical';
	attck.targetStat = 'HP';
	attck.color = 'white';
	attck.verbs = ['waste'];
	attck.buffArr = [];
	switch (buffStr){
		case 'Aflame':
			attck.calculated = Math.ceil(roll('1d5')*this.stats.maxHP/100);
			attck.type = 'fire';
			attck.sprite = 'flame';
			attck.color = 'red';
			attck.verbs = ['burn','roast'];
			break;
		case 'Poisoned':
			attck.calculated = roll('1d3');
			attck.type = 'poison';
			attck.sprite = 'bubble';
			attck.color = 'purple';
			attck.verbs = ['waste','wither'];
			break;
	}
	return attck;
};

Character.prototype.punch = function(){
	var attck = {};
	attck.natural = 1;
	attck.calculated = roll( Math.floor((this.stats.str + this.stats.agi)/8) + 'd3');
	attck.type = "physical";
	attck.targetStat = "HP";
	if (this.constructor.name === 'Hero'){
		attck.targetCharacter = currentGame.currentMonster;
	} else {
		attck.targetCharacter = currentGame.playerHero;
	}
	attck.buffArr = [];
	if (this.buffs.includes('Aflame')){
		attck.buffArr = ['Aflame',3];
	}
	attck.sprite = "poof";
	attck.color = this.color;
	attck.verbs = ["punch","smack","hit","wallop","slap"];
	return attck;
};

Character.prototype.useHand1 = function(){
	if (this.hand1){
		return this.hand1.attackObj();
	} else {
		return this.punch();
	}
};

Character.prototype.activate1 = function(){
	if (typeof(this.hand1) === 'undefined' ){
		this.equip1(new Punch());
	}
	this.useItem(this.hand1);
};

Character.prototype.activate2 = function(){
	if (typeof(this.hand2) === 'undefined' ){
		this.equip2(new Punch());
	}
	this.useItem(this.hand2);
};


Character.prototype.useItem = function(item){
	var obj = this.hand1.attackObj();
	if (obj.targetCharacter !== this){
		if (obj.targetCharacter.calcDodge()){
			obj.targetCharacter.dodge();
		} else {
			obj.targetCharacter.hit(obj);
		}
	} else {
		obj.targetCharacter.hit(obj);
	}
};

Character.prototype.runTurn = function(turnChoice){
	var nextTurn = (this.constructor.name === 'Hero') ? 'Monster turn' : 'End round';
	intervalRelay = "Check buffs";
	var thisCharacter = this;
	var turnLoop = setInterval(function(){
		if (intervalRelay === "Check buffs"){
			intervalRelay = "wait";
			thisCharacter.runBuffs();
		} else if (intervalRelay === "Use equip"){
			intervalRelay = "wait";
			thisCharacter[turnChoice]();
		} else if (intervalRelay === "End turn"){
			intervalRelay = "wait";
			clearInterval(turnLoop);
			intervalRelay = nextTurn;
		}
	},250);
};

// A hero is the PlayerCharacter Object

function Hero(name){
	this.div = document.getElementById('hero');
	this.canvas = document.getElementById('hero-sprite').getContext('2d');
	this.heroName = name;
	this.displayElement = {
		hpText: document.getElementById('hero-hp-text'),
		hpBar: document.getElementById('hero-hp-bar'),
		name: document.getElementById('hero-name')
	};
	this.displayElement.name.innerHTML = name;
	this.stats = {
		str: 8,
		agi: 8,
		int: 8,
		cha: 8,
		phys: 1,
		magi: 0,
		maxHP: 100
	};
	this.HP = this.stats.maxHP;
	this.kills = 0;
	this.spriteCompressed = "IwNgHgLAHAPgDAxTktW9HNfcY267a6EbHGlkkp6VVJ4EnmIOOs5maVc3vWt1kVQfSFpBI/FOkzZc+QsUJJqFUOYdOmrdTY7RbZXQbcKG8bwos+9ATZZjVfKkA===";
	this.color = "white";
	this.buffs = [];
}

Hero.prototype = new Character ();
Hero.prototype.constructor = Hero;

Hero.prototype.calcDodge = function(){
	var possibilities = [];
	for (var j = currentGame.currentMonster.stats.agi - 1; j >= 0; j--) {
		possibilities.push(false);
	}
	for (var k = (this.stats.agi/2) - 1; k >= 0; k--) {
		possibilities.push(true);
	}
	return randomEntry(possibilities);
};

Hero.prototype.dodge = function(){
	this.wiggle('dodge', 500);
	currentGame.log.add("You dodge the "+ currentGame.currentMonster.shortName +"'s attack.");
	intervalRelay = "End turn";
};

Hero.prototype.die = function(){
	intervalRelay = "End round";
	this.addClass('dead');
	currentGame.log.add('You were slain by the ' + currentGame.currentMonster.shortName + '.');
	setTimeout(function(){
		currentGame.log.add('You slayed ' + currentGame.playerHero.kills + ' monsters before perishing.');
	},2000);
};

Hero.prototype.initialize = function(){
	this.effectController = new Effect();
	this.effectController.link(this);
	this.equip1(new Sword());
	this.draw(this.canvas,this.spriteCompressed);
	this.updateStatus();
};

// A Monster is an enemy the PlayerCharacter fights one at a time

function Monster(){
	this.div = document.getElementById('monster');
	this.canvas = document.getElementById('monster-sprite').getContext('2d');
	this.shortName = "";
	this.displayElement = {
		hpText: document.getElementById('monster-hp-text'),
		hpBar: document.getElementById('monster-hp-bar'),
		name: document.getElementById('monster-name')
	};
	this.buffs = [];
	this.ai = function(){
		return 'activate1';
	};
}

Monster.prototype = new Character ();
Monster.prototype.constructor = Monster;

Monster.prototype.announce = function(){
	var article = "";
	if (currentGame.previousMonsterName === this.displayName){
		article = 'another ';
	} else if ('AEIOU'.indexOf(this.displayName.slice(0,1)) !== -1){
		article = 'an ';
	} else {
		article = 'a ';
	}
	var message = "It's " + article + this.displayName.toLowerCase() + '!';
	currentGame.log.add(message);
	if (this.shortName === ""){
		this.shortName = this.displayName;
	} 
	this.displayElement.name.innerHTML = this.shortName;
};

Monster.prototype.appear = function(){
	this.announce();
	this.effectController = new Effect();
	this.effectController.link(this);
	this.draw(this.canvas,this.spriteCompressed);
	this.HP = this.stats.maxHP;
	this.updateStatus();
};

Monster.prototype.die = function(){
	intervalRelay = "End round";
	this.addClass('dead');
	currentGame.log.add('You slayed the ' + this.shortName + '.');
	currentGame.playerHero.kills ++;
	if (currentGame.playerHero.kills >= currentGame.currentLocation.switchTrigger){
		setTimeout(currentGame.switchLocation, 2000);
	} else {
		setTimeout(currentGame.switchMonster, 2000);
	}
};

Monster.prototype.calcDodge = function(){
	var possibilities = [];
	for (var l = currentGame.playerHero.stats.agi - 1; l >= 0; l--) {
		possibilities.push(false);
	}
	for (var m = (this.stats.agi/2) - 1; m >= 0; m--) {
		possibilities.push(true);
	}
	return randomEntry(possibilities);
};

Monster.prototype.dodge = function(){
	this.wiggle('dodge', 500);
	currentGame.log.add('The ' + this.shortName + ' dodges your attack.');
	intervalRelay = "End turn";
};

// Types of Monsters

function Axedude (type) {
	this.stats = {
		str: 10,
		agi: 5,
		int: 5,
		cha: 2,
		phys: 2,
		magi: 0,
		maxHP: 16
	};
	this.spriteCompressed = "IwNgHgLAHAPgDAxTktW1xPGdx2u5IF5yF4BMZZCBx1tdODxTtpmGWJKbNnL/Xq3yZKnPNjFMiknlWrci46elVr1GzVu070AviX00ufBcCkGZDUsLb1mJq3Q5yXN124XsjTn95HmXp6iZvJw5DyRcnJAA";
	this.displayName = "Axedude";
	this.color = '#f8d878';
	this.hand1 = new Sword('Iron');
}
Axedude.prototype = new Monster();
Axedude.prototype.constructor = Axedude;

function Ball (type) {
	this.stats = {
		str: 7,
		agi: 7,
		int: 1,
		cha: 1,
		phys: 0,
		magi: 1,
		maxHP: 15
	};
	if ( type === ""){
		type = randomEntry(["Fire","Goo"]);
	}
	var dripSprite = "IwNgHgLAHAPgDAxTktW9HNe54fd6HBpGkpEBMwVhyhVDtipFrZCl1XTc+ejfJMVK1izDuzF1ewrGKnoFuHCtVr1GzVvU8SIvSKUzD+IZyJn63HiJoWJxsguGHeQifaNvByt7+zAQA===";
	var burnSprite = "IwNgHgLAHAPgDAxTktWxx0YZrTi7qYHFrElyH7kmnW22Ua0BMwbBTOJbvj3PFhwrN2Y4clZiR9BlVkyynPCtVr1GzVu06t8rLn3ZKR/CbooaF6uYry5jQg8eiec1+IYLhyj+8nOSl4GvkA==";
	switch (type){
		case 'Goo':
			this.spriteCompressed = dripSprite;
			this.displayName = "floating ball of dripping ooze";
			this.shortName = "Gooball";
			this.color = '#d800cc';
			break;
		case 'Fire':
			this.spriteCompressed = burnSprite;
			this.displayName = "floating orb of fire";
			this.shortName = "Fireball";
			this.color = "#f83800";
			this.hand1 = new Hose('Fire');
			break;
	}
}
Ball.prototype = new Monster();
Ball.prototype.constructor = Ball;

function Scamp (type) {
	this.stats = {
		str: 2,
		agi: 12,
		int: 10,
		cha: 8,
		phys: 0,
		magi: 1,
		maxHP: 10
	};
	this.spriteCompressed = "IwNgHgLAHAPgDAxTktW9HNbcY2G7a6EbHFYmll47WVI1kHpNWu170qU2q/P5BQ4SNFjxEyVypFybOTMx0WdfokZy1ydhwV9C0hry3rtk8xcuIgA=";
	this.displayName = "Scamp";
	this.color = '#b8f818';
}
Scamp.prototype = new Monster();
Scamp.prototype.constructor = Scamp;

function Skele (type) {
	this.stats = {
		str: 6,
		agi: 6,
		int: 6,
		cha: 2,
		phys: 0,
		magi: 0,
		maxHP: 12
	};
	if ( type === ""){
		type = randomEntry(["Footman","Archer","Monk","Bruiser","Flaming", "Bones"]);
	}
	this.color = '#f0d0b0';
	switch (type){
		case "Footman":
			this.stats.maxHP = 14;
			this.stats.str = 8;
			this.stats.phys = 1;
			this.spriteCompressed = "IwNgHgLAHAPgDAxTktW9HPOGn3f7B5JGJHnFlV6mFwX2PWrklnGtX2ef5P99KLNukpC+CcSK5ZZc+QsVLlKjFIGSCbWiQ4VxHJjuYMcYjZON7257rV4jDKJ6JnC3ziZ5JA==";
			this.displayName = "Skelebones Footman";
			this.hand1 = new Sword();
			break;
		case "Archer":
			this.stats.agi = 9;
			this.spriteCompressed = "IwNgHgLAHAPgDAxTktW4aUY5xP/pLaFFzA57lXVWl5kIWPLVZ2YFlOn62oWdcgksw7t+4tpNwzZc+QsVKps4qtHd69TaO3caB8uLX6WfYzM5GJvayuETdInVqcq3knEA";
			this.displayName = "Skelebones Archer";
			break;
		case "Monk":
			this.stats.agi = 9;
			this.stats.int = 9;
			this.stats.phys = 1;
			this.stats.magi = 1;
			this.spriteCompressed = "IwNgHgLAHAPgDAxTktW9HPOGn3f7B74JFnGLE55ErVzkN1PMkNWuMuGkb3e4O6ChVa9hbLFOkzZc+QsUTUogUlHVV3crTb9d6po1X9J49pU5lzhmn11bDNsWrOO1wIA=";
			this.displayName = "Wise, Old Skelebones";
			this.shortName = "Skelebones Monk";
			this.hand1 = new Staff();
			break;
		case "Bruiser":
			this.stats.maxHP = 16;
			this.stats.str = 10;
			this.stats.phys = 2;
			this.spriteCompressed = "IwNgHgLAHAPgDAxTktW9biKxux+o5JHIl55kXb40pFY4Gnk0PnbulML28mO0KldvUw9c/DJPTSxxXAsVLlK1WvUdxE7vOaFmOnn0G6WRui1psOwk5252BTO5tEWtMzXI/7T77EA=";
			this.displayName = "Skelebones who thinks he's a badass";
			this.shortName = "Skelebones Bruiser";
			this.hand1 = new Sword('Iron');
			break;
		case "Flaming":
			this.spriteCompressed = "IwNgHgLAHAPgDAxdhNW4KVqRj3GYBMe+CwxxW+55xpNld1uGh9yZVqmuH2XBdASoC+LMuz6kx0qXKGDJEpctlr1GzVvaj+unMhLTWR6hVPoKTfuZr0W+iVguDx+3aJEiF4+Qb/cikqOciECjuFAA";
			this.displayName = "Skelebones who is on fire";
			this.shortName = "Flaming Skelebones";
			this.buffs.push("Aflame");
			this.color = "#ff5000";
			break;
		case "Bones":
			this.spriteCompressed = "IwNgHgLAHAPgDAxTktW9HPOFxPc7D7pGnGqEJFqGlzlINUrHXPZV30nsb5Mc8fRsKE8RuSVOkzZc+Qt5YBFeirxl13fitrVdqwWrESySwVu7mWJw9Ym2jVIA";
			this.displayName = "Skelebones";
			break;	
	}
}
Skele.prototype = new Monster();
Skele.prototype.constructor = Skele;

function Snek (type) {
	var smallSprite = "IwNgHgLAHAPgDAxTktW9HNe14fib77pEEFpG7FXmF6ELWq2P0q2kuKdM5/8DBQ4SNFjx7Xs1IlKXJJTpsl2KQoXL2yNXA4zJPREA";
	var bigSprite = "IwNgHgLAHAPgDAxTktW9HNOD4HcHrABMpxuqBFeKJZ5RVmdD+hzpNzJXyvFtWjkGIqAuMLFMEU6VnkLFS5StVqhwxnNr1x2MRMr1WlbUc7c9aOr0YnRGyo776DMvLPGeBQA=";
	this.stats = {
		str: 5,
		agi: 9,
		int: 5,
		cha: 9,
		phys: 0,
		magi: 0,
		maxHP: 10
	};
	this.color = '#58d854';
	if ( type === ""){
		type = randomEntry(["Big","Small"]);
	}
	switch (type){
		case 'Big':
			this.hand1 = new Claws;
			this.spriteCompressed = bigSprite;
			this.displayName = "distressingly large Snek";
			this.shortName = "Really Big Snek";
			this.stats.str = 9;
			this.stats.agi = 12;
			this.stats.cha = 12;
			this.stats.maxHP = 18;
			break;
		case 'Small':
		default:
			this.hand1 = new Claws('Venom');
			this.spriteCompressed = smallSprite;
			this.displayName = "Snek";
			break;
	}
}
Snek.prototype = new Monster();
Snek.prototype.constructor = Snek;

function Jelly (type) {
	this.stats = {
		str: 7,
		agi: 10,
		int: 0,
		cha: 0,
		phys: 4,
		magi: 0,
		maxHP: 20
	};
	this.hand1 = new Hose('Acid');
	this.spriteCompressed = "IwNgHgLAHAPgDAxTktW9HNwEy7/5bYYk07JI0q8xfPYOhS6spqk5mnd6tn17vw58hXZqL7jegnpRpEp03A365a5OgSzaduvfoOGjFTXkJCGFC1xyaGWxSuGPi4jRY4v2yj66+tOa39ObmCmBVUxDVMaIA===";
	this.displayName = "quivering, gelatinous cube";
	this.shortName = "Box Jelly";
	this.color = 'rgba(88,216,84,0.5)';
}
Jelly.prototype = new Monster();
Jelly.prototype.constructor = Jelly;


function Were (type) {
	this.stats = {
		str: 12,
		agi: 7,
		int: 5,
		cha: 3,
		phys: 1,
		magi: 0,
		maxHP: 20
	};
	if( type === ''){
    	type = randomEntry(["Wolf","Goat","Hellbeast"]);
	}
	var wolfSprite = "IwNgHgLAHAPgDAxTktW9Lhyxhx8HoHH6YkmrmFlU5JbnZ1N7Xb2LGv11fuecKaWsJyFSmQd0kDhyZh3m5lK1WvUbNmhisaiqNEYaHzaC9ownS+/PD1JWWTLszEHKbnZSmPFd37Z23koIQA==";
	var goatSprite = "IwNgHgLAHAPgDAxTktWpx0M8TWdaK7F6onkrlVlW422lFzV1F4lOfPHaOves+bHumqj2/Mm0JC0jZnMqFlK1WvUbRM7tvlyK+2pQaThY5Cb04KkwSIVcB1jBJGzzNXnozT8Pxf5KFpohqkA=";
	switch (type){
		case "Wolf":
			this.spriteCompressed = wolfSprite;
			this.displayName = "Werewolf";
			this.color = "#ac7c00";
			this.hand1 = new Claws();
			break;
		case "Goat":
			this.stats.maxHP = 22;
			this.stats.str = 9;
			this.spriteCompressed = goatSprite;
			this.displayName = "Weregoat";
			this.color = '#d8d8d8';
			break;
		case "Hellbeast":
			this.stats.maxHP = 25;
			this.stats.str = 14;
			this.stats.int = 8;
			this.stats.agi = 8;
			this.stats.magi = 1;
			this.spriteCompressed = goatSprite;
			this.displayName = "loathsome, hellish beast";
			this.shortName = "Hellbeast";
			this.color = "#7c7c7c";
			break;
	}
}
Were.prototype = new Monster();
Were.prototype.constructor = Were;

function Mage (type) {
	this.stats = {
		str: 5,
		agi: 8,
		int: 12,
		cha: 8,
		phys: 0,
		magi: 2,
		maxHP: 12
	};
	this.hand1 = new Staff('Thunder');
	this.spriteCompressed = "IwNgHgLAHAPgDAxTktW9HgeV7dgEF75K4oEBMuwV5hRJd9WZiNzL5cVlPrjFQQioVSo/LQT9xlBvzYjqaWUXn4OjHBwaltO4gcNHjJ08sNqmczArWy2qDZt3NnUvk4d9BInMKFSOKLsZNLqPA7kipFafIFarm7qGvx6OkA==";
	this.displayName = "Wiz";
	this.color = '#0058f8';
}
Mage.prototype = new Monster();
Mage.prototype.constructor = Mage;

// Items are Displayable's that modify character's stats and determine their actions available

function Item(){
	this.owner = "";
}
Item.prototype = new Displayable();
Item.prototype.constructor = Item;

function Weapon(){
	this.natural = 1;
	this.buffArr = [];
}
Weapon.prototype = new Item();
Weapon.prototype.constructor = Weapon;

Weapon.prototype.attackObj = function(){
	var attck = {};
	attck.natural = this.natural;
	attck.calculated = this.attackVal();
	attck.type = this.attackType;
	attck.sprite = this.hitSprite;
	attck.color = this.color;
	if ((this.constructor.name === 'Punch')&&(this.owner.constructor.name !== "Hero")){
		attck.color = this.owner.color;
	}
	attck.verbs = this.verbArray;
	attck.targetCharacter = this.owner.getEnemy();
	attck.buffArr = this.buffArr;
	if (this.owner.buffs.includes('Aflame')){
		attck.buffArr = ['Aflame',3];
	}
	// Physical damage always targets HP, other do not.
	if (this.attackType === 'physical'){
		attck.targetStat = "HP";
	} else {
		attck.targetStat = this.targetStat;
	}
	return attck;
};

function Punch(){
	this.hitSprite = "poof";
	this.attackType = "physical";
	this.color = 'white';
	this.verbArray = ["punch","smack","hit","wallop","slap"];
	this.attackVal = function(){
		var str = this.owner.stats.str;
		var agi = this.owner.stats.agi;
		return roll( Math.floor((str + agi)/8) + 'd3');
	};

}
Punch.prototype = new Weapon();
Punch.prototype.constructor = Punch;

function Sword (type) {
	this.hitSprite = "slash1";
	this.attackType = "physical";
	this.verbArray = ['slash','strike','stab','lance','wound','cut'];
	switch (type){
		case "Iron":
			this.color = "#008888";
			this.attackVal = function(){
				return roll("3d3") - 2;	
			};
			break;
		case "Flame":
			this.color = "#f87858";
			this.attackType = "flame";
			this.buffArr= ["Aflame",10];
			this.attackVal = function(){
				return roll("3d3") - 1;	
			};
			break;
		case "Wood":
		default:
			this.color = "#f8b800";
			this.attackVal = function(){
				return roll("2d3");	
			};
			break;
	}
}
Sword.prototype = new Weapon();
Sword.prototype.constructor = Sword;

function Staff (type) {
	this.hitSprite = 'kapow';
	this.attackType = "physical";
	this.verbArray = ['strike','bludgeon','bash','thwack','smack'];
	switch (type){
		case "Thunder":
			this.hitSprite = 'bolt';
			this.attackType = "lightning";
			this.targetStat = "HP";
			this.color = "#b8f8d8";
			this.verbArray = ['blast','electrocute','zap','smite'];
			this.attackVal = function(){
				return Math.floor(1.5 * rollHits( this.owner.stats.int + "d3",3));
			};
			break;
		case "Wood":
		default:
			this.color = "#f8b800";
			this.attackVal = function(){
				var str = this.owner.stats.str;
				var agi = this.owner.stats.agi;
				return rollHits( (str+agi) + "d5",5);	
			};
			break;
	}
}
Staff.prototype = new Weapon();
Staff.prototype.constructor = Staff;

function Claws (type) {
	this.hitSprite = 'claws';
	this.attackType = "physical";
	this.targetStat = "HP";
	this.verbArray = ['maul','savage','lacerate','wound','cut'];
	switch (type){
		case "Venom":
			this.color = "#00b800";
			this.attackType = "poison";
			this.buffArr = ["Poisoned",6];
			this.attackVal = function(){
				var str = this.owner.stats.str;
				var agi = this.owner.stats.agi;
				return roll( Math.ceil((str + agi)/12) + 'd4');	
			};
			break;
		case "Bone":
		default:
			this.color = "#f0d0b0";
			this.attackVal = function(){
				var str = this.owner.stats.str;
				var agi = this.owner.stats.agi;
				return roll( Math.ceil((str + agi)/8) + 'd4');	
			};
			break;
	}
}
Claws.prototype = new Weapon();
Claws.prototype.constructor = Claws;

function Hose (type) {
	this.hitSprite = 'splat';
	this.attackType = "physical";
	this.verbArray = ['splash','douse'];
	switch (type){
		case "Fire":
			this.attackType = "fire";
			this.targetStat = "HP";
			this.color = 'rgba(248,56,0,0.5)';
			this.verbArray.push('ignite','torch');
			this.buffArr = ["Aflame",3];
			this.attackVal = function(){
				return roll('1d3');
			};
			break;
		case "Acid":
		default:
			this.attackType = "acid";
			this.targetStat = "maxHP";
			this.color = 'rgba(88,216,84,0.5)';
			this.verbArray.push('slime','spatter');
			this.attackVal = function(){
				return roll('1d2');
			};
			break;
	}
}
Hose.prototype = new Weapon();
Hose.prototype.constructor = Hose;


// an Effect is a Displayable that visually displays the type of damage to the player

function Effect(){
	this.sprites = {
		kapow: "GwFgHgTCA+AM8MU5LVvRzXs93/BhRxJBAjKZahRjVSnQ4o8i/UmTZ/N+5ZwMFs+zHl2pDeItJJmTh0hLIbypi5vNaqBPbAqzKtq9SsFzDJpWN2mhlwtv32512GueYnjLx4Off+HRAA==",
		slash1: "GwFgHgTCA+AM8MU5LVvRzXs93/BhRxJpZaAjOdZTXUlfU40zRS5h65e9l9ynb9BwkXSF9RyXtQlYpAhDM6KMC1bnUa+20oyA",
		blast: "GwFgHgTCA+AM8MU5LVvRzXs93/BhRxJeAjGfBaTUpRQ4/bTU25S2h41Yk3zxLV07DggaoJRNl2FSq8uovLcxStfOXrCwhSl3iNa5AZUD9x2AdNLicywqNitAh9hmT7Tt4OlvDHgGe/iyqcq7Wvpw6oi7ROPSxVvGk9rBAA==",
		claws: "GwFgHgTCA+AM8MU5LVvRzXs93/BGAjCYWXiUeddpYnTYwqfA0+1ay15+4bwzZ8ynFkOH8uPCTSpjeM2XIWLypbmjmtVqUSuRbY+nfWNJDZk0cwWra6w7sFbmh5yA",
		poof: "GwFgHgTCA+AM8MU5LVvRzXs93/mAjASasaRYuUWdtafVTZbI0mwvR5y/Nz8n69B7YWNF9xU6TNlzWHQuSVEVWIfM1bN1DdvSM9+gxkXGmaflxPnWtU7aOSR6809stqQA",
		splat: "GwFgHgTCA+AM8MU5LVvRzXs93/BhRxhAjCduRdWuaVTQw/M/vfTS8h8ex62Tqx2JPjwpi+EkV1GSEAwbMHzqkxZRbq523qo1Z1MlVOn7ewqgc26LnREbvLhoy1ev3cQ7vCA=",
		bolt: "GwFgHgTCA+AM8MU58CMKOZervM70MQKKJNL3Iqyuo1rqXQcYVRcZw87Vd2+oC+vYU1GVxbSf0lDRcmdPrtxC1gTXYlW6c01klJFYZPJ99WOYtNjwrtrGW7UhyLeDH2qzrTfrr93kAl1MAv2wgA==",
		flame: "GwFgHgTCA+AM8MU5LVvRzXs93/BaAjIZiaauRZdckVbUvYwsy0w7W7Jyr06358y9ckMTdhPUVkl8Zc+emajxEtatU14i9ZqFVdO+hH1Kt81ad0qZl6xY5m6mh5c0uTzvaLdPfjsZWdoJEEOFecvoODAFhEVGugSbhqX5B1qkh0vFp1nqZCbG5eZIpefmCFQnq1ZWsdbwlaU2NdG0c1a0Vis01TF385fWdWQYlRsNGQWozItOh5EA",
		bubble: "GwFgHgTCA+AM8MU5LVvRzXs93/BhRsAjMefmRdalSnTdQws42iR21/BxH59ywdWiEnwhiRgpGIlTZ/SdPQL54/hNFStxVbXXjty0gP3qjxoaouWrN24xH2Ho9i8LP3KhEA=="
	};
	this.color = "yellow";
	this.associatedCharacter = "";
}
Effect.prototype = new Displayable();
Effect.prototype.constructor = Effect;

Effect.prototype.link = function(character){
	this.associatedCharacter = character;
	this.damageElement = character.div.getElementsByClassName('damage-sprite')[0];
	this.damageCanvas = this.damageElement.getContext('2d');
};

Effect.prototype.displayDamage = function(spriteName, color){
	this.color = color;
	this.damageElement.classList.add("active", spriteName);
	this.draw(this.damageCanvas,this.sprites[spriteName]);
	var thisEffect = this;
	setTimeout(function(){thisEffect.clear();}, 500);
};

Effect.prototype.clear = function(){
	this.damageElement.className = "damage-sprite";
};

// event Listeners

function loadButtons(){
	var buttons = document.getElementsByClassName("button");
	for (var i=0; i < buttons.length; i+=1){
		var clickData = buttons[i].getAttribute('click-data');
		var fnName = clickData.slice(0,clickData.indexOf(' '));
		var fnArg = clickData.slice(clickData.indexOf(' ')+1);
		buttons[i].addEventListener("click", function(){currentGame[fnName](fnArg);});
	}
}

loadButtons();

currentGame.initialize();
