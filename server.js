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
app.use(express.static('public'));
app.get("/", function(request, response) {
  response.sendFile(__dirname + '/app/index.html');
});
const listener = app.listen(port, function () {
  console.log('Your app is listening on port ' + port);
});




// Start a web socket server
const wsServer = new WebSocket.Server({ server: listener });

class Game {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.move1;
    this.move2;
  }
  setMove(player, move) {
    if(player===this.player1){
      this.move1=move;
    } else {
      this.move2=move;
    }
  }
  getOpponentMove(player) {
    if(player===this.player1){
      return this.move2;
    } else {
      return this.move1;
    }
  }
  resetMoves() {
    this.move1 = undefined;
    this.move2 = undefined;
  }
}

// map from player's WSUID -> Game
const activeGames = {};
// map from player's WSUID -> connection
const connections = {};
// variable to remember the opposing player
var waitingPlayer = null;


// Handle new connections
wsServer.on("connection", (ws) => {
  console.log("new player connected");

  // Generate a new UID for this websocket
  const playerId = uuidv4(); 

  //set the playerID with the ws object
  connections[playerId] = ws;

  //if you are waiting for a player, set yourself as the waiting player and send an update saying you are waiting
  if (waitingPlayer === null) {
    waitingPlayer = playerId;
    ws.send(JSON.stringify({type: "waiting", message: "Waiting for another player to join"}));
  
  //otherwise, you join another player. Create a new game and send an update that you found an opponent for both players.
  } else {
    const game = new Game(waitingPlayer, playerId);
    activeGames[waitingPlayer] = game;
    activeGames[playerId] = game;
    ws.send(JSON.stringify({type: "foundOpponent", message: "We found you an opponent! Make a move!"}));
    connections[waitingPlayer].send(JSON.stringify({type: "foundOpponent", message: "We found you an opponent! Make a move!"}));
    //reset the waiting player 
    waitingPlayer = null;
  }


  // whenever a new move gets made
  ws.on("message", (data) => {
    //grab the active game and parse info about the move
    const game = activeGames[playerId];
    const myMove = JSON.parse(data);

    //check that we are making a move and that active game exists
    if (myMove.type === "move" && game !== undefined) {

      //send an update that you are waiting for opponent to make a move
      ws.send(JSON.stringify({type: "waiting", message: "Waiting for your opponent to make a move..."}));
      
      //set this player's move in the game object
      game.setMove(playerId, myMove);

      //check that the opponent made a move
      if (game.getOpponentMove(playerId) !== undefined) {

        //grab the opponent's move
        const opponentAttack = game.getOpponentMove(playerId).attackShape;
        const opponentDefense = game.getOpponentMove(playerId).defenseShape;

        //determine who is player1 and player 2
        var player1 = playerId;
        var player2 = game.player1 != playerId ? game.player1 : game.player2;


        //default object we send to player1 and player2
        var damage1 = {id: player1, myDamage: 0, opponentDamage: 0, myAttackMessage: "", myDefenseMessage: "", type: "movesConfirmed"};
        var damage2 = {id: player2, myDamage: 0, opponentDamage: 0, myAttackMessage: "", myDefenseMessage: "", type: "movesConfirmed"};

        //check if playerId took damage
        if(opponentAttack != myMove.defenseShape){
          damage1.myDamage = 1;
          damage1.myDefenseMessage = "You took a hit from " + opponentAttack + "! You're seeing stars!";
          damage2.opponentDamage = 1;
          damage2.myAttackMessage = "You landed a hit with " + opponentAttack + "!";
        } else {
          damage1.myDefenseMessage = "You blocked a hit from " + opponentAttack + "!";
          damage2.myAttackMessage = "Your attack was blocked with " + myMove.defenseShape +"!";
        }

        //check if I did damage to my opponent
        if(opponentDefense != myMove.attackShape) {
          damage1.opponentDamage = 1;
          damage1.myAttackMessage = "You landed a hit with " + myMove.attackShape + "! Your opponent is seeing stars!";
          damage2.myDamage = 1;
          damage2.myDefenseMessage = 'You took a hit from ' + myMove.attackShape + "!";
        } else {
          damage1.myAttackMessage = "Your attack was blocked with " + opponentDefense + "!";
          damage2.myDefenseMessage = 'You blocked a hit from ' + myMove.attackShape + "!";
        }

        //send the results of the moves to both players
        connections[damage1.id].send(JSON.stringify(damage1));
        connections[damage2.id].send(JSON.stringify(damage2));

        //reset both player's moves
        game.resetMoves();
      }    
    }
  });


  // Clean up when the player disconnects
  ws.on("close", () => {
    if (playerId in activeGames) delete activeGames[playerId];
    if (waitingPlayer && waitingPlayer in activeGames) delete activeGames[waitingPlayer];
    delete connections[playerId];
  });

});
