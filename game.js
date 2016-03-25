
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
		case 'chow down':
		verb = firstWord(verb)+'s '+secondWord(verb);
			break;
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

// Shortens string

function shorten(string,maxlength){
	if(string.length > maxlength) {
    	string = string.substring(0,maxlength-4)+"...";
	}
	return string;
}

// gets the first word of a string
function firstWord(string){
	return string.slice(0,string.indexOf(' '));
}

// gets the second word of a string
function secondWord(string){
	return string.slice(string.indexOf(' ')+1);
}

// takes a color and makes it half-black

function halfBlack(colorStr){
	var r = 0;
	var g = 0;
	var b = 0;
	var a = 1;
	if (colorStr.charAt(0) === "#"){
		r = parseInt(colorStr.substring(1,3), 16);
    	g = parseInt(colorStr.substring(3,5), 16);
   		b = parseInt(colorStr.substring(5,7), 16);
	} else if (colorStr.charAt(0) === "r"){
		var valArr = colorStr.slice(5,-1).split(',');
		r = valArr[0];
		g = valArr[1];
		b = valArr[2];
		a = valArr[3];
	} else {
		return 'rgba(127,127,127,1)';
	}
	r = (r/2).toFixed();
	g = (g/2).toFixed();
	b = (b/2).toFixed();
	a = ((a+1)/2).toFixed(1);
	return 'rgba('+r+','+g+','+b+','+ a +')';
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

var inventoryCanvases = [
	document.getElementById('invSprite1').getContext('2d'),
	document.getElementById('invSprite2').getContext('2d'),
	document.getElementById('invSprite3').getContext('2d'),
	document.getElementById('invSprite4').getContext('2d'),
	document.getElementById('invSprite5').getContext('2d'),
	document.getElementById('invSprite6').getContext('2d'),
	document.getElementById('invSprite7').getContext('2d'),
	document.getElementById('invSprite8').getContext('2d')
];

function Game (){
	this.interface = {
		element: document.getElementById('interface'),
		pause: function(){
			this.element.classList.add('wait');
		},
		unpause: function(){
			this.element.classList.remove('wait');
		}
	};
	this.log = {
		element: document.getElementById('gameLog'),
		add: function(message){
			this.element.innerHTML += ('<p>'+ message + '</p>');
			this.element.scrollTop = this.element.scrollHeight;
		}
	};

	this.dialog = {
		element: document.getElementById('dialog'),
		message: document.getElementById('dialog-text'),
		buttons: document.getElementById('dialog-buttons'),
		open: function(){
			currentGame.interface.pause();
			loadButtons(this.element);
			this.element.classList.add('active');
		},
		setText: function(message){
			this.message.innerHTML = message;
		},
		addButton: function(text,clickData,className){
			className = (className+"" === "undefined")? "" : className;
			var buttonStr = "<a class='button dialog "+className+"' click-data='"+clickData+"'>"+text+"</a>";
			this.buttons.innerHTML += buttonStr;
		},
		close: function(){
			this.element.classList.remove('active');
			var thisDialog = this;
			setTimeout(function(){
				thisDialog.message.innerHTML = "";
				thisDialog.buttons.innerHTML = "";
				currentGame.interface.unpause();
				},500);
		}
	};
	this.router = function(command){
		this.dialog.close();
		switch (command){
			case 'takeFoundItem':
				this.playerHero.addToInv(this.foundItem);
				break;
			case 'closeDialog':
			default:
				currentGame.playerHero.offHand = "";
				break;
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
		var monsterClass = firstWord(monsterType);
		var monsterVariant = secondWord(monsterType);
		if (monsterVariant === monsterType){
			monsterClass = monsterType;
			monsterVariant = "";
		}
		var newMonster = new window[monsterClass](monsterVariant);
		newMonster.div.className = "";
		newMonster.appear();
		currentGame.currentMonster = newMonster;
	};

	this.itemFromString = function(itemType){
		var itemClass = firstWord(itemType);
		var itemVariant = secondWord(itemType);
		if (itemVariant === itemType){
			itemClass = itemType;
			itemVariant = "";
		}
		return new window[itemClass](itemVariant);
	};

	this.switchMonster = function(){
		var monsterType = randomEntry(currentGame.currentLocation.monsterArray);
		currentGame.enterMonster(monsterType);
	};

	this.switchLocation = function(locationName){
		currentGame.interface.pause();
		var oldLocationName = (typeof(currentGame.currentLocation) === "undefined") ? "" : currentGame.currentLocation.shortName;
		var validLocations = ["Dungeon", "Volcano", "Forest", "Graveyard", "Mine"];
		validLocations.splice(validLocations.indexOf(oldLocationName),1);
		locationName = randomEntry(validLocations);
		currentGame.currentLocation = new Location(locationName);
		currentGame.currentLocation.switchTrigger = currentGame.playerHero.kills + 6 + roll('1d4');
		currentGame.currentLocation.draw(currentGame.currentLocation.canvas, currentGame.currentLocation.spriteCompressed);
		currentGame.currentLocation.canvas.fillRect(0,40,160,50);
		currentGame.log.add("You enter the " +locationName+'...');
		setTimeout(function(){
			currentGame.switchMonster();
			currentGame.interface.unpause();
		},2000);
	};

	this.everyoneIsAlive = function(){
		return ((this.playerHero.stats.HP > 0)&&(this.currentMonster.stats.HP >0));
	};

	this.runRound = function(playerChoice){
		this.foundItem = "";
		this.dialog.close();
		intervalRelay = "Player turn";
		var gameLoop = setInterval(function(){
			if (intervalRelay === "Player turn"){
				intervalRelay = "wait";
				currentGame.interface.pause();
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
				if(currentGame.playerHero.stats.HP > 0){
					currentGame.interface.unpause();
				}
			}
		},500);
	};

	this.inventoryRouter = function(number){
		var item = this.playerHero.inventory[number - 1];
		if (typeof(item) !== 'undefined'){
			item.invDialog();
		}
	};

	this.dropItem = function(number){
		this.dialog.close();
		this.playerHero.inventory.splice(number,1);
		this.playerHero.updateStatus();
		if (this.foundItem.sprite){
			this.playerHero.addToInv(this.foundItem);
		}
	}

	this.replace

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
            	canvas.fillStyle = halfBlack(this.color);
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
	this.resists = {};
	this.inventory = [];
}

Character.prototype = new Displayable ();
Character.prototype.constructor = Character;

Character.prototype.updateStatus = function(){
	if (this.stats.HP < 1){
		this.stats.HP = 0;
	} else if (this.stats.HP > this.stats.maxHP){
		this.stats.HP = this.stats.maxHP;
	}
	this.displayElement.hpText.innerHTML = this.stats.HP + "/" + this.stats.maxHP;
	var percentage = Math.floor((this.stats.HP / this.stats.maxHP)*100);
	this.displayElement.hpBar.style.width = percentage + "%";
	this.displayElement.hpBar.className = "hp-bar hp-" + (Math.round(percentage / 10)*10);
	if (this.constructor.name === "Hero"){
		this.drawInventory();
	}
	if (this.stats.HP === 0){
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
	if (this.constructor.name === "Hero"){
		document.getElementById('equip1').innerHTML = shorten(item.shortName,17);
	}
};

Character.prototype.equip2 = function(item){
	item.owner = this;
	this.hand2 = item;
	if (this.constructor.name === "Hero"){
		document.getElementById('equip2').innerHTML = shorten(item.shortName,17);
	}
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
			this.burnItems();
			return Math.floor((this.stats.magi + this.stats.phys) /2);
		case 'poison':
			return 0;
		case 'physical':
		default:
			return this.stats.phys;
	}
};

Character.prototype.burnItems = function(){
	var items = [this.hand1,this.hand2];
	for (var i = items.length - 1; i >= 0; i--) {
		if (typeof( items[i] ) !== "undefined" ){
			if (items[i].flammable === true){
				items[i].uses -= roll('2d3');
				items[i].uses = (items[i].uses > 0) ? items[i].uses : items[i].uses;
				items[i].breakVerb = 'is charred to a crisp';
			}
		}
	}
};

Character.prototype.smite = function(num){
	this.stats.HP -= num;
	this.lastHitBy = new Buff('Smite',this).attackObj();
	this.updateStatus();
};

Character.prototype.calcDodge = function(fleeing){
	if ((this.offHand !== "")&&(typeof(this.offHand) !== "undefined")){
		return false;
	}
	var possibilities = [];
	for (var j = this.getEnemy().stats.agi - 1; j >= 0; j--) {
		possibilities.push(false);
	}
	var softener = (this.hand1.ranged||this.hand2.ranged)? 2 : 3;
	softener -= (fleeing === true)? 0.5 : 0;
	for (var k = (this.stats.agi/softener) - 1; k >= 0; k--) {
		possibilities.push(true);
	}
	return randomEntry(possibilities);
}

Character.prototype.hit = function(atkObj){
	intervalRelay = 'wait';
	var defense = this.defense(atkObj.type);
	var resist = (typeof(this.resists[atkObj.type])!== 'undefined') ? (this.resists[atkObj.type]) : 1;
	if (atkObj.targetStat !== 'HP'){
		// Any natural damage is ignored for non-HP damage;
		atkObj.natural = 0;
	}
	var afterDef = (atkObj.calculated - defense) < 0 ? 0 : (atkObj.calculated - defense);
	// an attack cannot be < 0 (healing) b/c of defense.
	var defendedAtk = Math.ceil((atkObj.natural + afterDef)*resist);
	var undefendedAtk = Math.ceil(((atkObj.calculated + atkObj.natural)*resist));
	var appliedDmg = 0;
	switch (atkObj.itemType){
		case 'Consumable':
			appliedDmg = undefendedAtk;
			// Consumables ignore defenses and can be < 0 (healing)
			break;
		case 'Weapon':
			appliedDmg = defendedAtk;
		case 'Buff':
			appliedDmg = (atkObj.calculated < 0) ? undefendedAtk : defendedAtk ;
			break;
	}
 	this.stats[atkObj.targetStat] -= appliedDmg;
	this.effectController.displayDamage(atkObj.sprite, atkObj.color);
	this.wiggle('hit', 250);
	var verb = randomEntry(atkObj.verbs);
	var message = "";
	this.lastHitBy = atkObj;
	switch (atkObj.itemType){
		case 'Consumable':
		case 'Buff':
			if(atkObj.calculated < 0){ appliedDmg = Math.abs(appliedDmg);}
			message = firstCap(this.selfStr()) + ' ' + this.conjugate(verb) + ' for ' + appliedDmg + atkObj.targetStat.toUpperCase() + '.';
			break;
		case 'Weapon':
			message = firstCap(this.getEnemy().selfStr())+' '+ this.getEnemy().conjugate(verb) +' '+ this.selfStr().toLowerCase() + ' for ' + appliedDmg + atkObj.targetStat.toUpperCase() + '.';
			break;
	}
	currentGame.log.add(message);
	this.updateStatus();
	var waitBeforeEnding = 1;
	if (atkObj.buffArr.length > 1){
		var currentBuff = atkObj.buffArr[0];
		var chance = atkObj.buffArr[1];
		var gotBuffed = (rollHits('1d'+chance,chance) >= 1);
		if ((gotBuffed)&&(!this.buffs.includes(currentBuff)&&(this.stats.HP > 0))) {
			verb = 'are';
			message = firstCap(this.selfStr())+' '+ this.conjugate(verb)+ ' ' + currentBuff + ".";
			this.addBuff(currentBuff);
			setTimeout(function(){currentGame.log.add(message);},1000);
			waitBeforeEnding ++;
		}
	}
	// only end turn if the damage is nof coming from a buff effect,
	// otherwise runBuffs signals the next step.
	if (atkObj.itemType !== 'Buff'){
		setTimeout(function(){intervalRelay = "Check equip";},(1000 * waitBeforeEnding));
	}
	
};

Character.prototype.selfStr = function(){
	return (this.constructor.name === "Hero") ? "You" : "The " + this.shortName;
};

Character.prototype.conjugate = function(verb){
	return (this.constructor.name === "Hero") ? verb : thirdPerson(verb);
};

Character.prototype.addBuff = function(buff){
	if (!this.buffs.includes(buff)){
		this.buffs.push(buff);
	}
}

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
			buffAtkObj = new Buff(buffsArr[counter],thisCharacter).attackObj();
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
			if (thisCharacter.stats.HP > 0){
				currentGame.log.add(thisCharacter.selfStr() + ' ' + thisCharacter.conjugate('are') + ' no longer ' + buffsArr[counter].toLowerCase() + '.' );
			}
			curedIt = false;
			counter++;
		}
		if ((counter >= (buffsArr.length))&&(!curedIt)&&(goAhead)){
			if (thisCharacter.stats.HP <= 0){ nextStep = "End round";}
			clearInterval(buffInterval);
			setTimeout(function(){intervalRelay = nextStep;},1000);
		}
	},750);
};

