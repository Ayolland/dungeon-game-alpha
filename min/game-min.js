function randomEntry(t){return t[Math.floor(Math.random()*t.length)]}function roll(t){for(var e=t.slice(0,t.indexOf("d")),s=t.slice(t.indexOf("d")+1),r=0,n=e-1;n>=0;n--)r+=Math.floor(Math.random()*s)+1;return r}function Game(){this.log={element:document.getElementById("gameLog"),add:function(t){this.element.innerHTML+=t+"<br />",this.element.scrollTop=this.element.scrollHeight}},this.playerHero=new Hero("TEMP"),this.currentMonster=new Monster,this.previousMonsterName="",this.initialize=function(){this.playerHero.draw(),this.playerHero.updateHP(),this.switchMonster()},this.enterMonster=function(t){this.previousMonsterName=this.currentMonster.displayName;var e=new window[t];e.div.className="",e.appear(),this.currentMonster=e},this.switchMonster=function(){var t=randomEntry(["Axedude","Balltype","Scamp","Skele","Snek","Werebeing","Mage"]);currentGame.enterMonster(t)},this.attack=function(){document.getElementById("interface").className="wait";var t=Math.floor(4*Math.random())+1,e=Math.floor(4*Math.random())+1;this.currentMonster.HP>0&&this.playerHero.HP>0&&(roll("1d20")+this.currentMonster.stats.agi-this.playerHero.stats.agi>=20?this.currentMonster.dodge():this.currentMonster.hit(t)),this.currentMonster.HP>0&&this.playerHero.HP>0&&setTimeout(function(){roll("1d20")+currentGame.playerHero.stats.agi-currentGame.currentMonster.stats.agi>=20?currentGame.playerHero.dodge():currentGame.playerHero.hit(e)},1500),setTimeout(function(){document.getElementById("interface").className=""},2e3)}}function Displayable(){}function Character(){}function Hero(t){this.div=document.getElementById("hero"),this.canvas=document.getElementById("hero-sprite").getContext("2d"),this.heroName=t,this.displayElement={hpText:document.getElementById("hero-hp-text"),hpBar:document.getElementById("hero-hp-bar"),name:document.getElementById("hero-name")},this.displayElement.name.innerHTML=t,this.maxHP=50,this.HP=this.maxHP,this.stats={str:8,agi:8,"int":8,cha:8},this.kills=0,this.spriteCompressed="IwNgHgLAHAPgDAxTktW9HNfcY267a6EbHGlkkp6VVJ4EnmIOOs5maVc3vWt1kVQfSFpBI/FOkzZc+QsUJJqFUOYdOmrdTY7RbZXQbcKG8bwos+9ATZZjVfKkA===",this.color="white"}function Monster(){this.div=document.getElementById("monster"),this.canvas=document.getElementById("monster-sprite").getContext("2d"),this.shortName="",this.displayElement={hpText:document.getElementById("monster-hp-text"),hpBar:document.getElementById("monster-hp-bar"),name:document.getElementById("monster-name")}}function Axedude(t){this.maxHP=20,this.stats={str:10,agi:5,"int":5,cha:2},this.spriteCompressed="IwNgHgLAHAPgDAxTktW9GnG8ZvG475Y4FzFkUUJFHl62nWO0ovnap01ff1us0LajSacRHAvhGcpQqhP5ZeAzGvUbNW7Tsx8elUg1n0ZS86MYXhhY8IGsjdsg5MSr8j86YrLFyXJcbL4kumHqQA==",this.displayName="Axedude",this.color="yellow"}function Balltype(t){this.maxHP=15,this.stats={str:7,agi:7,"int":1,cha:1},this.spriteCompressed="IwNgHgLAHAPgDAxTktW9HNbcXncF6qEkqFzAUHLWV1EKmPnN51UNvu1L0nuJKHahWJVR+RliHYZ2eQsVLlK1Wtb5+Ofg0E6Re2i1ZthMrVuZmeg66dvWpZcXJxOMrj+u8/fGIA==",this.displayName="Gooball",this.color="purple"}function Scamp(t){this.maxHP=10,this.stats={str:2,agi:12,"int":10,cha:8},this.spriteCompressed="IwNgHgLAHAPgDAxTktW9HNbcY2G7a6EbHFYmll47WVI1kHpNWu170qU2q/P5BQ4SNFjxEyVypFybOTMx0WdfokZy1ydhwV9C0hry3rtk8xcuIgA=",this.displayName="Scamp",this.color="darkgreen"}function Skele(t){switch(this.maxHP=12,this.stats={str:6,agi:6,"int":6,cha:2},""===t&&(t=randomEntry(["Footman","Archer","Monk","Bruiser","Flaming"])),this.color="white",t){case"Footman":this.maxHP=14,this.stats.str=8,this.spriteCompressed="IwNgHgLAHAPgDAxTktW9HPOGn3f7B5JGJHnFlV6mFwX2PWrklnGtX2ef5P99KLNukpC+CcSK5ZZc+QsVLlKjFIGSCbWiQ4VxHJjuYMcYjZON7257rV4jDKJ6JnC3ziZ5JA==",this.displayName="Skelebones Footman";break;case"Archer":this.stats.agi=9,this.spriteCompressed="IwNgHgLAHAPgDAxTktW4aUY5xP/pLaFFzA57lXVWl5kIWPLVZ2YFlOn62oWdcgksw7t+4tpNwzZc+QsVKps4qtHd69TaO3caB8uLX6WfYzM5GJvayuETdInVqcq3knEA",this.displayName="Skelebones Archer";break;case"Monk":this.stats["int"]=9,this.spriteCompressed="IwNgHgLAHAPgDAxTktW9HPOGn3f7B74JFnGLE55ErVzkN1PMkNWuMuGkb3e4O6ChVa9hbLFOkzZc+QsUTUogUlHVV3crTb9d6po1X9J49pU5lzhmn11bDNsWrOO1wIA=",this.displayName="Wise, Old Skelebones",this.shortName="Skelebones Mage";break;case"Bruiser":this.maxHP=16,this.stats.str=10,this.spriteCompressed="IwNgHgLAHAPgDAxTktW9biKxux+o5JHIl55kXb40pFY4Gnk0PnbulML28mO0KldvUw9c/DJPTSxxXAsVLlK1WvUdxE7vOaFmOnn0G6WRui1psOwk5252BTO5tEWtMzXI/7T77EA=",this.displayName="Skelebones who thinks he's a badass",this.shortName="Skelebones Bruiser";break;case"Flaming":this.spriteCompressed="IwNgHgLAHAPgDAxdhNW4KVqRj3GbJb7Kl4mGn6F7Hq7nVWOqa5XrZ0LGPfPsOnIUxHCeJIfxwyKrSQsVLlK1WSUsuRaazYKaOiVkMGxBBofVEmDM2f69ew23eb6C7iXI/efWnEA=",this.displayName="Skelebones who is on fire",this.shortName="Flaming Skelebones",this.color="#ff5000";break;default:this.spriteCompressed="IwNgHgLAHAPgDAxTktW9HPOFxPc7D7pGnGqEJFqGlzlINUrHXPZV30nsb5Mc8fRsKE8RuSVOkzZc+Qt5YBFeirxl13fitrVdqwWrESySwVu7mWJw9Ym2jVIA",this.displayName="Skelebones"}}function Snek(t){this.maxHP=10,this.stats={str:9,agi:12,"int":5,cha:10},this.spriteCompressed="IwNgHgLAHAPgDAxTktW9HNOD4HcHp6K6oGnHKULVXmaW0r0M1Zw4drWnPOdVs5ARzzCWo8b3YzZc+QsVKFhIsKJCmkwltpaaE7iQar8bLJyZWR2flc0TLUkc+nL3H9kA",this.displayName="Snek",this.color="green"}function Werebeing(t){this.maxHP=20,this.stats={str:12,agi:7,"int":5,cha:3},this.spriteCompressed="IwNgHgLAHAPgDAxTktWpx0M8TWdaK7F6onkrlVlW422lFzV1F4lOfPHaOves+bHumqj2/Mm0JC0jZnMqFlK1WvUbRM7tvlyK+2pQaThY5Cb04KkwSIVcB1jBJGzzNXnozT8Pxf5KFpohqkA=",this.displayName="Werebeing",this.color="lightgray"}function Mage(t){this.maxHP=12,this.stats={str:5,agi:8,"int":12,cha:8},this.spriteCompressed="IwNgHgLAHAPgDAxTktW97geV7dgEF75K4pG5ZmKGELU20Xn5Mk71GsMM0f3tBOKpTRV2vTtyGM2kprXIK6xVWvUbNWjJLHE2M/iXniBSxYe6LeI5fxWHdPAV0sUy843yXTHCs6R2PMqu2mHhCEA=",this.displayName="Wiz",this.color="blue"}function loadButtons(){for(var t=document.getElementsByClassName("button"),e=0;e<t.length;e+=1){var s=t[e].getAttribute("click-data");t[e].addEventListener("click",function(){currentGame[s]()})}}var __nativeST__=window.setTimeout;window.setTimeout=function(t,e){var s=this,r=Array.prototype.slice.call(arguments,2);return __nativeST__(t instanceof Function?function(){t.apply(s,r)}:t,e)};var currentGame=new Game;Displayable.prototype.constructor=Displayable,Displayable.prototype.draw=function(){var t=LZString.decompressFromBase64(this.spriteCompressed),e=t.slice(t.indexOf("|")+1),s=t.slice(0,t.indexOf("x")),r=t.slice(t.indexOf("x")+1,t.indexOf("|"));this.canvas.clearRect(0,0,s,r),this.canvas.fillStyle=this.color;for(var n=0;n<e.length;n+=1)if(1==e.slice(n,n+1)){var o=Math.floor(n/s);this.canvas.fillRect(n-o*s,o,1,1)}},Character.prototype=new Displayable,Character.prototype.constructor=Character,Character.prototype.updateHP=function(){this.HP<1&&(this.HP=0),this.displayElement.hpText.innerHTML=this.HP+"/"+this.maxHP;var t=Math.floor(this.HP/this.maxHP*100);this.displayElement.hpBar.style.width=t+"%",this.displayElement.hpBar.className="hp-bar hp-"+10*Math.round(t/10),0===this.HP&&this.die()},Character.prototype.addClass=function(t){this.div.classList.add(t)},Character.prototype.wiggle=function(t,e){this.div.classList.add(t);var s=this;setTimeout(function(){s.div.classList.remove(t)},e)},Hero.prototype=new Character,Hero.prototype.constructor=Hero,Hero.prototype.hit=function(t){this.HP-=t,this.wiggle("hit",250),currentGame.log.add("The "+currentGame.currentMonster.shortName+" hit you for "+t+"HP."),this.updateHP()},Hero.prototype.dodge=function(){this.wiggle("dodge",500),currentGame.log.add("You dodge the "+currentGame.currentMonster.shortName+"'s attack.")},Hero.prototype.die=function(){this.addClass("dead"),currentGame.log.add("You were slain by the "+currentGame.currentMonster.shortName+"."),setTimeout(function(){currentGame.log.add("You slayed "+currentGame.playerHero.kills+" monsters before perishing.")},2e3)},Monster.prototype=new Character,Monster.prototype.constructor=Monster,Monster.prototype.announce=function(){var t="";t=currentGame.previousMonsterName===this.displayName?"another ":-1!=="AEIOU".indexOf(this.displayName.slice(0,1))?"an ":"a ";var e="It's "+t+this.displayName+"!";currentGame.log.add(e),""===this.shortName&&(this.shortName=this.displayName),this.displayElement.name.innerHTML=this.shortName},Monster.prototype.appear=function(){this.announce(),this.draw(),this.HP=this.maxHP,this.updateHP()},Monster.prototype.die=function(){this.addClass("dead"),currentGame.log.add("You slayed the "+this.shortName+"."),currentGame.playerHero.kills++,setTimeout(currentGame.switchMonster,2e3)},Monster.prototype.hit=function(t){this.HP-=t,this.wiggle("hit",250),currentGame.log.add("You hit the "+this.shortName+" for "+t+"HP."),this.updateHP()},Monster.prototype.dodge=function(){this.wiggle("dodge",500),currentGame.log.add("The "+this.shortName+" dodges your attack.")},Axedude.prototype=new Monster,Axedude.prototype.constructor=Axedude,Balltype.prototype=new Monster,Balltype.prototype.constructor=Balltype,Scamp.prototype=new Monster,Scamp.prototype.constructor=Scamp,Skele.prototype=new Monster,Skele.prototype.constructor=Skele,Snek.prototype=new Monster,Snek.prototype.constructor=Snek,Werebeing.prototype=new Monster,Werebeing.prototype.constructor=Werebeing,Mage.prototype=new Monster,loadButtons(),currentGame.playerHero=new Hero("Sandra"),currentGame.currentMonster=new Monster,currentGame.previousMonsterName="",currentGame.initialize();