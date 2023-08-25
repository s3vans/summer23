// TODO: Implement visual effects.
// TODO: Allow attackers to be scheduled via config.
// FIXME: Collectibles fall to top-left of target square.

let attackerCnt = 0;

class Game {
  constructor(expandedGameConfig) {
    this.config = expandedGameConfig;
    this.resetState();
    this.store = new Store(this, expandedGameConfig.store);
    this.gameMap = new GameMap(this, expandedGameConfig.gameMap);
  }

  resetState() {
    this.state = {};
    this.state.scaleFactor = 1;
    this._updateScaleFactor();
    this.state.gameState = "NORMAL";
    this.state.currentLevelIndex = 0;
    this.state.currentLevel = null;
    this.state.lastClickTime = 0;
    this.state.attackerRow = -1;
    this.state.sequenceNum = 0;
    this.state.lastEventTime = Date.now();
    this.state.waitTime = 0;
  }

  loadLevel(levelIndex) {
    // TODO: Consider that we don't really want to reset all Game state.
    this.resetState();

    this.store.reset();
    this.gameMap.reset();

    let gameConfig = this.config;
    let levelConfig = gameConfig.levels[levelIndex];

    this.currentLevelIndex = levelIndex;
    this.currentLevel = new Level(this, levelConfig);

    this.store.addDefenderConfigs(levelConfig.defenders, gameConfig.defenders);

    this.gameMap.addAttackerConfigs(levelConfig.attackers,
                                    gameConfig.attackers);

    this.gameMap.addCollectibleConfigs(levelConfig.collectibles,
                                       gameConfig.collectibles);
  }

  _updateScaleFactor() {
    const xRes = this.config.consts.xResolution;
    const yRes = this.config.consts.yResolution;
    const minScaleFactor = this.config.consts.minScaleFactor;
    const maxScaleFactor = this.config.consts.maxScaleFactor;

    const xFactor = Math.max(windowWidth / xRes, minScaleFactor);
    const yFactor = Math.max(windowHeight / yRes, minScaleFactor);
    const smallerFactor = Math.min(yFactor, xFactor);
    this.state.scaleFactor = Math.min(smallerFactor, maxScaleFactor);
  }

  _getScaledResolution() {
    this._updateScaleFactor();
    const scaledResX = this.config.consts.xResolution * this.state.scaleFactor;
    const scaledResY = this.config.consts.yResolution * this.state.scaleFactor;
    return [scaledResX, scaledResY];
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

  setup() {
    const [scaledResX, scaledResY] = this._getScaledResolution();
    createCanvas(scaledResX, scaledResY);

    //setInterval(() => { this._sendAttacker(); }, 5000);
    setInterval(() => { this._sendCollectible(); }, 6000);
  }

  update(deltaT) {
    let now = Date.now();
    let elapsed = now - this.state.lastEventTime;
    if (elapsed > this.state.waitTime) {
      let sequence = this.config.levels[this.state.currentLevelIndex].sequence;
      while (this.state.sequenceNum < sequence.length) {
        let [ command, arg1, arg2 ] = sequence[this.state.sequenceNum];
        console.log("Read command", command, arg1, arg2);
        if (command == "wait") {
          let duration = arg1;
          console.log("Waiting for", duration, "milliseconds");
          this.state.lastEventTime = now;
          this.state.waitTime = duration;
          this.state.sequenceNum++;
          break;
        }
        else if (command == "attack") {
          let attackerId = arg1;
          let attackerRow = arg2;
          console.log("Attacking with", attackerId, "in row", attackerRow);
          this.gameMap.sendThisAttacker(attackerRow, attackerId);
          this.state.sequenceNum++;
        }
      }
    }
    this.currentLevel.update(deltaT);
    this.gameMap.update(deltaT);
  }

  _scaleMouse(pos) {
    return pos / this.state.scaleFactor;
  }

  _drawGameOver() {
    console.log("GAME OVER");
    if (this.currentLevel.config.mp3s.lose.mp3 != undefined) {
      this.currentLevel.config.mp3s.lose.mp3.play();
    }
    push();
    const xRes = this.config.consts.xResolution;
    const yRes = this.config.consts.yResolution;
    translate(xRes/2, yRes/2);
    stroke(0); fill(255);
    rectMode(CENTER);
    let goW = 400;
    let goH = 90;
    rect(0, 0, goW, goH);
    rect(0, 0, goW-6, goH-6);
    strokeWeight(1); stroke(0); fill(0);
    textSize(24); textAlign(CENTER, CENTER);
    text("G A M E     O V E R\n(っ◡︵◡ς)", 0, 0);
    pop();
  }

  _drawCursor(scaledMouseX, scaledMouseY) {
    this.store.drawCursor(this.state.gameState, scaledMouseX, scaledMouseY);
    this.gameMap.drawCursor(scaledMouseX, scaledMouseY);
  }

  // This draws all of the overlayed game info, such as XP.
  _drawOverlay() {
    const overlayX = this.config.consts.overlayX;
    const overlayY = this.config.consts.overlayY;
    const overlayWidth = this.config.consts.overlayWidth;
    const overlayHeight = this.config.consts.overlayHeight;
    push();
    translate(overlayX, overlayY);
    fill(0, 0, 0, 100);
    rect(0, 0, overlayWidth, overlayHeight);
    pop();
    push();
    translate(overlayX+20, overlayY+30);
    fill(255); strokeWeight(1); stroke(255); textSize(16);
    text(this.levelName, 0, 0);
    text("XP: " + this.currentLevel.state.money, 0, 24);
    pop();
  }

  draw(deltaT) {
    scale(this.state.scaleFactor);
    const scaledMouseX = this._scaleMouse(mouseX);
    const scaledMouseY = this._scaleMouse(mouseY);

    if (this.state.gameState == "GAMEOVER") {
      this._drawGameOver();
      noLoop();
      return;
    }

    // Draws background.
    this.currentLevel.draw(deltaT);

    // Draws the store at the top.
    this.store.draw(deltaT);

    // Draws characters, projectiles, collectibles, and effects.
    this.gameMap.draw(deltaT);

    this._drawCursor(scaledMouseX, scaledMouseY);

    this._drawOverlay();
  }

  // Debounce mouse clicks within 30ms. We treat 'touch ended' as a mouse
  // click, which resulted in two clicks without this debounce.
  // Returns true if debounced, else false.
  _debounceClick() {
    const now = new Date().getTime();
    if (now <= this.state.lastClickTime + 30) {
      return true;
    }
    this.state.lastClickTime = now;
    return false;
  }

  // In NORMAL and SELECTED states, we always handle collectible clicks,
  // followed by character selection changes. Only in SELECTED do we handle
  // placing a character on the map.
  mouseClicked() {
    if (this._debounceClick()) {
      return;
    }

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
 
  keyPressed() {
    let key = keyCode;
    let keyNum = key - 48; // '0' is keyCode 48, '9' is keyCode 57.
    if (keyNum < 0 || keyNum > 9) { 
      return;
    }
    if (keyNum == 0) {
      this.gameMap.sendCollectible();
      return;
    }
    if (this.state.attackerRow == -1) {
      this.state.attackerRow = keyNum;
    }
    else {
      this.gameMap.sendThisAttacker(this.state.attackerRow-1, keyNum-1);
      this.state.attackerRow = -1;
    }
  }

  windowResized() {
    const [scaledResX, scaledResY] = this._getScaledResolution();
    resizeCanvas(scaledResX, scaledResY);
  }
}
