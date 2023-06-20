const XRESOLUTION = 800;
const YRESOLUTION = 600;
const MIN_SCALE_FACTOR = .5;
const MAX_SCALE_FACTOR = 3;

// A template that defines an available defender in a game level.
// Note that this doesn't currently represent an active character in the game.
class DefenderConfig {
  constructor(uid, name, img, xp_cost, hp) {
    this.uid = uid;
    this.name = name;
    this.img = img;
    this.xp = xp_cost;
    this.hp = hp;
  }
}

// A template that defines an available attacker in a game level.
// Note that this doesn't currently represent an active character in the game.
class AttackerConfig {
  constructor(uid, name, img, hp) {
    this.uid = uid;
    this.name = name;
    this.img = img;
    this.hp = hp;
  }
}

// All of the game config, state, and logic lives here.
class Game {
  constructor() {
    this.level = undefined;
    this.levelImg = undefined;
    this.uids = new Map();
    this.err_duplicate_uid = "";
    this.attackerConfigs = new Map();
    this.defenderConfigs = new Map();
    this.scaleFactor = 1;
  }

  _updateScaleFactor() {
    let yFactor = Math.max(windowHeight / YRESOLUTION, MIN_SCALE_FACTOR);
    let xFactor = Math.max(windowWidth / XRESOLUTION, MIN_SCALE_FACTOR);
    this.scaleFactor = Math.min(MAX_SCALE_FACTOR, Math.min(yFactor, xFactor));
  }

  _displayError(err) {
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

  loadLevel(level) {
    this._loadLevel(level);
    this._loadDefenderConfigForLevel(level);
    this._loadAttackerConfigForLevel(level);
  }

  _loadLevel(level) {
    this.level = level;
    this.levelImg = loadImage(level.img);
    this._checkUidsFromLevel(level);
  }

  _checkUidsFromLevel(level) {
    this._isUidUnique(level.uid);
    for (let defender of level.defenderConfigs) {
      this._isUidUnique(defender.uid);
    }
    for (let attacker of level.attackerConfigs) {
      this._isUidUnique(attacker.uid);
    }
  }

  _loadDefenderConfigForLevel(level) {
    for (let defender of this.level.defenderConfigs) {
      let defenderObj = new DefenderConfig(defender.uid, defender.name,
                                           loadImage(defender.img),
                                           defender.xp_cost, defender.hp);
      this.defenderConfigs.set(defender.uid, defenderObj);
    }
  }

  _loadAttackerConfigForLevel(level) {
    for (let attacker of this.level.attackerConfigs) {
      let attackerObj = new AttackerConfig(attacker.uid, attacker.name,
                                           loadImage(attacker.img),
                                           attacker.hp);
      this.attackerConfigs.set(attacker.uid, attackerObj);
    }
  }

  // TODO: Make canvas local to game.
  setup() {
    createCanvas(windowWidth, windowHeight);
    this._updateScaleFactor();
  }

  update() {
  }

  draw() {
    scale(this.scaleFactor);
    if (game.getDuplicateUid() != "") {
      game._displayError("Duplicate uid detected: " + err_duplicate_uid);
      noLoop();
      return;
    }
    this._drawBackground();
    this._drawPokestore();
  }

  _drawBackground() {
    background(0);
    image(this.levelImg, 0, 0);
  }

  _drawPokestore() {
    let x = 100;
    let y = 20;
    for (let i = 0; i < 5; i++) {
       rect(x+(100*i), y, 100, 100);
    }
    for (let defender of this.defenderConfigs.values()) {
       image(defender.img, x, y, 80, 80);
       textSize(10);
       text(defender.name, x+10, y+85);
       text('HP:' + defender.hp, x+50, y+85);
       text('XP:' + defender.xp, x+50, y+95);
       x += 100;
    }
  }

  windowResized() { 
    resizeCanvas(windowWidth, windowHeight);
    this._updateScaleFactor();
  }
}