Character.prototype.checkEquip = function(turnChoice){
	var item = "";
	switch (turnChoice){
		case 'activate1':
			item = this.hand1;
			break;
		case 'activate2':
			item = this.hand2;
			break;
		case 'activateOffhand':
			item = this.offHand;
			break;
		default:
			intervalRelay = "End turn";
			return;
	}
	if(item.checkExhausted()){
		item.exhaust();
		setTimeout( function(){intervalRelay = "End turn";},1000);
	} else {
		intervalRelay = "End turn";
	}
};

Character.prototype.runAway = function(){
	var success = this.calcDodge(true);
	var conjugated = "", message = "";
	if (success){
		conjugated = (this.constructor.name === "Hero") ? 'manage' : 'manages';
		message = firstCap(this.selfStr()) + " " + conjugated + " to escape!";
		currentGame.log.add(message);
		currentGame.currentMonster.addClass('escaped');
		setTimeout(function(){ 
			intervalRelay = "End round";
			currentGame.switchMonster();
		},1000);
	} else {
		conjugated = (this.constructor.name === "Hero") ? 'try' : 'tries';
		message = firstCap(this.selfStr()) + " " + conjugated + " to flee, but to no avail...";
		currentGame.log.add(message);
		setTimeout(function(){
			intervalRelay = "End turn";
		},1000);
	}
};


