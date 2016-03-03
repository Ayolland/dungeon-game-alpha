function randomEntry(e){return e[Math.floor(Math.random()*e.length)]}function Game(){this.log={element:document.getElementById("gameLog"),add:function(e){this.element.innerHTML+=e+"<br />",this.element.scrollTop=this.element.scrollHeight}},this.playerHero=new Hero("TEMP"),this.currentMonster=new Monster,this.previousMonsterName="",this.initialize=function(){this.playerHero.draw(),this.playerHero.updateHP(),this.switchMonster()},this.enterMonster=function(e){this.previousMonsterName=this.currentMonster.displayName;var t=new window[e];t.div.className="",t.appear(),this.currentMonster=t},this.switchMonster=function(){var e=randomEntry(["Axedude","Balltype","Scamp","Skele","Snek","Werebeing","Mage"]);currentGame.enterMonster(e)},this.attack=function(){var e=Math.floor(4*Math.random()),t=Math.floor(4*Math.random());this.currentMonster.HP>0&&this.playerHero.HP>0&&(e>0?this.currentMonster.hit(e):this.currentMonster.dodge()),this.currentMonster.HP>0&&this.playerHero.HP>0&&setTimeout(function(){t>0?currentGame.playerHero.hit(t):currentGame.playerHero.dodge()},2e3)}}function Displayable(){}function Character(){}function Hero(e){this.div=document.getElementById("hero"),this.canvas=document.getElementById("hero-sprite").getContext("2d"),this.heroName=e,this.displayElement={hpText:document.getElementById("hero-hp-text"),hpBar:document.getElementById("hero-hp-bar"),name:document.getElementById("hero-name")},this.displayElement.name.innerHTML=e,this.maxHP=50,this.HP=this.maxHP,this.kills=0,this.spriteCompressed="16x48|000000000000000000000180018003C007E007F00BF809CE11C003E003E003600630063004100C1800000000000000000000000000000000000000000180018003C007E007F00BF809CE13E003E003600630063004100C18",this.color="white"}function Monster(){this.div=document.getElementById("monster"),this.canvas=document.getElementById("monster-sprite").getContext("2d"),this.shortName="",this.displayElement={hpText:document.getElementById("monster-hp-text"),hpBar:document.getElementById("monster-hp-bar"),name:document.getElementById("monster-name")}}function Axedude(e){this.maxHP=20,this.spriteCompressed="16x48|000000000000001E085E078A05081FE83FE83FF81FDC07880F880FC01FE03DD018C818601860102030300000000000000000000000000000001E085E078A05081FE83FE83FF81FDC07880F880FC01FE03DD018E8186010203030000000000000",this.displayName="Axedude",this.color="yellow"}function Balltype(e){this.maxHP=15,this.spriteCompressed="16x48|0000000000000000000003800FE01FF03D783AB87C7C7ABC6D742FF427E405A001200100010000000000000000000000000000000000000003800FE01FF03FF83EF87D7C7EFC6FF42FF427E405A0012001000100000000000000000000000000",this.displayName="Gooball",this.color="purple"}function Scamp(e){this.maxHP=10,this.spriteCompressed="16x48|000000000000000000000300018003C007E0018007E00FF013C803C007E0076006200820000000000000000000000000000000000000000000000600030007800FC003000FC01FE0279003C007E0076006200820000000000000000000000000",this.displayName="Scamp",this.color="darkgreen"}function Skele(e){switch(this.maxHP=12,""===e&&(e=randomEntry(["Footman","Archer","Monk","Knight","Flaming"])),this.color="white",e){case"Footman":this.maxHP=14,this.spriteCompressed="16x48|00000000000000000100810082C0C7E045302BD4280E118E13CE02440240042004200420041000000000000000000000000000000000000000804080416063F0229815EA140708C709E701220220022004200410041",this.displayName="Skelebones Footman";break;case"Archer":this.spriteCompressed="16x48|00000000080014001240214020B07FFC214820F02100126014F0089000900108010801080104000000000000000000000000000004000A00092010A010583FFE10A41078108009300A78044800880088010801040104",this.displayName="Skelebones Archer";break;case"Monk":this.spriteCompressed="16x48|00000000000000000100810082C047E045302BD02808118813C80A400A40062004200420041000000000000000000000000000000000000000804080416023F0229815E8140408C409E405200720022004200410041",this.displayName="Wise, Old Skelebones",this.shortName="Skelebones Mage";break;case"Knight":this.maxHP=16,this.spriteCompressed="16x48|00000000000004400380810082C0C7E045302BD4280E118E13CE02440240042004200420041000000000000000000000000000000000022001C04080416063F0229815EA140708C709E701220220022004200410041",this.displayName="Skelebones who thinks he's a badass",this.shortName="Skelebones Bruiser";break;case"Flaming":this.spriteCompressed="16x48|010001A003C00AC0056005200AD007E005300BD00808118813C80240024004200420042004100000000000000000000000A000C005C0036002B00290056803F0029805E8040408C409E401200220022004200410041",this.displayName="Skelebones who is on fire",this.shortName="Flaming Skelebones",this.color="#ff5000";break;default:this.spriteCompressed="16x48|00000000000000000100010002C007E005300BD00808118813C802400240042004200420041000000000000000000000000000000000000000800080016003F0029805E8040408C409E401200220022004200410041",this.displayName="Skelebones"}}function Snek(e){this.maxHP=10,this.spriteCompressed="16x48|000000000000000003C00FE008701FD010401F8008800F800480034021C040E043FC6FFE3FFC00000000000000000000000000000000000003C00FE008701FD010401F8008800F800480034081C040E043FC6FFE3FFC00000000000000000000",this.displayName="Snek",this.color="green"}function Werebeing(e){this.maxHP=20,this.spriteCompressed="16x48|0000000000800B0014001F803FE07FF01FF01FF817EC33C423CC31E423E007E00670023001080208040800000000000000000000000000800B0014001F803FE07FF01FF01FF817EC33C421EC33E427E006700230010802080408000000000000",this.displayName="Werebeing",this.color="lightgray"}function Mage(e){this.maxHP=12,this.spriteCompressed="16x48|000000000000020002000F8002100D281F901FD02FD02738201045100D900A900DD01FD01FF03FF000000000000000000000000000000100010007C8011406880FC80FE817FC1388100825880D880A880DC81FC81FE83FF00000000000000000",this.displayName="Wiz",this.color="blue"}function loadButtons(){for(var e=document.getElementsByClassName("button"),t=0;t<e.length;t+=1){var r=e[t].getAttribute("click-data");e[t].addEventListener("click",function(){currentGame[r]()})}}var __nativeST__=window.setTimeout;window.setTimeout=function(e,t){var r=this,s=Array.prototype.slice.call(arguments,2);return __nativeST__(e instanceof Function?function(){e.apply(r,s)}:e,t)};var currentGame=new Game;Displayable.prototype.constructor=Displayable,Displayable.prototype.draw=function(){var e=binhex.convertHexadecimalToBinary(this.spriteCompressed.slice(this.spriteCompressed.indexOf("|")+1)),t=this.spriteCompressed.slice(0,this.spriteCompressed.indexOf("x")),r=this.spriteCompressed.slice(this.spriteCompressed.indexOf("x")+1,this.spriteCompressed.indexOf("|"));this.canvas.clearRect(0,0,t,r),this.canvas.fillStyle=this.color;for(var s=0;s<e.length;s+=1)if(1==e.slice(s,s+1)){var o=Math.floor(s/t);this.canvas.fillRect(s-o*t,o,1,1)}},Character.prototype=new Displayable,Character.prototype.constructor=Character,Character.prototype.updateHP=function(){this.HP<1&&(this.HP=0),this.displayElement.hpText.innerHTML=this.HP+"/"+this.maxHP;var e=Math.floor(this.HP/this.maxHP*100);this.displayElement.hpBar.style.width=e+"%",this.displayElement.hpBar.className="hp-bar hp-"+10*Math.round(e/10),0===this.HP&&this.die()},Character.prototype.addClass=function(e){this.div.classList.add(e)},Character.prototype.wiggle=function(e,t){this.div.classList.add(e);var r=this;setTimeout(function(){r.div.classList.remove(e)},t)},Hero.prototype=new Character,Hero.prototype.constructor=Hero,Hero.prototype.hit=function(e){this.HP-=e,this.wiggle("hit",250),currentGame.log.add("The "+currentGame.currentMonster.shortName+" hit you for "+e+"HP."),this.updateHP()},Hero.prototype.dodge=function(){this.wiggle("dodge",500),currentGame.log.add("You dodge the "+currentGame.currentMonster.shortName+"'s attack.")},Hero.prototype.die=function(){this.addClass("dead"),currentGame.log.add("You were slain by the "+currentGame.currentMonster.shortName+"."),setTimeout(function(){currentGame.log.add("You slayed "+currentGame.playerHero.kills+" monsters before perishing.")},2e3)},Monster.prototype=new Character,Monster.prototype.constructor=Monster,Monster.prototype.announce=function(){var e="";e=currentGame.previousMonsterName===this.displayName?"another ":-1!=="AEIOU".indexOf(this.displayName.slice(0,1))?"an ":"a ";var t="It's "+e+this.displayName+"!";currentGame.log.add(t),""===this.shortName&&(this.shortName=this.displayName),this.displayElement.name.innerHTML=this.shortName},Monster.prototype.appear=function(){this.announce(),this.draw(),this.HP=this.maxHP,this.updateHP()},Monster.prototype.die=function(){this.addClass("dead"),currentGame.log.add("You slayed the "+this.shortName+"."),currentGame.playerHero.kills++,setTimeout(currentGame.switchMonster,2e3)},Monster.prototype.hit=function(e){this.HP-=e,this.wiggle("hit",250),currentGame.log.add("You hit the "+this.shortName+" for "+e+"HP."),this.updateHP()},Monster.prototype.dodge=function(){this.wiggle("dodge",500),currentGame.log.add("The "+this.shortName+" dodges your attack.")},Axedude.prototype=new Monster,Axedude.prototype.constructor=Axedude,Balltype.prototype=new Monster,Balltype.prototype.constructor=Balltype,Scamp.prototype=new Monster,Scamp.prototype.constructor=Scamp,Skele.prototype=new Monster,Skele.prototype.constructor=Skele,Snek.prototype=new Monster,Snek.prototype.constructor=Snek,Werebeing.prototype=new Monster,Werebeing.prototype.constructor=Werebeing,Mage.prototype=new Monster,loadButtons(),currentGame.playerHero=new Hero("Sandra"),currentGame.currentMonster=new Monster,currentGame.previousMonsterName="",currentGame.initialize();