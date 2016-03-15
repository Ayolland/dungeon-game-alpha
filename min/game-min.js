function randomEntry(t){return t[Math.floor(Math.random()*t.length)]}function roll(t){for(var e=t.slice(0,t.indexOf("d")),r=t.slice(t.indexOf("d")+1),s=0,a=e-1;a>=0;a--)s+=Math.floor(Math.random()*r)+1;return s}function rollHits(t,e){for(var r=t.slice(0,t.indexOf("d")),s=t.slice(t.indexOf("d")+1),a=0,i=r-1;i>=0;i--){var n=roll("1d"+s);(n>=e||n===s)&&a++}return a}function thirdPerson(t){switch(t){case"bash":case"punch":case"slash":case"splash":t+="es";break;case"are":t="is";break;default:t+="s"}return t}function firstCap(t){return t.charAt(0).toUpperCase()+t.slice(1).toLowerCase()}function shorten(t,e){return t.length>e&&(t=t.substring(0,e-4)+"..."),t}function firstWord(t){return t.slice(0,t.indexOf(" "))}function secondWord(t){return t.slice(t.indexOf(" ")+1)}function Game(){this.log={element:document.getElementById("gameLog"),add:function(t){this.element.innerHTML+="<p>"+t+"</p>",this.element.scrollTop=this.element.scrollHeight}},this.currentLocation=new Location,this.playerHero=new Hero("TEMP"),this.currentMonster=new Monster,this.previousMonsterName="",this.initialize=function(){currentGame.playerHero=new Hero("Sandra"),currentGame.currentMonster=new Monster,currentGame.previousMonsterName="",this.switchLocation(),this.playerHero.initialize()},this.enterMonster=function(t){this.previousMonsterName=this.currentMonster.displayName;var e=t.slice(0,t.indexOf(" ")),r=t.slice(t.indexOf(" ")+1);-1===t.indexOf(" ")&&(e=t,r="");var s=new window[e](r);s.div.className="",s.buffs=[],s.hand1&&s.equip1(s.hand1),s.appear(),currentGame.currentMonster=s},this.switchMonster=function(){var t=randomEntry(currentGame.currentLocation.monsterArray);currentGame.enterMonster(t)},this.switchLocation=function(t){var e="undefined"==typeof currentGame.currentLocation?"":currentGame.currentLocation.shortName,r=["Dungeon","Volcano","Forest","Graveyard","Mine"];r.splice(r.indexOf(e),1),t=randomEntry(r),currentGame.currentLocation=new Location(t),currentGame.currentLocation.switchTrigger=currentGame.playerHero.kills+6+roll("1d4"),currentGame.currentLocation.draw(currentGame.currentLocation.canvas,currentGame.currentLocation.spriteCompressed),currentGame.currentLocation.canvas.fillRect(0,40,160,50),currentGame.log.add("You enter the "+t+"..."),setTimeout(function(){currentGame.switchMonster()},2e3)},this.everyoneIsAlive=function(){return this.playerHero.HP>0&&this.currentMonster.HP>0},this.runRound=function(t){intervalRelay="Player turn";var e=setInterval(function(){if("Player turn"===intervalRelay)intervalRelay="wait",interfaceElement.classList.add("wait"),currentGame.everyoneIsAlive()?currentGame.playerHero.runTurn(t):intervalRelay="End round";else if("Monster turn"===intervalRelay){intervalRelay="wait";var r=currentGame.currentMonster.ai();currentGame.everyoneIsAlive()?currentGame.currentMonster.runTurn(r):intervalRelay="End round"}else"End round"===intervalRelay&&(clearInterval(e),intervalRelay="wait",interfaceElement.classList.remove("wait"))},500)}}function Displayable(){}function Location(t){switch(this.canvas=document.getElementById("level-sprite").getContext("2d"),this.shortName=t,t){case"Dungeon":this.spriteCompressed="BwBgHgLCA+CM8MU5LVvRzCQi3/qORxJ2JuuBV1Z5xNDjTzLjOsFlhKnXrzFDojod2ddvwFCu40fXKSpg+LPFEhittLIqkvBX00FBM9WpESdGo8hO195+rvXabw13Idq5K0hsNGdtJi3q6UYs7WbtoBUU7y4WbhUW5BngmO6aKR0ZGmBo6JITm5aYXmWRJpNmUWfnEu7rGaQXwy6UkVHrkeGRWFJT3Knh11Xe09ur4hmaQKMZPDffPWhm3dgRtT0zPL2QvRteVjEXbN/K3Hqgl5pWFXJ5y3h/fl7u9xW4rV9iM+c8UDqlep0vLsvM9gUtvJ1Kn4fjVVjCTA4dtgvpIjqjGjxuMNEfjcW0ClVkoSWiCSflQU8gQSGgD2stlKdzgIUfYkilbJZJsZ5Gwut9ZPzkZlWG8dgogA==",this.monsterArray=["Axedude","Ball Goo","Skele Bones","Skele Footman","Mage","Jelly"];break;case"Volcano":this.spriteCompressed="BwBgHgLCA+CM8MUpJWpWz6308/sWBxJuRiIhWO6ZupF5peGTC1eLhD+Ht7fSgLZV6VfjlE9kg2XK5Txk7rSHTW8zW1XVGQ/uuFatRpQtOGZus8bJrlBvWssantxwedXHLuhs1iAhTM5r5eRnKBQezM0b7cBCYJesHEXuHx3pG8lM4ZUX6ZidmJij4FcUX+1qWeaWn5mSXeKLHFjS5MHQrlMSGhhgM5fCQdbiIMyqM9vcnSM+qzbhj1nRljlrPdYflLi43bO6NFU627J8fxuZfhGyGXm3uKMU8POYP2kzIVg22TdV8+j8eKdvl9JHcIalNkDhg9VPNxND5ulpuU8qD2n5XnZeKtPOlMVkOPtdgdscM9kQSf1Kb0JHMIh5BDYMSy7CMwT9jJyeXztMjWazqcyAvyWKiObj5P8ablOMSaRyFsKBhMmrJVWzleqqnT3Di9SdsJq7kbzfR5aggA==",this.monsterArray=["Axedude","Ball Fire","Skele Monk","Skele Bruiser","Were Hellbeast"];break;case"Forest":this.spriteCompressed="IwNgDAHgLGA+ZmE5TEOOhiUrVj+ORWJhq2OpFlBtZxBm9R5V6y7lpLrjtPeJpx6M2IjlRH5p1GiVHjWYxcpZC8U3vPFtuapc1yCNArYa67huA+bq3rgvjstXiqrgpUY+9m5Of+DKKyDMK+we7WEa6oBl5hMUYuptEhsZFy2okSyQF6oYH6etl++QIZSdpqxkwqLmkUMiUV5BH8UvX6Zmnejfbq7D053FUcEp6hceVt3nnyo7GtC4sDPauKw01W1NjLs7tlRjMbYoc7SkGW5TUlmwNyFiEHNdfRG29ns8MdLXaH11tXLJ/nd+jchpV1jRIUVdK97nV5iCdntwYkZMETiNkTCCr9MMc5lMojZYfi0ISfoNliiaaCOulCgC/g07kE3tNekzqrUnNCOWM/Az6Yj2oY+kyJXtWiKAnygaDgbK3Iqsd0npDtsqPKU1al2QKxjdhYbNJjxftuRTueMhSdShrnnTjZzTYirZrHZSjnb3qkNdqViClm7LlcHqGndkCb9BbkHL6ovMflzpW5w2GcQohtJvQCWlGYk6vpMXViM9CKsWc708zy4V0q3E1rWbemK0mbVGSwmy3MC6TG8mk/w248Gyq292lVzB+6Jx4xy8Z1k0+Ou4y08vK4Rg+2m6nwhNBZ58hCfHvLUe6RdMYsU2Or+fbz6CXf3qsGhTj1SVXRiWqVbfmu3w6k4Z51ISfRPh+4oSsS55Qveb5rtBf7gfQiF1sOvhoWBu6YfEwY4ay6EkqeYSwQsuwUV0YHkau5zlswNGrnRjRmhR8HuuyxgniSHEpFxOTMbxEwBuB/HnJwwG3DKKR7txgn3rO6S8HqCkgVoXipoG1Q6ABD46Y4iYmkO17UZc6mbPanGPu+KkrNZhl0exl7tPyRQebafoGoezhCV5RbPgZDi2OFpEoq8vkMtG6KRT66YxbFIVJX5BxEj4PZBclfLkZamW5s+1rJVmnawfxxm5WVcYhTJvk0Q1M6eTKb65QFpXNflo7fu1Zl9aFA0DalfUjUNrnjZNU3TTNs0sEAA=",this.monsterArray=["Axedude","Scamp","Were Wolf","Skele Archer","Snek"];break;case"Graveyard":this.spriteCompressed="IwNgDAHgLGA+wMU5LVjKzn3HXrCGBxJuRp2GeOB5F9ZDKV+1Ny7TFdXZbO+Zp2I9+fYb1zjWYsSVFtpkjtIGzF86lObblSGQfUy0/HoQnKWppaYkG9XQatVWt+tWYcj2RrbZdevMK+hqEWgd4citb+4Qxu8bYhSQmWTvQxKX7WEXJRSYzuyXmBGvku6eZZHhGESkUeqfnZ0Z6W9YitZUJdbm1BjbKahbTOub3impUmOV6Z3SZRtK5xTPNNQktYg6He6yuC0Z0+flVhVss2sQmzTjnZAd3Fjzd1x+lE5PuDDTsHK503mc6J93r1zi9wT9lv06t9/pCWkjYXwRBVrtV/hiUdwEZi/tj/HN8fDCSlAT0LJ8oVjSaSgb80MDyfDERC7Colqzuc9Mjp9Jt5pMWedDOi3tTQdp2QVkRMRQIJXClc4yXjeUNKhcqBKNTS2X8pFrUTrpcVdrK5YdWCMGgzGPrLaKATtbUaNszrY69X0Pe6bUUDervRoFoCjoG1UHo4rdBTTu5/VaYxrpfyE8ck1a1bF3YUWCoI4Lac7zTqaKDgv644mCeiy8ZOLGBUX7QSc+sHSD7Vma03JSHkWbbWo9KPwz6LeYRwW0iPPWKWV3l1LtrOuavF07XCvTc3KNN8yNk/th+WHbUCwPDafqUa8ziMheg4qvc/12s/dPXyETdaV6ijiHrWV6/uWhwAT2tQwkO4EVpBNbQdsiL5gGqwDI+OidhWaGYRk6EHsYJpYXhSGXI2AYtqRZGUH+gE0biQF0cBDGLJ+gGmqxXE1PeXHcdq1HtNwiR0XxUHYAMYlSVs0myXJ/JrPJjhBEpqlqepGmaVp2k6bpen6QZgRAA===",this.monsterArray=["Were","Skele"];break;case"Mine":this.spriteCompressed="IwNgDAHgLGA+wMU5LVvRzXs93/BhRxJpZ5FlV1Ntd9DjTzLrb7HnX3PvfwYJIITCyo0QP4lx7MIPlUFc2YgljJ9GSgWUdyLXT3k1Q46bTLVeCZdQ2zF3RhOlLc2wJf4P74R4eOrl5CwdbKvr6q/rjuURHy0YSJ+qFJsYbx6YqZycZZtDkp3rY5kbqlJbkWaoVBKbFlGmmeES1ZVdrirZmexF3hjSKpdiED7X0JFW7DnUNTCX1xY/ZJSw3pM9U9kw1EO+FtrXtz+yWLhz0ix/PxezeRm9prl49PJ7VNYRcVn9bfpb0CP0AVdVu9LqC/v9Cq9TPc3EDRiDfjgajtARQHuszt4lm18eV8f5Yb98vlzkd3lZcVS1pDpD5iXkQjRBoMUc56jZycyok59PShmlgSc+c1RQSWuLzCYSccGXE5mK7oqpULpFJqDVBXKBTK9ZrDUbjSbTWbzRbLVbrTbbXb7Q7HU7nS7XW73R7PV7vT7fX7/QggA=",this.monsterArray=["Skele Footman","Were Goat","Jelly","Snek"]}document.body.className=this.shortName,document.getElementById("level-text").innerHTML="LVL: "+this.shortName}function Character(){this.buffs=[]}function Hero(t){this.div=document.getElementById("hero"),this.canvas=document.getElementById("hero-sprite").getContext("2d"),this.heroName=t,this.displayElement={hpText:document.getElementById("hero-hp-text"),hpBar:document.getElementById("hero-hp-bar"),name:document.getElementById("hero-name")},this.displayElement.name.innerHTML=t,this.stats={str:8,agi:8,"int":8,cha:8,phys:1,magi:0,maxHP:100},this.HP=this.stats.maxHP,this.kills=0,this.spriteCompressed="IwNgHgLAHAPgDAxTktW9HNfcY267a6EbHGlkkp6VVJ4EnmIOOs5maVc3vWt1kVQfSFpBI/FOkzZc+QsUJJqFUOYdOmrdTY7RbZXQbcKG8bwos+9ATZZjVfKkA===",this.color="white",this.buffs=[]}function Monster(){this.div=document.getElementById("monster"),this.canvas=document.getElementById("monster-sprite").getContext("2d"),this.shortName="",this.displayElement={hpText:document.getElementById("monster-hp-text"),hpBar:document.getElementById("monster-hp-bar"),name:document.getElementById("monster-name")},this.buffs=[],this.ai=function(){return"activate1"}}function Axedude(t){this.stats={str:10,agi:5,"int":5,cha:2,phys:2,magi:0,maxHP:16},this.spriteCompressed="IwNgHgLAHAPgDAxTktW1xPGdx2u5IF5yF4BMZZCBx1tdODxTtpmGWJKbNnL/Xq3yZKnPNjFMiknlWrci46elVr1GzVu070AviX00ufBcCkGZDUsLb1mJq3Q5yXN124XsjTn95HmXp6iZvJw5DyRcnJAA",this.displayName="Axedude",this.color="#f8d878",this.hand1=new Sword("Iron")}function Ball(t){this.stats={str:7,agi:7,"int":1,cha:1,phys:0,magi:1,maxHP:15},""===t&&(t=randomEntry(["Fire","Goo"]));var e="IwNgHgLAHAPgDAxTktW9HNe54fd6HBpGkpEBMwVhyhVDtipFrZCl1XTc+ejfJMVK1izDuzF1ewrGKnoFuHCtVr1GzVvU8SIvSKUzD+IZyJn63HiJoWJxsguGHeQifaNvByt7+zAQA===",r="IwNgHgLAHAPgDAxTktWxx0YZrTi7qYHFrElyH7kmnW22Ua0BMwbBTOJbvj3PFhwrN2Y4clZiR9BlVkyynPCtVr1GzVu06t8rLn3ZKR/CbooaF6uYry5jQg8eiec1+IYLhyj+8nOSl4GvkA==";switch(t){case"Goo":this.spriteCompressed=e,this.displayName="floating ball of dripping ooze",this.shortName="Gooball",this.color="#d800cc";break;case"Fire":this.spriteCompressed=r,this.displayName="floating orb of fire",this.shortName="Fireball",this.color="#f83800",this.hand1=new Hose("Fire")}}function Scamp(t){this.stats={str:2,agi:12,"int":10,cha:8,phys:0,magi:1,maxHP:10},this.spriteCompressed="IwNgHgLAHAPgDAxTktW9HNbcY2G7a6EbHFYmll47WVI1kHpNWu170qU2q/P5BQ4SNFjxEyVypFybOTMx0WdfokZy1ydhwV9C0hry3rtk8xcuIgA=",this.displayName="Scamp",this.color="#b8f818"}function Skele(t){switch(this.stats={str:6,agi:6,"int":6,cha:2,phys:0,magi:0,maxHP:12},""===t&&(t=randomEntry(["Footman","Archer","Monk","Bruiser","Flaming","Bones"])),this.color="#f0d0b0",t){case"Footman":this.stats.maxHP=14,this.stats.str=8,this.stats.phys=1,this.spriteCompressed="IwNgHgLAHAPgDAxTktW9HPOGn3f7B5JGJHnFlV6mFwX2PWrklnGtX2ef5P99KLNukpC+CcSK5ZZc+QsVLlKjFIGSCbWiQ4VxHJjuYMcYjZON7257rV4jDKJ6JnC3ziZ5JA==",this.displayName="Skelebones Footman",this.hand1=new Sword;break;case"Archer":this.stats.agi=9,this.spriteCompressed="IwNgHgLAHAPgDAxTktW4aUY5xP/pLaFFzA57lXVWl5kIWPLVZ2YFlOn62oWdcgksw7t+4tpNwzZc+QsVKps4qtHd69TaO3caB8uLX6WfYzM5GJvayuETdInVqcq3knEA",this.displayName="Skelebones Archer";break;case"Monk":this.stats.agi=9,this.stats["int"]=9,this.stats.phys=1,this.stats.magi=1,this.spriteCompressed="IwNgHgLAHAPgDAxTktW9HPOGn3f7B74JFnGLE55ErVzkN1PMkNWuMuGkb3e4O6ChVa9hbLFOkzZc+QsUTUogUlHVV3crTb9d6po1X9J49pU5lzhmn11bDNsWrOO1wIA=",this.displayName="Wise, Old Skelebones",this.shortName="Skelebones Monk",this.hand1=new Staff;break;case"Bruiser":this.stats.maxHP=16,this.stats.str=10,this.stats.phys=2,this.spriteCompressed="IwNgHgLAHAPgDAxTktW9biKxux+o5JHIl55kXb40pFY4Gnk0PnbulML28mO0KldvUw9c/DJPTSxxXAsVLlK1WvUdxE7vOaFmOnn0G6WRui1psOwk5252BTO5tEWtMzXI/7T77EA=",this.displayName="Skelebones who thinks he's a badass",this.shortName="Skelebones Bruiser",this.hand1=new Sword("Iron");break;case"Flaming":this.spriteCompressed="IwNgHgLAHAPgDAxdhNW4KVqRj3GYBMe+CwxxW+55xpNld1uGh9yZVqmuH2XBdASoC+LMuz6kx0qXKGDJEpctlr1GzVvaj+unMhLTWR6hVPoKTfuZr0W+iVguDx+3aJEiF4+Qb/cikqOciECjuFAA",this.displayName="Skelebones who is on fire",this.shortName="Flaming Skelebones",this.buffs.push("Aflame"),this.color="#ff5000";break;case"Bones":this.spriteCompressed="IwNgHgLAHAPgDAxTktW9HPOFxPc7D7pGnGqEJFqGlzlINUrHXPZV30nsb5Mc8fRsKE8RuSVOkzZc+Qt5YBFeirxl13fitrVdqwWrESySwVu7mWJw9Ym2jVIA",this.displayName="Skelebones"}}function Snek(t){var e="IwNgHgLAHAPgDAxTktW9HNe14fib77pEEFpG7FXmF6ELWq2P0q2kuKdM5/8DBQ4SNFjx7Xs1IlKXJJTpsl2KQoXL2yNXA4zJPREA",r="IwNgHgLAHAPgDAxTktW9HNOD4HcHrABMpxuqBFeKJZ5RVmdD+hzpNzJXyvFtWjkGIqAuMLFMEU6VnkLFS5StVqhwxnNr1x2MRMr1WlbUc7c9aOr0YnRGyo776DMvLPGeBQA=";switch(this.stats={str:5,agi:9,"int":5,cha:9,phys:0,magi:0,maxHP:10},this.color="#58d854",""===t&&(t=randomEntry(["Big","Small"])),t){case"Big":this.hand1=new Claws,this.spriteCompressed=r,this.displayName="distressingly large Snek",this.shortName="Really Big Snek",this.stats.str=9,this.stats.agi=12,this.stats.cha=12,this.stats.maxHP=18;break;case"Small":default:this.hand1=new Claws("Venom"),this.spriteCompressed=e,this.displayName="Snek"}}function Jelly(t){this.stats={str:7,agi:10,"int":0,cha:0,phys:4,magi:0,maxHP:20},this.hand1=new Hose("Acid"),this.spriteCompressed="IwNgHgLAHAPgDAxTktW9HNwEy7/5bYYk07JI0q8xfPYOhS6spqk5mnd6tn17vw58hXZqL7jegnpRpEp03A365a5OgSzaduvfoOGjFTXkJCGFC1xyaGWxSuGPi4jRY4v2yj66+tOa39ObmCmBVUxDVMaIA===",this.displayName="quivering, gelatinous cube",this.shortName="Box Jelly",this.color="rgba(88,216,84,0.5)"}function Were(t){this.stats={str:12,agi:7,"int":5,cha:3,phys:1,magi:0,maxHP:20},""===t&&(t=randomEntry(["Wolf","Goat","Hellbeast"]));var e="IwNgHgLAHAPgDAxTktW9Lhyxhx8HoHH6YkmrmFlU5JbnZ1N7Xb2LGv11fuecKaWsJyFSmQd0kDhyZh3m5lK1WvUbNmhisaiqNEYaHzaC9ownS+/PD1JWWTLszEHKbnZSmPFd37Z23koIQA==",r="IwNgHgLAHAPgDAxTktWpx0M8TWdaK7F6onkrlVlW422lFzV1F4lOfPHaOves+bHumqj2/Mm0JC0jZnMqFlK1WvUbRM7tvlyK+2pQaThY5Cb04KkwSIVcB1jBJGzzNXnozT8Pxf5KFpohqkA=";switch(t){case"Wolf":this.spriteCompressed=e,this.displayName="Werewolf",this.color="#ac7c00",this.hand1=new Claws;break;case"Goat":this.stats.maxHP=22,this.stats.str=9,this.spriteCompressed=r,this.displayName="Weregoat",this.color="#d8d8d8";break;case"Hellbeast":this.stats.maxHP=25,this.stats.str=14,this.stats["int"]=8,this.stats.agi=8,this.stats.magi=1,this.spriteCompressed=r,this.displayName="loathsome, hellish beast",this.shortName="Hellbeast",this.color="#7c7c7c"}}function Mage(t){this.stats={str:5,agi:8,"int":12,cha:8,phys:0,magi:2,maxHP:12},this.hand1=new Staff("Thunder"),this.spriteCompressed="IwNgHgLAHAPgDAxTktW9HgeV7dgEF75K4oEBMuwV5hRJd9WZiNzL5cVlPrjFQQioVSo/LQT9xlBvzYjqaWUXn4OjHBwaltO4gcNHjJ08sNqmczArWy2qDZt3NnUvk4d9BInMKFSOKLsZNLqPA7kipFafIFarm7qGvx6OkA==",this.displayName="Wiz",this.color="#0058f8"}function Item(){this.owner=""}function Weapon(){this.natural=1,this.buffArr=[],this.uses=!0,this.targetStat="HP"}function Punch(){this.uses=!0,this.hitSprite="poof",this.attackType="physical",this.color="white",this.displayName="nothing but the essentials",this.shortName="Bare Hands",this.verbArray=["punch","smack","hit","wallop","slap"],this.attackVal=function(){var t=this.owner.stats.str,e=this.owner.stats.agi;return roll(Math.floor((t+e)/8)+"d3")}}function Sword(t){switch(this.hitSprite="slash1",this.attackType="physical",this.verbArray=["slash","strike","stab","lance","wound","cut"],t){case"Iron":this.uses=40,this.displayName="a modest but functional iron blade",this.shortName="Iron Sword",this.color="#008888",this.attackVal=function(){return roll("3d3")-2};break;case"Flame":this.uses=30,this.displayName="a shining red sword that smells of sulfur",this.shortName="Flame Sword",this.color="#f87858",this.attackType="flame",this.buffArr=["Aflame",8],this.attackVal=function(){return roll("3d3")-1};break;case"Wood":default:this.flammable=!0,this.uses=25,this.displayName="a wooden sword meant for practice",this.shortName="Wooden Sword",this.color="#f8b800",this.attackVal=function(){return roll("2d3")}}}function Staff(t){switch(this.hitSprite="kapow",this.attackType="physical",this.verbArray=["strike","bludgeon","bash","thwack","smack"],t){case"Thunder":this.uses=40,this.displayName="a staff enchanted with electricity",this.shortName="Thunder Staff",this.hitSprite="bolt",this.attackType="lightning",this.targetStat="HP",this.color="#b8f8d8",this.verbArray=["blast","electrocute","zap","smite"],this.attackVal=function(){return Math.floor(1.5*rollHits(this.owner.stats["int"]+"d3",3))};break;case"Wood":default:this.flammable=!0,this.uses=25,this.displayName="a solid, wooden staff",this.shortName="Wooden Staff",this.color="#f8b800",this.attackVal=function(){var t=this.owner.stats.str,e=this.owner.stats.agi;return rollHits(t+e+"d5",5)}}}function Claws(t){switch(this.hitSprite="claws",this.attackType="physical",this.targetStat="HP",this.verbArray=["maul","savage","lacerate","wound","cut"],t){case"Venom":this.uses=10,this.displayName="a pair of fangs with the venom sac still attached",this.shortName="Venom Fangs",this.color="#00b800",this.attackType="poison",this.buffArr=["Poisoned",6],this.attackVal=function(){var t=this.owner.stats.str,e=this.owner.stats.agi;return roll(Math.ceil((t+e)/12)+"d4")};break;case"Bone":default:this.uses=15,this.displayName="a set of sharp bone claws",this.shortName="Bone Claws",this.color="#f0d0b0",this.attackVal=function(){var t=this.owner.stats.str,e=this.owner.stats.agi;return roll(Math.ceil((t+e)/8)+"d4")}}}function Hose(t){switch(this.hitSprite="splat",this.attackType="physical",this.verbArray=["splash","douse"],t){case"Fire":this.uses=15,this.displayName="a glowing bladder of sorts, hot to the touch",this.shortName="Lava Sac",this.attackType="fire",this.targetStat="HP",this.color="rgba(248,56,0,0.5)",this.verbArray.push("ignite","torch"),this.buffArr=["Aflame",3],this.attackVal=function(){return roll("1d3")};break;case"Acid":default:this.uses=30,this.displayName="a slimy, acidic appendage",this.shortName="Acid Whip",this.attackType="acid",this.targetStat="maxHP",this.color="rgba(88,216,84,0.5)",this.verbArray.push("slime","spatter"),this.attackVal=function(){return roll("1d2")}}}function Effect(){this.sprites={kapow:"GwFgHgTCA+AM8MU5LVvRzXs93/BhRxJBAjKZahRjVSnQ4o8i/UmTZ/N+5ZwMFs+zHl2pDeItJJmTh0hLIbypi5vNaqBPbAqzKtq9SsFzDJpWN2mhlwtv32512GueYnjLx4Off+HRAA==",slash1:"GwFgHgTCA+AM8MU5LVvRzXs93/BhRxJpZaAjOdZTXUlfU40zRS5h65e9l9ynb9BwkXSF9RyXtQlYpAhDM6KMC1bnUa+20oyA",blast:"GwFgHgTCA+AM8MU5LVvRzXs93/BhRxJeAjGfBaTUpRQ4/bTU25S2h41Yk3zxLV07DggaoJRNl2FSq8uovLcxStfOXrCwhSl3iNa5AZUD9x2AdNLicywqNitAh9hmT7Tt4OlvDHgGe/iyqcq7Wvpw6oi7ROPSxVvGk9rBAA==",claws:"GwFgHgTCA+AM8MU5LVvRzXs93/BGAjCYWXiUeddpYnTYwqfA0+1ay15+4bwzZ8ynFkOH8uPCTSpjeM2XIWLypbmjmtVqUSuRbY+nfWNJDZk0cwWra6w7sFbmh5yA",poof:"GwFgHgTCA+AM8MU5LVvRzXs93/mAjASasaRYuUWdtafVTZbI0mwvR5y/Nz8n69B7YWNF9xU6TNlzWHQuSVEVWIfM1bN1DdvSM9+gxkXGmaflxPnWtU7aOSR6809stqQA",splat:"GwFgHgTCA+AM8MU5LVvRzXs93/BhRxhAjCduRdWuaVTQw/M/vfTS8h8ex62Tqx2JPjwpi+EkV1GSEAwbMHzqkxZRbq523qo1Z1MlVOn7ewqgc26LnREbvLhoy1ev3cQ7vCA=",bolt:"GwFgHgTCA+AM8MU58CMKOZervM70MQKKJNL3Iqyuo1rqXQcYVRcZw87Vd2+oC+vYU1GVxbSf0lDRcmdPrtxC1gTXYlW6c01klJFYZPJ99WOYtNjwrtrGW7UhyLeDH2qzrTfrr93kAl1MAv2wgA==",flame:"GwFgHgTCA+AM8MU5LVvRzXs93/BaAjIZiaauRZdckVbUvYwsy0w7W7Jyr06358y9ckMTdhPUVkl8Zc+emajxEtatU14i9ZqFVdO+hH1Kt81ad0qZl6xY5m6mh5c0uTzvaLdPfjsZWdoJEEOFecvoODAFhEVGugSbhqX5B1qkh0vFp1nqZCbG5eZIpefmCFQnq1ZWsdbwlaU2NdG0c1a0Vis01TF385fWdWQYlRsNGQWozItOh5EA",bubble:"GwFgHgTCA+AM8MU5LVvRzXs93/BhRsAjMefmRdalSnTdQws42iR21/BxH59ywdWiEnwhiRgpGIlTZ/SdPQL54/hNFStxVbXXjty0gP3qjxoaouWrN24xH2Ho9i8LP3KhEA=="},this.color="yellow",this.associatedCharacter=""}function addClick(t,e){t.addEventListener("click",e)}function tempClosure(t,e){return t[e]}function loadButtons(){for(var t=document.getElementsByClassName("button"),e=0;e<t.length;e+=1)t[e].addEventListener("click",function(t){return function(){var e=t.getAttribute("click-data");currentGame[firstWord(e)](secondWord(e))}}(t[e]))}var __nativeST__=window.setTimeout;window.setTimeout=function(t,e){var r=this,s=Array.prototype.slice.call(arguments,2);return __nativeST__(t instanceof Function?function(){t.apply(r,s)}:t,e)};var intervalRelay="",currentGame=new Game,interfaceElement=document.getElementById("interface");Displayable.prototype.constructor=Displayable,Displayable.prototype.draw=function(t,e){var r=LZString.decompressFromBase64(e),s=r.slice(r.indexOf("|")+1),a=r.slice(0,r.indexOf("x")),i=r.slice(r.indexOf("x")+1,r.indexOf("|"));t.clearRect(0,0,a,i),t.fillStyle=this.color;for(var n=0;n<s.length;n+=1){var o=Math.floor(n/a);1==s.slice(n,n+1)?(t.fillStyle=this.color,t.fillRect(n-o*a,o,1,1)):2==s.slice(n,n+1)&&(t.fillStyle="black",t.fillRect(n-o*a,o,1,1))}},Location.prototype=new Displayable,Location.prototype.constructor=Location,Character.prototype=new Displayable,Character.prototype.constructor=Character,Character.prototype.updateStatus=function(){this.HP<1?this.HP=0:this.HP>this.stats.maxHP&&(this.HP=this.stats.maxHP),this.displayElement.hpText.innerHTML=this.HP+"/"+this.stats.maxHP;var t=Math.floor(this.HP/this.stats.maxHP*100);this.displayElement.hpBar.style.width=t+"%",this.displayElement.hpBar.className="hp-bar hp-"+10*Math.round(t/10),0===this.HP&&this.die()},Character.prototype.addClass=function(t){this.div.classList.add(t)},Character.prototype.wiggle=function(t,e){this.div.classList.add(t);var r=this;setTimeout(function(){r.div.classList.remove(t)},e)},Character.prototype.equip1=function(t){t.owner=this,this.hand1=t,"Hero"===this.constructor.name&&(document.getElementById("equip1").innerHTML=shorten(t.shortName,17))},Character.prototype.equip2=function(t){t.owner=this,this.hand2=t,"Hero"===this.constructor.name&&(document.getElementById("equip2").innerHTML=shorten(t.shortName,17))},Character.prototype.getEnemy=function(){return"Hero"===this.constructor.name?currentGame.currentMonster:currentGame.playerHero},Character.prototype.defense=function(t){switch(t){case"white":case"black":return this.stats.magi;case"lightning":case"fire":return this.burnItems(),Math.floor((this.stats.magi+this.stats.phys)/2);case"poison":return 0;case"physical":default:return this.stats.phys}},Character.prototype.burnItems=function(){for(var t=[this.hand1,this.hand2],e=t.length-1;e>=0;e--)"undefined"!=typeof t[e]&&t[e].flammable===!0&&(t[e].uses-=roll("1d10"))},Character.prototype.hit=function(t){intervalRelay="wait";var e=this.defense(t.type),r=t.calculated-e<0?0:t.calculated-e,s=t.natural+r;"HP"===t.targetStat?this.HP-=s:(s=r,this.stats[t.targetStat]-=s),this.effectController.displayDamage(t.sprite,t.color),this.wiggle("hit",250);var a=randomEntry(t.verbs),i="";i=t.buff?firstCap(this.selfStr())+" "+this.conjugate(a)+" for "+s+t.targetStat.toUpperCase()+".":firstCap(this.getEnemy().selfStr())+" "+this.getEnemy().conjugate(a)+" "+this.selfStr().toLowerCase()+" for "+s+t.targetStat.toUpperCase()+".",currentGame.log.add(i),this.updateStatus();var n=1;if(t.buffArr.length>1){var o=t.buffArr[0],h=t.buffArr[1],c=rollHits("1d"+h,h)>=1;c&&!this.buffs.includes(o)&&this.HP>0&&(a="are",i=firstCap(this.selfStr())+" "+this.conjugate(a)+" "+o+".",this.buffs.push(o),setTimeout(function(){currentGame.log.add(i)},1e3),n++)}t.buff||setTimeout(function(){intervalRelay="Check equip"},1e3*n)},Character.prototype.selfStr=function(){return"Hero"===this.constructor.name?"You":"The "+this.shortName},Character.prototype.conjugate=function(t){return"Hero"===this.constructor.name?t:thirdPerson(t)},Character.prototype.runBuffs=function(){var t="Use equip";if(this.buffs.length<1)return void(intervalRelay=t);var e=this.buffs.slice(),r=this,s=0,a=!1,i={},n=!0,o=setInterval(function(){if(!a&&n){i=r.buffEffect(e[s]),r.hit(i);var h=roll("1d"+i.cureChance)===i.cureChance;if(h){var c=r.buffs.indexOf(e[s]);-1!==c&&r.buffs.splice(c,1),a=!0,setTimeout(function(){n=!0},1e3)}else s++,setTimeout(function(){n=!0},1e3)}else n&&(currentGame.log.add(r.selfStr()+" "+r.conjugate("are")+" no longer "+e[s].toLowerCase()+"."),a=!1,s++);s>=e.length&&!a&&n&&(r.HP<=0&&(t="End round"),clearInterval(o),setTimeout(function(){intervalRelay=t},1e3))},750)},Character.prototype.checkEquip=function(t){var e="";switch(t){case"activate1":e=this.hand1;break;case"activate2":e=this.hand2;break;default:return void(intervalRelay="End turn")}e.checkExhausted()?(e.exhaust(),setTimeout(function(){intervalRelay="End turn"},1e3)):intervalRelay="End turn"},Character.prototype.buffEffect=function(t){var e={};switch(e.buff=!0,e.cureChance=3,e.natural=0,e.calculated=0,e.type="physical",e.targetStat="HP",e.color="white",e.verbs=["waste"],e.buffArr=[],t){case"Aflame":e.calculated=roll("1d3")+Math.ceil(roll("1d5")*this.stats.maxHP/100),e.type="fire",e.sprite="flame",e.color="red",e.verbs=["burn","roast"];break;case"Poisoned":e.calculated=roll("1d3"),e.type="poison",e.sprite="bubble",e.color="purple",e.verbs=["waste","wither"]}return e},Character.prototype.runAway=function(){var t=this.calcDodge();if(t){var e="Hero"===this.constructor.name?"manage":"manages",r=firstCap(this.selfStr())+" "+e+" to escape!";currentGame.log.add(r),currentGame.currentMonster.addClass("escaped"),setTimeout(function(){intervalRelay="End round",currentGame.switchMonster()},1e3)}else{var e="Hero"===this.constructor.name?"try":"tries";r=firstCap(this.selfStr())+" "+e+" to flee, but to no avail...",currentGame.log.add(r),setTimeout(function(){intervalRelay="End turn"},1e3)}},Character.prototype.useHand1=function(){return this.hand1?this.hand1.attackObj():this.punch()},Character.prototype.activate1=function(){"undefined"==typeof this.hand1&&this.equip1(new Punch),this.useItem(this.hand1)},Character.prototype.activate2=function(){"undefined"==typeof this.hand2&&this.equip2(new Punch),this.useItem(this.hand2)},Character.prototype.useItem=function(t){var e=t.attackObj();e.targetCharacter!==this&&e.targetCharacter.calcDodge()?e.targetCharacter.dodge():(t.uses!==!0&&t.uses--,e.targetCharacter.hit(e))},Character.prototype.runTurn=function(t){var e="Hero"===this.constructor.name?"Monster turn":"End round";intervalRelay="Check buffs";var r=this,s=setInterval(function(){if("Check buffs"===intervalRelay)intervalRelay="wait",r.runBuffs();else if("Use equip"===intervalRelay)intervalRelay="wait",r[t]();else if("Check equip"===intervalRelay)intervalRelay="wait",r.checkEquip(t);else if("End turn"===intervalRelay)intervalRelay="wait",clearInterval(s),intervalRelay=e;else if("End round"===intervalRelay)return void clearInterval(s)},250)},Hero.prototype=new Character,Hero.prototype.constructor=Hero,Hero.prototype.debug=function(){this.equip2(new Sword("Flame")),currentGame.log.add("...something mysterious occurrs..."),setTimeout(function(){intervalRelay="End turn"},1e3)},Hero.prototype.possesive=function(){return"your"},Hero.prototype.calcDodge=function(){for(var t=[],e=currentGame.currentMonster.stats.agi-1;e>=0;e--)t.push(!1);for(var r=this.stats.agi/2-1;r>=0;r--)t.push(!0);return randomEntry(t)},Hero.prototype.dodge=function(){this.wiggle("dodge",500),currentGame.log.add("You dodge the "+currentGame.currentMonster.shortName+"'s attack."),intervalRelay="End turn"},Hero.prototype.die=function(){intervalRelay="End round",this.addClass("dead"),currentGame.log.add("You were slain by the "+currentGame.currentMonster.shortName+"."),setTimeout(function(){currentGame.log.add("You slayed "+currentGame.playerHero.kills+" monsters before perishing.")},2e3)},Hero.prototype.initialize=function(){this.effectController=new Effect,this.effectController.link(this),this.equip1(new Sword),this.draw(this.canvas,this.spriteCompressed),this.updateStatus()},Monster.prototype=new Character,Monster.prototype.constructor=Monster,Monster.prototype.possesive=function(){return"the "+this.shortName.toLowerCase()+"'s"},Monster.prototype.announce=function(){var t="";t=currentGame.previousMonsterName===this.displayName?"another ":-1!=="AEIOU".indexOf(this.displayName.slice(0,1))?"an ":"a ";var e="It's "+t+this.displayName.toLowerCase()+"!";currentGame.log.add(e),""===this.shortName&&(this.shortName=this.displayName),this.displayElement.name.innerHTML=this.shortName},Monster.prototype.appear=function(){this.announce(),this.effectController=new Effect,this.effectController.link(this),this.draw(this.canvas,this.spriteCompressed),this.HP=this.stats.maxHP,this.updateStatus()},Monster.prototype.die=function(){intervalRelay="End round",this.addClass("dead"),currentGame.log.add("You slayed the "+this.shortName+"."),currentGame.playerHero.kills++,currentGame.playerHero.kills>=currentGame.currentLocation.switchTrigger?setTimeout(currentGame.switchLocation,2e3):setTimeout(currentGame.switchMonster,2e3)},Monster.prototype.calcDodge=function(){for(var t=[],e=currentGame.playerHero.stats.agi-1;e>=0;e--)t.push(!1);for(var r=this.stats.agi/2-1;r>=0;r--)t.push(!0);return randomEntry(t)},Monster.prototype.dodge=function(){this.wiggle("dodge",500),currentGame.log.add("The "+this.shortName+" dodges your attack."),intervalRelay="End turn"},Axedude.prototype=new Monster,Axedude.prototype.constructor=Axedude,Ball.prototype=new Monster,Ball.prototype.constructor=Ball,Scamp.prototype=new Monster,Scamp.prototype.constructor=Scamp,Skele.prototype=new Monster,Skele.prototype.constructor=Skele,Snek.prototype=new Monster,Snek.prototype.constructor=Snek,Jelly.prototype=new Monster,Jelly.prototype.constructor=Jelly,Were.prototype=new Monster,Were.prototype.constructor=Were,Mage.prototype=new Monster,Mage.prototype.constructor=Mage,Item.prototype=new Displayable,Item.prototype.constructor=Item,Weapon.prototype=new Item,Weapon.prototype.constructor=Weapon,Weapon.prototype.checkExhausted=function(){return this.uses<=0},Weapon.prototype.exhaust=function(){if(this.uses!==!0){this.owner.hand1===this?this.owner.equip1(new Punch):this.owner.hand2===this&&this.owner.equip2(new Punch);var t=firstCap(this.owner.possesive())+" "+this.shortName+" breaks.";currentGame.log.add(t)}},Weapon.prototype.attackObj=function(){var t={};return t.natural=this.natural,t.calculated=this.attackVal(),t.type=this.attackType,t.sprite=this.hitSprite,t.color=this.color,"Punch"===this.constructor.name&&"Hero"!==this.owner.constructor.name&&(t.color=this.owner.color),t.verbs=this.verbArray,t.targetCharacter=this.owner.getEnemy(),t.buffArr=this.buffArr,this.owner.buffs.includes("Aflame")&&(t.buffArr=["Aflame",3]),"physical"===this.attackType?t.targetStat="HP":t.targetStat=this.targetStat,t},Punch.prototype=new Weapon,Punch.prototype.constructor=Punch,Sword.prototype=new Weapon,Sword.prototype.constructor=Sword,Staff.prototype=new Weapon,Staff.prototype.constructor=Staff,Claws.prototype=new Weapon,Claws.prototype.constructor=Claws,Hose.prototype=new Weapon,Hose.prototype.constructor=Hose,Effect.prototype=new Displayable,Effect.prototype.constructor=Effect,Effect.prototype.link=function(t){this.associatedCharacter=t,this.damageElement=t.div.getElementsByClassName("damage-sprite")[0],this.damageCanvas=this.damageElement.getContext("2d")},Effect.prototype.displayDamage=function(t,e){this.color=e,this.damageElement.classList.add("active",t),this.draw(this.damageCanvas,this.sprites[t]);var r=this;setTimeout(function(){r.clear()},500)},Effect.prototype.clear=function(){this.damageElement.className="damage-sprite"},loadButtons(),currentGame.initialize();