// TODO: Make timing frame independent.
// TODO: Implement character states.
// TODO: Implement visual effects.
// TODO: Add sounds.
// TODO: Support drawing character animations (at rest).
// TODO: Allow attackers to be scheduled via config.
// TODO: Unify common character/object traits into parent class.
// TODO: Replace many hard coded vals with default vals overriden by config.
// FIXME: Collectibles fall to top-left of target square.

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

function removeFromArray(arr, elem) {
  const index = arr.indexOf(elem);
  if (index != -1) {
    arr.splice(index, 1);
  }
}

class Character {
  constructor(game, characterConfig, state, row, col, x_pos, y_pos, health) {
    this.game = game;
    // Static config:
    // name, uid, img, width, height, speed
    this.config = config;
    // Instance config:
    this.state = state;
    this.row = row;
    this.col = col;
    this.x_pos = x_pos;
    this.y_pos = y_pos;
    this.health = health;
  }
}

class DefenderCharacter extends Character {
  constructor(game, defenderConfig, row, col) {
    super(
        game, defenderConfig,
        /*state=*/"IDLE", row, col,
        /*x_pos=*/MAP_X + (MAP_CELL_WIDTH * col),
        /*y_pos=*/MAP_Y + (MAP_CELL_HEIGHT * row),
        defenderConfig.health);
  }
}

// Rudimentary defender instance.
class Defender {
  constructor(game, row, col, uid, img, hp, recharge) {
    this.game = game;
    this.row = row;
    this.col = col;
    this.uid = uid;
    this.img = img;
    this.hp = hp;
    this.x_pos = MAP_X + (MAP_CELL_WIDTH * col);
    this.y_pos = MAP_Y + (MAP_CELL_HEIGHT * row);
    this.width = MAP_CELL_WIDTH;
    this.charge = recharge;
    this.recharge = recharge;
  }

  hit() {
    this.hp -= 1;
    if (this.hp <= 0) {
      this.game.map_state[this.row][this.col] = undefined;
      removeFromArray(this.game.defendersByRow[this.row], this);
      removeFromArray(this.game.activeDefenders, this);
    }
  }

  update() {
    if (this.game.attackersByRow[this.row].length > 0) {
      if (this.charge == this.recharge) {
        let defenderConfig = this.game.defenderConfigMap.get(this.uid);
        let projectile = new Projectile(this.game, this.row, this.col,
                                        defenderConfig.projectile_img,
                                        defenderConfig.projectile_hp,
                                        defenderConfig.projectile_speed);
        this.game.activeProjectiles.push(projectile);
        this.charge = 0;
      }
    }
    if (this.charge < this.recharge) {
      this.charge++;
    }
  }
}

// Rudimentary attacker instance.
class Attacker {
  constructor(game, row, img, hp) {
    this.game = game;
    this.row = row;
    this.img = img;
    this.hp = hp;
    this.x_pos = XRESOLUTION + MAP_CELL_WIDTH;
    this.y_pos = MAP_Y + row * MAP_CELL_HEIGHT;
    this.speed = 1;
    this.width = MAP_CELL_WIDTH;
  }

  hit() {
    this.hp -= 100;
    if (this.hp <= 0) {
      this.game.map_state[this.row][this.col] = undefined;
      removeFromArray(this.game.attackersByRow[this.row], this);
      removeFromArray(this.game.activeAttackers, this);
    }
  }

  update() {
      // Order is important here. If we check for attack after we check for
      // neighboring attacker, then we stop hitting.

      // Check for attack condition.
      let defendersToTheLeft = this.game.defendersByRow[this.row]
          .filter(a => a.x_pos < this.x_pos);
      let defender =
          this.game._nextTo(this, defendersToTheLeft, MAP_CELL_WIDTH);
      if (defender != undefined) {
        defender.hit();
        return;
      }

      // Stand back if next to another attacker.
      let attackersToTheLeft = this.game.attackersByRow[this.row]
          .filter(a => a.x_pos < this.x_pos);
      let other_attacker = this.game._nextTo(this, attackersToTheLeft,
                                             MAP_ENEMY_QUEUE_OFFSET);

      if (other_attacker != undefined) {
        return;
      }

      // Move left at speed.
      this.x_pos -= this.speed;
  }
}

