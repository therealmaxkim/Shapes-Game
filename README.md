Shapes Game created by Nart Varoqua and Max Kim
===========================

### Introduction: 
This game is a two-player multiplayer game where players choose two shapes: an "attacking" shape and a "defending" shape by utilizing their drawings/video. An attack shape can be blocked by a matching defense shape. Players have 3 HP. 


### Motivation: 
why did you choose this project, why is it important to you?
The most important part of this project was the technical achievement of creating a "fighting game" server that matched players with an opponent and communicated with each player while also running a trained neural network in the user interface. It was a challenge to make it work and gain an understanding of all the working parts.

### Overview: 
how does the project work, what processing steps does it go through?
The server waits for pairs of players to connect and matches them on the fly. Each player can then lock in an attacking move and defense move as determined by a pose detection AI. The server checks whether a player guessed the opponent's attack shape, and assigns them damage otherwise. 

### Structural description: 
what are the parts of the project, how do they communicate?

Server: manage and track connections

Application: track messages from server and game client. Provide feedback to user through text and P5 drawing

Player script: track player statistics

Game Client: relay messages to and from server


### In-depth dive: 
for each part of the project, how does it work? What technologies did you use?

1. Determine the chosen attack and defense shape 
2. Wait until both players made a move 
3. Determine who won the move and check for winner 

* Prevent concurrency issues. Players cannot revise their move 
* Disregard keeping track of players. Player HP and moves stored on client end and moves reset on server end


### Group work: 
how did you all work together? How did you divide up the work? How did you communicate?

### Next steps: 
with more time what would you work on next? What weren't you able to finish?

### Q&A
