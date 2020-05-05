const { EventEmitter } = require("events");
const { clamp }  = require("./util");
const { v4: uuidv4 } = require("uuid");

module.exports = class Player extends EventEmitter {
    constructor(health, attackShape, defenseShape, activityPoints) {
        super();

        this._player = this._makePlayer(
            health, 
            attackShape,
            defenseShape,
            activityPoints
        );
    }

    // Make a new player object 
    _makePlayer(health, attackShape, defenseShape, activityPoints) {
        return {
            hp: health,
            opponentHP,
            move: {attackShape: attackShape,
                    defenseShape: defenseShape},
            ap: activityPoints,
        };
    }
    _setOpponentHealth(health) {
        this._player.opponentHP = health;
        
        }
        
    //update a player's move.
    updateMoves (attackShape, defenseShape){
        console.log("Within game updatemoves")
        //this._player.attack = attack;
        this._player.move.attackShape = attackShape;
        //this._player.defense = defense;
        this._player.move.defenseShape = defenseShape;
        this.emit("movesChanged", this._player.move);
    }

    updateHealth (damage) {
        //calculate new value of incoming attack and new value of defending player
        //var attackValue = incomingAttack + Math.floor(incomingAttack*Math.random());
        //var defenseValue = this._player.defense + Math.floor(this._player.defense*Math.random());
        
        //Check if the player's defense shape matches the incoming attack shape.
        //If the shapes match, then no damage is taken and attack is blocked.
        // if (this._player.defenseShape !== opponentMove.attackShape) {
        //     this._player.health -= 1;
        //     //the opponent's health is decreased 
        // } 
        // this.emit("playerHurt", this._player.hp);
        this._player.hp -= damage.myDamage;
        this._setOpponentHealth(damage.opponentDamage);

    }



    //TODO: need a method to match players against each other and set the opposingPlayer

    /*
    // Draw each player as a square at the appropriate position
    draw(p, width, height) {
        p.push();
        p.strokeWeight(2);
        p.fill(255);
        p.textSize(16);
        let myState = `My health: ${this._player.health} attack: ${this._player.attack} attackShape: ${this._player.attackShape} defense: ${this._player.defense} defenseShape: ${this._player.defenseShape}`;
        let opposingState = `Opponent health: ${this._opposingPlayer.health} attack: ${this._opposingPlayer.attack} attackShape: ${this._opposingPlayer.attackShape} defense: ${this._opposingPlayer.defense} defenseShape: ${this._opposingPlayer.defenseShape}`;
        p.text(myState, 10, height/2);
        p.text(opposingState, width-10, height/2);
        p.pop();
    }
    */

    // Accessor for the player that this game owns, accessed like "game.ownedPlayer"
    getPlayer() {
        return this._player;
    }

    updatePlayers(players) {
        const ourPlayer = {
            [this._player.id]: this._player
        };

        // Make sure that our player stays in there, no matter what
        this._players = Object.assign(players, ourPlayer);
    }

    // _movePlayer(dx, dy) {
    //     this._player.x = clamp(this._player.x + dx, 0, this._columns - 1);
    //     this._player.y = clamp(this._player.y + dy, 0, this._rows - 1);

    //     this.emit("playerMoved", this._player);
    // }

    // handleInput(key) {
    //     if (key === "ArrowLeft") {
    //         this._movePlayer(-1, 0);
    //     } else if (key === "ArrowRight") {
    //         this._movePlayer(1, 0);
    //     } else if (key === "ArrowUp") {
    //         this._movePlayer(0, -1);
    //     } else if (key === "ArrowDown") {
    //         this._movePlayer(0, 1);
    //     }
    // }

}
