const XRESOLUTION = 800;
const YRESOLUTION = 600;
const MIN_SCALE_FACTOR = .5;
const MAX_SCALE_FACTOR = 3;

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
        "uid": "evee",
        "name": "Evee",
        "img": "assets/evee.png",
        "hp": 150,
      }],
    }];

let uids = new Map();
let err_duplicate_uid = "";
function _isUidUnique(uid) {
  if (uids.has(uid)) {
    console.error("Encountered duplicate id: " + uid);
    err_duplicate_uid = uid;
    return false;
  }
  uids.set(uid, true);
  return true;
}

let images = new Map();
function _loadImagesFromLevels() {
  for (level of levels) {
    _isUidUnique(level.uid);
    images.set(level.uid, loadImage(level.img));
    for (defender of level.defenders) {
      _isUidUnique(defender.uid);
      images.set(defender.uid, loadImage(defender.img));
    }
    for (attacker of level.attackers) {
      _isUidUnique(attacker.uid);
      images.set(attacker.uid, loadImage(attacker.img));
    }
  }
}

let scaleFactor = 1;
function _updateScaleFactor() {
  let yFactor = Math.max(windowHeight / YRESOLUTION, MIN_SCALE_FACTOR);
  let xFactor = Math.max(windowWidth / XRESOLUTION, MIN_SCALE_FACTOR);
  return Math.min(MAX_SCALE_FACTOR, Math.min(yFactor, xFactor));
}

function _displayError(err) {
  background(255);
  fill(255, 0, 0);
  textSize(20);
  text(err, 10, 20);
}

function preload() {
  _loadImagesFromLevels();
}

function setup() {
  level = levels[0];
  createCanvas(windowWidth, windowHeight);
  _updateScaleFactor();
}

function draw() {
  scale(scaleFactor);
  background(0);
  if (err_duplicate_uid != "") {
    _displayError("Duplicate uid detected: " + err_duplicate_uid);
    noLoop();
    return;
  }
  image(images.get(level.uid), 0, 0);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  _updateScaleFactor();
}
