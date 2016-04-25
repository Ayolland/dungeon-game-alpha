
// Helper functions


// Returns a random element from an array
function randomEntry(array){
	return array[Math.floor(Math.random()*array.length)];
}

// Allows Monsters/Items to be created randomly by randomly assigning a valid type
function plinko(type,validTypes){
	if ((typeof(type) !== "undefined")&&(type !== "")){
		return type;
	}
	var newType = (validTypes !== [])? randomEntry(validTypes) : "";
	return newType;
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
		case 'do':
			verb += 'es';
			break;
		case "are":
			verb = "is";
			break;
		default:
			if (verb.indexOf(' ') !== -1){
				verb = firstWord(verb)+'s '+secondWord(verb);
			} else {
				verb += 's';
			}
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
		inputDiv: document.getElementById('dialog-inputDiv'),
		canvas: document.getElementById('dialog-spriteCanvas'),
		open: function(){
			currentGame.interface.pause();
			loadButtons(this.element);
			this.element.classList.add('active');
		},
		addImage: function(displayable,width,height,scale){
			var canvasContext = this.canvas.getContext('2d');
			this.canvas.setAttribute('width',width);
			this.canvas.setAttribute('height',height);
			this.canvas.style.width = (width * scale)+'px';
			this.canvas.style.height = (height * scale)+'px';
			this.canvas.style.margin = '1em auto';
			displayable.draw(canvasContext,displayable.spriteCompressed);
		},
		addInput: function(value){
			var inputStr = '<input id="dialog-input" type="text" value="' + value + '">';
			this.inputDiv.innerHTML = inputStr;
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
			thisDialog.message.innerHTML = "";
			thisDialog.buttons.innerHTML = "";
			thisDialog.inputDiv.innerHTML = "";
			this.canvas.setAttribute('width',0);
			this.canvas.setAttribute('height',0);
			this.canvas.style.width = 0+'px';
			this.canvas.style.height = 0+'px';
			this.canvas.style.margin = 0;
			setTimeout(function(){
				currentGame.interface.unpause();
				},500);
		}
	};
	this.router = function(command){
		var playerInput = "";
		var inputElement = document.querySelector('#dialog-input');
		if (inputElement !== null){
			playerInput = inputElement.value;
		}
		this.dialog.close();
		switch (command){
			case 'startOver':
				currentGame.chooseClass();
				break;
			case 'chooseWarrior':
			case 'chooseRogue':
			case 'chooseSorcerer':
				var chosenClass = command.replace('choose','');
				currentGame.initialize(playerInput,chosenClass);
				break;
			case 'nextMonster':
				currentGame.currentMonster.addClass('dead');
				currentGame.log.add('You continue on your journey...');
				setTimeout(function(){
					currentGame.switchMonster();
				},1000);
				break;
			case 'unEquipleft':
				this.playerHero.equip2( new Punch() );
				break;
			case 'unEquipright':
				this.playerHero.equip1( new Punch() );
				break;
			case 'takeFoundItem':
				this.playerHero.addToInv(this.foundItem);
				break;
			case 'takeLootedItem':
				this.playerHero.addToInv(this.foundItem);
			case 'newMonster':
				this.switchMonster();
			case 'closeDialog':
			default:
				currentGame.playerHero.offHand = "";
				break;
		}
	};

	this.talkRouter = function(convo_id){
		this.dialog.close();
		currentGame.currentMonster.talk(convo_id);
	};

	this.currentLocation = new Location();
	this.playerHero = new Hero('TEMP');
	this.currentMonster = new Monster();
	this.previousMonsterName = "";

	this.chooseClass = function(zilch){
		var message = "Welcome to Crystals of Zoxx. <br> Enter your name and choose a class below. <br><br> Adventurer name:";
		currentGame.dialog.setText(message);
		currentGame.dialog.addButton('Warrior','router chooseWarrior','suggest');
		currentGame.dialog.addButton('Rogue','router chooseRogue','suggest');
		currentGame.dialog.addButton('Sorcerer','router chooseSorcerer','suggest');
		currentGame.dialog.addInput('Sandra');
		var logo = new Illustration('#d800cc',"GwVgHiDsA+AM8MQgjM2r5rerH2cT0MyKTPPwK32wJsoeOopbNutV22/pNqpz9WFdv3Z1OjKR2GyS9PER5cc5HnI2at2nVoBMBwwkNHdZ1iYPHL522st7MDuy6c30zsw+/vYz1P7IPqZ+vtbB3uFGAe5BhnEmUVZICRHx8D44gcHYDkKCnIWpBrmRMYkeesVVGZb5RUV5aBFZNuUmGE1sDZxdLe3JA1XNdSI9fWmtidWddfkWc6H91bUdIx36i03ZadUl8ywTazsRezWaR/G9bWclPqSyl/tDU95nBxRPwyQndfcf5C+ihWQzub02ayWV0IIJmQwewiBYlhTRmEOhUJKbE8mUyF0WlQqiDyqxseLkXTcRKSNXuLQpBNeyVJ+0x8XpiMZTMcNNBVTSPIWkJhOK2bwFnOFIvc23FAsFgK5KFu0NRsupSEp3QF8N1L0VUu1OXWVzRhJCxKVKRVurZcW5ZC1Y3+dpNYKpFtdsj5try0xWvIByqRdoqAa9cl1QN+ySdwh6bu+ftizjj8fGYrWPQKknlefzfzKDQLJbzKpzKtLVfLCdrdfrCdRtbUDdbjTmcLrLbbbbVHa73R7rb7WYHrkOmYx468k6x05nkLT840CYrQeXLGza43ui3DR3u6KCCAA=");
		currentGame.dialog.addImage(logo,65,57,2);
		currentGame.dialog.open();
	};

	this.initialize = function(playerName,playerClass){
		currentGame.playerHero = new Hero(playerName,playerClass);
		currentGame.currentMonster = new Monster();
		currentGame.previousMonsterName = "";
		this.switchLocation();
		this.playerHero.initialize(playerClass);
		document.getElementById('headsdown').addEventListener('click',(function(hero){
			return function(){
				hero.infoDialog();
			};
		})(currentGame.playerHero));
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
		if ((newMonster.aiType === 'inanimate')||(newMonster.aiType === 'mimic')){
			newMonster.div.classList.add('inanimate');
		}
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
		if (currentGame.currentLocation.switchTrigger <= 0){
			currentGame.crossroadDialog();
		} else {
			var monsterType = randomEntry(currentGame.currentLocation.monsterArray);
			currentGame.enterMonster(monsterType);
		}
	};

	this.validLocations = ["Dungeon", "Volcano", "Forest", "Graveyard", "Mine"];

	this.crossroadDialog = function(){
		var oldLocationName = currentGame.currentLocation.shortName;
		var location1 = new Location(currentGame.differentLocation([oldLocationName]));
		var location2 = new Location(currentGame.differentLocation([oldLocationName,location1.shortName]));
		var message = "You come to a crossroads.<br><br>";
		message += "One path leads to "+ location1.displayName +".<br><br>";
		message += "The other path heads towards "+ location2.displayName +'.<br><br>';
		message += "What path do you choose?";
		currentGame.dialog.addButton('Head for the '+location1.shortName,'switchLocation '+location1.shortName);
		currentGame.dialog.addButton('Take the path to the '+location2.shortName,'switchLocation '+location2.shortName);
		currentGame.dialog.setText(message);
		currentGame.dialog.open();
		currentGame.currentMonster.addClass('dead');
	};

	this.differentLocation = function(locationArr){
		var validLocations = currentGame.validLocations.slice(0);
		if (locationArr.length > 0){
			for (var a = locationArr.length - 1; a >= 0; a--) {
				validLocations.splice(validLocations.indexOf(locationArr[a]),1);
			}
		}
		return randomEntry(validLocations);
	};

	this.switchLocation = function(locationName){
		currentGame.dialog.close();
		currentGame.interface.pause();
		locationName = (typeof(locationName) === "undefined") ? randomEntry(currentGame.validLocations) : locationName;
		currentGame.currentLocation = new Location(locationName);
		document.body.className = currentGame.currentLocation.shortName;
		document.getElementById('level-text').innerHTML = "LVL: " + currentGame.currentLocation.shortName;
		currentGame.currentLocation.switchTrigger = 5 + roll('1d3');
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
		var item = this.playerHero.inventory[number];
		item.destroy();
		if (this.foundItem.sprite){
			this.playerHero.addToInv(this.foundItem);
		}
	};
}

// A Displayable is an object with an associated canvas for drawing sprites
function Displayable (){
	this.validTypes = [];
}

Displayable.prototype.constructor = Displayable;