// Rudimentary collectible instance.
class Collectible {
  constructor(game, row, col, img, xp, lifespan) {
    this.game = game;
    this.state = "FALLING";
    this.height = MAP_CELL_HEIGHT / 2;
    this.width = MAP_CELL_WIDTH / 2;
    this.img = img;
    this.x_pos = MAP_X + (col * MAP_CELL_WIDTH);
    this.y_pos = 0 - MAP_CELL_HEIGHT;
    this.target_y_pos = MAP_Y + (row * MAP_CELL_HEIGHT);
    this.speed = 1;
    this.xp = xp;
    this.lifespan = lifespan;
  }

  draw() {
    push();
    image(this.img, this.x_pos, this.y_pos, this.width, this.height);
    pop();
  }

  update() {
    if (this.state == "LANDED") {
      if (this.lifespan > 0) {
        this.lifespan -= 1;
      } else {
        removeFromArray(this.game.activeCollectibles, this);
      }
    }
    if (this.y_pos < this.target_y_pos) {
      this.y_pos += this.speed;
    } else {
      this.state = "LANDED";
    }
  }
}

class Projectile {
  constructor(game, row, col, img, hp, speed) {
    this.game = game;
    this.state = "FLYING";
    this.row = row;
    this.col = col;
    this.height = MAP_CELL_HEIGHT / 2;
    this.width = MAP_CELL_WIDTH / 2;
    this.img = img;
    this.x_pos = MAP_X + (col * MAP_CELL_WIDTH);
    this.y_pos = MAP_Y + (row * MAP_CELL_HEIGHT);
    this.speed = speed;
    this.hp = hp;
  }

  draw() {
    push();
    image(this.img, this.x_pos, this.y_pos, this.width, this.height);
    pop();
  }

  update() {
    if (this.state == "FLYING") {
      // Handle hits first.
      let attackersToTheRight = this.game.attackersByRow[this.row]
          .filter(a => a.x_pos > this.x_pos);
      let attacker =
          this.game._nextTo(this, attackersToTheRight, MAP_CELL_WIDTH);
      if (attacker != undefined) {
        attacker.hit();
        removeFromArray(this.game.activeProjectiles, this);
        return;
      }
      if (this.x_pos < XRESOLUTION + MAP_CELL_WIDTH) {
        this.x_pos += this.speed;
      } else {
        // Remove it once offscreen.
        removeFromArray(this.game.activeProjectiles, this);
      }
    }
  }
}

