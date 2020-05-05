const p5 = require("p5");
const Player = require("./player");
const GameClient = require("./gameClient");
const setup = require("./imageDetector/imageDetectorApp");

// let health = 10;
let activityPoints = 4;
let attackShape = "none";
let defenseShape = "none";

window.addEventListener('DOMContentLoaded', (event) => {
    setup();
    //health, attack, defense, attackShape, defenseShape, activityPoints, side, height
    let player = new Player(10, attackShape, defenseShape, activityPoints);
    let gameClient = new GameClient();
    player.on("movesChanged", (move) => gameClient.sendMove(move));
    gameClient.on("movesConfirmed", (damage) => player.updateHealth(damage));
    gameClient.on("foundOpponent", (health) => player.setOpponentHealth(health));
  


    //A function that confirms the shape. 
    function confirmAttackShape() {
        //Set the current shape as the final shape selected
        var current_shape = window.document.querySelector('.curr_attack').innerHTML;
        window.document.querySelector('.chosen_attack').innerHTML = current_shape;
        
        //hide confirming button so players can't modify their move
        var element = window.document.querySelector('.btn_attack');
        element.setAttribute("hidden", true);
    };

    function confirmDefenseShape() {
        //Set the current shape as the final shape selected
        var current_shape = window.document.querySelector('.curr_defense').innerHTML;
        window.document.querySelector('.chosen_defense').innerHTML = current_shape;
        
        //hide confirming button so players can't modify their move
        var element = window.document.querySelector('.btn_defense');
        element.setAttribute("hidden", true);
    };


    //add function to move buttons around and adjusts text to reflect the state of the game

    //a function that checks that attack and defend shapes were confirmed, then sends the data
    //to the server 
    function confirmMove() {
        //check that both attack and defense buttons are hidden
        var attack_btn = window.document.querySelector('.btn_attack').hidden;
        var defense_btn = window.document.querySelector('.btn_defense').hidden;
        
        if (attack_btn && defense_btn) {
            //grab the attack and defense shapes in the string form
            var attack_shape = window.document.querySelector('.chosen_attack').innerHTML;
            var defense_shape = window.document.querySelector('.chosen_defense').innerHTML;
            
            //send the attack and defense to the server
            //attack, attackShape, defense, defenseShape
            game.updateMoves(1, attack_shape, 1, defense_shape);

        } else {
            this.alert("Please make sure to confirm both attack and defense shapes.");
        }
    };

    //a function that will make both the attack and defense confirm button appear
    function resetShape() {
        var attack_element = window.document.querySelector(".btn_attack");
        var defense_element = window.document.querySelector(".btn_defense");

        attack_element.removeAttribute("hidden");
        defense_element.removeAttribute("hidden");
    }

    var btn_attack = window.document.querySelector(".btn_attack");
    var btn_defense = window.document.querySelector(".btn_defense");
    var btn_confirm = window.document.querySelector(".btn_confirm");
    var btn_reset = window.document.querySelector(".btn_reset");

    btn_attack.setAttribute("onclick", confirmAttackShape); 
    btn_attack.onclick = function() {confirmAttackShape();};
    btn_defense.setAttribute("onclick", confirmDefenseShape);
    btn_defense.onclick = function() {confirmDefenseShape();};
    btn_confirm.setAttribute("onclick", confirmMove);
    btn_confirm.onclick = function() {confirmMove();};
    btn_reset.setAttribute("onclick", resetShape);
    btn_reset.onclick = function() {confirmShape();};

    console.log("Made it to end of fucntion");
}); 







