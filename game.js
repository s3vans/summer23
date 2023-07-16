// TODO: Make timing frame independent.
// TODO: Implement character states.
// TODO: Implement visual effects.
// TODO: Add sounds.
// TODO: Allow attackers to be scheduled via config.
// TODO: Unify common character/object traits into parent class.
// TODO: Replace many hard coded vals with default vals overriden by config.
// FIXME: Collectibles fall to top-left of target square.

let attackerCnt = 0;

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

// All of the game config, state, and logic lives here.
class Game {
  constructor(expandedGameConfig) {
    this.config = expandedGameConfig;

    // General state
    this.state = {};
    this.state.canvas = null;
    this.state.scaleFactor = 1;
    this.state.gameState = "NORMAL";

    // Game Level State
    this.state.currentLevelIndex = 0;
    this.state.currentLevel = null;

    // To be retired, replaced by game.config:
    this.collectibleConfigs = [];

    // Store State
    this.store = new Store(this, expandedGameConfig.store);

    // Map State
    this.attackerConfigs = [];
    this.attackersByRow = [];
    for (let row = 0; row < MAP_CELL_ROW_COUNT; row++) {
      this.attackersByRow[row] = [];
    }
    this.defendersByRow = [];
    for (let row = 0; row < MAP_CELL_ROW_COUNT; row++) {
      this.defendersByRow[row] = [];
    }
    this.activeAttackers = [];
    this.activeDefenders = [];
    this.activeCollectibles = [];
    this.activeProjectiles = [];
    this.map_state = [];
    for (let row = 0; row < MAP_CELL_ROW_COUNT; row++) {
      this.map_state[row] = [];
      for (let col = 0; col < MAP_CELL_COL_COUNT; col++) {
        this.map_state[row][col] = undefined;
      }
    }
  }

  _updateScaleFactor() {
    const xRes = this.config.consts.xResolution;
    const yRes = this.config.consts.yResolution;
    const minScaleFactor = this.config.consts.minScaleFactor;
    const maxScaleFactor = this.config.consts.maxScaleFactor;
    let xFactor = Math.max(windowWidth / xRes, minScaleFactor);
    let yFactor = Math.max(windowHeight / yRes, minScaleFactor);
    this.state.scaleFactor =
        Math.min(maxScaleFactor, Math.min(yFactor, xFactor));
  }

  loadLevel(gameConfig, levelIndex) {
    let newLevelConfig = gameConfig.levels[levelIndex];
    this.currentLevelIndex = levelIndex;
    this.currentLevel = new Level(this, newLevelConfig);

    for (let uid of newLevelConfig.defenders) {
      this.store.addDefenderConfig(gameConfig.defenders[uid]);
    }
    for (let uid of newLevelConfig.attackers) {
      this.attackerConfigs.push(gameConfig.attackers[uid]);
    }
    for (let uid of newLevelConfig.collectibles) {
      this.collectibleConfigs.push(gameConfig.collectibles[uid]);
    }
  }

  _sendAttacker() {
    if (attackerCnt++ > 100) {
      return;
    }
    if (this.attackerConfigs.length == 0) {
      console.log("No attackers defiend for this level.");
    }
    let row = Math.floor(Math.random() * MAP_CELL_ROW_COUNT);
    let num = Math.floor(Math.random() * this.attackerConfigs.length);
    let attackerConfig = this.attackerConfigs[num];
    let attacker =
        new Attacker(game, row, attackerConfig.imgs.idle,
                     attackerConfig.startingHealth);
    this.activeAttackers.push(attacker);
    this.attackersByRow[row].push(attacker);
  }

