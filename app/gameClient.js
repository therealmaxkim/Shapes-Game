const { EventEmitter } = require("events");

module.exports = class GameClient extends EventEmitter {
    constructor() {
        super();
        const pageUrl = new URL(window.location);
        pageUrl.protocol = "wss";
        this._websocket = new WebSocket(pageUrl.toString());

        this._websocket.onopen = () => {
            this.emit("connected");
        };

        this._websocket.onmessage = (event) => {
            console.log('onmessage of gameClient.js ', event);
            const data = JSON.parse(event.data);
            this.emit(data.type, data);
        };


    }

    sendMove(move) {
        console.log("sendMove of gameClient.js ", move);
        this._websocket.send(
            JSON.stringify(move)
        );
    }
}
