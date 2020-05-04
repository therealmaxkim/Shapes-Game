const { EventEmitter } = require("events");

module.exports = class GameClient extends EventEmitter {
    constructor() {
        super();
        const pageUrl = new URL(window.location);
        pageUrl.protocol = "ws";
        this._websocket = new WebSocket(pageUrl.toString());

        this._websocket.onopen = () => {
            console.log("within gameclient onopen");
            this.emit("connected");
        };

        this._websocket.onmessage = (event) => {
            console.log('within gameclient onmessage');
            console.log(event.type);
            console.log(event.data);
            //const players = JSON.parse(event.data);
            this.emit("playersUpdate", "players tesst");
        };


    }

    sendPlayer(player) {
        console.log("within sendplayer")
        console.log(player)
        this._websocket.send(
            JSON.stringify(player)
        );
    }
}
