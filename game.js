
// Global Variables
var gameLog = {
	element: document.getElementById('gameLog'),
	add: function(message){
		this.element.innerHTML += (message + '<br />');
		this.element.scrollTop = this.element.scrollHeight;
	}
};

var currentMonster = new Monster();
var previousMonsterName = "";


// A Displayable is an object with an associated canvas for drawing sprites
function Displayable (){
}

Displayable.prototype.constructor = Displayable;

Displayable.prototype.draw = function(){
    var binary = binhex.convertHexadecimalToBinary(this.spriteCompressed.slice( this.spriteCompressed.indexOf('|') + 1));
    var spriteWidth = this.spriteCompressed.slice( 0, this.spriteCompressed.indexOf('x'));
    var spriteHeight = this.spriteCompressed.slice( this.spriteCompressed.indexOf('x') + 1 , this.spriteCompressed.indexOf('|') );
    this.canvas.clearRect(0,0,spriteWidth,spriteHeight);
    this.canvas.fillStyle = this.color;
    for (var i=0; i < binary.length; i+=1){
    	if (binary.slice(i,i+1) == 1){
    		var row = Math.floor(i / spriteWidth );
    		this.canvas.fillRect( (i - row * spriteWidth ), row, 1, 1 );
    	}
    }
};

// A Character is either a Monster (NPC) or the player Character
function Character (){	
}

Character.prototype = new Displayable ();
Character.prototype.constructor = Character;

Character.prototype.updateHP = function(){
	if (this.HP < 1){
		this.HP = 0;
	}
	this.displayElement.hpText.innerHTML = this.HP + "/" + this.initialHP;
	this.displayElement.hpBar.style.width = Math.floor((this.HP / this.initialHP)*100) + "%";
	if (this.HP === 0){
		this.die();
	}
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
	if (previousMonsterName === this.displayName){
		article = 'another ';
	} else if ('AEIOU'.indexOf(this.displayName.slice(0,1)) !== -1){
		article = 'an ';
	} else {
		article = 'a ';
	}
	var message = "It's " + article + this.displayName + '!';
	gameLog.add(message);
	if (this.shortName === ""){
		this.shortName = this.displayName;
	} 
	this.displayElement.name.innerHTML = this.shortName;
};

Monster.prototype.appear = function(){
	this.announce();
	this.draw();
	this.HP = this.initialHP;
	this.updateHP();
};

Monster.prototype.addClass = function(classStr){
	this.div.classList.add(classStr);
};

Monster.prototype.die = function(){
	this.addClass('dead');
	gameLog.add('You slayed the ' + this.shortName + '.');
	setTimeout(switchMonster, 2000);
};

// Types of Monsters

function Axedude (type) {
	this.initialHP = 20;
	this.spriteCompressed = "16x48|000000000000001E085E078A05081FE83FE83FF81FDC07880F880FC01FE03DD018C818601860102030300000000000000000000000000000001E085E078A05081FE83FE83FF81FDC07880F880FC01FE03DD018E8186010203030000000000000";
	this.displayName = "Axedude";
	this.color = 'yellow';
}
Axedude.prototype = new Monster();
Axedude.prototype.constructor = Axedude;

function Balltype (type) {
	this.initialHP = 15;
	this.spriteCompressed = "16x48|0000000000000000000003800FE01FF03D783AB87C7C7ABC6D742FF427E405A001200100010000000000000000000000000000000000000003800FE01FF03FF83EF87D7C7EFC6FF42FF427E405A0012001000100000000000000000000000000";
	this.displayName = "Gooball";
	this.color = 'purple';
}
Balltype.prototype = new Monster();
Balltype.prototype.constructor = Balltype;

function Scamp (type) {
	this.initialHP = 10;
	this.spriteCompressed = "16x48|000000000000000000000300018003C007E0018007E00FF013C803C007E0076006200820000000000000000000000000000000000000000000000600030007800FC003000FC01FE0279003C007E0076006200820000000000000000000000000";
	this.displayName = "Scamp";
	this.color = 'darkgreen';
}
Scamp.prototype = new Monster();
Scamp.prototype.constructor = Scamp;

