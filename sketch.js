
function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  circle(mouseX, mouseY, 5+mouseX);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