Character.prototype.activateOffhand = function(){
	this.useItem(this.offHand);
};

Character.prototype.equip1Offhand = function(){
	this.equip1(this.offHand);
	currentGame.log.add(firstCap(this.selfStr()) +' '+ this.conjugate('equip')+' the '+ this.offHand.shortName.toLowerCase()+'.' );
	this.offHand = "";
	setTimeout(function(){intervalRelay = "Check equip";},1000);
};

Character.prototype.equip2Offhand = function(){
	this.equip2(this.offHand);
	currentGame.log.add(firstCap(this.selfStr()) +' '+ this.conjugate('equip')+' the '+ this.offHand.shortName.toLowerCase()+'.' );
	this.offHand = "";
	setTimeout(function(){intervalRelay = "Check equip";},1000);
};

Character.prototype.activate1 = function(){
	this.offHand = "";
	if (typeof(this.hand1) === 'undefined' ){
		this.equip1(new Punch());
	}
	this.useItem(this.hand1);
};

Character.prototype.activate2 = function(){
	this.offHand = "";
	if (typeof(this.hand2) === 'undefined' ){
		this.equip2(new Punch());
	}
	this.useItem(this.hand2);
};

Character.prototype.useItem = function(item){
	var obj = item.attackObj();
	if ((obj.targetCharacter !== this)&&(obj.targetCharacter.calcDodge())){
		obj.targetCharacter.dodge();
	} else {
		if(item.uses !== true){ item.uses-- ; }
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
		}else if (intervalRelay === "Check equip"){
			intervalRelay = "wait";
			thisCharacter.checkEquip(turnChoice);
		} else if (intervalRelay === "End turn"){
			intervalRelay = "wait";
			clearInterval(turnLoop);
			intervalRelay = nextTurn;
		} else if (intervalRelay === 'End round'){
			clearInterval(turnLoop);
			return;
		}
	},250);
};

Character.prototype.addToInv = function(item){
	if (this.inventory.length < 8){
		item.owner = this;
		this.inventory.push(item);
		if (this.constructor.name === "Hero"){
			this.updateStatus();
		}
	} else if (this.constructor.name === "Hero"){
		var thisCharacter = this;
		setTimeout(function(){
			thisCharacter.inventoryFull(item);
		},600)
	}
};

Character.prototype.die = function(){
	intervalRelay = "End round";
	this.addClass('dead');
	var message = "";
	switch (this.lastHitBy.itemType){
		case 'Consumable':
			message = this.selfStr() + " died of self-inflicted wounds.";
			break;
		case 'Buff':
			message = this.selfStr() + " died " + this.lastHitBy.killStr + '.';
			break;
		case 'Weapon':
			if(this.constructor.name === 'Hero'){
				message = 'You were slain by the ' + this.getEnemy().shortName + '.';
			} else {
				message = 'You slayed the ' + this.shortName + '.';
			}
			break;
	}
	currentGame.log.add(message);
	if(this.constructor.name === 'Hero'){
		currentGame.interface.pause();
		setTimeout(function(){
			currentGame.log.add('You slayed ' + currentGame.playerHero.kills + ' monsters and found '+currentGame.playerHero.gold+' gold before perishing.');
		},2000);
	} else if (currentGame.playerHero.stats.HP > 0) {
		currentGame.playerHero.kills ++;
		this.loot();
		if (currentGame.playerHero.kills >= currentGame.currentLocation.switchTrigger){
			setTimeout(currentGame.switchLocation, 2000);
		} else {
			setTimeout(currentGame.switchMonster, 2000);
		}
	}
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
		maxHP: 50
	};
	this.stats.HP = this.stats.maxHP;
	this.kills = 0;
	this.spriteCompressed = "IwNgHgLAHAPgDAxTktW9HNfcY267a6EbHGlkkp6VVJ4EnmIOOs5maVc3vWt1kVQfSFpBI/FOkzZc+QsUJJqFUOYdOmrdTY7RbZXQbcKG8bwos+9ATZZjVfKkA===";
	this.color = "white";
	this.buffs = [];
}

Hero.prototype = new Character ();
Hero.prototype.constructor = Hero;

Hero.prototype.drawInventory = function(){
	for (var v = 7; v >= 0; v--) {
		inventoryCanvases[v].clearRect(0,0,16,16);
	}
	for (var x = this.inventory.length - 1; x >= 0; x--) {
		var canvas = inventoryCanvases[x];
		var sprite = this.inventory[x].smallSprite;
		this.inventory[x].draw(canvas,sprite);

	}
};

Hero.prototype.debug = function(){
	// put some stuff you need to test here;
	currentGame.log.add('Fire rains from the heavens, lighting everything ablaze!');
	this.addToInv(new Sword('Flame'));
	this.addBuff('Aflame');
	this.getEnemy().addBuff('Aflame');
	this.effectController.displayDamage('flame', 'rgba(248,56,0,0.5)');
	currentGame.currentMonster.effectController.displayDamage('flame', 'rgba(248,56,0,0.5)');
	this.wiggle('hit', 250);
	var heroDamage = (this.stats.HP < 10 )? 10 : this.stats.HP - 10;
	setTimeout(function(){
		currentGame.playerHero.smite(heroDamage);
		currentGame.currentMonster.smite(12);
		intervalRelay = "End turn";
	},1000);
};

Hero.prototype.possesive = function(){
	return "your";
};

Hero.prototype.dodge = function(){
	this.wiggle('dodge', 500);
	currentGame.log.add("You dodge the "+ currentGame.currentMonster.shortName +"'s attack.");
	intervalRelay = "End turn";
};

Hero.prototype.initialize = function(){
	this.effectController = new Effect();
	this.effectController.link(this);
	this.addToInv(new Sword());
	this.addToInv(new Potion('Health'));
	this.equip1(this.inventory[0]);
	this.equip2(this.inventory[1]);
	this.gold = 0;
	this.draw(this.canvas,this.spriteCompressed);
	this.updateStatus();
};

