const XRESOLUTION = 800;
const YRESOLUTION = 600;
const MIN_SCALE_FACTOR = .5;
const MAX_SCALE_FACTOR = 3;

const STORE_X = 100;
const STORE_Y = 20;
const STORE_ITEM_COUNT = 6;
const STORE_ITEM_WIDTH = 100;
const STORE_ITEM_HEIGHT = 100;
const STORE_ITEM_IMG_WIDTH = 80;
const STORE_ITEM_IMG_HEIGHT = 80;

const OVERLAY_X = 720;
const OVERLAY_Y = 90;

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
    this.canvas = undefined;
    this.levelConfig = undefined;
    this.levelImg = undefined;
    this.levelXp = 0;
    this.uids = new Map();
    this.err_duplicate_uid = "";
    this.attackerConfigs = new Map();
    this.defenderConfigs = new Map();
    this.scaleFactor = 1;
    this.state = "NORMAL";
    this.selected = -1;
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

  loadLevel(levelConfig) {
    this._loadLevel(levelConfig);
    this._loadDefenderConfigForLevel(levelConfig);
    this._loadAttackerConfigForLevel(levelConfig);
  }

  _loadLevel(levelConfig) {
    this.levelConfig = levelConfig;
    this.levelUid = levelConfig.uid;
    this.levelName = levelConfig.name;
    this.levelImg = loadImage(levelConfig.img);
    this.levelXp = levelConfig.levelXp;
    this._checkUidsFromLevel(levelConfig);
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

  _loadDefenderConfigForLevel(levelConfig) {
    for (let defender of levelConfig.defenderConfigs) {
      let defenderObj = new DefenderConfig(defender.uid, defender.name,
                                           loadImage(defender.img),
                                           defender.xp_cost, defender.hp);
      this.defenderConfigs.set(defender.uid, defenderObj);
    }
  }

  _loadAttackerConfigForLevel(levelConfig) {
    for (let attacker of levelConfig.attackerConfigs) {
      let attackerObj = new AttackerConfig(attacker.uid, attacker.name,
                                           loadImage(attacker.img),
                                           attacker.hp);
      this.attackerConfigs.set(attacker.uid, attackerObj);
    }
  }

  setup() {
    this.canvas = createCanvas(windowWidth, windowHeight);
    this._updateScaleFactor();
  }

  update() {
  }

  draw() {
    scale(this.scaleFactor);
    if (this.getDuplicateUid() != "") {
      this._displayError("Duplicate uid detected: " + err_duplicate_uid);
      noLoop();
      return;
    }
    this._drawBackground();
    this._drawStore();
    this._drawCharacters();
    this._drawProjectiles();
    this._drawCollectibles();
    this._drawEffects();
    this._drawCursor();
    this._drawOverlay();
  }

  _drawBackground() {
    push();
    background(0);
    image(this.levelImg, 0, 0, XRESOLUTION, YRESOLUTION);
    pop();
  }

  _drawStore() {
    push();
    translate(STORE_X, STORE_Y);
    for (let i = 0; i < STORE_ITEM_COUNT; i++) {
       push();
       strokeWeight(1); stroke(0); fill(255);
       rect(STORE_ITEM_WIDTH*i, 0, STORE_ITEM_WIDTH, STORE_ITEM_HEIGHT);
       pop();
    }
    let x = 0;
    for (let defender of this.defenderConfigs.values()) {
       image(defender.img, x, 0, STORE_ITEM_IMG_WIDTH, STORE_ITEM_IMG_HEIGHT);
       push();
       noStroke(); fill(0); textSize(10);
       text(defender.name, x+10, 85);
       text('HP:' + defender.hp, x+60, 85);
       text('XP:' + defender.xp, x+60, 95);
       pop();
       x += STORE_ITEM_WIDTH;
    }
    pop();
  }

  // TODO: This draws all of the characters.
  _drawCharacters() {
  }

  // TODO: This draws all of the projectiles.
  _drawProjectiles() {
  }

  // TODO: This draws all of the collectibles.
  _drawCollectibles() {
  }

  // TODO: This draws all of the overlayed effects.
  _drawEffects() {
  }

  _mouseInRectangle(x, y, width, height) {
    if (mouseX < x || mouseX > x+width) {
      return false;
    }
    if (mouseY < y || mouseY > y+height) {
      return false;
    }
    return true;
  }

  _highlightRectangle(x, y, width, height, color, transparency) {
    push();
    fill(color);
    rect(x, y, width, height);
    pop();
  }

  _drawCursor() {
    push();
    if (this.state == "NORMAL") {
      let x = STORE_X;
      let y = STORE_Y;
      for (let i = 0; i < STORE_ITEM_COUNT; i++) {
        if (this._mouseInRectangle(x, y, STORE_ITEM_WIDTH, STORE_ITEM_HEIGHT)) {
          this._highlightRectangle(x, y, STORE_ITEM_WIDTH, STORE_ITEM_HEIGHT,
                                   color(255, 255, 0, 100));
        }
        x = x + STORE_ITEM_WIDTH;
      }
    }
    else if (this.state == "SELECTED") {
      this._highlightRectangle(STORE_X+(STORE_ITEM_WIDTH*this.selected), STORE_Y,
                               STORE_ITEM_WIDTH, STORE_ITEM_HEIGHT,
                               color(0, 255, 255, 100));
    }
    pop();
  }

  // This draws all of the overlayed game info, such as XP.
  _drawOverlay() {
    push();
    translate(OVERLAY_X, OVERLAY_Y);
    fill(0); strokeWeight(1); stroke(0); textSize(16);
    text(this.levelName, 0, 0);
    text("XP: " + this.levelXp, 0, 24);
    pop();
  }

  _getSelectedStoreItemIdx() {
    let x = 100;
    let y = 20;
    for (let i = 0; i < 5; i++) {
      if (mouseX >= x+(100*i) && mouseX <= x+(100*(i+1))) {
        if (mouseY >= y && mouseY <= 120) {
          return i;
        }
      }
    }
    return -1;
  }

  mouseClicked() {
    if (this.state == "NORMAL") {
      let idx = this._getSelectedStoreItemIdx();
      if (idx != -1) {
        this.state = "SELECTED";
        this.selected = idx;
      }
      setInterval(() => { this.state = "NORMAL"; this.selected = -1; }, 2000);
    }
  }

  windowResized() { 
    resizeCanvas(windowWidth, windowHeight);
    this._updateScaleFactor();
  }
}
