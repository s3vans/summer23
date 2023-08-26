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

  debug(...args) {
    const DEBUG = 1;
    if (DEBUG) {
      console.log(...args);
    }
  }

  loadLevel(levelIndex) {
    // TODO: Consider that we don't really want to reset all Game state.
    this.resetState();

    this.store.reset();
    this.gameMap.reset();

    let gameConfig = this.config;
    let levelConfig = gameConfig.levels[levelIndex];

    this.state.currentLevelIndex = levelIndex;
    this.state.currentLevel = new Level(this, levelConfig);

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

  _getIndex(arr, uid) {
    let index = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == uid) {
        return i;
      }
    }
    return -1;
  }


  setup() {
    const [scaledResX, scaledResY] = this._getScaledResolution();
    createCanvas(scaledResX, scaledResY);

    //setInterval(() => { this._sendAttacker(); }, 5000);
    setInterval(() => { this._sendCollectible(); }, 6000);
  }

  update(deltaT) {
    let sequence = this.config.levels[this.state.currentLevelIndex].sequence;
    let now = Date.now();
    let elapsed = now - this.state.lastEventTime;
    if (elapsed > this.state.waitTime) {
      while (this.state.sequenceNum < sequence.length) {
        let [ command, arg1, arg2, arg3 ] = sequence[this.state.sequenceNum];
        this.debug("Read command", command, arg1, arg2, arg3);
        if (command == "wait") {
          let duration = arg1;
          this.debug("Waiting for", duration, "milliseconds");
          this.state.lastEventTime = now;
          this.state.waitTime = duration;
          this.state.sequenceNum++;
          break;
        }
        else if (command == "attack") {
          let attackerId = arg1;
          let attackerRow = arg2;
          let attackerArr = this.state.currentLevel.config.attackers;
          let attackerIndex =
            this._getIndex(attackerArr, attackerId);
          this.debug("Attacking with", attackerId, "in row", attackerRow);
          this.gameMap.sendThisAttacker(attackerRow-1, attackerIndex);
          this.state.sequenceNum++;
        }
        else if (command == "drop") {
          let collectibleId = arg1;
          let collectibleRow = arg2;
          let collectibleCol = arg3;
          let collectibleArr = this.state.currentLevel.config.collectibles;
          let collectibleIndex =
            this._getIndex(collectibleArr, collectibleId);
          this.debug("Dropping", collectibleId, "in row", collectibleRow,
                     "and col", collectibleCol);
          this.gameMap.sendThisCollectible(collectibleRow-1, collectibleCol-1,
                                           collectibleIndex);
          this.state.sequenceNum++;
          continue;
        }
        else if (command == "money") {
          let money = arg1;
          this.debug("Setting money", money);
          this.state.currentLevel.state.money = money;
          this.state.sequenceNum++;
          continue;
        }
      }
    }
    if (this.state.gameState != "WIN" && this.state.gameState != "LOSE") {
      if (this.state.sequenceNum == sequence.length) {
        if (this.gameMap.state.activeAttackers.length == 0) {
          this.state.gameState = "WIN";
          setTimeout(
              () => {
                if (this.state.currentLevel.config.mp3s.win.mp3 != undefined) {
                  this.state.currentLevel.config.mp3s.win.mp3.play();
                }
                setTimeout(
                    () => {
                      this.loadLevel(this.state.currentLevelIndex+1);
                    }, 3000);
              }, 3000);
	  return;
        }
      }
    }
    this.state.currentLevel.update(deltaT);
    this.gameMap.update(deltaT);
  }

  _scaleMouse(pos) {
    return pos / this.state.scaleFactor;
  }

  _drawGameOver() {
    console.log("GAME OVER");
    if (this.state.currentLevel.config.mp3s.lose.mp3 != undefined) {
      this.state.currentLevel.config.mp3s.lose.mp3.play();
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
    text("XP: " + this.state.currentLevel.state.money, 0, 24);
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
    this.state.currentLevel.draw(deltaT);

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
      let availableMoney = this.state.currentLevel.state.money;
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
