function randomEntry(t){return t[Math.floor(Math.random()*t.length)]}function roll(t){for(var e=t.slice(0,t.indexOf("d")),s=t.slice(t.indexOf("d")+1),r=0,a=e-1;a>=0;a--)r+=Math.floor(Math.random()*s)+1;return r}function rollHits(t,e){for(var s=t.slice(0,t.indexOf("d")),r=t.slice(t.indexOf("d")+1),a=0,o=s-1;o>=0;o--){var n=roll("1d"+r);(n>=e||n===r)&&a++}return a}function thirdPerson(t){switch(t){case"bash":case"punch":case"slash":case"splash":t+="es";break;default:t+="s"}return t}function Game(){this.log={element:document.getElementById("gameLog"),add:function(t){this.element.innerHTML+="<p>"+t+"</p>",this.element.scrollTop=this.element.scrollHeight}},this.currentLocation=new Location,this.playerHero=new Hero("TEMP"),this.currentMonster=new Monster,this.previousMonsterName="",this.initialize=function(){this.switchLocation(),this.playerHero.initialize(),this.switchMonster()},this.enterMonster=function(t){this.previousMonsterName=this.currentMonster.displayName;var e=t.slice(0,t.indexOf(" ")),s=t.slice(t.indexOf(" ")+1);-1===t.indexOf(" ")&&(e=t,s="");var r=new window[e](s);r.div.className="",r.hand1&&r.equip1(r.hand1),r.appear(),this.currentMonster=r},this.switchMonster=function(){var t=randomEntry(currentGame.currentLocation.monsterArray);currentGame.enterMonster(t)},this.switchLocation=function(t){var e=["Dungeon","Volcano","Forest","Graveyard","Mine"];"undefined"!=typeof t&&e.includes(t)||(t=randomEntry(e)),currentGame.currentLocation=new Location(t),this.currentLocation.draw(this.currentLocation.canvas,this.currentLocation.spriteCompressed),this.currentLocation.canvas.fillRect(0,40,160,50)},this.attack=function(){interfaceElement.classList.add("wait");var t=0,e=["player turn","monster turn","end"],s=setInterval(function(){switch(e[t]){case"player turn":var r=currentGame.playerHero.useHand1();currentGame.currentMonster.calcDodge()?currentGame.currentMonster.dodge():currentGame.currentMonster.hit(r);break;case"monster turn":if(currentGame.currentMonster.HP>0){var a=currentGame.currentMonster.useHand1();currentGame.playerHero.calcDodge()?currentGame.playerHero.dodge():currentGame.playerHero.hit(a)}break;case"end":currentGame.playerHero.HP>0&&interfaceElement.classList.remove("wait"),clearInterval(s)}t++},1e3)}}function Displayable(){}function Location(t){switch(this.canvas=document.getElementById("level-sprite").getContext("2d"),this.shortName=t,t){case"Dungeon":this.spriteCompressed="BwBgHgLCA+CM8MU5LVvRzCQi3/qORxJ2JuuBV1Z5xNDjTzLjOsFlhKnXrzFDojod2ddvwFCu40fXKSpg+LPFEhittLIqkvBX00FBM9WpESdGo8hO195+rvXabw13Idq5K0hsNGdtJi3q6UYs7WbtoBUU7y4WbhUW5BngmO6aKR0ZGmBo6JITm5aYXmWRJpNmUWfnEu7rGaQXwy6UkVHrkeGRWFJT3Knh11Xe09ur4hmaQKMZPDffPWhm3dgRtT0zPL2QvRteVjEXbN/K3Hqgl5pWFXJ5y3h/fl7u9xW4rV9iM+c8UDqlep0vLsvM9gUtvJ1Kn4fjVVjCTA4dtgvpIjqjGjxuMNEfjcW0ClVkoSWiCSflQU8gQSGgD2stlKdzgIUfYkilbJZJsZ5Gwut9ZPzkZlWG8dgogA==",this.monsterArray=["Axedude","Ball Goo","Skele Bones","Skele Footman","Mage","Jelly"];break;case"Volcano":this.spriteCompressed="BwBgHgLCA+CM8MUpJWpWz6308/sWBxJuRiIhWO6ZupF5peGTC1eLhD+Ht7fSgLZV6VfjlE9kg2XK5Txk7rSHTW8zW1XVGQ/uuFatRpQtOGZus8bJrlBvWssantxwedXHLuhs1iAhTM5r5eRnKBQezM0b7cBCYJesHEXuHx3pG8lM4ZUX6ZidmJij4FcUX+1qWeaWn5mSXeKLHFjS5MHQrlMSGhhgM5fCQdbiIMyqM9vcnSM+qzbhj1nRljlrPdYflLi43bO6NFU627J8fxuZfhGyGXm3uKMU8POYP2kzIVg22TdV8+j8eKdvl9JHcIalNkDhg9VPNxND5ulpuU8qD2n5XnZeKtPOlMVkOPtdgdscM9kQSf1Kb0JHMIh5BDYMSy7CMwT9jJyeXztMjWazqcyAvyWKiObj5P8ablOMSaRyFsKBhMmrJVWzleqqnT3Di9SdsJq7kbzfR5aggA==",this.monsterArray=["Axedude","Ball Fire","Skele Monk","Skele Bruiser","Were Hellbeast"];break;case"Forest":this.spriteCompressed="IwNgDAHgLGA+ZmE5TEOOhiUrVj+ORWJhq2OpFlBtZxBm9R5V6y7lpLrjtPeJpx6M2IjlRH5p1GiVHjWYxcpZC8U3vPFtuapc1yCNArYa67huA+bq3rgvjstXiqrgpUY+9m5Of+DKKyDMK+we7WEa6oBl5hMUYuptEhsZFy2okSyQF6oYH6etl++QIZSdpqxkwqLmkUMiUV5BH8UvX6Zmnejfbq7D053FUcEp6hceVt3nnyo7GtC4sDPauKw01W1NjLs7tlRjMbYoc7SkGW5TUlmwNyFiEHNdfRG29ns8MdLXaH11tXLJ/nd+jchpV1jRIUVdK97nV5iCdntwYkZMETiNkTCCr9MMc5lMojZYfi0ISfoNliiaaCOulCgC/g07kE3tNekzqrUnNCOWM/Az6Yj2oY+kyJXtWiKAnygaDgbK3Iqsd0npDtsqPKU1al2QKxjdhYbNJjxftuRTueMhSdShrnnTjZzTYirZrHZSjnb3qkNdqViClm7LlcHqGndkCb9BbkHL6ovMflzpW5w2GcQohtJvQCWlGYk6vpMXViM9CKsWc708zy4V0q3E1rWbemK0mbVGSwmy3MC6TG8mk/w248Gyq292lVzB+6Jx4xy8Z1k0+Ou4y08vK4Rg+2m6nwhNBZ58hCfHvLUe6RdMYsU2Or+fbz6CXf3qsGhTj1SVXRiWqVbfmu3w6k4Z51ISfRPh+4oSsS55Qveb5rtBf7gfQiF1sOvhoWBu6YfEwY4ay6EkqeYSwQsuwUV0YHkau5zlswNGrnRjRmhR8HuuyxgniSHEpFxOTMbxEwBuB/HnJwwG3DKKR7txgn3rO6S8HqCkgVoXipoG1Q6ABD46Y4iYmkO17UZc6mbPanGPu+KkrNZhl0exl7tPyRQebafoGoezhCV5RbPgZDi2OFpEoq8vkMtG6KRT66YxbFIVJX5BxEj4PZBclfLkZamW5s+1rJVmnawfxxm5WVcYhTJvk0Q1M6eTKb65QFpXNflo7fu1Zl9aFA0DalfUjUNrnjZNU3TTNs0sEAA=",this.monsterArray=["Axedude","Scamp","Were Wolf","Skele Archer","Snek"];break;case"Graveyard":this.spriteCompressed="IwNgDAHgLGA+wMU5LVjKzn3HXrCGBxJuRp2GeOB5F9ZDKV+1Ny7TFdXZbO+Zp2I9+fYb1zjWYsSVFtpkjtIGzF86lObblSGQfUy0/HoQnKWppaYkG9XQatVWt+tWYcj2RrbZdevMK+hqEWgd4citb+4Qxu8bYhSQmWTvQxKX7WEXJRSYzuyXmBGvku6eZZHhGESkUeqfnZ0Z6W9YitZUJdbm1BjbKahbTOub3impUmOV6Z3SZRtK5xTPNNQktYg6He6yuC0Z0+flVhVss2sQmzTjnZAd3Fjzd1x+lE5PuDDTsHK503mc6J93r1zi9wT9lv06t9/pCWkjYXwRBVrtV/hiUdwEZi/tj/HN8fDCSlAT0LJ8oVjSaSgb80MDyfDERC7Colqzuc9Mjp9Jt5pMWedDOi3tTQdp2QVkRMRQIJXClc4yXjeUNKhcqBKNTS2X8pFrUTrpcVdrK5YdWCMGgzGPrLaKATtbUaNszrY69X0Pe6bUUDervRoFoCjoG1UHo4rdBTTu5/VaYxrpfyE8ck1a1bF3YUWCoI4Lac7zTqaKDgv644mCeiy8ZOLGBUX7QSc+sHSD7Vma03JSHkWbbWo9KPwz6LeYRwW0iPPWKWV3l1LtrOuavF07XCvTc3KNN8yNk/th+WHbUCwPDafqUa8ziMheg4qvc/12s/dPXyETdaV6ijiHrWV6/uWhwAT2tQwkO4EVpBNbQdsiL5gGqwDI+OidhWaGYRk6EHsYJpYXhSGXI2AYtqRZGUH+gE0biQF0cBDGLJ+gGmqxXE1PeXHcdq1HtNwiR0XxUHYAMYlSVs0myXJ/JrPJjhBEpqlqepGmaVp2k6bpen6QZgRAA===",this.monsterArray=["Were","Skele"];break;case"Mine":this.spriteCompressed="IwNgDAHgLGA+wMU5LVvRzXs93/BhRxJpZ5FlV1Ntd9DjTzLrb7HnX3PvfwYJIITCyo0QP4lx7MIPlUFc2YgljJ9GSgWUdyLXT3k1Q46bTLVeCZdQ2zF3RhOlLc2wJf4P74R4eOrl5CwdbKvr6q/rjuURHy0YSJ+qFJsYbx6YqZycZZtDkp3rY5kbqlJbkWaoVBKbFlGmmeES1ZVdrirZmexF3hjSKpdiED7X0JFW7DnUNTCX1xY/ZJSw3pM9U9kw1EO+FtrXtz+yWLhz0ix/PxezeRm9prl49PJ7VNYRcVn9bfpb0CP0AVdVu9LqC/v9Cq9TPc3EDRiDfjgajtARQHuszt4lm18eV8f5Yb98vlzkd3lZcVS1pDpD5iXkQjRBoMUc56jZycyok59PShmlgSc+c1RQSWuLzCYSccGXE5mK7oqpULpFJqDVBXKBTK9ZrDUbjSbTWbzRbLVbrTbbXb7Q7HU7nS7XW73R7PV7vT7fX7/QggA=",this.monsterArray=["Skele Footman","Were Goat","Jelly","Snek"]}document.body.className=this.shortName,document.getElementById("level-text").innerHTML="LVL: "+this.shortName}function Character(){}function Hero(t){this.div=document.getElementById("hero"),this.canvas=document.getElementById("hero-sprite").getContext("2d"),this.heroName=t,this.displayElement={hpText:document.getElementById("hero-hp-text"),hpBar:document.getElementById("hero-hp-bar"),name:document.getElementById("hero-name")},this.displayElement.name.innerHTML=t,this.stats={str:8,agi:8,"int":8,cha:8,phys:1,maxHP:100},this.HP=this.stats.maxHP,this.kills=0,this.spriteCompressed="IwNgHgLAHAPgDAxTktW9HNfcY267a6EbHGlkkp6VVJ4EnmIOOs5maVc3vWt1kVQfSFpBI/FOkzZc+QsUJJqFUOYdOmrdTY7RbZXQbcKG8bwos+9ATZZjVfKkA===",this.color="white"}function Monster(){this.div=document.getElementById("monster"),this.canvas=document.getElementById("monster-sprite").getContext("2d"),this.shortName="",this.displayElement={hpText:document.getElementById("monster-hp-text"),hpBar:document.getElementById("monster-hp-bar"),name:document.getElementById("monster-name")}}function Axedude(t){this.stats={str:10,agi:5,"int":5,cha:2,phys:2,maxHP:16},this.spriteCompressed="IwNgHgLAHAPgDAxTktW9GnG8ZvG475Y4FzFkUUJFHl62nWO0ovnap01ff1us0LajSacRHAvhGcpQqhP5ZeAzGvUbNW7Tsx8elUg1n0ZS86MYXhhY8IGsjdsg5MSr8j86YrLFyXJcbL4kumHqQA==",this.displayName="Axedude",this.color="#f8d878",this.hand1=new Sword}function Ball(t){this.stats={str:7,agi:7,"int":1,cha:1,phys:0,maxHP:15},""===t&&(t=randomEntry(["Fire","Goo"]));var e="IwNgHgLAHAPgDAxTktW9HNbcXncF6qEkqFzAUHLWV1EKmPnN51UNvu1L0nuJKHahWJVR+RliHYZ2eQsVLlK1Wtb5+Ofg0E6Re2i1ZthMrVuZmeg66dvWpZcXJxOMrj+u8/fGIA==",s="IwNgHgLAHAPgDAxTktWxx0YZrTi7qYHFrElyH7kmnW22UaM1M4WmPsXcH1Ot6nHkIZkGVVCLwzZc+QsVLlKhZKy512Slvw66KGger6OyCS2YW+hCab69h0sWNF3z18a6IO4QA===";switch(t){case"Goo":this.spriteCompressed=e,this.displayName="floating ball of dripping ooze",this.shortName="Gooball",this.color="#d800cc";break;case"Fire":this.spriteCompressed=s,this.displayName="floating orb of fire",this.shortName="Fireball",this.color="#f83800"}}function Scamp(t){this.stats={str:2,agi:12,"int":10,cha:8,phys:0,maxHP:10},this.spriteCompressed="IwNgHgLAHAPgDAxTktW9HNbcY2G7a6EbHFYmll47WVI1kHpNWu170qU2q/P5BQ4SNFjxEyVypFybOTMx0WdfokZy1ydhwV9C0hry3rtk8xcuIgA=",this.displayName="Scamp",this.color="#b8f818"}function Skele(t){switch(this.stats={str:6,agi:6,"int":6,cha:2,phys:0,maxHP:12},""===t&&(t=randomEntry(["Footman","Archer","Monk","Bruiser","Flaming","Bones"])),this.color="#f0d0b0",t){case"Footman":this.stats.maxHP=14,this.stats.str=8,this.stats.def=1,this.spriteCompressed="IwNgHgLAHAPgDAxTktW9HPOGn3f7B5JGJHnFlV6mFwX2PWrklnGtX2ef5P99KLNukpC+CcSK5ZZc+QsVLlKjFIGSCbWiQ4VxHJjuYMcYjZON7257rV4jDKJ6JnC3ziZ5JA==",this.displayName="Skelebones Footman",this.hand1=new Sword;break;case"Archer":this.stats.agi=9,this.spriteCompressed="IwNgHgLAHAPgDAxTktW4aUY5xP/pLaFFzA57lXVWl5kIWPLVZ2YFlOn62oWdcgksw7t+4tpNwzZc+QsVKps4qtHd69TaO3caB8uLX6WfYzM5GJvayuETdInVqcq3knEA",this.displayName="Skelebones Archer";break;case"Monk":this.stats.agi=9,this.stats["int"]=9,this.stats.def=1,this.spriteCompressed="IwNgHgLAHAPgDAxTktW9HPOGn3f7B74JFnGLE55ErVzkN1PMkNWuMuGkb3e4O6ChVa9hbLFOkzZc+QsUTUogUlHVV3crTb9d6po1X9J49pU5lzhmn11bDNsWrOO1wIA=",this.displayName="Wise, Old Skelebones",this.shortName="Skelebones Monk",this.hand1=new Staff;break;case"Bruiser":this.stats.maxHP=16,this.stats.str=10,this.stats.def=2,this.spriteCompressed="IwNgHgLAHAPgDAxTktW9biKxux+o5JHIl55kXb40pFY4Gnk0PnbulML28mO0KldvUw9c/DJPTSxxXAsVLlK1WvUdxE7vOaFmOnn0G6WRui1psOwk5252BTO5tEWtMzXI/7T77EA=",this.displayName="Skelebones who thinks he's a badass",this.shortName="Skelebones Bruiser",this.hand1=new Sword;break;case"Flaming":this.spriteCompressed="IwNgHgLAHAPgDAxdhNW4KVqRj3GbJb7Kl4mGn6F7Hq7nVWOqa5XrZ0LGPfPsOnIUxHCeJIfxwyKrSQsVLlK1WSUsuRaazYKaOiVkMGxBBofVEmDM2f69ew23eb6C7iXI/efWnEA=",this.displayName="Skelebones who is on fire",this.shortName="Flaming Skelebones",this.color="#ff5000";break;case"Bones":this.spriteCompressed="IwNgHgLAHAPgDAxTktW9HPOFxPc7D7pGnGqEJFqGlzlINUrHXPZV30nsb5Mc8fRsKE8RuSVOkzZc+Qt5YBFeirxl13fitrVdqwWrESySwVu7mWJw9Ym2jVIA",this.displayName="Skelebones"}}function Snek(t){this.stats={str:9,agi:12,"int":5,cha:10,phys:0,maxHP:10},this.hand1=new Claws,this.spriteCompressed="IwNgHgLAHAPgDAxTktW9HNe14fib77pEEFpG7FXmF6ELWq2P0q2kuKdM5/8DBQ4SNFjx7Xs1IlKXJJTpsl2KQoXL2yNXA4zJPREA",this.displayName="Snek",this.color="#58d854"}function Jelly(t){this.stats={str:7,agi:12,"int":0,cha:0,phys:4,maxHP:25},this.hand1=new Bucket,this.spriteCompressed="IwNgHgLAHAPgDAxTktW9HNecXf8r5HBYmrEkGIWW4413UOMLMtxv3NJ0M80cyrQQJ4ii2SVOkzZc+QsXk+XCqTRqq4iQVqdtKtnlZGmetQd0tzxHJaFA",this.displayName="quivering, gelatinous cube",this.shortName="Box Jelly",this.color="rgba(88,216,84,0.5)"}function Were(t){this.stats={str:12,agi:7,"int":5,cha:3,phys:1,maxHP:20},""===t&&(t=randomEntry(["Wolf","Goat","Hellbeast"]));var e="IwNgHgLAHAPgDAxTktW9Lhyxhx8HoHH6YkmrmFlU5JbnZ1N7Xb2LGv11fuecKaWsJyFSmQd0kDhyZh3m5lK1WvUbNmhisaiqNEYaHzaC9ownS+/PD1JWWTLszEHKbnZSmPFd37Z23koIQA==",s="IwNgHgLAHAPgDAxTktWpx0M8TWdaK7F6onkrlVlW422lFzV1F4lOfPHaOves+bHumqj2/Mm0JC0jZnMqFlK1WvUbRM7tvlyK+2pQaThY5Cb04KkwSIVcB1jBJGzzNXnozT8Pxf5KFpohqkA=";switch(t){case"Wolf":this.spriteCompressed=e,this.displayName="Werewolf",this.color="#ac7c00",this.hand1=new Claws;break;case"Goat":this.stats.maxHP=22,this.stats.str=9,this.spriteCompressed=s,this.displayName="Weregoat",this.color="#d8d8d8";break;case"Hellbeast":this.stats.maxHP=25,this.stats.str=14,this.stats["int"]=8,this.stats.agi=8,this.spriteCompressed=s,this.displayName="loathsome, hellish beast",this.shortName="Hellbeast",this.color="#7c7c7c"}}function Mage(t){this.stats={str:5,agi:8,"int":12,cha:8,phys:0,maxHP:12},this.spriteCompressed="IwNgHgLAHAPgDAxTktW97geV7dgEF75K4pG5ZmKGELU20Xn5Mk71GsMM0f3tBOKpTRV2vTtyGM2kprXIK6xVWvUbNWjJLHE2M/iXniBSxYe6LeI5fxWHdPAV0sUy843yXTHCs6R2PMqu2mHhCEA=",this.displayName="Wiz",this.color="#0058f8"}function Item(){this.owner=""}function Weapon(){this.natural=1}function Sword(t){switch(this.hitSprite="slash1",this.attackType="physical",this.verbArray=["slash","strike","stab","lance","wound","cut"],t){case"Wood":default:this.color="#f8b800",this.attackVal=function(){return roll("2d3")}}}function Staff(t){switch(this.hitSprite="kapow",this.attackType="physical",this.verbArray=["strike","bludgeon","bash","thwack","smack"],t){case"Wood":default:this.color="#f8b800",this.attackVal=function(){var t=this.owner.stats.str,e=this.owner.stats.agi;return rollHits(t+e+"d5",5)}}}function Claws(t){switch(this.hitSprite="claws",this.attackType="physical",this.verbArray=["maul","savage","lacerate","wound","cut"],t){case"Bone":default:this.color="#f0d0b0",this.attackVal=function(){var t=this.owner.stats.str,e=this.owner.stats.agi;return roll(Math.floor((t+e)/8)+"d4")}}}function Bucket(t){switch(this.hitSprite="splat",this.attackType="physical",this.verbArray=["splash","douse"],t){case"Acid":default:this.attackType="acid",this.targetStat="maxHP",this.color="rgba(88,216,84,0.5)",this.verbArray.push("slime","spatter"),this.attackVal=function(){return roll("1d2")}}}function Effect(){this.sprites={kapow:"GwFgHgTCA+AM8MU5LVvRzXs93/BhRxJBAjKZahRjVSnQ4o8i/UmTZ/N+5ZwMFs+zHl2pDeItJJmTh0hLIbypi5vNaqBPbAqzKtq9SsFzDJpWN2mhlwtv32512GueYnjLx4Off+HRAA==",slash1:"GwFgHgTCA+AM8MU5LVvRzXs93/BhRxJpZaAjOdZTXUlfU40zRS5h65e9l9ynb9BwkXSF9RyXtQlYpAhDM6KMC1bnUa+20oyA",blast:"GwFgHgTCA+AM8MU5LVvRzXs93/BhRxJeAjGfBaTUpRQ4/bTU25S2h41Yk3zxLV07DggaoJRNl2FSq8uovLcxStfOXrCwhSl3iNa5AZUD9x2AdNLicywqNitAh9hmT7Tt4OlvDHgGe/iyqcq7Wvpw6oi7ROPSxVvGk9rBAA==",claws:"GwFgHgTCA+AM8MU5LVvRzXs93/BGAjCYWXiUeddpYnTYwqfA0+1ay15+4bwzZ8ynFkOH8uPCTSpjeM2XIWLypbmjmtVqUSuRbY+nfWNJDZk0cwWra6w7sFbmh5yA",poof:"GwFgHgTCA+AM8MU5LVvRzXs93/mAjASasaRYuUWdtafVTZbI0mwvR5y/Nz8n69B7YWNF9xU6TNlzWHQuSVEVWIfM1bN1DdvSM9+gxkXGmaflxPnWtU7aOSR6809stqQA",splat:"GwFgHgTCA+AM8MU5LVvRzXs93/BhRxhAjCduRdWuaVTQw/M/vfTS8h8ex62Tqx2JPjwpi+EkV1GSEAwbMHzqkxZRbq523qo1Z1MlVOn7ewqgc26LnREbvLhoy1ev3cQ7vCA="},this.color="yellow",this.associatedCharacter=""}function loadButtons(){for(var t=document.getElementsByClassName("button"),e=0;e<t.length;e+=1){var s=t[e].getAttribute("click-data");t[e].addEventListener("click",function(){currentGame[s]()})}}var __nativeST__=window.setTimeout;window.setTimeout=function(t,e){var s=this,r=Array.prototype.slice.call(arguments,2);return __nativeST__(t instanceof Function?function(){t.apply(s,r)}:t,e)};var currentGame=new Game,interfaceElement=document.getElementById("interface");Displayable.prototype.constructor=Displayable,Displayable.prototype.draw=function(t,e){var s=LZString.decompressFromBase64(e),r=s.slice(s.indexOf("|")+1),a=s.slice(0,s.indexOf("x")),o=s.slice(s.indexOf("x")+1,s.indexOf("|"));t.clearRect(0,0,a,o),t.fillStyle=this.color;for(var n=0;n<r.length;n+=1)if(1==r.slice(n,n+1)){var i=Math.floor(n/a);t.fillRect(n-i*a,i,1,1)}},Location.prototype=new Displayable,Location.prototype.constructor=Location,Character.prototype=new Displayable,Character.prototype.constructor=Character,Character.prototype.updateHP=function(){this.HP<1?this.HP=0:this.HP>this.stats.maxHP&&(this.HP=this.stats.maxHP),this.displayElement.hpText.innerHTML=this.HP+"/"+this.stats.maxHP;var t=Math.floor(this.HP/this.stats.maxHP*100);this.displayElement.hpBar.style.width=t+"%",this.displayElement.hpBar.className="hp-bar hp-"+10*Math.round(t/10),0===this.HP&&this.die()},Character.prototype.addClass=function(t){this.div.classList.add(t)},Character.prototype.wiggle=function(t,e){this.div.classList.add(t);var s=this;setTimeout(function(){s.div.classList.remove(t)},e)},Character.prototype.equip1=function(t){t.owner=this,this.hand1=t},Character.prototype.getEnemy=function(){switch(this.constructor.name){case"Hero":return currentGame.currentMonster;case"Monster":return currentGame.playerHero}},Character.prototype.hit=function(t){var e=this.stats.phys,s=0,r=t.calculated-e<0?0:t.calculated-e,a=t.natural+r;"HP"===t.targetStat?this.HP-=a:(a=r,this.stats[t.targetStat]-=a),this.effectController.displayDamage(t.sprite,t.color),this.wiggle("hit",250);var o=randomEntry(t.verbs),n="";n="Hero"!==this.constructor.name?"You "+o+" the "+this.shortName+" for "+a+t.targetStat.toUpperCase()+".":"The "+currentGame.currentMonster.shortName+" "+thirdPerson(o)+" you for "+a+t.targetStat.toUpperCase()+".",currentGame.log.add(n),this.updateHP()},Character.prototype.punch=function(){var t={};return t.natural=1,t.calculated=roll(Math.floor((this.stats.str+this.stats.agi)/8)+"d3"),t.type="physical",t.targetStat="HP",t.sprite="poof",t.color=this.color,t.verbs=["punch","smack","hit","wallop","slap"],t},Character.prototype.useHand1=function(){return this.hand1?this.hand1.attackObj():this.punch()},Hero.prototype=new Character,Hero.prototype.constructor=Hero,Hero.prototype.calcDodge=function(){for(var t=[],e=currentGame.currentMonster.stats.agi-1;e>=0;e--)t.push(!1);for(var s=this.stats.agi/2-1;s>=0;s--)t.push(!0);return randomEntry(t)},Hero.prototype.dodge=function(){this.wiggle("dodge",500),currentGame.log.add("You dodge the "+currentGame.currentMonster.shortName+"'s attack.")},Hero.prototype.die=function(){this.addClass("dead"),currentGame.log.add("You were slain by the "+currentGame.currentMonster.shortName+"."),setTimeout(function(){currentGame.log.add("You slayed "+currentGame.playerHero.kills+" monsters before perishing.")},2e3)},Hero.prototype.initialize=function(){this.effectController=new Effect,this.effectController.link(this),this.equip1(new Sword),this.draw(this.canvas,this.spriteCompressed),this.updateHP()},Monster.prototype=new Character,Monster.prototype.constructor=Monster,Monster.prototype.announce=function(){var t="";t=currentGame.previousMonsterName===this.displayName?"another ":-1!=="AEIOU".indexOf(this.displayName.slice(0,1))?"an ":"a ";var e="It's "+t+this.displayName+"!";currentGame.log.add(e),""===this.shortName&&(this.shortName=this.displayName),this.displayElement.name.innerHTML=this.shortName},Monster.prototype.appear=function(){this.announce(),this.effectController=new Effect,this.effectController.link(this),this.draw(this.canvas,this.spriteCompressed),this.HP=this.stats.maxHP,this.updateHP()},Monster.prototype.die=function(){this.addClass("dead"),currentGame.log.add("You slayed the "+this.shortName+"."),currentGame.playerHero.kills++,setTimeout(currentGame.switchMonster,2e3)},Monster.prototype.calcDodge=function(){for(var t=[],e=currentGame.playerHero.stats.agi-1;e>=0;e--)t.push(!1);for(var s=this.stats.agi/2-1;s>=0;s--)t.push(!0);return randomEntry(t)},Monster.prototype.dodge=function(){this.wiggle("dodge",500),currentGame.log.add("The "+this.shortName+" dodges your attack.")},Axedude.prototype=new Monster,Axedude.prototype.constructor=Axedude,Ball.prototype=new Monster,Ball.prototype.constructor=Ball,Scamp.prototype=new Monster,Scamp.prototype.constructor=Scamp,Skele.prototype=new Monster,Skele.prototype.constructor=Skele,Snek.prototype=new Monster,Snek.prototype.constructor=Snek,Jelly.prototype=new Monster,Jelly.prototype.constructor=Jelly,Were.prototype=new Monster,Were.prototype.constructor=Were,Mage.prototype=new Monster,Mage.prototype.constructor=Mage,Item.prototype=new Displayable,Item.prototype.constructor=Item,Weapon.prototype=new Item,Weapon.prototype.constructor=Weapon,Weapon.prototype.target=function(){return this.owner.getEnemy()},Weapon.prototype.attackObj=function(){var t={};return t.natural=this.natural,t.calculated=this.attackVal(),t.type=this.attackType,t.sprite=this.hitSprite,t.color=this.color,t.verbs=this.verbArray,"physical"===this.attackType?t.targetStat="HP":t.targetStat=this.targetStat,t},Sword.prototype=new Weapon,Sword.prototype.constructor=Sword,Staff.prototype=new Weapon,Staff.prototype.constructor=Staff,Claws.prototype=new Weapon,Claws.prototype.constructor=Claws,Bucket.prototype=new Weapon,Bucket.prototype.constructor=Bucket,Effect.prototype=new Displayable,Effect.prototype.constructor=Effect,Effect.prototype.link=function(t){this.associatedCharacter=t,this.damageCanvasElement=t.div.getElementsByClassName("damage-sprite")[0],this.damageCanvas=this.damageCanvasElement.getContext("2d")},Effect.prototype.displayDamage=function(t,e){this.color=e,this.damageCanvasElement.classList.add("active",t),this.draw(this.damageCanvas,this.sprites[t]);var s=this;setTimeout(function(){s.clearDamage()},500)},Effect.prototype.clearDamage=function(){this.damageCanvasElement.className="damage-sprite"},loadButtons(),currentGame.playerHero=new Hero("Sandra"),currentGame.currentMonster=new Monster,currentGame.previousMonsterName="",currentGame.switchLocation(),currentGame.initialize();