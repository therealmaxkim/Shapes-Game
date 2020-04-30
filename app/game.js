const { EventEmitter } = require("events");
const { clamp }  = require("./util");
const { v4: uuidv4 } = require("uuid");

module.exports = class Game extends EventEmitter {
    constructor(health, activityPoints, attack, defense, side) {
        super();

        this._player = this._makePlayer(
            health, 
            attack, 
            defense,
            attackShape,
            defenseShape,
            activityPoints, 
            side,
            height
        );

        this._opposingPlayer = null;
    }

    // Make a new player object 
    _makePlayer(health, attack, attackShape, defense, defenseShape, activityPoints, side, height) {
        return {
            hp: health,
            attack: attack,
            defense: defense,
            attackShape: attackShape,
            defenseShape: defenseShape,
            ap: activityPoints,
            xPos: side,
            yPos: height,
        };
    }

    //update a player's move.
    updateMoves(attack, attackShape, defense, defenseShape){
        this._player.attack = attack;
        this._player.attackShape = attackShape;
        this._player.defense = defense;
        this._player.defenseShape = defenseShape;
        this.emit("movesChanged", this._player);
    }

    //updateOpposingPlayer should be called when we receive and emission from the 
    //server telling us that the opposing player has confirmed their move
    updateOpposingPlayer (player) {
        this._opposingPlayer = player;
        _updateHealth(this._opposingPlayer.attack, this._opposingPlayer.attackShape);
    }
    
    _updateHealth(incomingAttack, incomingAttackShape){
        //calculate new value of incoming attack and new value of defending player
        var attackValue = incomingAttack + Math.floor(incomingAttack*Math.random());
        var defenseValue = this._player.defense + Math.floor(this._player.defense*Math.random());
        
        //Check if the player's defense shape matches the incoming attack shape.
        //If the shapes match, then no damage is taken and attack is blocked.
        if (incomingAttackShape !== this._player.defenseShape) {
            this._player.health -= attackValue-defenseValue;
            this.emit("playerHurt", this._player);
        } else {
            this.emit("playerBlocked", this._player);
        }
    }

    // Accessor for the player that this game owns, accessed like "game.ownedPlayer"
    get ownedPlayer() {
        return this._player;
    }

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

    // updatePlayers(players) {
    //     const ourPlayer = {
    //         [this._player.id]: this._player
    //     };

    //     // Make sure that our player stays in there, no matter what
    //     this._players = Object.assign(players, ourPlayer);
    // }
}
