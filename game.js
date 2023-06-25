// TODO: Unify common character/object traits into parent class.
// TODO: Implement deaths and expirations.
// TODO: Call update() function on attackers/defenders to produce movement.
// TODO: Allow defenders to detect attackers in their row.
// TODO: Allow defenders to launch projectile attacks.
// TODO: Add collectibles to restore XP.
// TODO: Implement character states.
// TODO: Implement visual Effects.
// TODO: Add sounds.
// TODO: Support drawing character animations (at rest).
// TODO: Allow attackers to be scheduled via config.
// TODO: Replace many hard coded vals with default vals overriden by config.

let attackerCnt = 0;

const XRESOLUTION = 800;
const YRESOLUTION = 600;
const MIN_SCALE_FACTOR = .5;
const MAX_SCALE_FACTOR = 3;

const STORE_X = 100;
const STORE_Y = 0;
const STORE_ITEM_COUNT = 6;
const STORE_ITEM_WIDTH = 100;
const STORE_ITEM_HEIGHT = 100;
const STORE_ITEM_IMG_WIDTH = 80;
const STORE_ITEM_IMG_HEIGHT = 80;

const MAP_X = 100;
const MAP_Y = 100;
const MAP_CELL_COL_COUNT = 7;
const MAP_CELL_ROW_COUNT = 5;
const MAP_CELL_WIDTH = 100;
const MAP_CELL_HEIGHT = 100;
const MAP_CELL_IMG_WIDTH = 100;
const MAP_CELL_IMG_HEIGHT = 100;
const MAP_ENEMY_QUEUE_OFFSET = 50;
const MAP_HP_XOFFSET = 50;
const MAP_HP_YOFFSET = 100;

const OVERLAY_X = 700;
const OVERLAY_Y = 0;
const OVERLAY_WIDTH = 100;
const OVERLAY_HEIGHT = 100;

// Rudimentary defender instance.
class Defender {
  constructor(row, col, img, hp) {
    this.row = row;
    this.col = col;
    this.img = img;
    this.hp = hp;
    this.x_pos = MAP_X + (MAP_CELL_WIDTH * col);
    this.y_pos = MAP_Y + (MAP_CELL_HEIGHT * row);
    this.width = MAP_CELL_WIDTH;
  }

  hit() {
    this.hp -= 1;
  }
}

// Rudimentary attacker instance.
class Attacker {
  constructor(row, img, hp) {
    this.row = row;
    this.img = img;
    this.hp = hp;
    this.x_pos = XRESOLUTION + MAP_CELL_WIDTH;
    this.y_pos = MAP_Y + row * MAP_CELL_HEIGHT;
    this.speed = 1;
    this.width = MAP_CELL_WIDTH;
  }

  update() {
  }
}

class Collectible {
  constructor(row, col) {
    this.height = MAP_CELL_HEIGHT / 2;
    this.width = MAP_CELL_WIDTH / 2;
    this.x_pos = MAP_X + (col * MAP_CELL_WIDTH) + (MAP_CELL_WIDTH / 2);
    this.y_pos = 0 - MAP_CELL_HEIGHT;
    this.target_y_pos = MAP_Y + (row * MAP_CELL_HEIGHT) + (MAP_CELL_HEIGHT / 2);
    this.speed = 1;
  }

  draw() {
    push();
    fill(255, 255, 0);
    circle(this.x_pos, this.y_pos, this.width);
    pop();
  }