  _sendCollectible() {
    let row = Math.floor(Math.random() * MAP_CELL_ROW_COUNT);
    let col = Math.floor(Math.random() * MAP_CELL_COL_COUNT);
    let num = Math.floor(Math.random() * this.collectibleConfigs.length);
    let collectibleConfig = this.collectibleConfigs[num];
    this.activeCollectibles.push(new Collectible(game, row, col,
                                                 collectibleConfig.imgs.falling.img,
                                                 collectibleConfig.health,
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
    const xRes = this.config.consts.xResolution;
    const yRes = this.config.consts.yResolution;
    this.state.canvas =
        createCanvas(xRes*this.state.scaleFactor, yRes*this.state.scaleFactor);
    setInterval(() => { this._sendAttacker(); }, 5000);
    setInterval(() => { this._sendCollectible(); }, 6000);
  }

  update() {
    for (let attacker of this.activeAttackers) {
      // Check for GAME OVER condition.
      if (attacker.x_pos < MAP_X - (MAP_CELL_WIDTH / 2)) {
        this.state.gameState = "GAMEOVER";
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
    scale(this.state.scaleFactor);
    if (this.state.gameState == "GAMEOVER") {
      console.log("GAME OVER");
      push();
      const xRes = this.config.consts.xResolution;
      const yRes = this.config.consts.yResolution;
      translate(xRes/2, yRes/2);
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
    this.currentLevel.draw();  // background
    this._drawCharacters();
    this._drawProjectiles();
    this._drawCollectibles();
    this._drawEffects();
    this.store.draw();
    this._drawCursor();
    this._drawOverlay();
  }

  _scaleMouse(pos) {
    return pos / this.state.scaleFactor;
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
          image(defender.img, x, y, MAP_CELL_IMG_WIDTH, MAP_CELL_IMG_HEIGHT,
                defender.spriteX, defender.spriteY, MAP_CELL_IMG_WIDTH,
                MAP_CELL_IMG_HEIGHT);
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
      attacker.draw();
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
    this.store.drawCursor(this.state.gameState);
    push();
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
    text("XP: " + this.currentLevel.state.money, 0, 24);
    pop();
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
    let topOfMap =
        this.store.config.consts.yPos + this.store.config.consts.itemHeight;
    let leftOfMap = this.store.config.consts.xPos;
    if ((mY >= topOfMap) && (mX >= leftOfMap)) {
      for (let collectible of this.activeCollectibles) {
        let center_x = collectible.x_pos + (collectible.width / 2);
        let center_y = collectible.y_pos + (collectible.height / 2);
        let hit_distance = collectible.width / 2;
        if ((Math.abs(center_x - mX) <= hit_distance) &&
            (Math.abs(center_y - mY) <= hit_distance)) {
        }
        if ((Math.abs(center_x - mX) <= hit_distance) &&
            (Math.abs(center_y - mY) <= hit_distance)) {
          this.currentLevel.state.money += collectible.health;
          helper.removeFromArray(this.activeCollectibles, collectible);
          return true;
        }
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
    let defenderConfig = this.store.getSelectedDefenderConfig();
    let defenderUid = this.currentLevel.config.defenders[this.store.getSelected()];
    let defender = new Defender(game, row, col, defenderUid,
                                defenderConfig.imgs.idle.img,
                                defenderConfig.startingHealth,
                                /*projectile_recharge=*/3000);
    this.map_state[row][col] = defender
    this.activeDefenders.push(defender);
    this.defendersByRow[row].push(defender);
    this.currentLevel.state.money -= defenderConfig.cost;
    this.state.gameState = "NORMAL";
    this.store.resetSelected();
    return true;
  }

  // In NORMAL and SELECTED states, we always handle collectible clicks,
  // followed by character selection changes. Only in SELECTED do we handle
  // placing a character on the map.
  // FIXME: Letting off the mouse seems to count as a click which can cause
  // mispacement of defenders after clicking on a collectibel.
  mouseClicked() {
    if ((this.state.gameState == "NORMAL") ||
        (this.state.gameState == "SELECTED")) {
      if (this._handleCollectibleClick()) {
        return;
      }
      let availableMoney = this.currentLevel.state.money;
      if (this.store.handleCharacterSelection(availableMoney)) {
        this.state.gameState = "SELECTED";
        return;
      }
    }
    if (this.state.gameState == "SELECTED") {
      if (this._handleCharacterPlacement()) {
        return;
      }
    }
    return;
  }

  windowResized() {
    // TODO: Is there a resize for this.state.canvas?
    this._updateScaleFactor();
    const xRes = this.config.consts.xResolution;
    const yRes = this.config.consts.yResolution;
    resizeCanvas(xRes*this.state.scaleFactor, yRes*this.state.scaleFactor);
  }
}
