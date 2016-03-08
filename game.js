
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

function thirdPerson(verb){
	switch (verb){
		case "bash":
		case "punch":
		case "slash":
			verb += 'es';
			break;
		default:
			verb += 's';
			break;
	}
	return verb;
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
var interfaceElement = document.getElementById('interface');

function Game (){
	this.log = {
		element: document.getElementById('gameLog'),
		add: function(message){
			this.element.innerHTML += (message + '<br />');
			this.element.scrollTop = this.element.scrollHeight;
		}
	};

	this.currentLocation = new Location();
	this.playerHero = new Hero('TEMP');
	this.currentMonster = new Monster();
	this.previousMonsterName = "";

	this.initialize = function(){
		this.currentLocation.draw(this.currentLocation.canvas, this.currentLocation.spriteCompressed);
		this.playerHero.initialize();
		this.switchMonster();
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
		this.currentMonster = newMonster;
	};
	this.switchMonster = function(){
		var monsterType = randomEntry(currentGame.currentLocation.monsterArray);
		currentGame.enterMonster(monsterType);
	};

	this.attack = function(){
		interfaceElement.classList.add("wait");
		var step = 0;
		var stepsArr = ["player turn","monster turn","end"];
		var turnInterval = setInterval(function(){
			switch (stepsArr[step]){
				case "player turn":
					var heroAtkObj = currentGame.playerHero.useHand1();
					if (currentGame.currentMonster.calcDodge()){
						currentGame.currentMonster.dodge();
					} else {
						currentGame.currentMonster.hit(heroAtkObj);
					}
					break;
				case "monster turn":
					if (currentGame.currentMonster.HP > 0) {
						var monsterAtkVal = currentGame.currentMonster.useHand1();
						if (currentGame.playerHero.calcDodge()){
							currentGame.playerHero.dodge();
						} else {
							currentGame.playerHero.hit(monsterAtkVal);
						}
					}
					break;
				case "end":
					if (currentGame.playerHero.HP > 0){
						interfaceElement.classList.remove("wait");
					}
					clearInterval(turnInterval);
					break;
			}
			step ++;
		},1000);
	};

}

// A Displayable is an object with an associated canvas for drawing sprites
function Displayable (){
}

Displayable.prototype.constructor = Displayable;

Displayable.prototype.draw = function(canvas,sprite){
	var rawStr = LZString.decompressFromBase64(sprite);
    var binary = (rawStr.slice( rawStr.indexOf('|') + 1));
    var spriteWidth = rawStr.slice( 0, rawStr.indexOf('x'));
    var spriteHeight = rawStr.slice( rawStr.indexOf('x') + 1 , rawStr.indexOf('|') );
    canvas.clearRect(0,0,spriteWidth,spriteHeight);
    canvas.fillStyle = this.color;
    for (var i=0; i < binary.length; i+=1){
    	if (binary.slice(i,i+1) == 1){
    		var row = Math.floor(i / spriteWidth );
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
			this.monsterArray = ["Axedude", "Ball Goo", "Skele Bones", "Skele Footman", "Mage"];
			break;
		case "Volcano":
			this.spriteCompressed = "BwBgHgLCA+CM8MUpJWpWz6308/sWBxJuRiIhWO6ZupF5peGTC1eLhD+Ht7fSgLZV6VfjlE9kg2XK5Txk7rSHTW8zW1XVGQ/uuFatRpQtOGZus8bJrlBvWssantxwedXHLuhs1iAhTM5r5eRnKBQezM0b7cBCYJesHEXuHx3pG8lM4ZUX6ZidmJij4FcUX+1qWeaWn5mSXeKLHFjS5MHQrlMSGhhgM5fCQdbiIMyqM9vcnSM+qzbhj1nRljlrPdYflLi43bO6NFU627J8fxuZfhGyGXm3uKMU8POYP2kzIVg22TdV8+j8eKdvl9JHcIalNkDhg9VPNxND5ulpuU8qD2n5XnZeKtPOlMVkOPtdgdscM9kQSf1Kb0JHMIh5BDYMSy7CMwT9jJyeXztMjWazqcyAvyWKiObj5P8ablOMSaRyFsKBhMmrJVWzleqqnT3Di9SdsJq7kbzfR5aggA==";
			this.monsterArray = ["Axedude","Ball Fire","Skele Monk","Skele Bruiser", "Were Hellbeast"];
			break;
		case "Forest":
			this.spriteCompressed = "BwBgHgLCA+IgjIpiF3muDnNZ9ftDNiCUtsTyiMbClca06dLTn8T3HcuyGq6rToL7DqHASIYd2oobInFmWMcvwtJFIWxxyd9RUzXCjy7acGtZVs4fXXzm8nn0p0crvyaaNnJRXp+EXc7S1CFQy8AgwkiPkUzLwtEpVV3AX9LGzDsh1S0kMDXJNcZbh9fcqdKqXlbJIiEpt0i/WdKTzdclPti1p12gsDK5OppMji9C0HM8SmK4cjJKm708LnIxpU63W2C1HWtftHPVZWOyYuczYU9s5DVh5dT9KGsnejHu8K4g6vb8xqG6fVLGV6zU7aIH/Fp+T69N5aQE5RFRDKiDxbZHwmHvSaxZoLMqIp4nJHLbaksniL4HAkA5JGAhiIlVFrqb68CYbZlsVmHVpPYJHfEEvlYiEqMXVNyy4X+UilXz4oJymIyQorXbOUlY6yYhk/YLjYEOfXNSHo+Ea/oRBYzan2UW/J0sRpcgwQoq2S5urLugGugN9WH2hUYI1SSMM0bLbmBtW3RMJ9XsxYRgPux2Z4U5vPO/OFov5oA=";
			this.monsterArray =["Axedude","Scamp","Were Wolf","Skele Archer","Snek"];
			break;
		case "Graveyard":
			this.spriteCompressed = "BwBgHgLCA+CM8MU5KQhRjbZt5+6+RR2xm6uFlhSpZOt1Ol9JzT12nZHqDrJLi054ONAkPEDpCPBOHcRVJjNWNGCsYqlq5ApSPYGWa5MNTHmGrUtN8K/WZpMWbcnadEHH5KsWUudkZeKr7qYbahWJHOJrzyTqLy7tp6wQEhsbIEiFGENDFukrHFmR65dFjplsZF3oGeGbVlNc10HlHZ6dVNvdX9hpU5uWZ9mT3FEwETw/mk+Qm1A6klY+y06w78g/WrpTNGDEPJw07BVjt1yyqd2fGJPderT17bZidSXI9tpTVHfv8Nvd1L9QYVdlYzjoMj5YWCxistkIKpDdADZrt4Q5kTjTtFUSj5okEW5ttjAeVVH45nUvilqTljvRboSkYijocKVtYUFmU9IeYCbz1jJtIt3kzhXZJBdJVKeJSIrj5SqFZtFarNeEtTrdXr9QbDUbjSbTWb9UA===";
			this.monsterArray = ["Were","Skele"];
			break;
	}
	document.body.className = this.shortName;
	document.getElementById('level-text').innerHTML = "LVL: " + this.shortName;
}

Location.prototype = new Displayable ();
Location.prototype.constructor = Location;

// A Character is either a Monster (NPC) or the Hero

function Character (){	
}

Character.prototype = new Displayable ();
Character.prototype.constructor = Character;

Character.prototype.updateHP = function(){
	if (this.HP < 1){
		this.HP = 0;
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

Character.prototype.getEnemy = function(){
	switch (this.constructor.name){
		case 'Hero':
			return currentGame.currentMonster;
		case 'Monster':
			return currentGame.playerHero;
	}
};

Character.prototype.punch = function(){
	var attck = {};
	attck.natural = 1;
	attck.calculated = roll( Math.floor((this.stats.str + this.stats.agi)/8) + 'd3');
	attck.type = "physical";
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
		def: 1,
		maxHP: 100
	};
	this.HP = this.stats.maxHP;
	this.kills = 0;
	this.spriteCompressed = "IwNgHgLAHAPgDAxTktW9HNfcY267a6EbHGlkkp6VVJ4EnmIOOs5maVc3vWt1kVQfSFpBI/FOkzZc+QsUJJqFUOYdOmrdTY7RbZXQbcKG8bwos+9ATZZjVfKkA===";
	this.color = "white";
}

Hero.prototype = new Character ();
Hero.prototype.constructor = Hero;

Hero.prototype.hit = function(atkObj){
	var defense = this.stats.def;
	var totalAtk = atkObj.natural + atkObj.calculated - defense;
	this.HP -= totalAtk;
	this.effectController.displayDamage(atkObj.sprite, atkObj.color);
	this.wiggle('hit', 250);
	var verb = thirdPerson(randomEntry(atkObj.verbs));
	currentGame.log.add('The '+ currentGame.currentMonster.shortName +' ' + verb +' you for ' + totalAtk + 'HP.');
	this.updateHP();
};

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
};

Hero.prototype.die = function(){
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
	this.updateHP();
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
	this.effectController = new Effect();
	this.effectController.link(this);
	this.draw(this.canvas,this.spriteCompressed);
	this.HP = this.stats.maxHP;
	this.updateHP();
};

Monster.prototype.die = function(){
	this.addClass('dead');
	currentGame.log.add('You slayed the ' + this.shortName + '.');
	currentGame.playerHero.kills ++;
	setTimeout(currentGame.switchMonster, 2000);
};

Monster.prototype.hit = function(atkObj){
	var defense = this.stats.def;
	var totalAtk = atkObj.natural + atkObj.calculated - defense;
	this.HP -= totalAtk;
	this.effectController.displayDamage(atkObj.sprite, atkObj.color);
	this.wiggle('hit', 250);
	var verb = randomEntry(atkObj.verbs);
	currentGame.log.add('You '+ verb +' the ' + this.shortName + ' for ' + totalAtk + 'HP.');
	this.updateHP();
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
};

// Types of Monsters

function Axedude (type) {
	this.stats = {
		str: 10,
		agi: 5,
		int: 5,
		cha: 2,
		def: 2,
		maxHP: 16
	};
	this.spriteCompressed = "IwNgHgLAHAPgDAxTktW9GnG8ZvG475Y4FzFkUUJFHl62nWO0ovnap01ff1us0LajSacRHAvhGcpQqhP5ZeAzGvUbNW7Tsx8elUg1n0ZS86MYXhhY8IGsjdsg5MSr8j86YrLFyXJcbL4kumHqQA==";
	this.displayName = "Axedude";
	this.color = '#f8d878';
	this.hand1 = new Sword();
}
Axedude.prototype = new Monster();
Axedude.prototype.constructor = Axedude;

function Ball (type) {
	this.stats = {
		str: 7,
		agi: 7,
		int: 1,
		cha: 1,
		def: 0,
		maxHP: 15
	};
	if ( type === ""){
		type = randomEntry(["Fire","Goo"]);
	}
	var dripSprite = "IwNgHgLAHAPgDAxTktW9HNbcXncF6qEkqFzAUHLWV1EKmPnN51UNvu1L0nuJKHahWJVR+RliHYZ2eQsVLlK1Wtb5+Ofg0E6Re2i1ZthMrVuZmeg66dvWpZcXJxOMrj+u8/fGIA==";
	var burnSprite = "IwNgHgLAHAPgDAxTktWxx0YZrTi7qYHFrElyH7kmnW22UaM1M4WmPsXcH1Ot6nHkIZkGVVCLwzZc+QsVLlKhZKy512Slvw66KGger6OyCS2YW+hCab69h0sWNF3z18a6IO4QA===";
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
		def: 0,
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
		def: 0,
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
			this.stats.def = 1;
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
			this.stats.def = 1;
			this.spriteCompressed = "IwNgHgLAHAPgDAxTktW9HPOGn3f7B74JFnGLE55ErVzkN1PMkNWuMuGkb3e4O6ChVa9hbLFOkzZc+QsUTUogUlHVV3crTb9d6po1X9J49pU5lzhmn11bDNsWrOO1wIA=";
			this.displayName = "Wise, Old Skelebones";
			this.shortName = "Skelebones Monk";
			this.hand1 = new Staff();
			break;
		case "Bruiser":
			this.stats.maxHP = 16;
			this.stats.str = 10;
			this.stats.def = 2;
			this.spriteCompressed = "IwNgHgLAHAPgDAxTktW9biKxux+o5JHIl55kXb40pFY4Gnk0PnbulML28mO0KldvUw9c/DJPTSxxXAsVLlK1WvUdxE7vOaFmOnn0G6WRui1psOwk5252BTO5tEWtMzXI/7T77EA=";
			this.displayName = "Skelebones who thinks he's a badass";
			this.shortName = "Skelebones Bruiser";
			this.hand1 = new Sword();
			break;
		case "Flaming":
			this.spriteCompressed = "IwNgHgLAHAPgDAxdhNW4KVqRj3GbJb7Kl4mGn6F7Hq7nVWOqa5XrZ0LGPfPsOnIUxHCeJIfxwyKrSQsVLlK1WSUsuRaazYKaOiVkMGxBBofVEmDM2f69ew23eb6C7iXI/efWnEA=";
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
	this.stats = {
		str: 9,
		agi: 12,
		int: 5,
		cha: 10,
		def: 0,
		maxHP: 10
	};
	this.hand1 = new Claws();
	this.spriteCompressed = "IwNgHgLAHAPgDAxTktW9HNe14fib77pEEFpG7FXmF6ELWq2P0q2kuKdM5/8DBQ4SNFjx7Xs1IlKXJJTpsl2KQoXL2yNXA4zJPREA";
	this.displayName = "Snek";
	this.color = '#58d854';
}
Snek.prototype = new Monster();
Snek.prototype.constructor = Snek;


function Were (type) {
	this.stats = {
		str: 12,
		agi: 7,
		int: 5,
		cha: 3,
		def: 1,
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
		def: 0,
		maxHP: 12
	};
	this.spriteCompressed = "IwNgHgLAHAPgDAxTktW97geV7dgEF75K4pG5ZmKGELU20Xn5Mk71GsMM0f3tBOKpTRV2vTtyGM2kprXIK6xVWvUbNWjJLHE2M/iXniBSxYe6LeI5fxWHdPAV0sUy843yXTHCs6R2PMqu2mHhCEA=";
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
}
Weapon.prototype = new Item();
Weapon.prototype.constructor = Weapon;

Weapon.prototype.target = function(){
	return this.owner.getEnemy();
};

Weapon.prototype.attackObj = function(){
	var attck = {};
	attck.natural = this.natural;
	attck.calculated = this.attackVal();
	attck.type = this.attackType;
	attck.sprite = this.hitSprite;
	attck.color = this.color;
	attck.verbs = this.verbArray;
	return attck;
};

function Sword (type) {
	this.hitSprite = "slash1";
	this.attackType = "physical";
	this.verbArray = ['slash','strike','stab','lance','wound','cut'];
	switch (type){
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
	this.verbArray = ['maul','savage','lacerate','wound','cut'];
	switch (type){
		case "Bone":
		default:
			this.color = "#f0d0b0";
			this.attackVal = function(){
				var str = this.owner.stats.str;
				var agi = this.owner.stats.agi;
				return roll( Math.floor((str + agi)/8) + 'd4');	
			};
			break;
	}
}
Claws.prototype = new Weapon();
Claws.prototype.constructor = Claws;Claws

// an Effect is a Displayable that visually displays the type of damage to the player

function Effect(){
	this.sprites = {
		kapow: "GwFgHgTCA+AM8MU5LVvRzXs93/BhRxJBAjKZahRjVSnQ4o8i/UmTZ/N+5ZwMFs+zHl2pDeItJJmTh0hLIbypi5vNaqBPbAqzKtq9SsFzDJpWN2mhlwtv32512GueYnjLx4Off+HRAA==",
		slash1: "GwFgHgTCA+AM8MU5LVvRzXs93/BhRxJpZaAjOdZTXUlfU40zRS5h65e9l9ynb9BwkXSF9RyXtQlYpAhDM6KMC1bnUa+20oyA",
		blast: "GwFgHgTCA+AM8MU5LVvRzXs93/BhRxJeAjGfBaTUpRQ4/bTU25S2h41Yk3zxLV07DggaoJRNl2FSq8uovLcxStfOXrCwhSl3iNa5AZUD9x2AdNLicywqNitAh9hmT7Tt4OlvDHgGe/iyqcq7Wvpw6oi7ROPSxVvGk9rBAA==",
		claws: "GwFgHgTCA+AM8MU5LVvRzXs93/BGAjCYWXiUeddpYnTYwqfA0+1ay15+4bwzZ8ynFkOH8uPCTSpjeM2XIWLypbmjmtVqUSuRbY+nfWNJDZk0cwWra6w7sFbmh5yA",
		poof: "GwFgHgTCA+AM8MU5LVvRzXs93/mAjASasaRYuUWdtafVTZbI0mwvR5y/Nz8n69B7YWNF9xU6TNlzWHQuSVEVWIfM1bN1DdvSM9+gxkXGmaflxPnWtU7aOSR6809stqQA"
	};
	this.color = "yellow";
	this.associatedCharacter = "";
}
Effect.prototype = new Displayable();
Effect.prototype.constructor = Effect;

Effect.prototype.link = function(Character){
	this.associatedCharacter = Character;
	this.damageCanvasElement = Character.div.getElementsByClassName('damage-sprite')[0];
	this.damageCanvas = this.damageCanvasElement.getContext('2d');
};

Effect.prototype.displayDamage = function(spriteName, color){
	this.color = color;
	this.damageCanvasElement.classList.add("active", spriteName);
	this.draw(this.damageCanvas,this.sprites[spriteName]);
	var thisEffect = this;
	setTimeout(function(){thisEffect.clearDamage();}, 500);
};

Effect.prototype.clearDamage = function(){
	this.damageCanvasElement.className = "damage-sprite";
};

// event Listeners

function loadButtons(){
	var buttons = document.getElementsByClassName("button");
	for (var i=0; i < buttons.length; i+=1){
		var fnName = buttons[i].getAttribute('click-data');
		buttons[i].addEventListener("click", function(){currentGame[fnName]();});
	}
}

loadButtons();


currentGame.playerHero = new Hero('Sandra');
currentGame.currentMonster = new Monster();
currentGame.previousMonsterName = "";
currentGame.currentLocation = new Location(randomEntry(["Dungeon", "Volcano", "Forest", "Graveyard"]));

currentGame.initialize();