  update() {
    if (this.y_pos < this.target_y_pos) {
      this.y_pos += this.speed;
    }
  }
}

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
    // General state
    this.canvas = undefined;
    this.uids = new Map();
    this.err_duplicate_uid = "";
    this.scaleFactor = 1;

    // Level State
    this.levelConfig = undefined;
    this.levelImg = undefined;
    this.levelXp = 0;
    this.attackerConfigMap = new Map();
    this.attackerConfigs = [];
    this.attackersByRow = [];
    for (let row = 0; row < MAP_CELL_ROW_COUNT; row++) {
      this.attackersByRow[row] = [];
    }
    this.defenderConfigMap = new Map();
    this.defendersByRow = [];
    for (let row = 0; row < MAP_CELL_ROW_COUNT; row++) {
      this.defendersByRow[row] = [];
    }

    // Store State
    this.defenderConfigs = [];
    this.selected = -1;

    // Active Game + Map State
    this.activeAttackers = [];
    this.activeDefenders = [];
    this.activeCollectibles = [];
    this.state = "NORMAL";
    this.map_state = [];
    for (let row = 0; row < MAP_CELL_ROW_COUNT; row++) {
      this.map_state[row] = [];
      for (let col = 0; col < MAP_CELL_COL_COUNT; col++) {
        this.map_state[row][col] = undefined;
      }
    }
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

  _checkUidsFromLevel(levelConfig) {
    this._isUidUnique(levelConfig.uid);
    for (let defender of levelConfig.defenderConfigs) {
      this._isUidUnique(defender.uid);
    }
    for (let attacker of levelConfig.attackerConfigs) {
      this._isUidUnique(attacker.uid);
    }
  }

  _loadDefenderConfigForLevel(levelConfig) {
    for (let defender of levelConfig.defenderConfigs) {
      let defenderObj = new DefenderConfig(defender.uid, defender.name,
                                           loadImage(defender.img),
                                           defender.xp_cost, defender.hp);
      this.defenderConfigMap.set(defender.uid, defenderObj);
      this.defenderConfigs.push(defenderObj);
    }
  }

  _loadAttackerConfigForLevel(levelConfig) {
    for (let attacker of levelConfig.attackerConfigs) {
      let attackerObj = new AttackerConfig(attacker.uid, attacker.name,
                                           loadImage(attacker.img),
                                           attacker.hp);
      this.attackerConfigMap.set(attacker.uid, attackerObj);
      this.attackerConfigs.push(attackerObj);
    }
  }

  _sendAttacker() {
    // TODO: Validate that there is at least one attacker in the levelConfig.
    if (attackerCnt++ > 100) {
      return;
    }
    let row = Math.floor(Math.random() * MAP_CELL_ROW_COUNT);
    let num = Math.floor(Math.random() * this.attackerConfigMap.size);
    let attackerConfig = this.attackerConfigs[num];
    let attacker = new Attacker(row, attackerConfig.img, attackerConfig.hp);
    this.activeAttackers.push(attacker);
    this.attackersByRow[row].push(attacker);
  }

  _sendCollectible() {
    let row = Math.floor(Math.random() * MAP_CELL_ROW_COUNT);
    let col = Math.floor(Math.random() * MAP_CELL_COL_COUNT);
    this.activeCollectibles.push(new Collectible(row, col));
  }

  // Return |other_character| from |characters| if |character| is within
  // |distance| as measured between their centers, else return undefined.
  //
  // We use the center of the characters to avoid dealing with edges.
  _nextTo(character, characters, distance) {
    for (let other of characters) {
      if (other == character) {
        continue;
      }
      let C = (character.x_pos + (character.x_pos+character.width)) / 2;
      let CO = (other.x_pos + (other.x_pos+other.width)) / 2;
      if (Math.abs(C - CO) <= distance) {
        return other;
      }
    }
    return undefined;
  }

  setup() {
    this._updateScaleFactor();
    this.canvas = createCanvas(XRESOLUTION*this.scaleFactor,
                               YRESOLUTION*this.scaleFactor);
    setInterval(() => { this._sendAttacker(); }, 5000);
    setInterval(() => { this._sendCollectible(); }, 6000);
  }

  update() {
    for (let attacker of this.activeAttackers) {
      // Check for GAME OVER condition.
      if (attacker.x_pos < MAP_X - (MAP_CELL_WIDTH / 2)) {
        this.state = "GAMEOVER";
        return;
      }

      // Order is important here. If we check for attack after we check for
      // neighboring attacker, then we stop hitting.

      // Check for attack condition.
      let defendersToTheLeft = this.defendersByRow[attacker.row]
          .filter(a => a.x_pos < attacker.x_pos);
      let defender = this._nextTo(attacker,
                                  defendersToTheLeft,
                                  MAP_CELL_WIDTH);
      if (defender != undefined) {
        defender.hit();
        continue;
      }

      // Stand back if next to another attacker.
      let other_attacker = this._nextTo(attacker,
                                        this.attackersByRow[attacker.row],
                                        MAP_ENEMY_QUEUE_OFFSET);

      if (other_attacker != undefined) {
        continue;
      }

      // Move left at speed.
      attacker.x_pos -= attacker.speed;
    }

    for (let collectible of this.activeCollectibles) {
      collectible.update();
    }
  }

  draw() {
    scale(this.scaleFactor);
    if (this.getDuplicateUid() != "") {
      this._displayError("Duplicate uid detected: " + err_duplicate_uid);
      noLoop();
      return;
    }
    if (this.state == "GAMEOVER") {
      console.log("GAME OVER");
      push();
      translate(XRESOLUTION/2, YRESOLUTION/2);
      stroke(0); fill(255);
      rectMode(CENTER);
      //let goW = 300;
      //let goH = 70;
      let goW = 400;
      let goH = 90;
      rect(0, 0, goW, goH);
      rect(0, 0, goW-6, goH-6);
      strokeWeight(1); stroke(0); fill(0);
      textSize(24); textAlign(CENTER, CENTER);
      text("G A M E     O V E R\n(っ◡︵◡ς)", 0, 0);
      pop();
      noLoop();
      return;
    }
    this._drawBackground();
    this._drawCharacters();
    this._drawProjectiles();
    this._drawCollectibles();
    this._drawEffects();
    this._drawStore();
    this._drawCursor();
    this._drawOverlay();
  }

  _scaleMouse(pos) {
    return pos / this.scaleFactor;
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
    for (let defender of this.defenderConfigMap.values()) {
       image(defender.img, x+10, 0, STORE_ITEM_IMG_WIDTH, STORE_ITEM_IMG_HEIGHT);
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

  // Draws all of the characters.
  _drawCharacters() {
    // FIXME: This is hacked together for drawing defenders. Attackers move and
    // aren't aligned with the grids.
    let y = MAP_Y;
    for (let row = 0; row < MAP_CELL_ROW_COUNT; row++) {
      let x = MAP_X;
      for (let col = 0; col < MAP_CELL_COL_COUNT; col++) {
        let defender = this.map_state[row][col];
        if (defender != undefined) {
          image(defender.img, x, y, MAP_CELL_IMG_WIDTH, MAP_CELL_IMG_HEIGHT);
          push();
          noStroke(); fill(255); textSize(10);
          text('HP:' + defender.hp, x+MAP_HP_XOFFSET, y+MAP_HP_YOFFSET);
          pop();
        }
        x = x + MAP_CELL_WIDTH;
      }
      y = y + MAP_CELL_HEIGHT;
    }

    // FIXME: Here's another hack for drawing the attackers.
    for (let attacker of this.activeAttackers) {
      image(attacker.img, attacker.x_pos, attacker.y_pos, MAP_CELL_IMG_WIDTH,
            MAP_CELL_IMG_HEIGHT);
      push();
      noStroke(); fill(255); textSize(10);
      text('HP:' + attacker.hp, attacker.x_pos+MAP_HP_XOFFSET,
           attacker.y_pos+MAP_HP_YOFFSET);
      pop();
    }
  }

  // TODO: This draws all of the projectiles.
  _drawProjectiles() {
  }

  // This draws all of the collectibles.
  _drawCollectibles() {
    for (let collectible of this.activeCollectibles) {
      collectible.draw();
    }
  }

  // TODO: This draws all of the overlayed effects.
  _drawEffects() {
  }

  _mouseInRectangle(x, y, width, height) {
    let mX = this._scaleMouse(mouseX);
    let mY = this._scaleMouse(mouseY);
    if (mX < x || mX > x+width) {
      return false;
    }
    if (mY < y || mY > y+height) {
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
    } else if (this.state == "SELECTED") {
      this._highlightRectangle(STORE_X+(STORE_ITEM_WIDTH*this.selected), STORE_Y,
                               STORE_ITEM_WIDTH, STORE_ITEM_HEIGHT,
                               color(0, 255, 255, 100));
      let y = MAP_Y;
      for (let row = 0; row < MAP_CELL_ROW_COUNT; row++) {
        let x = MAP_X;
        for (let col = 0; col < MAP_CELL_COL_COUNT; col++) {
          if (this._mouseInRectangle(x, y, MAP_CELL_WIDTH, MAP_CELL_HEIGHT)) {
            if (this.map_state[row][col] == undefined) {
              this._highlightRectangle(x, y, MAP_CELL_WIDTH, MAP_CELL_HEIGHT,
                                       color(255, 255, 0, 100));
            } else {
              this._highlightRectangle(x, y, MAP_CELL_WIDTH, MAP_CELL_HEIGHT,
                                       color(255, 0, 0, 100));
            }
          }
          x = x + MAP_CELL_WIDTH;
        }
        y = y + MAP_CELL_HEIGHT;
      }
    }
    pop();
  }

  // This draws all of the overlayed game info, such as XP.
  _drawOverlay() {
    push();
    translate(OVERLAY_X, OVERLAY_Y);
    fill(0, 0, 0, 100);
    rect(0, 0, OVERLAY_WIDTH, OVERLAY_HEIGHT);
    pop();
    push();
    translate(OVERLAY_X+20, OVERLAY_Y+30);
    fill(255); strokeWeight(1); stroke(255); textSize(16);
    text(this.levelName, 0, 0);
    text("XP: " + this.levelXp, 0, 24);
    pop();
  }

  _getSelectedStoreItemIdx() {
    let mX = this._scaleMouse(mouseX);
    let mY = this._scaleMouse(mouseY);
    let x = STORE_X;
    let y = STORE_Y;
    for (let i = 0; i < STORE_ITEM_COUNT; i++) {
      if (mX >= x+(STORE_ITEM_WIDTH*i) && mX < x+(STORE_ITEM_WIDTH*(i+1))) {
        if (mY >= y && mY <= 120) {
          if (i < this.defenderConfigMap.size) {
            return i;
          }
          return -1;
        }
      }
    }
    return -1;
  }

  _getSelectedMapRowCol() {
      let y = MAP_Y;
      for (let row = 0; row < MAP_CELL_ROW_COUNT; row++) {
        let x = MAP_X;
        for (let col = 0; col < MAP_CELL_COL_COUNT; col++) {
          if (this._mouseInRectangle(x, y, MAP_CELL_WIDTH, MAP_CELL_HEIGHT)) {
            return [row, col]
          }
          x = x + MAP_CELL_WIDTH;
        }
        y = y + MAP_CELL_HEIGHT;
      }
      return [-1, -1];
  }

  mouseClicked() {
    // TODO: Handle collecting Collectibles first.
    //for (let collectible of this.activeCollectibles) {
    //  let mX = this._scaleMouse(mouseX);
    //  let mY = this._scaleMouse(mouseY);
    //  if ((mY < STORE_Y+STORE_ITEM_HEIGHT) || (mX < STORE_X)) {
    //  }
    //}
    if (this.state == "NORMAL") {
      let idx = this._getSelectedStoreItemIdx();
      if (idx == -1) {
        return;
      }
      if (this.levelXp >= this.defenderConfigs[idx].xp) {
        this.state = "SELECTED";
        this.selected = idx;
      }
    } else if (this.state == "SELECTED") {
        // Handle changing selection.
        let idx = this._getSelectedStoreItemIdx();
        if (idx != -1) {
          if (this.levelXp >= this.defenderConfigs[idx].xp) {
            this.state = "SELECTED";
            this.selected = idx;
          }
        } else {
          // Handle placing on map.
          let [row, col] = this._getSelectedMapRowCol();
          if (row == -1) {
            return;
          }
          if (this.map_state[row][col] != undefined) {
            return;
          }
          let defenderConfig = this.defenderConfigs[this.selected];
          let defender = new Defender(row, col, defenderConfig.img,
                                      defenderConfig.hp);
          this.map_state[row][col] = defender
          this.activeDefenders.push(defender);
          this.defendersByRow[row].push(defender);
          this.levelXp -= this.defenderConfigs[this.selected].xp;
          this.state = "NORMAL";
          this.selected = -1;
      }
    }
  }

  windowResized() {
    // TODO: Is there a resize for this.canvas?
    this._updateScaleFactor();
    resizeCanvas(XRESOLUTION*this.scaleFactor, YRESOLUTION*this.scaleFactor);
  }
}
