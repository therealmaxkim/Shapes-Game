const { EventEmitter } = require("events");
const { clamp }  = require("./util");
const { v4: uuidv4 } = require("uuid");

module.exports = class Game extends EventEmitter {
    constructor(health, activityPoints, attack, defense, side) {
        super();

        this._player = this._makePlayer(
            health, 
            activityPoints, 
            attack, 
            defense,
            side,
            height);

        this._opposingPlayer = null;
    }
    // Make a new player object out of hp, ap, and moves
    _makePlayer(health, activityPoints, attack, defense, side, height) {
        return {
            hp: health,
            ap: activityPoints,
            currentAttack: attack,
            currentDefense: defense,
            xPos: side,
            yPos: height,
        };
    }
    updateMoves(attack, defense){
        this._player.currentAttack = attack;
        this._player.currentDefense = defense;
    }
    updateHealth(health, incomingAttack){
        incomingAttack += Math.floor(incomingAttack*Math.random());
        const defense = this._player.currentDefense + Math.floor(this._player.currentDefense*Math.random());
        this._player.hp = health -incomingAttack+defense;
        this.emit("playerHurt", this._player);
    }
    updateOpposingPlayer (player) {
        this._opposingPlayer = player;
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
        let myState = `My health: ${this._player.health} attack: ${this._player.currentAttack} defense: ${this._player.currentDefense}`;
        let opposingState = `Opponent health: ${this._opposingPlayer.health} attack: ${this._opposingPlayer.currentAttack} defense: ${this._opposingPlayer.currentDefense}`;
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
