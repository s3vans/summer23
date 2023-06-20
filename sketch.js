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

class GameState {
  constructor() {
    this.level = undefined;
    this.levelImg = undefined;
    this.uids = new Map();
    this.err_duplicate_uid = "";
    this.attackers = new Map();
    this.defenders = new Map();
    this.scaleFactor = 1;
  }

  updateScaleFactor() {
    let yFactor = Math.max(windowHeight / YRESOLUTION, MIN_SCALE_FACTOR);
    let xFactor = Math.max(windowWidth / XRESOLUTION, MIN_SCALE_FACTOR);
    this.scaleFactor = Math.min(MAX_SCALE_FACTOR, Math.min(yFactor, xFactor));
  }

  displayError(err) {
    console.err(err);
    background(255);
    fill(255, 0, 0);
    textSize(20);
    text(err, 10, 20);
  }

  _isUidUnique(uid) {
    if (this.uids.has(uid)) {
      err_duplicate_uid = uid;
      return false;
    }
    this.uids.set(uid, true);
    return true;
  }

  // Returns "" if no duplicates were encountered.
  // Else returns the last duplicate id encountered.
  getDuplicateUid() {
    return this.err_duplicate_uid;
  }

  loadLevelFromLevelConfig(level) {
    this._loadLevel(level);
    this._loadDefendersFromLevel(level);
    this._loadAttackersFromLevel(level);
  }

  _loadLevel(level) {
    this.level = level;
    this.levelImg = loadImage(level.img);
    this._checkUidsFromLevel(level);
  }

  _checkUidsFromLevel(level) {
    this._isUidUnique(this.level.uid);
    for (let defender of this.level.defenders) {
      this._isUidUnique(defender.uid);
    }
    for (let attacker of this.level.attackers) {
      this._isUidUnique(attacker.uid);
    }
  }

  _loadDefendersFromLevel(level) {
    for (let defender of this.level.defenders) {
      let defenderObj = new Defender(defender.uid, defender.name,
                                     loadImage(defender.img), defender.xp_cost,
                                     defender.hp);
      this.defenders.set(defender.uid, defenderObj);
    }
  }

  _loadAttackersFromLevel(level) {
    for (let attacker of this.level.attackers) {
      let attackerObj = new Attacker(attacker.uid, attacker.name,
                                     loadImage(attacker.img), attacker.hp);
      this.attackers.set(attacker.uid, attackerObj);
    }
  }

  drawBackground() {
    background(0);
    image(this.levelImg, 0, 0);
  }

  drawPokestore() {
    let x = 100;
    let y = 20;
    for (let i = 0; i < 5; i++) {
       rect(x+(100*i), y, 100, 100);
    }
    for (let defender of this.defenders.values()) {
       image(defender.img, x, y, 80, 80);
       textSize(10);
       text(defender.name, x+10, y+85);
       text('HP:' + defender.hp, x+50, y+85);
       text('XP:' + defender.xp, x+50, y+95);
       x += 100;
    }
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

let game = new GameState();

function preload() {
  game.loadLevelFromLevelConfig(levels[0]);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  game.updateScaleFactor();
}

function draw() {
  scale(game.scaleFactor);
  if (game.getDuplicateUid() != "") {
    game.displayError("Duplicate uid detected: " + err_duplicate_uid);
    noLoop();
    return;
  }
  game.drawBackground();
  game.drawPokestore();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  game.updateScaleFactor();
}