Hero.prototype.receive = function(item){
	currentGame.foundItem = item;
	var message = "You find a " + item.shortName + "!";
	currentGame.dialog.addButton("Take the " + item.shortName, "router takeFoundItem");
	currentGame.dialog.addButton("Leave it", "router closeDialog");
	currentGame.dialog.setText(message);
	currentGame.dialog.open();
};

Hero.prototype.inventoryFull = function(item){
	var message = "You don't have room in your knapsack for the "+ item.shortName + "!<br> Would you like to drop something?"
	for (var q = 0; q <= this.inventory.length - 1; q++) {
		currentGame.dialog.addButton("Drop your "+ this.inventory[q].shortName, "dropItem " + q);
	}
	currentGame.dialog.addButton("Leave the "+ item.shortName +" behind", "router closeDialog");
	currentGame.dialog.setText(message);
	currentGame.dialog.open();
}

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
	this.inventory = [];
}
Monster.prototype = new Character ();
Monster.prototype.constructor = Monster;

Monster.prototype.possesive = function(){
	return "the " + this.shortName.toLowerCase() + "'s"; 
};

Monster.prototype.ai = function(){
	if (typeof(this.aiType) === 'undefined'){
		this.aiType = 'simple';
	}
	switch(this.aiType){
		case "simple":
			return 'activate1';
		case "random":
			return (Math.random() > 0.5)? 'activate1' : 'activate2';
		case "switch":
			if (typeof(this.switchTrigger) === 'undefined'){
				this.switchTrigger = Math.round(this.maxHP / 2);
			}
			return ( this.stats.HP >= this.switchTrigger )? 'activate1' : 'activate2';
		case "buffer":
			return ( this.hand1.constructor.name !== 'Punch') ? 'activate1' : 'activate2';
	}
};

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
	this.buffs = [];
	this.inventory = [];
	if( typeof(this.item1) !== "undefined"){
		this.addToInv(this.item1);
	}
	if( typeof(this.item2) !== "undefined"){
		this.addToInv(this.item2);
	}
	var grab1 = (this.inventory[0])? this.inventory[0] : new Punch();
	var grab2 = (this.inventory[1])? this.inventory[1] : new Punch();
	this.equip1(grab1);
	this.equip2(grab2);
	this.effectController = new Effect();
	this.effectController.link(this);
	this.draw(this.canvas,this.spriteCompressed);
	this.stats.HP = this.stats.maxHP;
	this.gold = roll('1d20');
	this.updateStatus();
};

Monster.prototype.dodge = function(){
	this.wiggle('dodge', 500);
	currentGame.log.add('The ' + this.shortName + ' dodges your attack.');
	intervalRelay = "End turn";
};

Monster.prototype.loot = function(){
	var tempUncommonArr = ["Potion Regen","Sword Iron","Vial Steroids","Food","Food Rotten","Bow Wood"];
	var tempRareArr = ["Potion Health","Sword Flame","Staff Thunder","Bow Poison"];
	var numUncommon = roll('1d3') - 1;
	var numRare = roll('1d2') - 1;
	for (var w = numUncommon - 1; w >= 0; w--) {
		this.addToInv(currentGame.itemFromString(randomEntry(tempUncommonArr)));
	}
	for (var e = numRare.length - 1; e >= 0; e--) {
		this.addToInv(currentGame.itemFromString(randomEntry(tempRareArr)));
	}
	var gotItem = (rollHits('1d2',2)>0);
	var message = "You found "
	var lootedItem = (this.inventory.length > 0) ? randomEntry(this.inventory) : false;
	var thisMonster = this;
	message += (gotItem&&lootedItem)? "a "+lootedItem.shortName+"!" : this.gold + " gold!";
	setTimeout(function(){
		currentGame.log.add(message);
		if (gotItem&&lootedItem){
			currentGame.playerHero.receive(lootedItem);
		} else {
			currentGame.playerHero.gold += thisMonster.gold;
		}
	},1000);
}

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
	this.spriteCompressed = "IwNgHgLAHAPgDAxTktW1xPGdx2u5IF5yF4BMZZCBx1tdODxTtpmGWJKbNnL/Xq3wdqNQh1I8qY8UVlScnaelVr1GzVu07VAviX3jJUscEpFpDRXmb5hzK3RPyTsoe6FOjxkfZXGNrbyaGbKTEA==";
	this.displayName = "Axedude";
	this.color = '#f8d878';
	this.item2 = (new Axe());
	this.item1 = (new Vial('Steroids'));
	this.aiType = 'buffer';
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
			this.resists = { fire: -0.5 };
			this.spriteCompressed = burnSprite;
			this.displayName = "floating orb of fire";
			this.shortName = "Fireball";
			this.color = "#f83800";
			this.item1 = (new Hose('Fire'));
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
	this.item1 = (new Potion('Regen'));
	this.aiType = 'random';
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
	this.resists = { fire: 1.5 };
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
			this.item1 = (new Sword());
			break;
		case "Archer":
			this.stats.agi = 10;
			this.spriteCompressed = "IwNgHgLAHAPgDAxTktW4aUY5xP/pLaFFzA57lXVWl5kIWPLVZ2YFlOn62oWdcgksw7t+4tpNwzZc+QsVKps4qtHd69TaO3caB8uLX6WfYzM5GJvayuETdInVqcq3knEA";
			this.displayName = "Skelebones Archer";
			this.item1 = (new Bow());
			break;
		case "Monk":
			this.stats.agi = 16;
			this.stats.int = 9;
			this.stats.phys = 1;
			this.stats.magi = 1;
			this.spriteCompressed = "IwNgHgLAHAPgDAxTktW9HPOGn3f7B74JFnGLE55ErVzkN1PMkNWuMuGkb3e4O6ChVa9hbLFOkzZc+QsUTUogUlHVV3crTb9d6po1X9J49pU5lzhmn11bDNsWrOO1wIA=";
			this.displayName = "Wise, Old Skelebones";
			this.shortName = "Skelebones Monk";
			this.item1 = (new Staff());
			break;
		case "Bruiser":
			this.stats.maxHP = 18;
			this.stats.str = 10;
			this.stats.phys = 2;
			this.spriteCompressed = "IwNgHgLAHAPgDAxTktW9biKxux+o5JHIl55kXb40pFY4Gnk0PnbulML28mO0KldvUw9c/DJPTSxxXAsVLlK1WvUdxE7vOaFmOnn0G6WRui1psOwk5252BTO5tEWtMzXI/7T77EA=";
			this.displayName = "Skelebones who thinks he's a badass";
			this.shortName = "Skelebones Bruiser";
			this.item1 = (new Sword('Iron'));
			break;
		case "Flaming":
			this.stats.maxHP = 20;
			this.spriteCompressed = "IwNgHgLAHAPgDAxdhNW4KVqRj3GYBMe+CwxxW+55xpNld1uGh9yZVqmuH2XBdASoC+LMuz6kx0qXKGDJEpctlr1GzVvaj+unMhLTWR6hVPoKTfuZr0W+iVguDx+3aJEiF4+Qb/cikqOciECjuFAA";
			this.displayName = "Skelebones who is on fire";
			this.shortName = "Flaming Skelebones";
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
			this.hand1 = new Claws();
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
			this.item1 = (new Claws('Venom'));
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
	this.resists = { fire: 1.25 };
	this.item1 = (new Hose('Acid'));
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
			this.item1 = (new Claws());
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
	this.inventory = [];
	this.stats = {
		str: 5,
		agi: 8,
		int: 12,
		cha: 8,
		phys: 0,
		magi: 2,
		maxHP: 12
	};
	this.item1 = (new Staff('Thunder'));
	this.item2 = (new Potion('Health'));
	this.spriteCompressed = "IwNgHgLAHAPgDAxTktW9HgeV7dgEF75K4oEBMuwV5hRJd9WZiLzjpCh3DbCFQfy7da3NJQatSVMdLY0e8/MxapVPHBr7Fde/QcNGJe5UymY2YrdeWrx5peRUacvMvNyCKw4Yo/q/r4yisEKVBZaHJwK9tLafEA==";
	this.displayName = "Wiz";
	this.color = '#0058f8';
	this.aiType = 'switch';
	this.switchTrigger = 5;
}
Mage.prototype = new Monster();
Mage.prototype.constructor = Mage;

