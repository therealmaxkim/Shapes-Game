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
            opponentHP: health,
            move:{  attackShape: attackShape,
                    defenseShape: defenseShape,
                    type: "move"
                },
            ap: activityPoints,
        };
    }
        
    //update a player's move.
    updateMoves (attackShape, defenseShape){
        console.log("Within game updatemoves")
        //this._player.attack = attack;
        //this._player.defense = defense;
        this._player.move.attackShape = attackShape;
        this._player.move.defenseShape = defenseShape;
        this.emit("movesChanged", this._player.move);
    }

    updateHealth (damage) {
        //calculate new value of incoming attack and new value of defending player
        //var attackValue = incomingAttack + Math.floor(incomingAttack*Math.random());
        //var defenseValue = this._player.defense + Math.floor(this._player.defense*Math.random());
        
        this._player.hp -= damage.myDamage;
        this._player.opponentHP -= damage.opponentDamage;
    }

    // Accessor for the player that this game owns, accessed like "game.ownedPlayer"
    getPlayer() {
        return this._player;
    }

    //TODO: need a method to match players against each other and set the opposingPlayer

    //updatePlayers(players) {
    //    const ourPlayer = {
    //        [this._player.id]: this._player
    //    };

        // Make sure that our player stays in there, no matter what
    //    this._players = Object.assign(players, ourPlayer);
    //}

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
