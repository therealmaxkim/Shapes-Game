// server.js
// add api endpoint or ws to handle matchmaking, something like 'register'. hold on to one player until a pairing player is available.
// init project
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");

// Special piece for running with webpack dev server
if (process.env.NODE_ENV === "development") {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const config = require('./webpack.dev.config.js');
  const compiler = webpack(config);

  // Tell express to use the webpack-dev-middleware and use the webpack.config.js
  // configuration file as a base.
  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  }));
}

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + '/app/index.html');
});

// listen for requests :)
const listener = app.listen(port, function () {
  console.log('Your app is listening on port ' + port);
});

// Space to store players, by player id
const players = {};

// Map from a connection id, to the player id that the connection owns
const playersByConnectionId = {};

// Start a web socket server
const wsServer = new WebSocket.Server({ server: listener });

function broadcastPlayers() {
  wsServer.clients.forEach(client => {
    client.send(
      JSON.stringify(players)
    );
  });
}

class Game {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.move1;
    this.move2;
  }
  setMove(player, move) {
    if(player===player1){
      this.move1=move;
    }
    else {
      this.move2=move;
    }
  }
  getOpponentMove(player){
    if(player===player1){
      return this.move2;
    }
    else {
      return this.move1;
    }
  }

}

// map from WSUID -> Game
const activeGames = {};

const waitingPlayer = null;

// Handle new connections
wsServer.on("connection", (ws) => {

  // Generate a new UID for this websocket
  const playerId = uuidv4();
  const health = 10;
  if (waitingPlayer === null) {
    waitingPlayer = playerId;
    ws.send("status", {message: "Waiting for another player to join"});
  } else {
    const game = new Game(waitingPlayer, playerId);
    activeGames[waitingPlayer] = game;
    activeGames[playerId] = game;
    ws.send("foundOpponent", health);
    waitingPlayer = null;

  }

  // Update players whenever a new move gets made
  ws.on("message", (data) => {
    const game = activeGames[playerId];
    const updateObject = JSON.parse(data);
    
    if (updateObject.type === "move") {
      game.setMove(playerId, updateObject.move);
      if (game.getOpponentMove(playerId) !== null) {
        const incomingAttack = game.getOpponentMove(playerId).attackShape;
        const oppShield = game.getOpponentMove(playerId).defenseShape;
        let damage = {myDamage: 0, opponentDamage: 0};
        if(incomingAttack !=updateObject.move.defenseShape){
          damage.myDamage=1;
        }
        if(oppShield != updateObject.move.attackShape) {
          damage.opponentDamage = 1;
        }
        ws.send("movesConfirmed",damage);
      }    
    }
  });

  // Clean up when the player disconnects
  ws.on("close", () => {
    delete activeGames[waitingPlayer];
    delete activeGames[playerId];
    if (waitingPlayer) delete activeGames[waitingPlayer]

  });

});
