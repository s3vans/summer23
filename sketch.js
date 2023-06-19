const XRESOLUTION = 800;
const YRESOLUTION = 600;
const MIN_SCALE_FACTOR = .5;
const MAX_SCALE_FACTOR = 3;

class Defender {
  constructor(uid, name, img, xp_cost, hp) {
    this.uid = uid;
    this.name = name;
    this.img = img;
    this.xp = xp_cost;
    this.hp = hp;
  }
}

class Attacker {
  constructor(uid, name, img, hp) {
    this.uid = uid;
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
    "defenders": [{
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
    err_duplicate_uid = uid;
    return false;
  }
  uids.set(uid, true);
  return true;
}

let images = new Map();
function _loadImagesFromLevel(level) {
  _isUidUnique(level.uid);
  images.set(level.uid, loadImage(level.img));
  for (let defender of level.defenders) {
    _isUidUnique(defender.uid);
    images.set(defender.uid, loadImage(defender.img));
  }
  for (let attacker of level.attackers) {
    _isUidUnique(attacker.uid);
    images.set(attacker.uid, loadImage(attacker.img));
  }
}

let defenders = new Map();
function _loadDefendersFromLevel(level) {
  for (let defender of level.defenders) {
    let defenderObj = new Defender(defender.uid, defender.name, defender.img,
                                   defender.xp_cost, defender.hp);
    defenders.set(defender.uid, defenderObj);
  }
}

let attackers = new Map();
function _loadAttackersFromLevel(level) {
  for (let attacker of level.attackers) {
    let attackerObj = new Attacker(attacker.uid, attacker.name, attacker.hp);
    attackers.set(attacker.uid, attackerObj);
  }
}

let scaleFactor = 1;
function _updateScaleFactor() {
  let yFactor = Math.max(windowHeight / YRESOLUTION, MIN_SCALE_FACTOR);
  let xFactor = Math.max(windowWidth / XRESOLUTION, MIN_SCALE_FACTOR);
  return Math.min(MAX_SCALE_FACTOR, Math.min(yFactor, xFactor));
}

function _displayError(err) {
  console.err(err);
  background(255);
  fill(255, 0, 0);
  textSize(20);
  text(err, 10, 20);
}

function _drawBackground() {
  background(0);
  image(images.get(level.uid), 0, 0);
}

function _drawPokestore() {
  let x = 100;
  let y = 20;
  for (let i = 0; i < 5; i++) {
     rect(x+(100*i), y, 100, 100);
  }
  for (let defender of defenders.values()) {
     image(images.get(defender.uid), x, y, 80, 80);
     textSize(10);
     text(defender.name, x+10, y+85);
     text('HP:' + defender.hp, x+50, y+85);
     text('XP:' + defender.xp, x+50, y+95);
     x += 100;
  }
}

function preload() {
  level = levels[0];
  _loadImagesFromLevel(level);
  _loadDefendersFromLevel(level);
  _loadAttackersFromLevel(level);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  _updateScaleFactor();
}

function draw() {
  scale(scaleFactor);
  if (err_duplicate_uid != "") {
    _displayError("Duplicate uid detected: " + err_duplicate_uid);
    noLoop();
    return;
  }
  _drawBackground();
  _drawPokestore();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  _updateScaleFactor();
}
