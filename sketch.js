
class Defender {
  constuctor(name, img, xp_cost, hp) {
    this.name = name;
    this.img = img;
    this.xp = xp_cost;
    this.hp = hp;
  }
}

class Attacker {
  constuctor(name, img, hp) {
    this.name = name;
    this.img = img;
    this.hp = hp;
  }
}

class Level {
  constructor(img, defenders, attackers, attack_delay_secs) {
    this.img = img;
    this.defenders = defenders;
    this.attackers = attackers;
    this.attack_delay_secs = attack_delay_secs;
  }
}

let level1_img;
let pikachu_img;
let evee_img;

function preload() {
  level1_img = loadImage('assets/level1.png');
  pikachu_img = loadImage('assets/pikachu.png');
  evee_img = loadImage('assets/evee.png');
}

let level1;
let pikachu;
let evee;

const XRESOLUTION = 800;
const YRESOLUTION = 600;
const MIN_SCALE_FACTOR = .5;
const MAX_SCALE_FACTOR = 3;

let scaleFactor = 1;

function updateScaleFactor() {
  let yFactor = Math.max(windowHeight / YRESOLUTION, MIN_SCALE_FACTOR);
  let xFactor = Math.max(windowWidth / XRESOLUTION, MIN_SCALE_FACTOR);
  return Math.min(MAX_SCALE_FACTOR, Math.min(yFactor, xFactor));
}

function setup() {
  pikachu = new Defender("Pikachu", pikachu_img, /*xp_cost=*/150, /*hp=*/200);
  evee = new Attacker("Evee", evee_img, /*hp=*/150);
  level1 = new Level(level1_img, [pikachu], [], 5);

  createCanvas(windowWidth, windowHeight);
  updatetScaleFactor();
}

function draw() {
  scale(scaleFactor);
  background(0);
  image(level1_img, 0, 0);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateScaleFactor();
}
