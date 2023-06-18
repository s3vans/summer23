let screen1;
let engine;

function preload() { 
  bg1 = loadImage('assets/bg1.jpg');
}

function setup() {
  engine = new GameEngine(windowWidth, windowHeight);
  screen1 = new Screen(bg1);
  screen1.show();
  engine.addScreen(screen1);
  setInterval(() => screen1.hide(), 5000);
}

function draw() {
  engine.update();
  engine.draw();
  circle(mouseX, mouseY, 5+mouseX);
}

/*function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}*/