function Skele (type) {
	this.initialHP = 12;
	if ( type === ""){
		type = randomEntry(["Footman","Archer","Monk","Knight","Flaming"]);
	}
	this.color = 'white';
	switch (type){
		case "Footman":
			this.initialHP = 14;
			this.spriteCompressed = "16x48|00000000000000000100810082C0C7E045302BD4280E118E13CE02440240042004200420041000000000000000000000000000000000000000804080416063F0229815EA140708C709E701220220022004200410041";
			this.displayName = "Skelebones Footman";
			break;
		case "Archer":
			this.spriteCompressed = "16x48|00000000080014001240214020B07FFC214820F02100126014F0089000900108010801080104000000000000000000000000000004000A00092010A010583FFE10A41078108009300A78044800880088010801040104";
			this.displayName = "Skelebones Archer";
			break;
		case "Monk":
			this.spriteCompressed = "16x48|00000000000000000100810082C047E045302BD02808118813C80A400A40062004200420041000000000000000000000000000000000000000804080416023F0229815E8140408C409E405200720022004200410041";
			this.displayName = "Wise, Old Skelebones";
			this.shortName = "Skelebones Mage";
			break;
		case "Knight":
			this.initialHP = 16;
			this.spriteCompressed = "16x48|00000000000004400380810082C0C7E045302BD4280E118E13CE02440240042004200420041000000000000000000000000000000000022001C04080416063F0229815EA140708C709E701220220022004200410041";
			this.displayName = "Skelebones who thinks he's a badass";
			this.shortName = "Skelebones Bruiser";
			break;
		case "Flaming":
			this.spriteCompressed = "16x48|010001A003C00AC0056005200AD007E005300BD00808118813C80240024004200420042004100000000000000000000000A000C005C0036002B00290056803F0029805E8040408C409E401200220022004200410041";
			this.displayName = "Skelebones who is on fire";
			this.shortName = "Flaming Skelebones";
			this.color = "#ff5000";
			break;
		default:
			this.spriteCompressed = "16x48|00000000000000000100010002C007E005300BD00808118813C802400240042004200420041000000000000000000000000000000000000000800080016003F0029805E8040408C409E401200220022004200410041";
			this.displayName = "Skelebones";	
	}
}
Skele.prototype = new Monster();
Skele.prototype.constructor = Skele;

function Snek (type) {
	this.initialHP = 10;
	this.spriteCompressed = "16x48|000000000000000003C00FE008701FD010401F8008800F800480034021C040E043FC6FFE3FFC00000000000000000000000000000000000003C00FE008701FD010401F8008800F800480034081C040E043FC6FFE3FFC00000000000000000000";
	this.displayName = "Snek";
	this.color = 'green';
}
Snek.prototype = new Monster();
Snek.prototype.constructor = Snek;


function Werebeing (type) {
	this.initialHP = 20;
	this.spriteCompressed = "16x48|0000000000800B0014001F803FE07FF01FF01FF817EC33C423CC31E423E007E00670023001080208040800000000000000000000000000800B0014001F803FE07FF01FF01FF817EC33C421EC33E427E006700230010802080408000000000000";
	this.displayName = "Werebeing";
	this.color = 'lightgray';
}
Werebeing.prototype = new Monster();
Werebeing.prototype.constructor = Werebeing;

function Mage (type) {
	this.initialHP = 12;
	this.spriteCompressed = "16x48|000000000000020002000F8002100D281F901FD02FD02738201045100D900A900DD01FD01FF03FF000000000000000000000000000000100010007C8011406880FC80FE817FC1388100825880D880A880DC81FC81FE83FF00000000000000000";
	this.displayName = "Wiz";
	this.color = 'blue';
}
Mage.prototype = new Monster();

function randomEntry(array){
	return array[Math.floor(Math.random()*array.length)];
}

function enterMonster(monsterType){
	if (monsterType[0].length === 1){
		monsterType = [monsterType,""];
	}
	previousMonsterName = currentMonster.displayName;
	var newMonster = new window[monsterType[0]](monsterType[1]);
	newMonster.div.className = "";
	newMonster.appear();
	currentMonster = newMonster;
}

function switchMonster(){
	var monsterType = randomEntry(["Axedude","Balltype","Scamp","Skele","Snek","Werebeing","Mage"]);
	enterMonster(monsterType);
}

function smack(){
	var atkVal = Math.floor(Math.random()*4);
	if (currentMonster.HP > 0){
		if (atkVal > 0){
			currentMonster.HP -= atkVal;
			gameLog.add('You hit the ' + currentMonster.shortName + ' for ' + atkVal + 'HP.');
			currentMonster.updateHP();
		} else {
			gameLog.add('You miss the ' + currentMonster.shortName + '.');
		}
		
	}
}

// event Listeners

function loadButtons(){
	var buttons = document.getElementsByClassName("button");
	for (var i=0; i < buttons.length; i+=1){
		var fnName = buttons[i].id;
		buttons[i].addEventListener("click", function(){window[fnName]();});
	}
}

loadButtons();
switchMonster();
