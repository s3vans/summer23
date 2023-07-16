// TODO: Make timing frame independent.
// TODO: Implement character states.
// TODO: Implement visual effects.
// TODO: Add sounds.
// TODO: Allow attackers to be scheduled via config.
// TODO: Unify common character/object traits into parent class.
// TODO: Replace many hard coded vals with default vals overriden by config.
// FIXME: Collectibles fall to top-left of target square.

let attackerCnt = 0;

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

    this.store = new Store(this, expandedGameConfig.store);

    this.gameMap = new GameMap(this, expandedGameConfig.gameMap);
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
      this.gameMap.addAttackerConfig(gameConfig.attackers[uid]);
    }
    for (let uid of newLevelConfig.collectibles) {
      this.gameMap.addCollectibleConfig(gameConfig.collectibles[uid]);
    }
  }

  _sendAttacker() {
    if (attackerCnt++ > 100) {
      return;
    }
    this.gameMap.sendAttacker();
  }

  _sendCollectible() {
    this.gameMap.sendCollectible();
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
    this.gameMap.update();
  }

  draw() {
    scale(this.state.scaleFactor);
    let scaledMouseX = this._scaleMouse(mouseX);
    let scaledMouseY = this._scaleMouse(mouseY);
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
    this.currentLevel.draw();
    this.gameMap.draw();
    this.store.draw();
    this._drawCursor(scaledMouseX, scaledMouseY);
    this._drawOverlay();
  }

  _scaleMouse(pos) {
    return pos / this.state.scaleFactor;
  }

  _drawCursor(scaledMouseX, scaledMouseY) {
    this.store.drawCursor(this.state.gameState, scaledMouseX, scaledMouseY);
    this.gameMap.drawCursor(scaledMouseX, scaledMouseY);
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

  // In NORMAL and SELECTED states, we always handle collectible clicks,
  // followed by character selection changes. Only in SELECTED do we handle
  // placing a character on the map.
  // FIXME: Letting off the mouse seems to count as a click which can cause
  // mispacement of defenders after clicking on a collectibel.
  mouseClicked() {
    let scaledMouseX = this._scaleMouse(mouseX);
    let scaledMouseY = this._scaleMouse(mouseY);
    if ((this.state.gameState == "NORMAL") ||
        (this.state.gameState == "SELECTED")) {
      if (this.gameMap.handleCollectibleClick(scaledMouseX, scaledMouseY)) {
        return;
      }
      let availableMoney = this.currentLevel.state.money;
      if (this.store.handleCharacterSelection(availableMoney, scaledMouseX,
          scaledMouseY)) {
        this.state.gameState = "SELECTED";
        return;
      }
    }
    if (this.state.gameState == "SELECTED") {
      if (this.gameMap.handleCharacterPlacement(scaledMouseX, scaledMouseY)) {
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
