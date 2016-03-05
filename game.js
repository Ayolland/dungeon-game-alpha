
// Helper functions


// Returns a random element from an array
function randomEntry(array){
	return array[Math.floor(Math.random()*array.length)];
}

function roll(diceStr){
	var diceNum = diceStr.slice(0,diceStr.indexOf("d"));
	var diceSides = diceStr.slice(diceStr.indexOf("d")+1);
	var totalRoll = 0;
	for (var i = diceNum - 1; i >= 0; i--) {
		totalRoll += (Math.floor(Math.random()*diceSides)+1);
	}
	return totalRoll;
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

var currentGame = new Game();

function Game (){
	this.log = {
		element: document.getElementById('gameLog'),
		add: function(message){
			this.element.innerHTML += (message + '<br />');
			this.element.scrollTop = this.element.scrollHeight;
		}
	};

	this.currentLevel = new Level();
	this.playerHero = new Hero('TEMP');
	this.currentMonster = new Monster();
	this.previousMonsterName = "";

	this.initialize = function(){
		this.currentLevel.draw()
		this.playerHero.draw();
		this.playerHero.updateHP();
		this.switchMonster();
	};

	this.enterMonster = function(monsterType){
		this.previousMonsterName = this.currentMonster.displayName;
		var newMonster = new window[monsterType];
		newMonster.div.className = "";
		newMonster.appear();
		this.currentMonster = newMonster;
	};
	this.switchMonster = function(){
		var monsterType = randomEntry(["Axedude","Balltype","Scamp","Skele","Snek","Werebeing","Mage"]);
		currentGame.enterMonster(monsterType);
	};
	this.attack = function(){
		document.getElementById('interface').className = "wait";
		var heroAtkVal = Math.floor(Math.random()*4) + 1;
		var monsterAtkVal = Math.floor(Math.random()*4) + 1;
		if ((this.currentMonster.HP > 0)&&(this.playerHero.HP > 0)){
			if ( (roll('1d20') + this.currentMonster.stats.agi - this.playerHero.stats.agi) >= 20){
				this.currentMonster.dodge();
			} else {
				this.currentMonster.hit(heroAtkVal);
			}
		}
		if ((this.currentMonster.HP > 0)&&(this.playerHero.HP > 0)){
			setTimeout(function(){
				if ( (roll('1d20') + currentGame.playerHero.stats.agi - currentGame.currentMonster.stats.agi) >= 20){
					currentGame.playerHero.dodge();
				} else {
					currentGame.playerHero.hit(monsterAtkVal);
				}
			},1500);
		}
		setTimeout(function(){document.getElementById('interface').className = "";}, 2000);	

	};

}

// A Displayable is an object with an associated canvas for drawing sprites
function Displayable (){
}

Displayable.prototype.constructor = Displayable;

Displayable.prototype.draw = function(){
	var rawStr = LZString.decompressFromBase64(this.spriteCompressed);
    var binary = (rawStr.slice( rawStr.indexOf('|') + 1));
    var spriteWidth = rawStr.slice( 0, rawStr.indexOf('x'));
    var spriteHeight = rawStr.slice( rawStr.indexOf('x') + 1 , rawStr.indexOf('|') );
    this.canvas.clearRect(0,0,spriteWidth,spriteHeight);
    this.canvas.fillStyle = this.color;
    for (var i=0; i < binary.length; i+=1){
    	if (binary.slice(i,i+1) == 1){
    		var row = Math.floor(i / spriteWidth );
    		this.canvas.fillRect( (i - row * spriteWidth ), row, 1, 1 );
    	}
    }
};

// A level is an object that stores the background image and the possible monsters

function Level(){
	this.canvas = document.getElementById('level-sprite').getContext('2d');
	this.spriteCompressed = "BwBgHgLCA+CM8MU5LVvRzCQi3/qORxJ2JuuBV1Z5xNDjTzLjOsFlhKnXrzFDojod2ddvwFCu40fXKSpg+LPFEhittLIqkvBX00FBM9WpESdGo8hO195+rvXabw13Idq5K0hsNGdtJi3q6UYs7WbtoBUU7y4WbhUW5BngmO6aKR0ZGmBo6JITm5aYXmWRJpNmUWfnEu7rGaQXwy6UkVHrkeGRWFJT3Knh11Xe09ur4hmaQKMZPDffPWhm3dgRtT0zPL2QvRteVjEXbN/K3Hqgl5pWFXJ5y3h/fl7u9xW4rV9iM+c8UDqlep0vLsvM9gUtvJ1Kn4fjVVjCTA4dtgvpIjqjGjxuMNEfjcW0ClVkoSWiCSflQU8gQSGgD2stlKdzgIUfYkilbJZJsZ5Gwut9ZPzkZlWG8dgogA==";
	this.monsterArray = ["Axedude","Balltype","Scamp","Skele","Snek","Werebeing","Mage"];
	this.shortName = "dungeon";
	document.body.className = this.shortName;
}

Level.prototype = new Displayable ();
Level.prototype.constructor = Level;

// A Character is either a Monster (NPC) or the Hero

function Character (){	
}

Character.prototype = new Displayable ();
Character.prototype.constructor = Character;

Character.prototype.updateHP = function(){
	if (this.HP < 1){
		this.HP = 0;
	}
	this.displayElement.hpText.innerHTML = this.HP + "/" + this.maxHP;
	var percentage = Math.floor((this.HP / this.maxHP)*100);
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
	this.maxHP = 50;
	this.HP = this.maxHP;
	this.stats = {
		str: 8,
		agi: 8,
		int: 8,
		cha: 8
	};
	this.kills = 0;
	this.spriteCompressed = "IwNgHgLAHAPgDAxTktW9HNfcY267a6EbHGlkkp6VVJ4EnmIOOs5maVc3vWt1kVQfSFpBI/FOkzZc+QsUJJqFUOYdOmrdTY7RbZXQbcKG8bwos+9ATZZjVfKkA===";
	this.color = "white";
}

Hero.prototype = new Character ();
Hero.prototype.constructor = Hero;

Hero.prototype.hit = function(atkVal){
	this.HP -= atkVal;
	this.wiggle('hit', 250);
	currentGame.log.add('The '+ currentGame.currentMonster.shortName +' hit you for ' + atkVal + 'HP.');
	this.updateHP();
};

Hero.prototype.dodge = function(){
	this.wiggle('dodge', 500);
	currentGame.log.add("You dodge the "+ currentGame.currentMonster.shortName +"'s attack.");
};

Hero.prototype.die = function(){
	this.addClass('dead');
	currentGame.log.add('You were slain by the ' + currentGame.currentMonster.shortName + '.');
	setTimeout(function(){
		currentGame.log.add('You slayed ' + currentGame.playerHero.kills + ' monsters before perishing.');
	},2000);
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
	var message = "It's " + article + this.displayName + '!';
	currentGame.log.add(message);
	if (this.shortName === ""){
		this.shortName = this.displayName;
	} 
	this.displayElement.name.innerHTML = this.shortName;
};

Monster.prototype.appear = function(){
	this.announce();
	this.draw();
	this.HP = this.maxHP;
	this.updateHP();
};

Monster.prototype.die = function(){
	this.addClass('dead');
	currentGame.log.add('You slayed the ' + this.shortName + '.');
	currentGame.playerHero.kills ++;
	setTimeout(currentGame.switchMonster, 2000);
};

Monster.prototype.hit = function(atkVal){
	this.HP -= atkVal;
	this.wiggle('hit', 250);
	currentGame.log.add('You hit the ' + this.shortName + ' for ' + atkVal + 'HP.');
	this.updateHP();
};

Monster.prototype.dodge = function(){
	this.wiggle('dodge', 500);
	currentGame.log.add('The ' + this.shortName + ' dodges your attack.');
};

// Types of Monsters

function Axedude (type) {
	this.maxHP = 20;
	this.stats = {
		str: 10,
		agi: 5,
		int: 5,
		cha: 2
	};
	this.spriteCompressed = "IwNgHgLAHAPgDAxTktW9GnG8ZvG475Y4FzFkUUJFHl62nWO0ovnap01ff1us0LajSacRHAvhGcpQqhP5ZeAzGvUbNW7Tsx8elUg1n0ZS86MYXhhY8IGsjdsg5MSr8j86YrLFyXJcbL4kumHqQA==";
	this.displayName = "Axedude";
	this.color = 'yellow';
}
Axedude.prototype = new Monster();
Axedude.prototype.constructor = Axedude;

function Balltype (type) {
	this.maxHP = 15;
	this.stats = {
		str: 7,
		agi: 7,
		int: 1,
		cha: 1
	};
	this.spriteCompressed = "IwNgHgLAHAPgDAxTktW9HNbcXncF6qEkqFzAUHLWV1EKmPnN51UNvu1L0nuJKHahWJVR+RliHYZ2eQsVLlK1Wtb5+Ofg0E6Re2i1ZthMrVuZmeg66dvWpZcXJxOMrj+u8/fGIA==";
	this.displayName = "Gooball";
	this.color = 'purple';
}
Balltype.prototype = new Monster();
Balltype.prototype.constructor = Balltype;

function Scamp (type) {
	this.maxHP = 10;
	this.stats = {
		str: 2,
		agi: 12,
		int: 10,
		cha: 8
	};
	this.spriteCompressed = "IwNgHgLAHAPgDAxTktW9HNbcY2G7a6EbHFYmll47WVI1kHpNWu170qU2q/P5BQ4SNFjxEyVypFybOTMx0WdfokZy1ydhwV9C0hry3rtk8xcuIgA=";
	this.displayName = "Scamp";
	this.color = 'darkgreen';
}
Scamp.prototype = new Monster();
Scamp.prototype.constructor = Scamp;

function Skele (type) {
	this.maxHP = 12;
	this.stats = {
		str: 6,
		agi: 6,
		int: 6,
		cha: 2
	};
	if ( type === ""){
		type = randomEntry(["Footman","Archer","Monk","Bruiser","Flaming"]);
	}
	this.color = 'white';
	switch (type){
		case "Footman":
			this.maxHP = 14;
			this.stats.str = 8;
			this.spriteCompressed = "IwNgHgLAHAPgDAxTktW9HPOGn3f7B5JGJHnFlV6mFwX2PWrklnGtX2ef5P99KLNukpC+CcSK5ZZc+QsVLlKjFIGSCbWiQ4VxHJjuYMcYjZON7257rV4jDKJ6JnC3ziZ5JA==";
			this.displayName = "Skelebones Footman";
			break;
		case "Archer":
			this.stats.agi = 9;
			this.spriteCompressed = "IwNgHgLAHAPgDAxTktW4aUY5xP/pLaFFzA57lXVWl5kIWPLVZ2YFlOn62oWdcgksw7t+4tpNwzZc+QsVKps4qtHd69TaO3caB8uLX6WfYzM5GJvayuETdInVqcq3knEA";
			this.displayName = "Skelebones Archer";
			break;
		case "Monk":
			this.stats.int = 9;
			this.spriteCompressed = "IwNgHgLAHAPgDAxTktW9HPOGn3f7B74JFnGLE55ErVzkN1PMkNWuMuGkb3e4O6ChVa9hbLFOkzZc+QsUTUogUlHVV3crTb9d6po1X9J49pU5lzhmn11bDNsWrOO1wIA=";
			this.displayName = "Wise, Old Skelebones";
			this.shortName = "Skelebones Mage";
			break;
		case "Bruiser":
			this.maxHP = 16;
			this.stats.str = 10;
			this.spriteCompressed = "IwNgHgLAHAPgDAxTktW9biKxux+o5JHIl55kXb40pFY4Gnk0PnbulML28mO0KldvUw9c/DJPTSxxXAsVLlK1WvUdxE7vOaFmOnn0G6WRui1psOwk5252BTO5tEWtMzXI/7T77EA=";
			this.displayName = "Skelebones who thinks he's a badass";
			this.shortName = "Skelebones Bruiser";
			break;
		case "Flaming":
			this.spriteCompressed = "IwNgHgLAHAPgDAxdhNW4KVqRj3GbJb7Kl4mGn6F7Hq7nVWOqa5XrZ0LGPfPsOnIUxHCeJIfxwyKrSQsVLlK1WSUsuRaazYKaOiVkMGxBBofVEmDM2f69ew23eb6C7iXI/efWnEA=";
			this.displayName = "Skelebones who is on fire";
			this.shortName = "Flaming Skelebones";
			this.color = "#ff5000";
			break;
		default:
			this.spriteCompressed = "IwNgHgLAHAPgDAxTktW9HPOFxPc7D7pGnGqEJFqGlzlINUrHXPZV30nsb5Mc8fRsKE8RuSVOkzZc+Qt5YBFeirxl13fitrVdqwWrESySwVu7mWJw9Ym2jVIA";
			this.displayName = "Skelebones";	
	}
}
Skele.prototype = new Monster();
Skele.prototype.constructor = Skele;

function Snek (type) {
	this.maxHP = 10;
	this.stats = {
		str: 9,
		agi: 12,
		int: 5,
		cha: 10
	};
	this.spriteCompressed = "IwNgHgLAHAPgDAxTktW9HNOD4HcHp6K6oGnHKULVXmaW0r0M1Zw4drWnPOdVs5ARzzCWo8b3YzZc+QsVKFhIsKJCmkwltpaaE7iQar8bLJyZWR2flc0TLUkc+nL3H9kA";
	this.displayName = "Snek";
	this.color = 'green';
}
Snek.prototype = new Monster();
Snek.prototype.constructor = Snek;


function Werebeing (type) {
	this.maxHP = 20;
	this.stats = {
		str: 12,
		agi: 7,
		int: 5,
		cha: 3
	};
	this.spriteCompressed = "IwNgHgLAHAPgDAxTktWpx0M8TWdaK7F6onkrlVlW422lFzV1F4lOfPHaOves+bHumqj2/Mm0JC0jZnMqFlK1WvUbRM7tvlyK+2pQaThY5Cb04KkwSIVcB1jBJGzzNXnozT8Pxf5KFpohqkA=";
	this.displayName = "Werebeing";
	this.color = 'lightgray';
}
Werebeing.prototype = new Monster();
Werebeing.prototype.constructor = Werebeing;

function Mage (type) {
	this.maxHP = 12;
	this.stats = {
		str: 5,
		agi: 8,
		int: 12,
		cha: 8
	};
	this.spriteCompressed = "IwNgHgLAHAPgDAxTktW97geV7dgEF75K4pG5ZmKGELU20Xn5Mk71GsMM0f3tBOKpTRV2vTtyGM2kprXIK6xVWvUbNWjJLHE2M/iXniBSxYe6LeI5fxWHdPAV0sUy843yXTHCs6R2PMqu2mHhCEA=";
	this.displayName = "Wiz";
	this.color = 'blue';
}
Mage.prototype = new Monster();



// event Listeners

function loadButtons(){
	var buttons = document.getElementsByClassName("button");
	for (var i=0; i < buttons.length; i+=1){
		var fnName = buttons[i].getAttribute('click-data');
		buttons[i].addEventListener("click", function(){currentGame[fnName]();});
	}
}

loadButtons();

// var tempHero = new Hero();
// tempHero.draw();
// switchMonster();
currentGame.playerHero = new Hero('Sandra');
currentGame.currentMonster = new Monster();
currentGame.previousMonsterName = "";
currentGame.currentLevel = new Level();

currentGame.initialize();
