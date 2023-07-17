let game;

function preload() {
  configHelper.expandGameConfig(pokemonGameConfig);
  game = new Game(pokemonGameConfig);
}

function setup() {
  game.setup();
  game.loadLevel(0);
}

function draw() {
  game.update();
  game.draw();
}

function mouseClicked() {
  game.mouseClicked();
}

function windowResized() {
  game.windowResized();
}

// onMouseClicked() wasn't working in Safari on our iPad. This code was
// suggested at: https://github.com/processing/p5.js/issues/5358
// It should prevent the browser from processing some default touch events.
document.addEventListener('touchstart', {}); // <-- mysterious HACK.
function touchStarted() {
  mouseClicked();
  return false;
}
function touchMoved() {
  return false;
}
function touchEnded() {
  return false;
}