// Items are Displayable's that modify character's stats and determine their actions available

function Item(){
	this.owner = "";
}
Item.prototype = new Displayable();
Item.prototype.constructor = Item;

Item.prototype.checkExhausted = function(){
	return (this.uses <= 0);
};

Item.prototype.exhaust = function(){
	if (this.uses === true){
		return;
	}
	if (this.owner.hand1 === this){
		this.owner.equip1( new Punch() );
	} else if (this.owner.hand2 === this){
		this.owner.equip2( new Punch() );
	}
	var invIndex = this.owner.inventory.indexOf(this);
	this.owner.inventory.splice(invIndex,1);
	this.owner.updateStatus();
	var message = firstCap(this.owner.possesive()) +" "+ this.shortName.toLowerCase() +' is '+ this.breakVerb + " and discarded.";
	currentGame.log.add(message);
};

Item.prototype.target = function(){
	return (this.selfTargeted) ? this.owner : this.owner.getEnemy();
};

Item.prototype.attackObj = function(){
	var attck = {};
	attck.targetCharacter = this.target();
	attck.natural = this.natural;
	attck.calculated = this.attackVal();
	attck.type = this.attackType;
	attck.sprite = this.sprite;
	attck.color = this.color;
	if ((this.constructor.name === 'Punch')&&(this.owner.constructor.name !== "Hero")){
		attck.color = this.owner.color;
	}
	attck.verbs = this.verbs;
	attck.itemType = this.itemType;
	attck.selfTargeted = this.selfTargeted;
	attck.buffArr = this.buffArr;
	attck.killStr = this.killStr;
	if (this.itemType === "Buff"){
		attck.cureChance = this.cureChance;
	}
	if ((this.owner.buffs.includes('Aflame'))&&(this.itemType === 'Weapon')){
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

Item.prototype.invDialog = function(){
	currentGame.foundItem = "";
	if (this.owner.constructor.name !== "Hero"){
		return;
	} 
	var message = this.shortName + ':<br>' + firstCap(this.displayName)+'.<br>';
	message += ('<br>' + this.infoStr())
	if ((this.owner.hand1 === this)||(this.owner.hand2 === this)){
		var hand = (this.owner.hand1 === this)?'right':'left';
		var activateNum = (this.owner.hand1 === this)?'activate1':'activate2';
		var newLine = '<br><br> It is at the ready in your '+hand+' hand.';
		message += newLine;
		currentGame.dialog.addButton('Use this from your '+hand+' hand','runRound '+activateNum,"suggest");
	} else{
		switch (this.itemType){
		case "Consumable":
			currentGame.dialog.addButton('Use without equipping','runRound activateOffhand',"caution");
		case "Weapon":
			var rHandStr = ( this.owner.hand2.constructor.name !== 'Punch')? 'instead of ' + this.owner.hand2.shortName : 'in your left hand.';
			var lHandStr = ( this.owner.hand1.constructor.name !== 'Punch')? 'instead of ' + this.owner.hand1.shortName : 'in your right hand.';
			currentGame.dialog.addButton('Equip '+lHandStr,'runRound equip1Offhand');
			currentGame.dialog.addButton('Equip '+rHandStr,'runRound equip2Offhand');
			break;
		}
	}
	message += '<br><br>Uses left: '+this.uses;
	this.owner.offHand = this;
	var invIndex = this.owner.inventory.indexOf(this)
	currentGame.dialog.setText(message);
	currentGame.dialog.addButton('Drop this '+this.shortName,'dropItem '+invIndex,"warning");
	currentGame.dialog.addButton('Cancel','router closeDialog');
	currentGame.dialog.open();
};

function Buff(type,owner){
	this.selfTargeted = true;
	this.itemType = 'Buff';
	this.cureChance = 3;
	this.natural = 0;
	this.type = 'physical';
 	this.targetStat = 'HP';
 	this.owner = owner;
 	this.buffArr = [];
 	this.killStr = "from inexplicable causes";
 	this.attackVal = function(){ return 0; };
	switch (type){
		case 'Smite':
			this.killStr = "by the hand of the divine";
			break;
		case 'Aflame':
			this.killStr = "in a conflagration";
			this.cureChance = 3;
 			this.attackVal = function(){
 				return roll('1d3')+Math.ceil(roll('1d5')*this.owner.stats.maxHP/100);
 			};
 			this.attackType = 'fire';
 			this.sprite = 'flame';
 			this.color = 'rgba(248,56,0,0.5)';
 			this.verbs = ['burn','roast'];
			break;
		case 'Poisoned':
			this.killStr = "of internal injuries";
			this.cureChance = 4;
			this.attackVal = function(){ return roll('1d3'); };
 			this.attackType = 'poison';
 			this.sprite = 'bubble';
 			this.color = '#d800cc';
 			this.verbs = ['waste','wither'];
 			break;
 		case 'Regenerating':
 			this. cureChance = 5;
 			this.attackVal = function(){
 				var n = Math.ceil(this.owner.stats.maxHP/12);
 				return roll( n+'d3' ) * -1;
 			};
 			this.attackType = 'white';
 			this.sprite = 'poof';
 			this.color = '#f8d878';
 			this.verbs = ['heal','regenerate'];
 			break;
 		case 'Juiced':
 			this.cureChance = 2;
 			this.attackVal = function(){
 				return roll('1d2') * -1;
 			};
 			this.attackType = 'poison';
 			this.targetStat = 'str';
 			this.sprite = 'bubble';
 			this.color = '#f83800';
 			this.verbs = ['gain','rage'];
 			break;
	}
}
Buff.prototype = new Item();
Buff.prototype.constructor = Buff;

function Weapon(){
	this.selfTargeted = false;
	this.natural = 1;
	this.buffArr = [];
	this.uses = true;
	this.flammable = false;
	this.ranged = false;
	this.targetStat = "HP";
	this.attackType = "physical";
	this.itemType = "Weapon";
}
Weapon.prototype = new Item();
Weapon.prototype.constructor = Weapon;

Weapon.prototype.infoStr = function(){
	var str = "Attacks enemy's " +this.targetStat;
	str += " with "+this.attackType+" damage, using your ";
	str += this.userTraits.join(' and ')+".";
	if (this.buffArr.length > 1){
		var odds = (this.buffArr[1] > 1)? " 1 in "+this.buffArr[1]+" chance to cause" : " Causes";
		str += odds + " enemy to be "+this.buffArr[0].toLowerCase()+".";
	}
	return str;
};

function Punch(){
	this.uses = true;
	this.sprite = "poof";
	this.attackType = "physical";
	this.color = 'white';
	this.displayName = "nothing but the essentials";
	this.shortName = "Bare Hands";
	this.verbs = ["punch","smack","hit","wallop","slap"];
	this.attackVal = function(){
		var str = this.owner.stats.str;
		var agi = this.owner.stats.agi;
		return roll( Math.floor((str + agi)/8) + 'd3');
	};

}
Punch.prototype = new Weapon();
Punch.prototype.constructor = Punch;

function Sword (type) {
	this.sprite = "slash1";
	this.attackType = "physical";
	this.verbs = ['slash','strike','stab','lance','wound','cut'];
	var simpleSword = "IwNgHqA+AMt/DFOS18BMw20+7v9g9liDUijtpLsss17pjlgg";
	this.smallSprite = simpleSword;
	this.userTraits = ['STR'];
	switch (type){
		case "Iron":
			this.uses = 30;
			this.breakVerb = "breaks on impact";
			this.displayName = "a modest but functional iron blade";
			this.shortName = "Iron Sword";
			this.color = "#008888";
			this.attackVal = function(){
				var diceNum = Math.round((this.owner.stats.STR / 4)*1.5);
				return roll(diceNum+"d3") - 2;	
			};
			break;
		case 'Fire':
		case "Flame":
			this.uses = 25;
			this.breakVerb = "glows red-hot, shatters,";
			this.displayName = "a shining red sword that smells of sulfur";
			this.shortName = "Flame Sword";
			this.color = "#f87858";
			this.attackType = "fire";
			this.buffArr = ["Aflame",8];
			this.attackVal = function(){
				var diceNum = Math.round((this.owner.stats.STR / 4)*1.5);
				return roll(diceNum+"d3") - 1;	
			};
			break;
		case "Wood":
		default:
			this.flammable = true;
			this.breakVerb = "splinters into bits";
			this.uses = 20;
			this.displayName = "a wooden sword meant for practice";
			this.shortName = "Wooden Sword";
			this.color = "#f8b800";
			this.attackVal = function(){
				var diceNum = Math.round(this.owner.stats.STR / 4);
				return roll(diceNum+"d3");	
			};
			break;
	}
}
Sword.prototype = new Weapon();
Sword.prototype.constructor = Sword;

function Axe (type) {
	this.sprite = 'slash1';
	this.attackType = "physical";
	this.verbs = ['strike','hit','chop','hack','cleave'];
	this.ranged = true;
	var simpleAxe = "IwNgHqA+AMt/DFOS1xWOOjsvbQEx4ErAnRmnnTWa1U4UFA==";
	var axe2 = "";
	switch (type){
		case "Brass":
		default:
			this.smallSprite = simpleAxe;
			this.uses = 10;
			this.breakVerb = "is bent beyond recognition";
			this.displayName = "an axe made of polished brass, prettier than it is functional";
			this.shortName = "Brass Axe";
			this.color = "#f8d878";
			this.userTraits = ['STR'];
			this.attackVal = function(){
				var str = this.owner.stats.str;
				return Math.ceil(str / roll('1d5'));
			};
			break;
	}
}
Axe.prototype = new Weapon();
Axe.prototype.constructor = Axe;

function Bow (type) {
	this.sprite = 'star';
	this.attackType = "physical";
	this.verbs = ['strike','hit','bullseye','arrow','snipe'];
	this.ranged = true;
	var simpleBow = "IwNgHqA+AMt/DFOS11gYyrsBM359lhDUS8y4iDpqC7sHsg==";
	var bow2 = "";
	switch (type){
		case "Poison":
			this.smallSprite = simpleBow;
			this.flammable = true;
			this.uses = 20;
			this.breakVerb = "is bent, arrowless";
			this.displayName = "a oily green bow whose arrows are laced with a toxic venom";
			this.shortName = "Poison Bow";
			this.color = "#005800";
			this.buffArr = ["Poisoned",3];
			this.userTraits = ['AGI'];
			this.attackVal = function(){
				var agi = this.owner.stats.agi;
				return rollHits( (agi) + "d5",5);
			};
			break;
		case "Wood":
		default:
			this.smallSprite = simpleBow;
			this.flammable = true;
			this.uses = 20;
			this.breakVerb = "breaks with a 'sproing'";
			this.displayName = "a simple wooden bow, used by hunters";
			this.shortName = "Wooden Bow";
			this.color = "#f8b800";
			this.userTraits = ['AGI'];
			this.attackVal = function(){
				var agi = this.owner.stats.agi;
				return rollHits( (agi) + "d4",4);
			};
			break;
	}
}
Bow.prototype = new Weapon();
Bow.prototype.constructor = Bow;

function Staff (type) {
	this.sprite = 'kapow';
	this.attackType = "physical";
	this.verbs = ['strike','bludgeon','bash','thwack','smack'];
	var plainStick = "IwNgHqA+AMt/DFOgJmYlx309uu9UtCC9Ttz1LlqlaNiysg==";
	var decoStick = "IwNgHqA+AMt/DFOcgTMF9itZ26M91cjs9YzzCryLbpq9HNmVCg==";
	switch (type){
		case 'Lightning':
		case "Thunder":
			this.ranged = true;
			this.smallSprite = decoStick;
			this.uses = 25;
			this.breakVerb = "splits down the middle";
			this.displayName = "a staff enchanted with electricity";
			this.shortName = "Thunder Staff";
			this.sprite = 'bolt';
			this.attackType = "lightning";
			this.targetStat = "HP";
			this.color = "#b8f8d8";
			this.userTraits = ['INT'];
			this.verbs = ['blast','electrocute','zap','smite'];
			this.attackVal = function(){
				return Math.floor(1.5 * rollHits( this.owner.stats.int + "d3",3));
			};
			break;
		case "Wood":
		default:
			this.smallSprite = plainStick;
			this.flammable = true;
			this.uses = 20;
			this.breakVerb = "snaps like a twig";
			this.displayName = "a solid, wooden staff";
			this.shortName = "Wooden Staff";
			this.color = "#f8b800";
			this.userTraits = ['STR','AGI'];
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
	this.sprite = 'claws';
	this.attackType = "physical";
	this.targetStat = "HP";
	this.verbs = ['maul','savage','lacerate','wound','cut'];
	this.smallSprite = "IwNgHqA+AMt/DFKcATMxaMK/XPgd0VC59tphSLYqb66bGniX7L0g";
	switch (type){
		case 'Poison':
		case "Venom":
			this.uses = 10;
			this.breakVerb = "snaps with a sickening crunch";
			this.displayName = "a pair of fangs with the venom sac still attached";
			this.shortName = "Venom Fang";
			this.color = "#00b800";
			this.userTraits = ['STR','AGI'];
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
			this.uses = 10;
			this.breakVerb = "is worn to stumps";
			this.displayName = "a set of sharp bone claws";
			this.shortName = "Bone Claw";
			this.color = "#f0d0b0";
			this.userTraits = ['STR','AGI'];
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
	this.sprite = 'splat';
	this.attackType = "physical";
	this.verbs = ['splash','douse'];
	this.smallSprite = "IwNgHqA+AMt/DFOQ4wBMLZp8ZvM1F1c9oj5STZrKSMLp7sH7H1Ny0PTECCk/boP6d8HDnCA=";
	switch (type){
		case 'Flame':
		case "Fire":
			this.uses = 15;
			this.breakVerb = ", empty and starting to smell,";
			this.displayName = "a glowing bladder of sorts, hot to the touch";
			this.shortName = "Lava Sac";
			this.attackType = "fire";
			this.targetStat = "HP";
			this.color = 'rgba(248,56,0,0.5)';
			this.verbs.push('ignite','torch');
			this.buffArr = ["Aflame",3];
			this.attackVal = function(){
				return roll('1d3');
			};
			break;
		case "Acid":
		default:
			this.uses = 30;
			this.breakVerb = "melts into a puddle of goo";
			this.displayName = "a slimy, acidic appendage";
			this.shortName = "Acid Whip";
			this.attackType = "acid";
			this.targetStat = "maxHP";
			this.color = 'rgba(88,216,84,0.5)';
			this.verbs.push('slime','spatter');
			this.attackVal = function(){
				return roll('1d2');
			};
			break;
	}
}
Hose.prototype = new Weapon();
Hose.prototype.constructor = Hose;

function Consumable(){
	this.selfTargeted = true;
	this.natural = 0;
	this.buffArr = [];
	this.uses = 1;
	this.hurts = false;
	this.targetStat = "HP";
	this.amountDmg = "a random amount of"
	this.attackVal = function(){return 0;};
	this.itemType = "Consumable";
}
Consumable.prototype = new Item();
Consumable.prototype.constructor = Consumable;

Consumable.prototype.infoStr = function(){
	var verb = (this.hurts)? 'Damages' : 'Heals';
	var str = verb + " you for "+this.amountDmg+ ' ' +this.targetStat.toUpperCase()+'.';
	if (this.buffArr.length > 1){
		var odds = (this.buffArr[1] > 1)? " 1 in "+this.buffArr[1]+" chance to cause" : " Causes";
		str += odds + " you to be "+this.buffArr[0].toLowerCase()+".";
	}
	return str;
};

function Potion(type){
	this.uses = 1;
	this.sprite = "poof";
	this.breakVerb = "is empty";
	this.shortName = "Potion of ";
	var roundBottleSprite = "IwNgHqA+AMt/DFOS5x0ddYAmbXs9gDd9VTZi094qFcdGmc65cMMXF2P2kHmrer2hA===";
	this.smallSprite = roundBottleSprite;
	switch (type){
		case "Regen":
			this.attackType = 'physical';
			this.color = '#f8d878';
			this.amountDmg = '1-6';
			this.shortName += "Regen";
			this.displayName = "a fizzy yellowish potion that smells like chalk";
			this.buffArr = ['Regenerating',1];
			this.verbs = ['regenerate'];
			this.attackVal = function(){
				return (-1 * roll('1d6'));
			};
			break;
		default:
		case "Health":
			this.attackType = 'physical';
			this.color = '#58f898';
			this.amountDmg = 'your entire';
			this.shortName += "Health";
			this.displayName = "a brilliant green potion, slightly warm to the touch";
			this.verbs = ['heal'];
			this.attackVal = function(){
				return this.owner.stats.maxHP * -1;
			};
			break;
	}

}
Potion.prototype = new Consumable();
Potion.prototype.constructor = Potion;

function Vial(type){
	this.uses = 1;
	this.sprite = "poof";
	this.breakVerb = "is used-up";
	this.shortName = "Vial of";
	this.smallSprite = "IwNgHqA+AMt/DHQEyuU+wvY3Yt9cDijpDCjzSz0LdhU6MHkmkW3EPrvTe+KQA===";
	switch (type){
		default:
		case "Steroids":
			this.hurts = true;
			this.displayName = 'a small ampule of dangerous performance-enhancing drugs';
			this.attackType = 'poison';
			this.targetStat = 'cha';
			this.amountDmg = '1-5';
			this.color = '#f83800';
			this.shortName += " Steroids";
			this.buffArr = ["Juiced",1];
			this.verbs = ['inject'];
			this.attackVal = function(val){
				return roll('1d5');
			};
			break;
	}
}

Vial.prototype = new Consumable();
Vial.prototype.constructor = Vial;

function Food(type){
	this.uses = 1;
	this.sprite = "poof";
	this.breakVerb = "is consumed";
	this.verbs = ['eat','smash','chow down','consume'];
	var meatSprite = "IwNgHqA+AMt/DFOY4aWzVgTCrO9htsjdki1jDKrzTbyG8yNojW32Ppsg";
	switch (type){
		case "Rotten":
			this.smallSprite = meatSprite;
			this.displayName = 'a hunk of raw, slightly decomposed meat';
			this.attackType = 'physical';
			this.targetStat = 'HP';
			this.color = '#b8f8b8';
			this.amountDmg = '12-20';
			this.shortName = "Questionable Meat";
			this.buffArr = ["Poisoned",3];
			this.attackVal = function(val){
				return (10 + roll('2d5')) * -1;
			};
			break;
		case "Meat":
		default:
			this.smallSprite = meatSprite;
			this.displayName = 'a savory grilled drumstick of some unknown animal';
			this.attackType = 'physical';
			this.targetStat = 'HP';
			this.color = '#e45c10';
			this.amountDmg = 20;
			this.shortName = "Tasty Meat";
			this.attackVal = function(val){
				return -20;
			};
			break;
	}
}

Food.prototype = new Consumable();
Food.prototype.constructor = Food;

// an Effect is a Displayable that visually displays the type of damage to the player

function Effect(){
	this.sprites = {
		kapow: "GwFgHgTCA+AM8MU5LVvRzXs93/BhRxJBAjKZahRjVSnQ4hOi/WmTZ/N+5ZwMGM+yLl2oQyESZJG0hHKdMnC5STtN6ilylWoY696jbpXisqnCa3HTR/ccGLdNhzx7nRMmZbcWhTn54vCG+QdTojGyo0eGRmGFxHAhAA==",
		slash1: "GwFgHgTCA+AM8MU5LVvRzXs93/BhRxJpZaAjOdZTXUlfU40zRS5h65e9l9ynb9BwkXSF9RyXtQlYpAhDM6KMC1bnUa+20oyA",
		blast: "GwFgHgTCA+AM8MU5LVvRzXs93/BhRxJeAjGfBaTUpRQ4/bTU25S2h41Yk3zxLV07DggaoJRNl2FSq8uovLcxStfOXrCwhSl3iNa5AZUD9x2AdNLicywqNitAh9hmT7Tt4OlvDHgGe/iyqcq7Wvpw6oi7ROPSxVvGk9rBAA==",
		claws: "GwFgHgTCA+AM8MU5LVvRzXs93/BGExhpeAjORGTdpdQsQ7S/FQva12x+4yd0LkOzToLLDYlNn3GlJ0qcznypCyStrTFmmto1pqDZbo4yisY6bQ6bUntZQHUwhY9Vv3BVw9RH4DEA",
		poof: "GwFgHgTCA+AM8MU5LVvRzXs93/mAjASasaRYuUWdtafVTZbI0mwvR5y/Nz8n69B7YWNF9xU6TNlzWHQuSVEVWIfM1bN1DdvSM9+gxkXGmaflxPnWtU7aOSR6809stqQA",
		splat: "GwFgHgTCA+AM8MU5LVvRzXs93/BhRxhAjCduRdWuaVTQw/M/vfTS8h8ex62Tqx2JPjwpi+EkV1GSEAwbMHzqkxZRbq523qo1Z1MlVOn7ewqgc26LnREbvLhoy1ev3cQ7vCA=",
		bolt: "GwFgHgTCA+AM8MU58CMKOZervM70MQKKJNL3Iqyuo1rqXQcYVRcZw87Vd2+oC+vYU1GVxbSf0lDRcmdPrtxC1gTXYlW6c01klJFYZPJ99WOYtNjwrtrGW7UhyLeDH2qzrTfrr93kAl1MAv2wgA==",
		flame: "GwFgHgTCA+AM8MU5LVvRzXs93/BaAjIZiaauRZdckVbUvYwsy0w7W7Jyr06358y9ckMTdhPUVkl8Zc+emajxEtatU14i9ZqFVdO+hH1Kt81ad0qZl6xY5m6mh5c0uTzvaLdPfjsZWdoJEEOFecvoODAFhEVGugSbhqX5B1qkh0vFp1nqZCbG5eZIpefmCFQnq1ZWsdbwlaU2NdG0c1a0Vis01TF385fWdWQYlRsNGQWozItOh5EA",
		bubble: "GwFgHgTCA+AM8MU5FlvRtrM9tvuh6++RZ5FyAjFbiZTeo/PdbYfs4V0jwZZj5sB3ERiE52Y6tNmwpcpouUrVvZeyA===",
		rain: "GwFgHgTCA+EAwMU5LkEYn1dncOfVzixXwRITOwqStSpuOzsMUccqIZQ6LwOS8+3QZz6IRAllRal6rMblmzaw3BxWqcvTRPXyu+gwvHGtp8gpJ1dTc9ZPVtOW0KG27qd3p7PmPj3EyDEC1MVDRfwiBM0cvCx8jBP4iIRc+NPTHTNiUtiS4ugcYwsi8/NzNIv84xIqgrPqw3KxpZKk5BOVO027apQLfGqc/YfjRnvGnIA=",
		shield: "GwFgHgTCA+AM8MU5LVvRzXs93/BhRxJpZ8AjBWlbXbaneQlTROx59ShRK87H48+9Kn0YiBg7sNFiZSXkPLLFI0eNkKyqxErmbk+qbpbr6htaeLXB5upb2SBtuxu1PXBV/ocezXvhevkoYgUH+VqFhkTaxTo6M8YTh0thCQA=",
		cloud: "GwFgHgTCA+AM8MU5LVvRzXs93hAjAfpkSUkcbJVedWfQ+TVU8zfGxVxRB6T0QE+lAfyQQRLdC1qJJsuZ2KKI3KTTVCVsrYWGrtBliP3HNTShqKnl5q5ZuLRja9NfOGDz/M9s37vAB4rDBLtRhwoSReva60X6xfo7JZn5pPvQKTprK2XFaNlLWhcLFJnYaktWl9jWSlZr1jVbNeVXVtEVNCvr5Zb3tPXxmNYGunSGt/XLT1twDgSYzC5Phy/Or2cgbghO2RkUHyA0YRdinMmV0Z0o3+vc74Y+Md/d7N0xAA==",
		star: "GwFgHgTCA+AM8MU5LVvRzXs93/BhRxJpREZlWFaNVpAjKk/ZS4u62Q+58nV2w9hmFgNTi2I0XzQ9Ww2SnlYVVRUsQ1NKSUV47+g9LMPHVzc4T0IbV4hSA===",
		chaos: "GwFgHgTCA+AM8MU5LVvRzXs93/BhRxqAjOeSVeuRHXZdU/KQxaxKWe85hx/X7IBDXjU5t+nJP1rS0FEqykNVXFqs3rhg4sokH92/YfkytRIxKvHrd7YhuW7p5QhNSH7i4Q+C13gaGZLp6hnJujpKiCoxhQT5R9GZiKLIUMcI8qTQinF45ltlAA==",
		cresent: "GwFgHgTCA+AM8MU5LVvRzXs93/BhRxJpZ5FmAjDVehJQbc3cg43s4jcqxzjzZJ2/bLVR9Yk0RkEoRUkgqbTEC1fmWcNKOYR0DDxA2JPcdW+CL37LuvVTtXx5R6ZoMgA="
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

function loadButtons(targetElement){
	var buttons = targetElement.querySelectorAll(".button");
	for (var i=0; i < buttons.length; i+=1){
		buttons[i].addEventListener("click",(function(temp){
			return function(){
				var clickData = temp.getAttribute('click-data');
				currentGame[firstWord(clickData)](secondWord(clickData));
			};
		})(buttons[i]));
	}
}

loadButtons(document);

currentGame.initialize();
