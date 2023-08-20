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

function keyPressed() {
  game.keyPressed();
}

function touchEnded() {
  mouseClicked();
  return false;
}
