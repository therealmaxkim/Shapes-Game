const p5 = require("p5");
//const Game = require("./game");
//const GameClient = require("./gameClient");

// Require different files to change behavior
const setup = require("./imageDetector/imageDetectorApp");
// const setup = require("./soundDetector/soundDetectorApp");
// const setup = require("./drawDetector/drawDetectorApp");

// Calls the setup function when the page is loaded
window.addEventListener("DOMContentLoaded", setup);

window.setShape = function(curr_shape, chosen_shape) {
    var current_shape = window.document.getElementsByClassName(curr_shape)[0].innerHTML;
    window.document.getElementsByClassName(chosen_shape)[0].innerHTML = current_shape;
};