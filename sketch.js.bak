
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

let levels = [{
    "uid": "level1",
    "name": "Level 1",
    "img": "assets/level1.png",
    "defenders": [ {
        "uid": "pikachu",
        "name": "Pikachu",
        "img": "assets/pikachu.png",
        "xp_cost": 150,
        "hp": 200,
      }],
    "attackers": [{
        uid: "evee",
        "name": "Evee",
        "img": "assets/evee.png",
        "hp": 150,
      }],
    }];

// TODO: Detect reused uids!
let images = new Map();
function loadImagesFromLevels() {
  for (level of levels) {
    images.set(level.uid, loadImage(level.img));
    for (defender of level.defenders) {
      images.set(defender.uid, loadImage(defender.img));
    }
    for (attacker of level.attackers) {
      images.set(attacker.uid, loadImage(attacker.img));
    }
  }
}

function preload() {
  loadImagesFromLevels();
}

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
  level = levels[0];
  createCanvas(windowWidth, windowHeight);
  updateScaleFactor();
}

function draw() {
  scale(scaleFactor);
  background(0);
  image(images.get(level.uid), 0, 0);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateScaleFactor();
}