// A template that defines an available defender in a game level.
// Note that this doesn't currently represent an active character in the game.
class DefenderConfig {
  constructor(uid, name, img, xp_cost, hp, projectile_img, projectile_hp,
              projectile_speed, projectile_recharge) {
    this.uid = uid;
    this.name = name;
    this.img = img;
    this.xp = xp_cost;
    this.hp = hp;
    this.projectile_img = projectile_img;
    this.projectile_hp = projectile_hp;
    this.projectile_speed = projectile_speed;
    this.projectile_recharge = projectile_recharge;
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

// A template that defines an available collectible in a game level.
class CollectibleConfig {
  constructor(uid, name, img, xp, lifespan) {
    this.uid = uid;
    this.name = name;
    this.img = img;
    this.xp = xp;
    this.lifespan = lifespan;
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
    this.collectibleConfigMap = new Map();
    this.collectibleConfigs = [];

    // Store State
    this.defenderConfigs = [];
    this.selected = -1;

    // Active Game + Map State
    this.activeAttackers = [];
    this.activeDefenders = [];
    this.activeCollectibles = [];
    this.activeProjectiles = [];
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
    this._loadCollectibleConfigForLevel(levelConfig);
  }

  _loadLevel(levelConfig) {
    this.levelConfig = levelConfig;
    this.levelUid = levelConfig.uid;
    this.levelName = levelConfig.name;
    this.levelImg = loadImage(levelConfig.img);
    this.levelXp = levelConfig.startingXp;
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
                                           defender.xp_cost, defender.hp,
                                           loadImage(defender.projectile_img),
                                           defender.projectile_hp,
                                           defender.projectile_speed,
                                           defender.projectile_recharge);
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

  _loadCollectibleConfigForLevel(levelConfig) {
    for (let collectible of levelConfig.collectibleConfigs) {
      let collectibleObj = new CollectibleConfig(collectible.uid,
                                                 collectible.name,
                                                 loadImage(collectible.img),
                                                 collectible.xp,
                                                 collectible.lifespan);
      this.collectibleConfigMap.set(collectible.uid, collectibleObj);
      this.collectibleConfigs.push(collectibleObj);
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
    let attacker =
        new Attacker(game, row, attackerConfig.img, attackerConfig.hp);
    this.activeAttackers.push(attacker);
    this.attackersByRow[row].push(attacker);
  }

  _sendCollectible() {
    let row = Math.floor(Math.random() * MAP_CELL_ROW_COUNT);
    let col = Math.floor(Math.random() * MAP_CELL_COL_COUNT);
    let num = Math.floor(Math.random() * this.collectibleConfigMap.size);
    let collectibleConfig = this.collectibleConfigs[num];
    this.activeCollectibles.push(new Collectible(game, row, col,
                                                 collectibleConfig.img,
                                                 collectibleConfig.xp,
                                                 collectibleConfig.lifespan));
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
      attacker.update();
    }

    for (let defender of this.activeDefenders) {
      defender.update();
    }

    for (let collectible of this.activeCollectibles) {
      collectible.update();
    }

    for (let projectile of this.activeProjectiles) {
      projectile.update();
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
       image(defender.img, x+10, 0, STORE_ITEM_IMG_WIDTH,
             STORE_ITEM_IMG_HEIGHT);
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

  // This draws all of the projectiles.
  _drawProjectiles() {
    for (let projectile of this.activeProjectiles) {
      projectile.draw();
    }
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
      this._highlightRectangle(STORE_X+(STORE_ITEM_WIDTH*this.selected),
                               STORE_Y, STORE_ITEM_WIDTH, STORE_ITEM_HEIGHT,
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

  _handleCollectibleClick() {
    let mX = this._scaleMouse(mouseX);
    let mY = this._scaleMouse(mouseY);
    if ((mY >= STORE_Y+STORE_ITEM_HEIGHT) && (mX >= STORE_X)) {
      for (let collectible of this.activeCollectibles) {
        let center_x = collectible.x_pos + (collectible.width / 2);
        let center_y = collectible.y_pos + (collectible.height / 2);
        let hit_distance = collectible.width / 2;
        if ((Math.abs(center_x - mX) <= hit_distance) &&
            (Math.abs(center_y - mY) <= hit_distance)) {
        }
        if ((Math.abs(center_x - mX) <= hit_distance) &&
            (Math.abs(center_y - mY) <= hit_distance)) {
          this.levelXp += collectible.xp;
          removeFromArray(this.activeCollectibles, collectible);
          return true;
        }
      }
    }
    return false;
  }

  _handleCharacterSelection() {
    let idx = this._getSelectedStoreItemIdx();
    if (idx != -1) {
      if (this.levelXp >= this.defenderConfigs[idx].xp) {
        this.state = "SELECTED";
        this.selected = idx;
        return true;
      }
    }
    return false;
  }

  _handleCharacterPlacement() {
    let [row, col] = this._getSelectedMapRowCol();
    if (row == -1) {
      return false;
    }
    if (this.map_state[row][col] != undefined) {
      return false;
    }
    let defenderConfig = this.defenderConfigs[this.selected];
    let defender = new Defender(game, row, col, defenderConfig.uid,
                                defenderConfig.img,
                                defenderConfig.hp,
                                defenderConfig.projectile_recharge);
    this.map_state[row][col] = defender
    this.activeDefenders.push(defender);
    this.defendersByRow[row].push(defender);
    this.levelXp -= this.defenderConfigs[this.selected].xp;
    this.state = "NORMAL";
    this.selected = -1;
    return true;
  }

  // In NORMAL and SELECTED states, we always handle collectible clicks,
  // followed by character selection changes. Only in SELECTED do we handle
  // placing a character on the map.
  // FIXME: Letting off the mouse seems to count as a click which can cause
  // mispacement of defenders after clicking on a collectibel.
  mouseClicked() {
    if ((this.state == "NORMAL") || (this.state == "SELECTED")) {
      if (this._handleCollectibleClick()) {
        return;
      }
      if (this._handleCharacterSelection()) {
        return;
      }
    }
    if (this.state == "SELECTED") {
      if (this._handleCharacterPlacement()) {
        return;
      }
    }
    return;
  }

  windowResized() {
    // TODO: Is there a resize for this.canvas?
    this._updateScaleFactor();
    resizeCanvas(XRESOLUTION*this.scaleFactor, YRESOLUTION*this.scaleFactor);
  }
}
