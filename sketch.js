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
  let deltaT = deltaTime;
  game.update(deltaT);
  game.draw(deltaT);
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