Displayable.prototype.draw = function(canvas,sprite){
	var rawStr = LZString.decompressFromBase64(sprite);
    var trinary = (rawStr.slice( rawStr.indexOf('|') + 1));
    var spriteWidth = rawStr.slice( 0, rawStr.indexOf('x'));
    var spriteHeight = rawStr.slice( rawStr.indexOf('x') + 1 , rawStr.indexOf('|') );
    if (canvas.canvas.id !== 'hero-sprite'){
    	canvas.clearRect(0,0,spriteWidth,spriteHeight);
    }
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

// An Illustration is a free-floating Displayable with no game logic attached

function Illustration (color,sprite){
	this.color = color;
	this.spriteCompressed = sprite;
}

Illustration.prototype = new Displayable ();
Illustration.prototype.constructor = Illustration;

// A Location is an object that stores the background image and the possible monsters

function Location(type){
	this.canvas = document.getElementById('level-sprite').getContext('2d');
	this.shortName = type;
	switch (type){
		case "Dungeon":
			this.spriteCompressed = "BwBgHgLCA+CM8MU5LVvRzCQi3/qORxJ2JuuBV1Z5xNDjTzLjOsFlhKnXrzFDojod2ddvwFCu40fXKSpg+LPFEhittLIqkvBX00FBM9WpESdGo8hO195+rvXabw13Idq5K0hsNGdtJi3q6UYs7WbtoBUU7y4WbhUW5BngmO6aKR0ZGmBo6JITm5aYXmWRJpNmUWfnEu7rGaQXwy6UkVHrkeGRWFJT3Knh11Xe09ur4hmaQKMZPDffPWhm3dgRtT0zPL2QvRteVjEXbN/K3Hqgl5pWFXJ5y3h/fl7u9xW4rV9iM+c8UDqlep0vLsvM9gUtvJ1Kn4fjVVjCTA4dtgvpIjqjGjxuMNEfjcW0ClVkoSWiCSflQU8gQSGgD2stlKdzgIUfYkilbJZJsZ5Gwut9ZPzkZlWG8dgogA==";
			this.displayName = "a musty, dark and ancient dungeon, full of cobwebs and lurking monsters";
			this.monsterArray = ["Chest","Axedude", "Ball Goo", "Skele Bones", "Skele Footman", "Mage","Jelly"];
			break;
		case "Volcano":
			this.spriteCompressed = "BwBgHgLCA+CM8MUpJWpWz6308/sWBxJuRiIhWO6ZupF5peGTC1eLhD+Ht7fSgLZV6VfjlE9kg2XK5Txk7rSHTW8zW1XVGQ/uuFatRpQtOGZus8bJrlBvWssantxwedXHLuhs1iAhTM5r5eRnKBQezM0b7cBCYJesHEXuHx3pG8lM4ZUX6ZidmJij4FcUX+1qWeaWn5mSXeKLHFjS5MHQrlMSGhhgM5fCQdbiIMyqM9vcnSM+qzbhj1nRljlrPdYflLi43bO6NFU627J8fxuZfhGyGXm3uKMU8POYP2kzIVg22TdV8+j8eKdvl9JHcIalNkDhg9VPNxND5ulpuU8qD2n5XnZeKtPOlMVkOPtdgdscM9kQSf1Kb0JHMIh5BDYMSy7CMwT9jJyeXztMjWazqcyAvyWKiObj5P8ablOMSaRyFsKBhMmrJVWzleqqnT3Di9SdsJq7kbzfR5aggA==";
			this.displayName = "a fiery volcano flowing with glowing magma, and wandered by hellish sprites";
			this.monsterArray = ["Chest","Axedude","Ball Fire","Skele Bruiser","Skele Flaming","Were Hellbeast"];
			break;
		case "Forest":
			this.spriteCompressed = "IwNgDAHgLGA+ZmE5TEOOhiUrVj+ORWJhq2OpFlBtZxBm9R5V6y7lpLrjtPeJpx6M2IjlRH5p1GiVHjWYxcpZC8U3vPFtuapc1yCNArYa67huA+bq3rgvjstXiqrgpUY+9m5Of+DKKyDMK+we7WEa6oBl5hMUYuptEhsZFy2okSyQF6oYH6etl++QIZSdpqxkwqLmkUMiUV5BH8UvX6Zmnejfbq7D053FUcEp6hceVt3nnyo7GtC4sDPauKw01W1NjLs7tlRjMbYoc7SkGW5TUlmwNyFiEHNdfRG29ns8MdLXaH11tXLJ/nd+jchpV1jRIUVdK97nV5iCdntwYkZMETiNkTCCr9MMc5lMojZYfi0ISfoNliiaaCOulCgC/g07kE3tNekzqrUnNCOWM/Az6Yj2oY+kyJXtWiKAnygaDgbK3Iqsd0npDtsqPKU1al2QKxjdhYbNJjxftuRTueMhSdShrnnTjZzTYirZrHZSjnb3qkNdqViClm7LlcHqGndkCb9BbkHL6ovMflzpW5w2GcQohtJvQCWlGYk6vpMXViM9CKsWc708zy4V0q3E1rWbemK0mbVGSwmy3MC6TG8mk/w248Gyq292lVzB+6Jx4xy8Z1k0+Ou4y08vK4Rg+2m6nwhNBZ58hCfHvLUe6RdMYsU2Or+fbz6CXf3qsGhTj1SVXRiWqVbfmu3w6k4Z51ISfRPh+4oSsS55Qveb5rtBf7gfQiF1sOvhoWBu6YfEwY4ay6EkqeYSwQsuwUV0YHkau5zlswNGrnRjRmhR8HuuyxgniSHEpFxOTMbxEwBuB/HnJwwG3DKKR7txgn3rO6S8HqCkgVoXipoG1Q6ABD46Y4iYmkO17UZc6mbPanGPu+KkrNZhl0exl7tPyRQebafoGoezhCV5RbPgZDi2OFpEoq8vkMtG6KRT66YxbFIVJX5BxEj4PZBclfLkZamW5s+1rJVmnawfxxm5WVcYhTJvk0Q1M6eTKb65QFpXNflo7fu1Zl9aFA0DalfUjUNrnjZNU3TTNs0sEAA=";
			this.displayName = "a murky forest dappled with leafy shadows and populated with wild, untamed creatures";
			this.monsterArray =["Chest","Axedude","Scamp","Were Wolf","Skele Archer","Skele Monk","Snek"];
			break;
		case "Graveyard":
			this.spriteCompressed = "IwNgDAHgLGA+wMU5LVjKzn3HXrCGBxJuRp2GeOB5F9ZDKV+1Ny7TFdXZbO+Zp2I9+fYb1zjWYsSVFtpkjtIGzF86lObblSGQfUy0/HoQnKWppaYkG9XQatVWt+tWYcj2RrbZdevMK+hqEWgd4citb+4Qxu8bYhSQmWTvQxKX7WEXJRSYzuyXmBGvku6eZZHhGESkUeqfnZ0Z6W9YitZUJdbm1BjbKahbTOub3impUmOV6Z3SZRtK5xTPNNQktYg6He6yuC0Z0+flVhVss2sQmzTjnZAd3Fjzd1x+lE5PuDDTsHK503mc6J93r1zi9wT9lv06t9/pCWkjYXwRBVrtV/hiUdwEZi/tj/HN8fDCSlAT0LJ8oVjSaSgb80MDyfDERC7Colqzuc9Mjp9Jt5pMWedDOi3tTQdp2QVkRMRQIJXClc4yXjeUNKhcqBKNTS2X8pFrUTrpcVdrK5YdWCMGgzGPrLaKATtbUaNszrY69X0Pe6bUUDervRoFoCjoG1UHo4rdBTTu5/VaYxrpfyE8ck1a1bF3YUWCoI4Lac7zTqaKDgv644mCeiy8ZOLGBUX7QSc+sHSD7Vma03JSHkWbbWo9KPwz6LeYRwW0iPPWKWV3l1LtrOuavF07XCvTc3KNN8yNk/th+WHbUCwPDafqUa8ziMheg4qvc/12s/dPXyETdaV6ijiHrWV6/uWhwAT2tQwkO4EVpBNbQdsiL5gGqwDI+OidhWaGYRk6EHsYJpYXhSGXI2AYtqRZGUH+gE0biQF0cBDGLJ+gGmqxXE1PeXHcdq1HtNwiR0XxUHYAMYlSVs0myXJ/JrPJjhBEpqlqepGmaVp2k6bpen6QZgRAA===";
			this.displayName = "a lonesome, rainswept graveyard, lit only by lightning and haunted by wicked undead spirits";
			this.monsterArray = ["Chest","Were","Skele","Skele","Mage"];
			break;
		case "Mine":
			this.spriteCompressed = "IwNgDAHgLGA+wMU5LVvRzXs93/BhRxJpZ5FlV1Ntd9DjTzLrb7HnX3PvfwYJIITCyo0QP4lx7MIPlUFc2YgljJ9GSgWUdyLXT3k1Q46bTLVeCZdQ2zF3RhOlLc2wJf4P74R4eOrl5CwdbKvr6q/rjuURHy0YSJ+qFJsYbx6YqZycZZtDkp3rY5kbqlJbkWaoVBKbFlGmmeES1ZVdrirZmexF3hjSKpdiED7X0JFW7DnUNTCX1xY/ZJSw3pM9U9kw1EO+FtrXtz+yWLhz0ix/PxezeRm9prl49PJ7VNYRcVn9bfpb0CP0AVdVu9LqC/v9Cq9TPc3EDRiDfjgajtARQHuszt4lm18eV8f5Yb98vlzkd3lZcVS1pDpD5iXkQjRBoMUc56jZycyok59PShmlgSc+c1RQSWuLzCYSccGXE5mK7oqpULpFJqDVBXKBTK9ZrDUbjSbTWbzRbLVbrTbbXb7Q7HU7nS7XW73R7PV7vT7fX7/QggA=";
			this.displayName = 'an abandoned mineshaft leading deep into the earth, now the lair of many sinister beasts';
			this.monsterArray = ["Chest","Skele Footman","Were Goat","Jelly","Snek"];
			break;
	}
}

Location.prototype = new Displayable ();
Location.prototype.constructor = Location;

// A Character is either a Monster (NPC) or the Hero

function Character (){
	this.buffs = {};
	this.resists = {};
	this.immunities = [];
	this.naturalResists = {};
	this.naturalImmunities = [];
	this.inventory = [];
	this.armor = new Nude();
	this.accessory = new Nothing();
	this.hand1 = new Punch();
	this.hand2 = new Punch();

}

Character.prototype = new Displayable ();
Character.prototype.constructor = Character;

Character.prototype.updateStatus = function(){
	if (this.stats.HP < 1){
		this.stats.HP = 0;
	} else if (this.stats.HP > this.stats.maxHP){
		this.stats.HP = this.stats.maxHP;
	}
	if (this.constructor.name === "Hero"){
		this.drawInventory();
		this.shortName = this.name + ' the ' + this.playerClass;
	}
	this.displayElement.name.innerHTML = this.shortName;
	this.displayElement.hpText.innerHTML = this.stats.HP + "/" + this.stats.maxHP;
	if (this.constructor.name !== 'Hero'){
		var hostilityNum = (this.stats.hostility === true )? 0 : Math.round((100 - this.stats.hostility)/10)*10;
		var orb = document.getElementById('monster-hostility-orb');
		orb.className = 'hp-bar hp-'+hostilityNum;
	}
	var percentage = Math.floor((this.stats.HP / this.stats.maxHP)*100);
	this.displayElement.hpBar.style.width = percentage + "%";
	this.displayElement.hpBar.className = "hp-bar hp-" + (Math.round(percentage / 10)*10);
	if (this.stats.HP === 0){
		this.die();
	}
};

Character.prototype.addClass = function(classStr){
	this.div.classList.add(classStr);
};

Character.prototype.removeClass = function(classStr){
	this.div.classList.remove(classStr);
};

Character.prototype.wiggle = function(tempClass, time){
	this.div.classList.add(tempClass);
	var thisCharacter = this;
	setTimeout(function(){thisCharacter.div.classList.remove(tempClass);}, time);
};

Character.prototype.switchWeapon = function(item,hand){
	if ((item.itemType !== "Weapon")&&(item.itemType !== "Consumable")){
		return;
	}
	if (typeof(item) === "undefined"){
		item = new Punch();
	}
	this.remove(this['hand'+hand]);
	this.wear(item);
	this['hand'+hand] = item;
	if (this.constructor.name === "Hero"){
		currentGame.playerHero.paint();
		document.getElementById('equip'+hand).innerHTML = shorten(item.shortName,17);
	}
};

Character.prototype.equip1 = function(item){
	this.switchWeapon(item,1);
};

Character.prototype.equip2 = function(item){
	this.switchWeapon(item,2);
};

Character.prototype.wear = function(item){
	var equippedArr = [this.armor,this.accessory,this.hand1,this.hand2];
	if ((equippedArr.includes(item))||(typeof(item.itemType) === 'undefined')){
		return;
	}
	item.owner = this;
	if (item.itemType === "Armor"){
		this.armor = item;
	} else if (item.itemType === "Accessory"){
		this.accessory = item;
	}
	if (item.buffs.length > 0){
		item.modifyUses(-1);
		for (var o = item.buffs.length - 1; o >= 0; o--) {
			this.addBuff(item.buffs[o]);
		}
	}
	if (item.immunities !== []){
		for (var p = item.immunities.length - 1; p >= 0; p--) {
			if (!(this.immunities.includes(item.immunities[p]))){
				this.immunities.push(item.immunities[p]);
			}
		}
	}
	for (var key in item.stats) {
	  this.stats[key] += item.stats[key];
	}
	this.calcResists();
	this.updateStatus();
};

Character.prototype.remove = function(item){
	var equippedArr = [this.armor,this.accessory,this.hand1,this.hand2];
	if (!(equippedArr.includes(item))||(typeof(item.itemType) === 'undefined')){
		return;
	}
	if (this.armor === item){
		this.armor = {};
	} else if (this.accessory === item){
		this.accessory = {};
	}
	for (var key in item.stats) {
	  this.stats[key] -= item.stats[key];
	}
	if (item.immunities !== []){
		for (var p = item.immunities.length - 1; p >= 0; p--) {
			if (!(this.naturalImmunities.includes(item.immunities[p]))){
				var index = this.immunities.indexOf(item.immunities[p]);
				this.immunities.splice(index,1);
			}
		}
	}
	this.calcResists();
	this.updateStatus();
};

Character.prototype.calcResists = function(){
	this.resists = {};
	var itemArr = [this.armor];
	var resistsArr = [this.naturalResists];
	for (var t = itemArr.length - 1; t >= 0; t--) {
		if(itemArr[t].resists !== {}){
			resistsArr.push(itemArr[t].resists);
		}
	}
	for (var y = resistsArr.length - 1; y >= 0; y--) {
		for (var key in resistsArr[y]) {
		  if (this.resists.hasOwnProperty(key)) {
		    this.resists[key] = (this.resists[key] < resistsArr[y][key])? this.resists[key] : resistsArr[y][key];
		  } else {
		  	this.resists[key] = resistsArr[y][key];
		  }
		}
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
	var items = this.allEquipment();
	for (var i = items.length - 1; i >= 0; i--) {
		if (typeof( items[i] ) !== "undefined" ){
			if (items[i].flammable === true){
				items[i].modifyUses( roll('2d3')*-1 );
				items[i].uses = (items[i].uses > 0) ? items[i].uses : 1;
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

Character.prototype.explode = function(num,type){
	var resist = (typeof(this.resists[type]) !== 'undefined')? this.resists[type] : 1;
	var def = this.defense();
	var afterDef = (num - def) < 0 ? 0 : (num - def);
	this.stats.HP -= Math.ceil(afterDef*resist);
	this.lastHitBy = new Buff('Explode',this).attackObj();
	this.updateStatus();
};

Character.prototype.calcDodge = function(fleeing){
	if ((Object.keys(this.buffs).includes('Sedated'))||(Object.keys(this.buffs).includes('Paralyzed'))||(['inanimate','mimic'].includes(this.aiType))){
		return false;
	}
	var enemyRoll = roll('1d'+this.getEnemy().stats.agi*1.25);
	var bonus = 0;
	bonus += (this.hand1.ranged)? 1 : 0;
	bonus += (this.hand2.ranged)? 1 : 0;
	bonus += (Object.keys(this.buffs).includes('Obscured'))? 5 : 0;
	bonus += (fleeing === true)? 2 : 0;
	bonus -= ((this.offHand !== "")&&(typeof(this.offHand) !== "undefined"))? 2:0;
	var dodgeRoll = roll('1d'+Math.ceil(this.stats.agi/3)) + bonus;
	var result = (dodgeRoll >= enemyRoll)? true : false;
	return result;
};

Character.prototype.calcBlock = function(){
	if ((Object.keys(this.buffs).includes('Sedated'))||(Object.keys(this.buffs).includes('Paralyzed'))||(this.aiType === 'inanimate')){
		return false;
	}
	var enemyRoll = roll('1d30');
	var result = ( this.stats.block >= enemyRoll)? true : false;
	if (result){
		var equipArr = this.allEquipment();
		var blockingArr = [];
		for (var i = equipArr.length - 1; i >= 0; i--) {
			if(equipArr[i].stats.block > 0){
				blockingArr.push(equipArr[i]);
			}
		}
		randomEntry(blockingArr).modifyUses( roll('1d3')* -1 );
	}
	return result;
};

Character.prototype.allEquipment = function(){
	return [this.hand1,this.hand2,this.armor,this.accessory];
};

Character.prototype.dodge = function(){
	this.wiggle('dodge', 500);
	currentGame.log.add( this.selfStr()+ ' ' + this.conjugate('dodge')+' '+this.getEnemy().possesive()+' attack.');
	intervalRelay = "End turn";
};

Character.prototype.block = function(){
	this.effectController.displayDamage('shield', '#7c7c7c');
	this.wiggle('hit', 250);
	currentGame.log.add( this.selfStr()+ ' ' + this.conjugate('block')+' '+this.getEnemy().possesive()+' attack.');
	intervalRelay = "End turn";
};

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
			appliedDmg = (atkObj.noDamage === true) ? 0 : appliedDmg;
			break;
	}
 	this.stats[atkObj.targetStat] -= appliedDmg;
 	atkObj.itemType = (atkObj.unique) ? 'Unique' : atkObj.itemType;
 	if (atkObj.itemType !== 'Unique'){
 		this.effectController.displayDamage(atkObj.sprite, atkObj.color);
		this.wiggle('hit', 250);
 	}
	var verb = randomEntry(atkObj.verbs);
	var message = "";
	this.lastHitBy = atkObj;
	switch (atkObj.itemType){
		case 'Unique':
			message = firstCap(this.selfStr()) + ' ' + this.conjugate(verb) + ' ' + atkObj.uniqueStr + '.';
			break;
		case 'Consumable':
		case 'Buff':
			if(atkObj.calculated < 0){ appliedDmg = Math.abs(appliedDmg);}
			message = firstCap(this.selfStr()) + ' ' + this.conjugate(verb) + ' for ' + appliedDmg + atkObj.targetStat.toUpperCase() + '.';
			message = (atkObj.noDamage === true)? firstCap(this.selfStr()) + ' ' + this.conjugate(verb) +' '+ atkObj.uniqueStr+'.' : message;
			break;
		case 'Weapon':
			message = firstCap(this.getEnemy().selfStr())+' '+ this.getEnemy().conjugate(verb) +' '+ this.selfStr().toLowerCase() + ' for ' + appliedDmg + atkObj.targetStat.toUpperCase() + '.';
			break;
	}
	if (this.armor.uses !== true){
		this.armor.modifyUses(-1);
	}
	currentGame.log.add(message);
	this.updateStatus();
	var waitBeforeEnding = 1;
	if (atkObj.buffArr.length > 1){
		var currentBuff = atkObj.buffArr[0];
		var chance = atkObj.buffArr[1];
		var gotBuffed = (rollHits('1d'+chance,chance) >= 1);
		if ((gotBuffed)&&(!Object.keys(this.buffs).includes(currentBuff)&&(this.stats.HP > 0))) {
			this.addBuff(currentBuff);
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
	if ((!Object.keys(this.buffs).includes(buff))&&(!(this.immunities.includes(buff)))){
		var message = firstCap(this.selfStr())+' '+ this.conjugate('are')+ ' ' + buff + ".";
		setTimeout(function(){currentGame.log.add(message);},1000);
		this.buffs[buff] = new Buff(buff,this).timer;
	}
};

Character.prototype.removeBuff = function(buff){
	if (!(Object.keys(this.buffs).includes(buff))){
		return;
	}
	delete this.buffs[buff];
};

Character.prototype.runBuffs = function(){
	var nextStep = "Use equip";
	if (Object.keys(this.buffs).length < 1){
		intervalRelay = nextStep;
		return;
	}
	var buffsArr = Object.keys(this.buffs).slice(0);
	var thisCharacter = this;
	var counter = 0;
	var curedIt = false;
	var buffAtkObj = {};
	var goAhead = true;
	var buffInterval = setInterval(function(){
		if ((!curedIt)&&(goAhead)){
			buffAtkObj = new Buff(buffsArr[counter],thisCharacter).attackObj();
			thisCharacter.hit(buffAtkObj);
			thisCharacter.buffs[buffsArr[counter]]--;
			var cured = (thisCharacter.buffs[buffsArr[counter]] <= 0);
			if (cured){
				thisCharacter.removeBuff(buffsArr[counter]);
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
	var item = new Nude();
	var checkArr = [this.hand1,this.hand2,this.armor,this.accessory];
	var exhaustedArr = [];
	for (var e = checkArr.length - 1; e >= 0; e--) {
		if (typeof(checkArr[e]) !== 'undefined'){
			if (checkArr[e].checkExhausted()) {
				exhaustedArr.push(checkArr[e]);
			}
		}
	}
	switch (turnChoice){
		case 'activate1':
		case 'activate2':
			if (exhaustedArr.length > 0){
				item = randomEntry(exhaustedArr);
				exhaustedArr.splice(exhaustedArr.indexOf(item),1);
				for (var r = exhaustedArr.length - 1; r >= 0; r--) {
					exhaustedArr[r].uses = 1;
				}
			} else {
				intervalRelay = "End turn";
			}
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
	this.offHand = "";
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

Character.prototype.wearOffhand = function(){
	if (this.offHand.itemType === "Armor"){
		this.switchArmor(this.offHand);
	} else if (this.offHand.itemType === "Accessory"){
		this.switchAccessory(this.offHand);
	}
	currentGame.log.add(firstCap(this.selfStr()) +' '+ this.conjugate('put on')+' the '+ this.offHand.shortName.toLowerCase()+'.' );
	this.offHand = "";
	setTimeout(function(){intervalRelay = "Check equip";},1000);
};

Character.prototype.removeOffhand = function(){
	if (this.offHand.itemType === "Armor"){
		this.switchArmor();
	} else if (this.offHand.itemType === "Accessory"){
		this.switchAccessory();
	}
	currentGame.log.add(firstCap(this.selfStr()) +' '+ this.conjugate('remove')+' the '+ this.offHand.shortName.toLowerCase()+'.' );
	this.offHand = "";
	setTimeout(function(){intervalRelay = "Check equip";},1000);
};

Character.prototype.freeze = function(){
	this.offHand = "";
	currentGame.log.add(firstCap(this.selfStr()) +' '+ this.conjugate('are')+' frozen and unable to move.' );
	setTimeout(function(){intervalRelay = "Check equip";},1000);
};

Character.prototype.wait = function(){
	this.offHand = "";
	currentGame.log.add(firstCap(this.selfStr()) +' '+ this.conjugate('do')+' nothing.' );
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
	} else if ((obj.targetCharacter !== this)&&(obj.targetCharacter.calcBlock())) {
		obj.targetCharacter.block();
	} else {
		if(item.uses !== true){ item.modifyUses(-1) ; }
		obj.targetCharacter.hit(obj);
	}
};

Character.prototype.runTurn = function(turnChoice){
	this.turnChoice = turnChoice;
	if(this.accessory.uses !== true){
		this.accessory.modifyUses(-1);
	}
	var nextTurn = (this.constructor.name === 'Hero') ? 'Monster turn' : 'End round';
	intervalRelay = "Check buffs";
	var thisCharacter = this;
	var turnLoop = setInterval(function(){
		if (intervalRelay === "Check buffs"){
			intervalRelay = "wait";
			thisCharacter.runBuffs();
		} else if (intervalRelay === "Use equip"){
			intervalRelay = "wait";
			if (thisCharacter.turnChoice === 'freeze'){
				thisCharacter.freeze();
			} else {
				thisCharacter[turnChoice]();
			}
		}else if (intervalRelay === "Check equip"){
			intervalRelay = "wait";
			thisCharacter.checkEquip(turnChoice);
		} else if (intervalRelay === "End turn"){
			thisCharacter.turnChoice = "";
			intervalRelay = "wait";
			clearInterval(turnLoop);
			intervalRelay = nextTurn;
		} else if (intervalRelay === 'End round'){
			thisCharacter.turnChoice = "";
			clearInterval(turnLoop);
			return;
		}
	},250);
};

Character.prototype.addToInv = function(item){
	if (this.inventory.length < 8){
		item.uses = item.maxUses;
		item.owner = this;
		this.inventory.push(item);
		if (this.constructor.name === "Hero"){
			this.updateStatus();
		}
	} else if (this.constructor.name === "Hero"){
		var thisCharacter = this;
		setTimeout(function(){
			thisCharacter.inventoryFull(item);
		},600);
	}
};

Character.prototype.die = function(){
	intervalRelay = "End round";
	this.addClass('dead');
	var message = "";
	var diedByStr = "";
	switch (this.lastHitBy.itemType){
		case 'Consumable':
			diedByStr = "died of self-inflicted wounds";
			message = this.selfStr() +' '+ diedByStr + '.';
			break;
		case 'Buff':
			diedByStr = "died " + this.lastHitBy.killStr ;
			message = this.selfStr() +' '+ diedByStr + '.';
			break;
		case 'Weapon':
			if(this.constructor.name === 'Hero'){
				diedByStr = 'slain by a ' + this.getEnemy().shortName;
				message = 'You are slain by the ' + this.getEnemy().shortName; + '.';
			} else {
				var verb = 'slayed';
				verb = (this.aiType === 'inanimate')? 'destroyed' : verb;
				verb = (this.constructor.name === 'Chest')? 'opened' : verb;
				message = 'You '+verb+' the ' + this.shortName + '.';
			}
			break;
	}
	currentGame.log.add(message);
	if(this.constructor.name === 'Hero'){
		currentGame.interface.pause();
		var thisCharacter = this;
		setTimeout(function(){
			var graveSprite = "IwNgHqA+AMuwTIpcXSe5KnB7zb5ci94FjzhToSdDFdY9Lm6dHbCXPh2W+HqFcryECa9em0GixHOqykyiImdCA===";
			var gravestone = new Illustration('#7c7c7c',graveSprite);
			currentGame.dialog.addImage(gravestone,16,16,6);
			var message2 = "Eventually your body is found and given an adventurer's grave:<br><br>";
			message2 += "Here lies " + thisCharacter.shortName + ":<br>";
			message2 += firstCap(diedByStr)+' in the '+currentGame.currentLocation.shortName.toLowerCase()+' after slaying '+ currentGame.playerHero.kills + ' monsters and finding '+currentGame.playerHero.gold+' gold.<br><br>';
			message2 += 'May they find more peace in the next life than in this one.';
			currentGame.dialog.setText(message2);
			currentGame.dialog.addButton('Try Again','router startOver');
			currentGame.dialog.open();
			currentGame.currentMonster.addClass('dead');
		},2000);
	} else if (currentGame.playerHero.stats.HP > 0) {
		currentGame.playerHero.kills += (this.aiType === 'inanimate')? 0 : 1;
		currentGame.currentLocation.switchTrigger --;
		this.loot();
	}
};

// A hero is the PlayerCharacter Object

function Hero(name,playerClass){
	this.div = document.getElementById('hero');
	this.canvas = document.getElementById('hero-sprite').getContext('2d');
	this.name = name;
	this.playerClass = playerClass;
	this.displayElement = {
		hpText: document.getElementById('hero-hp-text'),
		hpBar: document.getElementById('hero-hp-bar'),
		name: document.getElementById('hero-name')
	};
	this.unlucky = 0;
	this.stats = {
		str: 8,
		agi: 8,
		int: 8,
		cha: 8,
		phys: 0,
		magi: 0,
		block: 0,
		maxHP: 50
	};
	this.stats.HP = this.stats.maxHP;
	this.kills = 0;
	this.spriteCompressed = "IwNgHgLAHAPgDAxTktW9HNdcY267a6EbHGlkkp6VVJ4EnmIOOvqWacWM8J3IqA+oLQDh+SVOkzZc+Qv7s+XZh25jaYtmRxKGagvon1dPE0pbLTVjqJzLCQA=";
	this.color = "white";
	this.buffs = {};
}

Hero.prototype = new Character ();
Hero.prototype.constructor = Hero;

Hero.prototype.drawInventory = function(){
	for (var v = 7; v >= 0; v--) {
		inventoryCanvases[v].clearRect(0,0,16,16);
		document.querySelector('#invButton'+(v+1)).classList.remove('full');
	}
	for (var x = this.inventory.length - 1; x >= 0; x--) {
		this.inventory[x].updateInvStatus(x);
	}
};

Hero.prototype.debug = function(){
	// put some stuff you need to test here;
	for (var i = this.inventory.length - 1; i >= 0; i--) {
		this.inventory[i].uses = 0;
	}
	currentGame.log.add('Your items crumble before your eyes!');
	this.effectController.displayDamage('cloud', '#dddddd');
	this.wiggle('hit', 250);
	setTimeout(function(){
		intervalRelay = "End turn";
	},1000);
};

Hero.prototype.talk = function(){
	var monster = this.getEnemy();
	if (['wild','inanimate','wildSimple','mimic'].includes(monster.aiType)){
	} else {
		var talkitude = roll( Math.floor((this.stats.cha + this.stats.agi)/8) + 'd12');
		monster.stats.hostility -= talkitude;
		monster.stats.hostility = (monster.stats.hostility < 0)? 0 : monster.stats.hostility;
	}
	currentGame.log.add('You attempt to talk to ' + monster.selfStr()+'.');
	setTimeout(function(){
		monster.updateStatus();
		currentGame.log.add(monster.hostilityMsg());
		if (monster.stats.hostility <= 0){
			// var convo = randomEntry(monster.convos);
			var convo = "smallTalk1";
			monster.beginConversation(convo);
			intervalRelay = "End round";
		} else {
			intervalRelay = "End turn";
		}
	},1000);
};

Hero.prototype.possesive = function(){
	return "your";
};

Hero.prototype.initialize = function(playerClass){
	this.removeClass('dead');
	this.inventory = [];
	switch (playerClass){
		case 'Rogue':
			this.stats.agi = 9;
			this.addToInv(new Bow('Wood'));
			this.addToInv(new Potion('Health'));
			this.addToInv(new Cloth('Shirt'));
			this.addToInv(new Bomb('Smoke'));
			break;
		case 'Sorcerer':
			this.stats.int = 9;
			this.addToInv(new Staff('Thunder'));
			this.addToInv(new Vial('Opiates'));
			this.addToInv(new Cloth('Robes'));
			this.addToInv(new Ring('Wood'));
			break;
		case 'Warrior':
		default:
			this.stats.str = 9;
			this.addToInv(new Sword('Wood'));
			this.addToInv(new Potion('Regen'));
			this.addToInv(new Plate('Brass'));
			this.addToInv(new Food('Meat'));
			break;
	}
	this.effectController = new Effect();
	this.effectController.link(this);
	this.equip1(this.inventory[0]);
	this.equip2(this.inventory[1]);
	this.switchArmor(this.inventory[2]);
	if (['Accessory','Armor'].includes(this.inventory[3].itemType)){
		this.switchAccessory(this.inventory[3]);
	} else {
		this.switchAccessory();
	}
	this.gold = 0;
	this.paint();
	this.updateStatus();
};

Hero.prototype.paint = function(){
	this.canvas.clearRect(0,0,16,48);
	if ((typeof(this.hand1.avatarSprite)!== "undefined")&&(this.hand1.avatarSprite!== "")&&(this.hand1.drawLvl === 'bottom')){
		this.hand1.draw(this.canvas,this.hand1.avatarSprite);
	}
	this.draw(this.canvas,this.spriteCompressed);
	if ((typeof(this.armor.avatarSprite)!== "undefined")&&(this.armor.avatarSprite!== "")){
		this.armor.draw(this.canvas,this.armor.avatarSprite);
	}
	if ((typeof(this.accessory.avatarSprite)!== "undefined")&&(this.accessory.avatarSprite!== "")){
		this.accessory.draw(this.canvas,this.accessory.avatarSprite);
	}
	if ((typeof(this.hand1.avatarSprite)!== "undefined")&&(this.hand1.avatarSprite!== "")&&(this.hand1.drawLvl === 'top')){
		this.hand1.draw(this.canvas,this.hand1.avatarSprite);
	}
};

Hero.prototype.switchArmor = function(item){
	if (typeof(item) === "undefined"){
		item = new Nude();
	}
	this.remove(this.armor);
	this.wear(item);
	if (this.constructor.name === "Hero"){
		currentGame.playerHero.paint();
	}
};

Hero.prototype.switchAccessory = function(item){
	if (typeof(item) === "undefined"){
		item = new Nothing();
	}
	this.remove(this.accessory);
	this.wear(item);
	if (this.constructor.name === "Hero"){
		currentGame.playerHero.paint();
	}
};

Hero.prototype.receive = function(item,looted){
	currentGame.foundItem = item;
	var message = "You find a " + item.shortName + "!";
	var takeAction = (looted === true)? "takeLootedItem" : "takeFoundItem";
	var dropAction = (looted === true)? "newMonster" : "closeDialog";
	currentGame.dialog.addButton("Take the " + item.shortName, "router "+takeAction);
	currentGame.dialog.addButton("Leave it", "router "+dropAction);
	currentGame.dialog.setText(message);
	currentGame.dialog.open();
};

Hero.prototype.inventoryFull = function(item){
	var message = "You don't have room in your knapsack for the "+ item.shortName + "!<br> Would you like to drop something?";
	for (var q = 0; q <= this.inventory.length - 1; q++) {
		currentGame.dialog.addButton("Drop your "+ this.inventory[q].shortName, "dropItem " + q);
	}
	currentGame.dialog.addButton("Leave the "+ item.shortName +" behind", "router closeDialog");
	currentGame.dialog.setText(message);
	currentGame.dialog.open();
};

Hero.prototype.infoDialog = function(){
	var message = this.name + ' the '+this.playerClass+ '<br>' + 'HP: '+this.stats.HP+'/'+this.stats.maxHP+'<br><br>';
	message += 'STR: '+this.stats.str+' | '+'AGI :'+this.stats.agi+'<br>';
	message += 'INT: '+this.stats.int+' | '+'CHA :'+this.stats.cha+'<br><br>';
	message += 'Physical Defense: '+this.stats.phys+'<br>'+'Magical Defense: '+this.stats.magi+'<br>';
	message += 'Blocking: '+Math.round(this.stats.block * 3)+'% chance<br><br>';
	if (Object.keys(this.buffs).length > 0){
		message += 'Currently: '+ Object.keys(this.buffs).join(', ')+'<br><br>';
	}
	message += 'Right hand: '+this.hand1.shortName+'<br>Left hand: '+this.hand2.shortName+'<br>';
	message += 'Armor: '+this.armor.shortName+'<br>';
	message += 'Accessory: '+this.accessory.shortName+'<br><br>';
	message += 'Kills: '+this.kills+'<br>Gold: '+this.gold;
	currentGame.dialog.addButton("Back to game","router closeDialog");
	currentGame.dialog.setText(message);
	currentGame.dialog.open();
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
	this.inventory = [];
}
Monster.prototype = new Character ();
Monster.prototype.constructor = Monster;

Monster.prototype.possesive = function(){
	return "the " + this.shortName.toLowerCase() + "'s"; 
};

Monster.prototype.ai = function(){
	switch(this.aiType){
		case 'mimic':
			if (this.stats.HP < this.stats.maxHP){
				return 'mimic';
			}
		case 'inanimate':
			return 'wait';
		case 'wildSimple':
		case "simple":
			return 'activate1';
		case 'wild':
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
	this.buffs = {};
	this.stats.hostility = 100;
	this.announce();
	this.stats.block = 0;
	this.immunities = this.naturalImmunities.slice(0);
	this.inventory = [];
	if (typeof(this.aiType) === 'undefined'){
		this.aiType = 'wild';
	}
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
	if (typeof(this.garment) !== "undefined"){
		this.wear(this.garment);
		this.addToInv(this.garment);
	} else {
		this.wear(new Nude());
	}
	if (typeof(this.trinket) !== "undefined"){
		this.wear(this.trinket);
		this.addToInv(this.trinket);
	} else {
		this.wear(new Nothing());
	}
	this.addToInv(currentGame.itemFromString(randomEntry(this.common)));
	if ( roll('1d2') === 2) {
		this.addToInv(currentGame.itemFromString(randomEntry(this.uncommon)));
	}
	if ( roll('1d3') === 3) {
		this.addToInv(currentGame.itemFromString(randomEntry(this.rare)));
	}
	this.effectController = new Effect();
	this.effectController.link(this);
	this.draw(this.canvas,this.spriteCompressed);
	this.stats.HP = this.stats.maxHP;
	this.gold = roll(this.purseStr);
	this.updateStatus();
};

Monster.prototype.mimic = function(){
	this.offHand = "";
	this.div.classList.remove('inanimate');
	currentGame.log.add(firstCap(this.selfStr()) +' comes to life!' );
	this.shortName = this.revealedName;
	this.aiType = 'wild';
	this.updateStatus();
	setTimeout(function(){intervalRelay = "Check equip";},1000);
};

Monster.prototype.loot = function(){
	var gotItem = (currentGame.playerHero.unlucky >= 4) ? true : (roll('1d20')<=this.lootChance);
	gotItem = (currentGame.currentLocation.switchTrigger <= 0) ? false : gotItem;
	var message = "You found ";
	var lootedItem = (this.inventory.length > 0) ? randomEntry(this.inventory) : false;
	var thisMonster = this;
	message += (gotItem&&lootedItem)? "a "+lootedItem.shortName+"!" : this.gold + " gold!";
	setTimeout(function(){
		currentGame.log.add(message);
		if (gotItem&&lootedItem){
			currentGame.playerHero.unlucky = 0;
			currentGame.playerHero.receive(lootedItem,true);
		} else {
			currentGame.playerHero.unlucky++;
			currentGame.playerHero.gold += thisMonster.gold;
			setTimeout(currentGame.switchMonster, 2000);
		}
	},1000);
};

Monster.prototype.hostilityMsg = function(){
	this.updateStatus();
	var message = "";
	var roundedHostility = Math.round(this.stats.hostility/10);
	switch (roundedHostility){
		case 0:
			message = 'engages you in coversation'
			break;
		case 1:
		case 2:
			message = 'seems confused';
			break;
		case 3:
		case 4:
		case 5:
			message = 'hesistates momentarily';
			break;
		case 6:
		case 7:
		case 8:
			message = 'regards you with suspicion';
			break;
		case 9:
		default:
			message = 'ignores you, enraged';
			break;
	}
	var fullMessage = this.selfStr() + ' ' + message +'.';
	if (['wild','inanimate','wildSimple','mimic'].includes(this.aiType)){
		fullMessage = this.selfStr() + ' is unaffected by your words.';
	}
	return fullMessage;
};

Monster.prototype.beginConversation = function(convo_id) {
	var talkObject = lookupConvo(convo_id);
	var talkText = LZString.decompressFromBase64(talkObject.text).replace('XXXX',this.shortName);
	var buttonArray = talkObject.buttons;
	for (var i = buttonArray.length - 1; i >= 0; i--) {
		var buttonText = buttonArray[i][0];
		var buttonAction = buttonArray[i][1];
		var buttonClass = "";
		if (buttonArray[i].length > 2){
			buttonClass = buttonArray[i][2];
		}
		currentGame.dialog.addButton(buttonText,buttonAction,buttonClass);
	}
	currentGame.dialog.setText(talkText);
	currentGame.dialog.open();
};

// Types of Monsters

function Axedude (type) {
	this.stats = {
		str: 10,
		agi: 5,
		int: 5,
		cha: 2,
		phys: 0,
		magi: 0,
		maxHP: 16
	};
	this.spriteCompressed = "IwNgHgLAHAPgDAxTktW1xPGdx2u5IF5yF4BMZZCBx1tdODxTtpmGWJKbNnL/Xq3wdqNQh1I8qY8UVlScnaelVr1GzVu07VAviX3jJUscEpFpDRXmb5hzK3RPyTsoe6FOjxkfZXGNrbyaGbKTEA==";
	this.displayName = "Axedude";
	this.color = '#f8d878';
	this.item2 = (new Axe());
	this.item1 = (new Vial('Steroids'));
	this.garment = new Plate('Brass');
	this.trinket = new Ring('Brass');
	this.aiType = 'buffer';
	this.purseStr = '2d20';
	this.lootChance = 10;
	this.common = ['Food','Axe Brass','Ring Brass'];
	this.uncommon = ['Vial Steroids','Plate Brass'];
	this.rare = ['Vial Opiates','Food Spinach'];
}
Axedude.prototype = new Monster();
Axedude.prototype.constructor = Axedude;

function Ball (type) {
	this.validTypes = ['Goo','Fire'];
	type = plinko(type,this.validTypes);
	this.stats = {
		str: 7,
		agi: 7,
		int: 1,
		cha: 1,
		phys: 0,
		magi: 1,
		maxHP: 15
	};
	var dripSprite = "IwNgHgLAHAPgDAxTktW9HNe54fd6HBpGkpEBMwVhyhVDtipFrZCl1XTc+ejfJMVK1izDuzF1ewrGKnoFuHCtVr1GzVvU8SIvSKUzD+IZyJn63HiJoWJxsguGHeQifaNvByt7+zAQA===";
	var burnSprite = "IwNgHgLAHAPgDAxTktWxx0YZrTi7qYHFrElyH7kmnW22Ua0BMwbBTOJbvj3PFhwrN2Y4clZiR9BlVkyynPCtVr1GzVu06t8rLn3ZKR/CbooaF6uYry5jQg8eiec1+IYLhyj+8nOSl4GvkA==";
	this.purseStr = '1d10';
	this.lootChance = 12;
	this.common = ['Axe Brass','Sword Iron'];
	this.uncommon = ['Vial Opiates','Ring Brass'];
	switch (type){
		case 'Goo':
			this.spriteCompressed = dripSprite;
			this.displayName = "floating ball of dripping ooze";
			this.shortName = "Gooball";
			this.color = '#d800cc';
			this.rare = ['Bow Poison'];
			break;
		case 'Fire':
			this.naturalResists = { fire: -0.5 };
			this.spriteCompressed = burnSprite;
			this.displayName = "floating orb of fire";
			this.shortName = "Fireball";
			this.color = "#f83800";
			this.item1 = (new Hose('Fire'));
			this.trinket = new Ring('Fire');
			this.aiType = 'random';
			this.uncommon = ['Bomb Fire'];
			this.rare = ['Sword Fire','Ring Fire'];
			break;
	}
}
Ball.prototype = new Monster();
Ball.prototype.constructor = Ball;

function Chest (type) {
	this.validTypes = ['Wood','WoodMimic'];
	type = plinko(type,this.validTypes);
	this.stats = {
		str: 0,
		agi: 0,
		int: 0,
		cha: 0,
		phys: 0,
		magi: 0,
		maxHP: 10
	};
	this.aiType ='inanimate';
	this.naturalResists = { physical: 10 };
	this.spriteCompressed = "IwNgHgLAHAPgDAxTktW9HNez3f8FoBMwRZ5pyJ5N1S1tZliwrb7r9pT3ditrWvUZD+Iml3HNCM2XPkLFSvKOKCG5KmxLdBW9julwdh7Vp6C9LDuukabwYRV5HxEsW6KS3GGsyA==";
	this.purseStr = '5d20';
	this.lootChance = 20;
	switch (type){
		case 'WoodMimic':
			this.color = '#503000';
			this.displayName = "wooden chest";
			this.shortName = "Wood Chest";
			this.revealedName = 'Mimic';
			this.aiType = 'mimic';
			this.stats.phys = 2;
			this.stats.magi = 1;
			this.stats.str = 8;
			this.stats.agi = 8;
			this.naturalResists = {};
			this.item1 = (new Claws('Bone'));
			this.common = ['Potion','Plate Brass',"Bomb"];
			this.uncommon = ['Sword','Cloth Robes','Food','Ring'];
			this.rare = ['Sword Fire','Bow Poison','Staff Thunder'];
			break;
		case 'Wood':
		default:
			this.displayName = "wooden chest";
			this.shortName = "Wood Chest";
			this.color = '#503000';
			this.common = ['Food','Potion'];
			this.uncommon = ['Sword','Cloth Robes','Food','Ring','Plate'];
			this.rare = ['Sword Fire','Bow Poison','Staff Thunder'];
			break;
	}
}
Chest.prototype = new Monster();
Chest.prototype.constructor = Chest;

function Jelly (type) {
	this.stats = {
		str: 1,
		agi: 10,
		int: 0,
		cha: 0,
		phys: 4,
		magi: 0,
		maxHP: 20
	};
	this.naturalResists = { fire: 1.25 };
	this.item1 = (new Hose('Acid'));
	this.aiType ='random';
	this.spriteCompressed = "IwNgHgLAHAPgDAxTktW9HNwEy7/5bYYk07JI0q8xfPYOhS6spqk5mnd6tn17vw58hXZqL7jegnpRpEp03A365a5OgSzaduvfoOGjFTXkJCGFC1xyaGWxSuGPi4jRY4v2yj66+tOa39ObmCmBVUxDVMaIA===";
	this.displayName = "quivering, gelatinous cube";
	this.shortName = "Box Jelly";
	this.color = 'rgba(88,216,84,0.5)';
	this.purseStr = '3d20';
	this.lootChance = 19;
	this.common = ['Potion','Ring Brass',"Bomb","Buckler"];
	this.uncommon = ['Sword','Cloth Robes','Food','Ring','Plate'];
	this.rare = ['Sword Fire','Bow Poison','Staff Thunder'];
}
Jelly.prototype = new Monster();
Jelly.prototype.constructor = Jelly;

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
	this.purseStr = '3d10';
	this.lootChance = 12;
	this.common = ['Food','Potion','Ring Wood'];
	this.uncommon = ['Bow','Cloth Shirt','Staff Wood','Ring Alert'];
	this.rare = ['Vial Steroids','Food Spinach'];
}
Scamp.prototype = new Monster();
Scamp.prototype.constructor = Scamp;

function Skele (type) {
	this.validTypes = ["Footman","Archer","Monk","Bruiser","Flaming", "Bones"];
	type = plinko(type,this.validTypes);
	this.stats = {
		str: 6,
		agi: 6,
		int: 6,
		cha: 2,
		phys: 0,
		magi: 0,
		maxHP: 12
	};
	this.aiType = 'simple';
	this.color = '#f0d0b0';
	this.naturalResists = { fire: 1.25 };
	this.purseStr = '1d10';
	this.lootChance = 5;
	this.common = ['Food Rotten','Ring Wood'];
	this.uncommon = ['Sword Iron','Potion Health'];
	this.rare = ['Plate Brass'];
	switch (type){
		case "Footman":
			this.stats.maxHP = 14;
			this.stats.str = 8;
			this.spriteCompressed = "IwNgHgLAHAPgDAxTktW9HPOGn3f7B5JGJHnFlV6mFwX2PWrklnGtX2ef5P99KLNukpC+CcSK5ZZc+QsVLlKjFIGSCbWiQ4VxHJjuYMcYjZON7257rV4jDKJ6JnC3ziZ5JA==";
			this.displayName = "Skelebones Footman";
			this.item1 = (new Sword('Wood'));
			this.item2 = (new Buckler('Wood'));
			this.garment = new Cloth('Rags');
			this.aiType = 'random';
			break;
		case "Archer":
			this.stats.agi = 10;
			this.spriteCompressed = "IwNgHgLAHAPgDAxTktW4aUY5xP/pLaFFzA57lXVWl5kIWPLVZ2YFlOn62oWdcgksw7t+4tpNwzZc+QsVKps4qtHd69TaO3caB8uLX6WfYzM5GJvayuETdInVqcq3knEA";
			this.displayName = "Skelebones Archer";
			this.item1 = (new Bow('Wood'));
			this.rare = ['Bow Poison'];
			break;
		case "Monk":
			this.stats.agi = 16;
			this.stats.int = 9;
			this.stats.magi = 1;
			this.spriteCompressed = "IwNgHgLAHAPgDAxTktW9HPOGn3f7B74JFnGLE55ErVzkN1PMkNWuMuGkb3e4O6ChVa9hbLFOkzZc+QsUTUogUlHVV3crTb9d6po1X9J49pU5lzhmn11bDNsWrOO1wIA=";
			this.displayName = "Wise, Old Skelebones";
			this.shortName = "Skelebones Monk";
			this.item1 = (new Staff('Wood'));
			this.garment = new Cloth('Rags');
			this.rare = ['Vial Steroids'];
			break;
		case "Bruiser":
			this.stats.maxHP = 18;
			this.stats.str = 10;
			this.stats.phys = 1;
			this.spriteCompressed = "IwNgHgLAHAPgDAxTktW9biKxux+o5JHIl55kXb40pFY4Gnk0PnbulML28mO0KldvUw9c/DJPTSxxXAsVLlK1WvUdxE7vOaFmOnn0G6WRui1psOwk5252BTO5tEWtMzXI/7T77EA=";
			this.displayName = "Skelebones who thinks he's a badass";
			this.shortName = "Skelebones Bruiser";
			this.item1 = (new Sword('Iron'));
			this.item2 = (new Buckler('Iron'));
			this.garment = new Cloth('Rags');
			this.aiType = 'random';
			this.rare = ['Sword Flame','Ring'];
			break;
		case "Flaming":
			this.stats.maxHP = 20;
			this.spriteCompressed = "IwNgHgLAHAPgDAxdhNW4KVqRj3GYBMe+CwxxW+55xpNld1uGh9yZVqmuH2XBdASoC+LMuz6kx0qXKGDJEpctlr1GzVvaj+unMhLTWR6hVPoKTfuZr0W+iVguDx+3aJEiF4+Qb/cikqOciECjuFAA";
			this.displayName = "Skelebones who is on fire";
			this.shortName = "Flaming Skelebones";
			this.trinket = new Ring('Flame');
			this.color = "#ff5000";
			this.rare = ['Sword Flame','Bomb Fire'];
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
	this.validTypes = ["Big","Small","Sleeper"];
	type = plinko(type,this.validTypes);
	var smallSprite = "IwNgHgLAHAPgDAxTktW9HNez3vgHCaGHolFFolbU0HakaWOqWItJvluff14DBQ4SNFjxEhh1bky1HslpNpVfsTWLFGzloUIuslHzVA==";
	var bigSprite = "IwNgHgLAHAPgDAxTktW9HPOD4HcHrABMpxuqBFeKJZ5RVmdD+hzpNbOaXcFtWj2xIqA/njFMEU6VnkLFS5StVqhw3mKL1xo7X0QtOjdjpPdN5w1qsyNlByKNSXE2Vw8CgA==";
	var stripeSprite = "IwNgHgLAHAPgDAxTktW9HNez3uBMwhmRpwwahFc51KRO5B+jTGd+xqdCt31pQi3q0hDPBMlTpM2XPkLsYkmLYoqvNcnFYtmTq3Q84nY4mN8RvMcO2jBiIA==";
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
	this.purseStr = '1d10';
	this.lootChance = 15;
	this.common = ['Food','Food Rotten'];
	this.uncommon = ['Potion Health','Potion Regen'];
	switch (type){
		case 'Sleeper':
			this.item1 = new Claws('Sleeper');
			this.item2 = new Vial('Opiates');
			this.aiType = 'switch';
			this.switchTrigger = 4;
			this.color = '#881400';
			this.spriteCompressed = stripeSprite;
			this.displayName = "eastern blue-tongued shingleback";
			this.shortName = "Sleeper Snek";
			this.stats.agi = 11;
			this.stats.maxHP = 14;
			this.rare = ['Vial Opiates','Food Spinach','Ring Alert'];
			break;
		case 'Big':
			this.spriteCompressed = bigSprite;
			this.displayName = "distressingly large Snek";
			this.shortName = "Really Big Snek";
			this.stats.str = 9;
			this.stats.agi = 12;
			this.stats.cha = 11;
			this.stats.maxHP = 18;
			this.rare = ['Vial Opiates','Food Spinach','Ring Alert'];
			break;
		case 'Small':
		default:
			this.item1 = (new Claws('Venom'));
			this.spriteCompressed = smallSprite;
			this.displayName = "Snek";
			this.rare = ['Food Spinach'];
			break;
	}
}
Snek.prototype = new Monster();
Snek.prototype.constructor = Snek;

function Were (type) {
	this.validTypes = ["Wolf","Goat","Hellbeast"];
	type = plinko(type,this.validTypes);
	this.stats = {
		str: 12,
		agi: 7,
		int: 5,
		cha: 3,
		phys: 1,
		magi: 0,
		maxHP: 20
	};
	this.aiType = 'wildSimple';
	this.purseStr = '1d20';
	this.lootChance = 19;
	this.common = ['Food','Food Rotten','Buckler'];
	this.uncommon = ['Potion Health','Cloth Rags','Ring Wood'];
	this.rare = ['Vial Steroids','Food Spinach'];
	var wolfSprite = "IwNgHgLAHAPgDAxTktW9Lhyxhx8HoHH6YkmrmFlU5JbnZ1N7Xb2LGv11fuecKaWsJyFSmQd0kDhyZh3m5lK1WvUbNmhisaiqNEYaHzaC9ownS+/PD1JWWTLszEHKbnZSmPFd37Z23koIQA==";
	var goatSprite = "IwNgHgLAHAPgDAxTktWpx0M8TWdaK7F6onkrlVlW422lFzV1F4lOfPHaOves+bHumqj2/Mm0JC0jZnMqFlK1WvUbRM7tvlyK+2pQaThY5Cb04KkwSIVcB1jBJGzzNXnozT8Pxf5KFpohqkA=";
	switch (type){
		case "Wolf":
			this.spriteCompressed = wolfSprite;
			this.displayName = "Werewolf";
			this.color = "#ac7c00";
			this.stats.phys = 0;
			this.item1 = (new Claws('Bone'));
			this.garment = new Cloth('Rags');
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
			this.rare = ['Sword Fire','Bomb Fire','Ring Fire',"Buckler Ruby"];
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
		magi: 1,
		maxHP: 12
	};
	this.item1 = (new Staff('Thunder'));
	this.item2 = (new Potion('Health'));
	this.garment = new Cloth('Robes');
	this.spriteCompressed = "IwNgHgLAHAPgDAxTktW9HgeV7dgEF75K4oEBMuwV5hRJd9WZiLzjpCh3DbCFQfy7da3NJQatSVMdLY0e8/MxapVPHBr7Fde/QcNGJe5UymY2YrdeWrx5peRUacvMvNyCKw4Yo/q/r4yisEKVBZaHJwK9tLafEA==";
	this.displayName = "Wiz";
	this.color = '#0058f8';
	this.aiType = 'switch';
	this.switchTrigger = 5;
	this.purseStr = '2d20';
	this.lootChance = 15;
	this.common = ['Ring','Potion Regen','Bow'];
	this.uncommon = ['Potion Health',"Bomb"];
	this.rare = ['Sword Fire','Plate Silver',"Buckler Ruby"];
}
Mage.prototype = new Monster();
Mage.prototype.constructor = Mage;

// Items are Displayable's that modify character's stats and determine their actions available

function Item(){
	this.owner = "";
	this.noDamage = false;
	this.unique = false;
	this.buffs = [];
	this.immunities = [];
	this.stats = {};
	this.resists = {};
	this.avatarSprite = 'IwD2B8AYg===';
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
	this.destroy();
	var message = firstCap(this.owner.possesive()) +" "+ this.shortName.toLowerCase() +" "+ this.breakVerb + " and is discarded.";
	currentGame.log.add(message);
};

Item.prototype.destroy = function(){
	switch (this){
		case this.owner.armor:
			this.owner.switchArmor();
			break;
		case this.owner.accessory:
			this.owner.switchAccessory();
			break;
		case this.owner.hand1:
			this.owner.equip1( new Punch() );
			break;
		case this.owner.hand2:
			this.owner.equip2( new Punch() );
			break;
	}
	var invIndex = this.owner.inventory.indexOf(this);
	if (invIndex >= 0){
		this.owner.inventory.splice(invIndex,1);
	}
	this.owner.updateStatus();
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
	attck.noDamage = this.noDamage;
	attck.uniqueStr = this.uniqueStr;
	attck.unique = this.unique;
	if ((this.constructor.name === 'Punch')&&(this.owner.constructor.name !== "Hero")){
		attck.color = this.owner.color;
	}
	attck.verbs = this.verbs;
	attck.itemType = this.itemType;
	attck.selfTargeted = this.selfTargeted;
	attck.buffArr = this.buffArr;
	attck.killStr = this.killStr;
	if (this.itemType === "Buff"){

	}
	if ((Object.keys(this.owner.buffs).includes('Aflame'))&&(this.itemType === 'Weapon')){
		attck.buffArr = ['Aflame',3];
	}
	attck.targetStat = this.targetStat;
	return attck;
};

Item.prototype.statsStr = function(){
	if (Object.keys(this.stats).length === 0){
		return "";
	}
	var counter = 1;
	var str = "";
	for (var key in this.stats) {
		var signfier = (this.stats[key] > 0)? "+" : "-";
		var joiner = (counter >= Object.keys(this.stats).length)? "" : ", ";
		str += key.toUpperCase() +": "+signfier+this.stats[key]+joiner;
		counter++;
	}
	str +='<br>';
	return str;
};

Item.prototype.resistsStr = function(){
	if (Object.keys(this.resists).length === 0){
		return "";
	}
	var str = "";
	var counter = 1 ;
	for (var key in this.resists) {
		var signfier = (this.resists[key] > 0)? "" : "-";
		var joiner = (counter >= Object.keys(this.resists).length)? "" : ", ";
		str += key.toUpperCase() +": "+signfier+(this.resists[key]*100)+'%'+joiner;
		counter++;
	}
	str +='<br>';
	return str;
};

Item.prototype.immunitiesStr = function(){
	if (this.immunities.length === 0){
		return "";
	}
	var str = "Adds Immunity to: ";
	for (var i = this.immunities.length - 1; i >= 0; i--) {
		var joiner = (i !== 1)? "" : ", ";
	 	str += this.immunities[i] + joiner;
	}
	str +='<br>';
	return str;
};

Item.prototype.buffsStr = function(){
	if (this.buffs.length === 0){
		return "";
	}
	var str = "Equipping adds: ";
	for (var i = this.buffs.length - 1; i >= 0; i--) {
		var joiner = (i !== 1)? "" : ", ";
	 	str += this.buffs[i] + joiner;
	}
	str +='<br>';
	return str;
};

Item.prototype.equippedStr = function(){
	var equippedArr = [this.owner.armor,this.owner.accessory,this.owner.hand1,this.owner.hand2];
	if (!(equippedArr.includes(this))||(typeof(this.itemType) === 'undefined')){
		return "";
	}
	var str = "";
	switch (this){
		case this.owner.hand1:
		case this.owner.hand2:
			var hand = (this.owner.hand1 === this)?'right':'left';
			str = 'At the ready in your '+hand+' hand.';
			break;
		case this.owner.armor:
		case this.owner.accessory:
			str = 'You are wearing this.';
			break;
	}
	str += '<br>';
	return str;
};

Item.prototype.invDialog = function(){
	currentGame.foundItem = "";
	if (this.owner.constructor.name !== "Hero"){
		return;
	} 
	var message = this.shortName + ':<br>' + firstCap(this.displayName)+'.<br><br>';
	var textBlock2 = this.equippedStr()+this.infoStr();
	if (textBlock2 !== ""){ message += textBlock2 + '<br>'};
	var textBlock3 = this.statsStr()+this.resistsStr()+this.immunitiesStr()+this.buffsStr();
	if (textBlock3 !== ""){ message += textBlock3 + '<br>'};
	message += 'Uses left: '+this.uses;
	if ((this.owner.hand1 === this)||(this.owner.hand2 === this)){
		var hand,activateNum;
		if (this.owner.hand1 === this){
			hand = 'right';
			activateNum = 1;
		} else {
			hand = 'left';
			activateNum = 2;
		}
		currentGame.dialog.addButton('Use this from your '+hand+' hand','runRound activate'+activateNum,"suggest");
		currentGame.dialog.addButton('Un-equip this item','router unEquip'+hand,'caution');
	} else{
		switch (this.itemType){
		case 'Accessory':
			if (this.owner.accessory === this){
				currentGame.dialog.addButton('Remove ' + this.shortName,'runRound removeOffhand',"caution");
			} else {
				var accesStr = ( this.owner.accessory.constructor.name !== 'Nothing')? 'instead of ' + this.owner.accessory.shortName : 'the '+ this.shortName;
				currentGame.dialog.addButton('Wear ' + accesStr,'runRound wearOffhand',"caution");
			}
			break;
		case "Armor":
			if (this.owner.armor === this){
				currentGame.dialog.addButton('Remove ' + this.shortName,'runRound removeOffhand',"caution");
			} else {
				var armorStr = ( this.owner.armor.constructor.name !== 'Nude')? 'instead of ' + this.owner.armor.shortName : 'the '+ this.shortName;
				currentGame.dialog.addButton('Wear ' + armorStr,'runRound wearOffhand',"caution");
			}
			break;
		case "Consumable":
			currentGame.dialog.addButton('Use without equipping','runRound activateOffhand',"caution");
		case "Weapon":
			var rHandStr = ( this.owner.hand2.constructor.name !== 'Punch')? 'instead of ' + this.owner.hand2.shortName : 'in your left hand';
			var lHandStr = ( this.owner.hand1.constructor.name !== 'Punch')? 'instead of ' + this.owner.hand1.shortName : 'in your right hand';
			currentGame.dialog.addButton('Equip '+lHandStr,'runRound equip1Offhand');
			currentGame.dialog.addButton('Equip '+rHandStr,'runRound equip2Offhand');
			break;
		}
	}
	this.owner.offHand = this;
	var invIndex = this.owner.inventory.indexOf(this);
	currentGame.dialog.setText(message);
	currentGame.dialog.addButton('Drop the '+this.shortName,'dropItem '+invIndex,"warning");
	currentGame.dialog.addButton('Cancel','router closeDialog');
	currentGame.dialog.open();
};

Item.prototype.updateInvStatus = function(num){
	if (!(currentGame.playerHero.inventory.includes(this))){
		return;
	}
	if (typeof(num) === 'undefined'){
		num = currentGame.playerHero.inventory.indexOf(this);
	}
	inventoryCanvases[num].clearRect(0,0,16,16);
	var canvas = inventoryCanvases[num];
	var sprite = this.smallSprite;
	this.draw(canvas,sprite);
	var thisButton = document.querySelector('#invButton'+(num+1));
	thisButton.classList.add('full');
 	var percentage = Math.floor((this.uses / this.maxUses)*100);
 	var useBar = thisButton.querySelector('.use-bar');
 	useBar.className = "use-bar hp-bar hp-" + (Math.round(percentage / 10)*10);
 	useBar.style.width = 'calc('+percentage+'% - 2px)';
};

Item.prototype.modifyUses = function(num){
	this.uses += num;
	if (this.uses >= this.maxUses){
		this.maxUses = this.uses;
	}
	this.updateInvStatus();
};

function Buff(type,owner){
	this.selfTargeted = true;
	this.itemType = 'Buff';
	this.timer = 3;
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
		case 'Explode':
			this.killStr = "in an explosion";
			break;
		case 'Aflame':
			this.killStr = "in a conflagration";
			this.timer = roll('3d3');
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
			this.timer = roll('2d5');
			this.attackVal = function(){ return roll('1d3'); };
 			this.attackType = 'poison';
 			this.sprite = 'bubble';
 			this.color = '#d800cc';
 			this.verbs = ['waste','wither'];
 			break;
 		case 'Regenerating':
 			this.timer = roll('2d4');
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
 			this.timer = 1 + roll('1d3');
 			this.attackVal = function(){
 				return -1;
 			};
 			this.attackType = 'poison';
 			this.targetStat = 'str';
 			this.sprite = 'bubble';
 			this.color = '#f83800';
 			this.verbs = ['gain','rage'];
 			break;
 		case 'Sedated':
 			this.timer = 1 + roll('1d2');
 			this.attackVal = function(){
 				return 1;
 			};
 			this.attackType = 'poison';
 			this.targetStat = 'agi';
 			this.sprite = 'bubble';
 			this.color = '#00e8d8';
 			this.verbs = ['doze off','zonk out'];
 			break;
 			case 'Paralyzed':
 			this.noDamage = true;
 			this.timer = 1 + roll('1d4');
 			this.sprite = 'chaos';
 			this.color = '#ffff00';
 			this.verbs = ['freeze up','are immobilized'];
 			this.uniqueStr = "momentarily";
 			break;
 		case 'Obscured':
 			this.noDamage = true;
 			this.timer = roll('3d4');
 			this.sprite = 'cloud';
 			this.color = 'rgba(152,120,248,0.8)';
 			this.verbs = ['are'];
 			this.uniqueStr = 'enshrouded in smoke';
 			break;
	}
}
Buff.prototype = new Item();
Buff.prototype.constructor = Buff;

function Weapon(){
	this.drawLvl = 'bottom';
	this.selfTargeted = false;
	this.natural = 1;
	this.buffArr = [];
	this.userTraits = [];
	this.maxUses = true;
	this.flammable = false;
	this.ranged = false;
	this.targetStat = "HP";
	this.attackType = "physical";
	this.itemType = "Weapon";
}
Weapon.prototype = new Item();
Weapon.prototype.constructor = Weapon;

Weapon.prototype.infoStr = function(){
	if (this.unique === true){
		return "";
	}
	var str = "Attacks enemy's " +this.targetStat;
	str += " with "+this.attackType+" damage, using ";
	var traits = "your "+ this.userTraits.join(' and ')+".";
	str += (this.userTraits.length > 0)? traits : "complete chance.";
	if (this.buffArr.length > 1){
		var odds = (this.buffArr[1] > 1)? " 1 in "+this.buffArr[1]+" chance to cause" : " Causes";
		str += odds + " enemy to be "+this.buffArr[0].toLowerCase()+".";
	}
	str += '<br>';
	return str;
};

function Punch(){
	this.maxUses = true;
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
	this.validTypes = ["Iron","Cursed","Fire","Wood"];
	type = plinko(type,this.validTypes);
	this.sprite = "slash1";
	this.attackType = "physical";
	this.verbs = ['slash','strike','stab','lance','wound','cut'];
	var simpleSword = "IwNgHqA+AMt/DFOS18BMw20+7v9g9liDUijtpLsss17pjlgg";
	var avatarSword1 = "IwNgHgLAHAPgDAxTktWtx0s1pPcL4FG4lZnoWrA0EIBMdDTLrb7HnX3PvfyVai0HZhYpiIETadRkzlwgA===";
	this.smallSprite = simpleSword;
	this.avatarSprite = avatarSword1;
	this.userTraits = ['STR'];
	switch (type){
		case "Iron":
			this.maxUses = 30;
			this.breakVerb = "breaks on impact";
			this.displayName = "a modest but functional iron blade";
			this.shortName = "Iron Sword";
			this.color = "#008888";
			this.attackVal = function(){
				var diceNum = Math.round((this.owner.stats.str / 4)*1.5);
				return roll(diceNum+"d3") - 2;	
			};
			break;
		case "Cursed":
			this.maxUses = 30;
			this.breakVerb = "explodes with a loud noise";
			this.displayName = "a dark, sinister looking weapon";
			this.shortName = "Cursed Sword";
			this.color = "#4428bc";
			this.attackType = "shadow";
			this.resists = { light: 1.25};
			this.buffs = ["Paralyzed"];
			this.immunities = ['Regenerating'];
			this.attackVal = function(){
				var diceNum = Math.round((this.owner.stats.str / 4)*1.5);
				return roll(diceNum+"d3") - 2;	
			};
			break;
		case 'Fire':
		case "Flame":
			this.maxUses = 25;
			this.breakVerb = "glows red-hot, shatters,";
			this.displayName = "a shining red sword that smells of sulfur";
			this.shortName = "Flame Sword";
			this.color = "#f87858";
			this.attackType = "fire";
			this.buffArr = ["Aflame",8];
			this.attackVal = function(){
				var diceNum = Math.round((this.owner.stats.str / 4)*1.5);
				return roll(diceNum+"d3") - 1;	
			};
			break;
		case "Wood":
		default:
			this.flammable = true;
			this.breakVerb = "splinters into bits";
			this.maxUses = 20;
			this.displayName = "a wooden sword meant for practice";
			this.shortName = "Wooden Sword";
			this.color = "#f8b800";
			this.attackVal = function(){
				var diceNum = Math.round(this.owner.stats.str / 4);
				return roll(diceNum+"d3");	
			};
			break;
	}
}
Sword.prototype = new Weapon();
Sword.prototype.constructor = Sword;

function Buckler (type) {
	this.validTypes = ["Iron","Mirror",'Ruby',"Wood"];
	type = plinko(type,this.validTypes);
	this.sprite = "kapow";
	this.attackType = "physical";
	this.verbs = ['bash','strike','slam','bludgeon','ram'];
	var buckler1 = "IwNgHqA+AMt/DFObYaWuAJh+p2s0Dh9CjsSELy1CqzqL6bbL5HXSHdlbc3eeaEA=";
	var avatar1 = "IwNgHgLAHAPgDAxTktW9HNez3fHA7DHbGFbABM5mZpJp+TzLrb7HnX3PvSNtBoIHoqItHQpDaQA=";
	this.smallSprite = buckler1;
	this.avatarSprite = avatar1;
	this.drawLvl = 'top';
	this.userTraits = ['STR'];
	this.stats = {block: 1};
	switch (type){
		case "Iron":
			this.maxUses = 30;
			this.breakVerb = "cracks into two";
			this.displayName = "a small, battered metal shield";
			this.shortName = "Iron Buckler";
			this.color = "#008888";
			this.attackVal = function(){
				return rollHits(this.owner.stats.str+'d5',5);	
			};
			break;
		case "Mirror":
			this.maxUses = 30;
			this.breakVerb = "splits with a thunderous crack";
			this.displayName = "a small, polished, and gleaming shield";
			this.shortName = "Mirrored Buckler";
			this.color = "#a4e4fc";
			this.attackType = "light";
			this.resists = { shadow: 0.8 };
			this.immunities = ['Paralyzed'];
			this.attackVal = function(){
				return rollHits(this.owner.stats.str+'d6',6);	
			};
			break;
		case 'Ruby':
		case 'Fire':
		case "Flame":
			this.maxUses = 25;
			this.breakVerb = "glows red-hot, shatters,";
			this.displayName = "a small shield made of a deep crimson crystal";
			this.shortName = "Ruby Buckler";
			this.color = "#881400";
			this.attackType = "fire";
			this.resists = { fire: 0.75 };
			this.attackVal = function(){
				return rollHits(this.owner.stats.str+'d5',5);
			};
			break;
		case "Wood":
		default:
			this.flammable = true;
			this.breakVerb = "splinters into bits";
			this.maxUses = 20;
			this.displayName = "a small, disposable wooden shield";
			this.shortName = "Wooden Buckler";
			this.color = "#f8b800";
			this.attackVal = function(){
				return rollHits(this.owner.stats.str+'d8',8);	
			};
			break;
	}
}
Buckler.prototype = new Weapon();
Buckler.prototype.constructor = Buckler;

function Axe (type) {
	this.sprite = 'slash1';
	this.attackType = "physical";
	this.verbs = ['strike','hit','chop','hack','cleave'];
	this.ranged = true;
	var simpleAxe = "IwNgHqA+AMt/DFOS1xWOOjsvbQEx4ErAnRmnnTWa1U4UFA==";
	var avatarSimple= "IwNgHgLAHAPgDAxTktW9HOeFux+5467EmF7kBMVN5d9DjTzLrb7H7pG+3Pf6AYPJC01QuNySgA==";
	var axe2 = "";
	this.smallSprite = simpleAxe;
	this.avatarSprite = avatarSimple;
	switch (type){
		case "Brass":
		default:
			this.maxUses = 10;
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
	this.validTypes = ["Wood","Poison"];
	type = plinko(type,this.validTypes);
	this.sprite = 'star';
	this.attackType = "physical";
	this.verbs = ['strike','hit','bullseye','arrow','snipe'];
	this.ranged = true;
	var simpleBow = "IwNgHqA+AMt/DFOS11gYyrsBM359lhDUS8y4iDpqC7sHsg==";
	var avatarSimple = "IwNgHgLAHAPgDAxTktW9HNc8bCBMu2+cRmJZGJpW1ladtC9qj5NTLrXqPe/AwUOEjRY8Xj4pCeCsQ7sF6NlWZMlDNeymI5tHYiJA";
	var bow2 = "";
	this.smallSprite = simpleBow;
	this.avatarSprite = avatarSimple;
	switch (type){
		case "Poison":
			this.flammable = true;
			this.maxUses = 20;
			this.attackType = 'poison';
			this.breakVerb = "is bent, arrowless";
			this.displayName = "a oily green bow whose arrows are laced with a toxic venom";
			this.shortName = "Poison Bow";
			this.color = "#005800";
			this.buffArr = ["Poisoned",3];
			this.resists = {poison: 0.75};
			this.userTraits = ['AGI'];
			this.attackVal = function(){
				var agi = this.owner.stats.agi;
				return rollHits( (agi) + "d5",5);
			};
			break;
		case "Wood":
		default:
			this.flammable = true;
			this.maxUses = 20;
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
	this.validTypes = ["Thunder","Wood"];
	type = plinko(type,this.validTypes);
	this.sprite = 'kapow';
	this.attackType = "physical";
	this.verbs = ['strike','bludgeon','bash','thwack','smack'];
	var plainStick = "IwNgHqA+AMt/DFOgJmYlx309uu9UtCC9Ttz1LlqlaNiysg==";
	var avatarPlain = "IwNgHgLAHAPgDAxTktWtx0s1pPcL4FG4lZnoUYGJWp3Y2FNwPJt4se0u9/8DBjJt2YiuE8VJqjWkmfOKLSy8oiA=";
	var decoStick = "IwNgHqA+AMt/DFOcgTMF9itZ26M91cjs9YzzCryLbpq9HNmVCg==";
	var avatarDeco = "IwNgHgLAHAPgDAxTktWtx3OAJk1xfAhI40g8rS9atHYxehuJh1s5uW1blX7ToKHCRosUP6E8zSYU6yS8pc3YFVWdek0ZlDBV11A=";
	this.smallSprite = plainStick;
	this.avatarSprite = avatarPlain;
	switch (type){
		case 'Lightning':
		case "Thunder":
			this.ranged = true;
			this.smallSprite = decoStick;
			this.avatarSprite = avatarDeco;
			this.maxUses = 25;
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
			this.flammable = true;
			this.maxUses = 20;
			this.breakVerb = "snaps like a twig";
			this.displayName = "a solid, wooden staff";
			this.shortName = "Wooden Staff";
			this.color = "#f8b800";
			this.userTraits = ['STR','AGI'];
			this.stats = {block: 1};
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
	this.validTypes = ["Venom","Sleeper","Bone"];
	type = plinko(type,this.validTypes);
	this.sprite = 'claws';
	this.attackType = "physical";
	this.targetStat = "HP";
	this.verbs = ['maul','savage','lacerate','wound','lunge at'];
	this.smallSprite = "IwNgHqA+AMt/DFKcATMxaMK/XPgd0VC59tphSLYqb66bGniX7L0g";
	this.avatarSprite = "IwNgHgLAHAPgDAxTktW9HNez3f8FzC7DGHkWVXU2130ONPPVnakJA===";
	switch (type){
		case 'Poison':
		case "Venom":
			this.maxUses = 10;
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
		case "Sleeper":
			this.maxUses = 10;
			this.breakVerb = "is hollowed out, broken";
			this.displayName = "a pair of needle-like fangs dripping with noxious poison";
			this.shortName = "Sleeper Fang";
			this.color = "#00e8d8";
			this.userTraits = ['CHA','AGI'];
			this.attackType = "poison";
			this.buffArr = ["Paralyzed",4];
			this.attackVal = function(){
				var cha = this.owner.stats.cha;
				var agi = this.owner.stats.agi;
				return roll( Math.ceil((cha + agi)/12) + 'd4');	
			};
			break;
		case "Bone":
		default:
			this.maxUses = 10;
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
	this.validTypes = ["Fire","Acid"];
	type = plinko(type,this.validTypes);
	this.sprite = 'splat';
	this.attackType = "physical";
	this.verbs = ['splash','douse'];
	this.smallSprite = "IwNgHqA+AMt/DFOQ4wBMLZp8ZvM1F1c9oj5STZrKSMLp7sH7H1Ny0PTECCk/boP6d8HDnCA=";
	this.avatarSprite = "IwNgHgLAHAPgDAxTktW9HNez3f9LA7ABMxuR2wlW1NGJpOZBrb7HnX3Pvf/yehiZUKFIWjrZGLLLKA==";
	switch (type){
		case 'Flame':
		case "Fire":
			this.maxUses = 15;
			this.breakVerb = "is empty, starting to smell,";
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
			this.maxUses = 30;
			this.breakVerb = "melts into a puddle of goo";
			this.displayName = "a Box Jelly's acid generating organ: pretty useless as a weapon";
			this.shortName = "Acid Bladder";
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
	this.drawLvl = 'bottom';
	this.selfTargeted = true;
	this.natural = 0;
	this.buffArr = [];
	this.maxUses = 1;
	this.hurts = false;
	this.targetStat = "HP";
	this.amountDmg = "a random amount of";
	this.attackVal = function(){return 0;};
	this.itemType = "Consumable";
}
Consumable.prototype = new Item();
Consumable.prototype.constructor = Consumable;

Consumable.prototype.infoStr = function(){
	if (this.unique === true){
		return "";
	}
	var verb = (this.hurts)? 'Damages' : 'Heals';
	var str = verb + " you for "+this.amountDmg+ ' ' +this.targetStat.toUpperCase()+'.';
	if (this.buffArr.length > 1){
		var odds = (this.buffArr[1] > 1)? " 1 in "+this.buffArr[1]+" chance to cause" : " Causes";
		str += odds + " you to be "+this.buffArr[0].toLowerCase()+".";
	}
	str += '<br>';
	return str;
};

function Bomb (type) {
	this.validTypes = ["Smoke","Fire"];
	type = plinko(type,this.validTypes);
	this.unique = true;
	this.sprite = 'cloud';
	this.verbs = ['detonate','toss','light'];
	var bomb1 = "IwNgHqA+AMt/DFNgJmfFmnB8abtdcCEiy9TzdKrq5aj5gVaWmWq32OdMLvMgrpSE500RrCA=";
	var avatar1 = "IwNgHgLAHAPgDAxTktW9HNez3f/IBM2wwOpBlV1Ntd9DjTzLr9xWFJZcQA==";
	this.smallSprite = bomb1;
	this.avatarSprite = avatar1;
	this.breakVerb = "is empty";
	switch (type){
		case "Smoke":
			this.maxUses = 1;
			this.breakVerb = "is spent";
			this.displayName = "small explosives that do no damage but create a distracting cloud of smoke";
			this.shortName = "Smoke Bomb";
			this.uniqueStr = "a smoke bomb";
			this.color = '#6844fc';
			this.buffArr = ["Obscured",1];
			this.attackVal = function(){
				this.owner.effectController.displayDamage('cloud', 'rgba(152,120,248,0.8)');
				this.owner.wiggle('hit', 250);
				return 0;
			};
			break;
		case 'Flame':
		case "Fire":
		default:
			this.smallSprite = "IwNgHqA+AMt/DFwExKcVxhvl5zsd4Ci4tTYNCc9q0MSiHH7am2aP26m4g===";
			this.avatarSprite = "IwNgHgLAHAPgDAxTktW9HNez3f8FwBMuwpZ2wFhNtd9DjTzLrb79JO1WV3FQA===";
			this.maxUses = 5;
			this.displayName = "crude, unpredictable incendiary devices made from rubbish";
			this.shortName = "Sack of Fire Bombs";
			this.uniqueStr = "a fire bomb";
			this.attackType = "fire";
			this.targetStat = "HP";
			this.color = '#006800';
			this.attackVal = function(){
				this.owner.getEnemy().addBuff('Aflame');
				this.owner.getEnemy().explode(roll('2d5'),'fire');
				this.owner.getEnemy().effectController.displayDamage('flame', 'rgba(248,56,0,0.5)');
				this.owner.getEnemy().wiggle('hit', 250);
				var oops = (roll('1d4') === 4)? true : false;
				if (oops){
					this.owner.addBuff('Aflame');
					this.owner.explode(roll('2d5'),'fire');
					this.owner.effectController.displayDamage('flame', 'rgba(248,56,0,0.5)');
					this.owner.wiggle('hit', 250);
				}
				return 0;
			};
			break;
	}
}
Bomb.prototype = new Consumable();
Bomb.prototype.constructor = Bomb;

function Potion(type){
	this.validTypes = ["Health","Regen"];
	type = plinko(type,this.validTypes);
	this.maxUses = 1;
	this.sprite = "poof";
	this.breakVerb = "is empty";
	this.shortName = "Potion of ";
	var roundBottleSprite = "IwNgHqA+AMt/DFOS5x0ddYAmbXs9gDd9VTZi094qFcdGmc65cMMXF2P2kHmrer2hA===";
	var avatarBottle = "IwNgHgLAHAPgDAxTktW9HNez3f8FwBMuwpZ2wFhNtd9DjTzLrb79JO1WV3FQA===";
	this.smallSprite = roundBottleSprite;
	this.avatarSprite = avatarBottle;
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
	this.validTypes = ["Steroids","Opiates"];
	type = plinko(type,this.validTypes);
	this.maxUses = 1;
	this.sprite = "poof";
	this.breakVerb = "is used-up";
	this.shortName = "Vial of";
	this.smallSprite = "IwNgHqA+AMt/DHQEyuU+wvY3Yt9cDijpDCjzSz0LdhU6MHkmkW3EPrvTe+KQA===";
	switch (type){
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
			this.attackVal = function(){
				return roll('1d5');
			};
			break;
		default:
		case "Opiates":
			this.hurts = false;
			this.displayName = 'a tiny vial of powerful pain-killers';
			this.attackType = 'poison';
			this.targetStat = 'HP';
			this.amountDmg = 'your entire';
			this.color = '#00e8d8';
			this.shortName += " Opiates";
			this.buffArr = ["Sedated",2];
			this.verbs = ['medicate'];
			this.attackVal = function(){
				return this.owner.stats.maxHP * -1;
			};
			break;
	}
}

Vial.prototype = new Consumable();
Vial.prototype.constructor = Vial;

function Food(type){
	this.validTypes = ["Spinach","Rotten","Meat"];
	type = plinko(type,this.validTypes);
	this.maxUses = 1;
	this.sprite = "poof";
	this.breakVerb = "is consumed";
	this.verbs = ['eat','smash','chow down','consume'];
	var meatSprite = "IwNgHqA+AMt/DFOY4aWzVgTCrO9htsjdki1jDKrzTbyG8yNojW32Ppsg";
	var canSprite = "IwNgHqA+AMt/DHWC4S4oEzcypwdDdFVDUTtUDiFqib5Sdzaq2S2qPO9bKm0feg0Z1cg9F2hA";
	switch (type){
		case "Spinach":
			this.smallSprite = canSprite;
			this.displayName = "a tin of creamed spinach: unpleasant but hearty.";
			this.attackType = 'physical';
			this.targetStat = 'maxHP';
			this.color = '#00a844';
			this.amountDmg = '2-10';
			this.shortName = "Can of Spinach";
			this.buffArr = ["Juiced",5];
			this.attackVal = function(){
				return roll('2d5') * -1;
			};
			break;
		case "Rotten":
			this.smallSprite = meatSprite;
			this.displayName = 'a hunk of raw, slightly decomposed meat';
			this.attackType = 'physical';
			this.targetStat = 'HP';
			this.color = '#b8f8b8';
			this.amountDmg = '12-20';
			this.shortName = "Questionable Meat";
			this.buffArr = ["Poisoned",3];
			this.attackVal = function(){
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
			this.attackVal = function(){
				return -20;
			};
			break;
	}
}

Food.prototype = new Consumable();
Food.prototype.constructor = Food;

// Wearables are items that can be equipped to modify stats and resistances

function Wearable(){
	this.selfTargeted = false;
	this.maxUses = true;
	this.flammable = false;
	this.ranged = false;
	this.stats = {};
	this.resists = {};
	this.buffs = [];
	this.immunities = [];
}
Wearable.prototype = new Item();
Wearable.prototype.constructor = Wearable;

Wearable.prototype.infoStr = function(){
	return "";
};

// Armor are wearables. They can only be equipped if the Character has no other Armor on.

function Armor(){
	this.itemType = "Armor";
}
Armor.prototype = new Wearable();
Armor.prototype.constructor = Armor;

function Nude(){
	this.maxUses = true;
	this.smallSprite = "";
	this.color = 'white';
	this.displayName = "just as god made ya'";
	this.shortName = "Birthday Suit";
	this.stats = { cha: 1 };
}
Nude.prototype = new Armor();
Nude.prototype.constructor = Nude;

function Cloth(type){
	this.validTypes = ["Robes","Shirt","Rags"];
	type = plinko(type,this.validTypes);
	this.flammable = true;
	this.breakVerb = "is shredded beyond recognition";
	var shirtSprite = "IwNgHqA+AMt/DFOSlxbrcATMHek89tcjEiKz4DjToC4bL7MFLXz2O3nULYgA";
	var avatarShirt = "IwNgHgLAHAPgDAxTktW9HNezzAmBAjYYPPE9Eqq464TGrRhi3N9jzr7n3v/gYIFEilUuXpo6zVNJaT52KkA=";
	var robe1Sprite = "IwNgHqA+AMt/DG2MJjgCYOrcrWddNtdoVtMUkVyKqEbGaHUnXCz3HPqmi2O8AYOTCRnNqW7QgA==";
	var avatarRobe1 = "IwNgHgLAHAPgDAxTktW9HNezzwBM+weBRx6wlZ5Kld9qlcdCTy5h+iN3zDG9Ho35pBbYYNxTpM2XPkLFS5TlJDaa9Uioj2Y8duKdW64pOa0+LAbo3mJ/IA==";
	this.stats = { phys: 1 };
	this.smallSprite = shirtSprite;
	this.avatarSprite = avatarShirt;
	switch (type){
		case 'Robes':
			this.smallSprite = robe1Sprite;
			this.avatarSprite = avatarRobe1;
			this.stats.magi = 1;
			this.color = '#0000bc';
			this.maxUses = 30;
			this.displayName = "a garment made for apprentice spellcasters";
			this.shortName = "Magician's Robe";
			break;
		case 'Shirt':
			this.color = '#a4e4fc';
			this.maxUses = 30;
			this.displayName = "a decently sewn linen garment";
			this.shortName = "Linen Tunic";
			break;
		default:
		case 'Rags':
			this.color = '#503000';
			this.maxUses = 20;
			this.displayName = "a few scraps of burlap and linen";
			this.shortName = "Sackcloth Tunic";
			this.resists = { fire: 1.25 };
			this.immunities = ['Regenerating'];
			break;
	}
}
Cloth.prototype = new Armor();
Cloth.prototype.constructor = Cloth;

function Plate(type){
	this.validTypes = ["Silver","Brass"];
	type = plinko(type,this.validTypes);
	var hornedSprite = "IwNgHqA+AMt/DFOSpxro1xxcCZ9dM5Dg8Czd5zKiDz4qL8NjWMKD2cyKVS+yfIP5FYQA";
	var hornedAvatar = "IwNgHgLAHAPgDAxTktW9HNezjwBMC+w6+xwFZ6BlF1B5JedWZhmtT1hxe7cvVAWSDcY8RMlTpM2XPkLhArijIVK/FDW301LUlQ46+yk0RVIliXkA";
	this.breakVerb = "falls dented and broken to the ground";
	this.stats = { phys: 2 };
	this.smallSprite = hornedSprite;
	this.avatarSprite = hornedAvatar;
	switch (type){
		case 'Silver':
			this.color = "#d8d8d8";
			this.stats = { phys: 1, block: 2 };
			this.maxUses = 25;
			this.immunities = ['Aflame'];
			this.resists = { fire: 0.75, lightning: 0.75 };
			this.displayName = "thin, reflective armor polished with flame-resistant oils";
			this.shortName = "Silver Armor";
			break;
		default:
		case 'Brass':
			this.color = "#f8d878";
			this.maxUses = 15;
			this.stats = { phys: 2, block: 2 };
			this.displayName = "shiny, brass plates formed into a decorative, muscular, but somewhat flimsy chestplate";
			this.shortName = "Brass Platemail";
			break;
	}
}
Plate.prototype = new Armor();
Plate.prototype.constructor = Plate;

// Accessories are wearables. They can only be equipped if the Character has no other Accessory on.

function Accessory(){
	this.itemType = "Accessory";
}
Accessory.prototype = new Wearable();
Accessory.prototype.constructor = Accessory;

function Nothing(){
	this.maxUses = true;
	this.smallSprite = "";
	this.color = 'white';
	this.displayName = "a whole lot of it";
	this.shortName = "Nothing";
	this.stats = { };
}
Nothing.prototype = new Accessory();
Nothing.prototype.constructor = Nothing;

function Ring(type){
	this.validTypes = ["Emerald","Fire","Wood","Brass"];
	type = plinko(type,this.validTypes);
	var ring1 = "IwNgHqA+AMt/DFOS1x2uugTLjT9ZthlCiSF0K5jEdrpbLimtSWqH56rNfYgA";
	this.smallSprite = ring1;
	switch (type){
		case 'Alert':
		case 'Emerald':
			this.stats = { agi: 1 };
			this.immunities = ['Paralyzed','Sedated'];
			this.color = "#00b800";
			this.maxUses = 20;
			this.breakVerb = "melts into thin air";
			this.displayName = "a brilliant green ring that tingles on your finger";
			this.shortName = "Ring of Alertness";
			break;
		case 'Flame':
		case 'Fire':
			this.resists = { fire: 0.80 };
			this.buffs = ['Aflame'];
			this.color = "#881400";
			this.maxUses = 20;
			this.breakVerb = "crumbles into soot";
			this.displayName = "a ring encircled in dim flames, and scorching to the touch";
			this.shortName = "Flaming Ring";
			break;
		case 'Brass':
			this.stats = { str: 1 };
			this.color = "#f8d878";
			this.maxUses = 20;
			this.breakVerb = "is tarnished, worn, and dull";
			this.displayName = "a shiny, brass ring: not very useful, but wearing it gives you a sense of confidence";
			this.shortName = "Brass Ring";
			break;
		default:
		case 'Wood':
			this.flammable = true;
			this.stats = { maxHP: 5 };
			this.color = "#f8b800";
			this.maxUses = 30;
			this.breakVerb = "snaps in half";
			this.displayName = "a solid, oaken ring: not very useful, but wearing it gives you a feeling of fortitude";
			this.shortName = "Wood Ring";
			break;
	}
}
Ring.prototype = new Accessory();
Ring.prototype.constructor = Ring;

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
		chaos: "GwFgHgTCA+AM8MU5LVvRzXs93/BhRxqAjOeSVepYrdQ7KfBK6/MyhfY2pxEgFNknBKN5dYQii2F0W7OWR4Fm0sbNH8E6yR2Jq56gVqn6z4jWaX5DhkxY0O7kgQ8Ivrn4bvdJtNniGStqm1l5kVkTBMo7yUoqW/iqqsoi68VESemyJyrHZfJYphR7c8EA",
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

// Conversation Library

var convoLib = {
	testConvo: {
		text: "DIewTgpgtgBAlgBwM4FdYBMQBtwyXAFxgEMoICAaGAYxADskJqDyUwT1E59q46BzGBCyEqjdDExC4KJFBASWUBLj69O6FHSIoiWYgCNwEIUUw5IMKMX51iJEQEcUxAHQwAqkQh04sYhJQfH4wAG4+cKRUztwwdCBIBGAoEhAAHhBgvATEBHD0MChY+lC0MPpGYLG++IVExE4oiEJpQva0UPJStAwQzrnuACJNSCS6JnDJluaqdDCQCJAAFj7omYTwc6HYKAg5LGHCGxBIjDRwxWiS2MZCKDAAZij8kUR0RfowCMRVuWzuAFE0tQIHsIGw8HwiCBqNRiExcjRdnB0LlEfE5osQCifJQ8FoiHwkVhvjAYjAQA8HnBePY1oxktorNgRPVfLAUUJEuVDOA0K4gA=",
		buttons: [['Close Dialog','router zilch','suggest']]
	},
	smallTalk1: {
		text: "MoewBAFiDuYIYCMQFcAuZUQJYGczQFM5MCAnfAgclIMjgDcsA7AcwH4wBxG4gGkmQQOAITT4IxMABNwASTABrJjH6zKAWzAArZDnRwwADWOGAdEA",
		buttons: [['Uh huh...','router nextMonster'],['And so warm for April!','router nextMonster']]
	}
};

function lookupConvo(convo_id){
	var talkObject = {};
	if(convoLib.hasOwnProperty(convo_id)){
		talkObject = convoLib[convo_id];
		return talkObject;
	}else{

	}
}


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

currentGame.chooseClass();
