const p5 = require("p5");
const Player = require("./player");
const GameClient = require("./gameClient");
const setup = require("./imageDetector/imageDetectorApp");

let health = 3;
let activityPoints = 4;
let attackShape = "none";
let defenseShape = "none";

window.addEventListener('DOMContentLoaded', (event) => {
    //attach the teachable machines
    setup();
    //setup the player and game client
    let player = new Player(health, attackShape, defenseShape, activityPoints);
    let gameClient = new GameClient();

    player.on("movesChanged", (move) => gameClient.sendMove(move));

    gameClient.on("movesConfirmed", (data) => {
        console.log("movesConfirmed of app.js", data)
        player.updateHealth(data);
        resetShape();
        window.document.querySelector('.outcomeAttack').innerHTML = data.myAttackMessage;
        window.document.querySelector('.outcomeDefense').innerHTML = data.myDefenseMessage;
        if (player._player.hp == 0) {
            window.document.querySelector('.yourHP').innerHTML = "You lost!";
            window.document.querySelector('.opponentHP').innerHTML = "Opponent wins!";
        } else if (player._player.opponentHP == 0) {
            window.document.querySelector('.yourHP').innerHTML = "You win!";
            window.document.querySelector('.opponentHP').innerHTML = "Opponent lost!";
        } else {
            window.document.querySelector('.yourHP').innerHTML = player._player.hp;
            window.document.querySelector('.opponentHP').innerHTML = player._player.opponentHP;
        }
        window.document.querySelector('.description').innerHTML = "Make your next move!";
    });
  
    gameClient.on("waiting", (data) => {
        console.log("waiting of app.js", data)
        window.document.querySelector('.description').innerHTML = data.message;
    });

    gameClient.on("foundOpponent", (data) => {
        console.log("foundOpponent of app.js", data)
        window.document.querySelector('.description').innerHTML = data.message;
        window.document.querySelector('.yourHP').innerHTML = player._player.hp;
        window.document.querySelector('.opponentHP').innerHTML = player._player.opponentHP;
    });


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
            player.updateMoves(attack_shape, defense_shape);

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







