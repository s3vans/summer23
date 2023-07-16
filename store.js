class Store {
  constructor(game, storeConfig) {
    this.game = game;
    this.config = storeConfig;
    this.reset();
  };

  addDefenderConfig(defenderConfig) {
    this.state.defenderConfigs.push(defenderConfig);
  }

  _getNumDefenderConfigs() {
    return this.state.defenderConfigs.length;
  }

  _getSelectedStoreItemIdx() {
    let mX = this.game._scaleMouse(mouseX);
    let mY = this.game._scaleMouse(mouseY);
    let x = this.config.consts.xPos;
    let y = this.config.consts.yPos;
    for (let i = 0; i < this.config.consts.itemCount; i++) {
      if (mX >= x+(this.config.consts.itemWidth*i) &&
          mX < x+(this.config.consts.itemWidth*(i+1))) {
        if (mY >= y && mY <= 120) {
          if (i < this._getNumDefenderConfigs()) {
            return i;
          }
          return -1;
        }
      }
    }
    return -1;
  }

  getSelected() {
    return this.state.selected;
  }

  resetSelected() {
    this.state.selected = -1;
  }

  handleCharacterSelection(availableMoney) {
    let idx = this._getSelectedStoreItemIdx();
    if (idx != -1) {
      let cost = this.state.defenderConfigs[idx].cost
      if (availableMoney >= cost) {
        this.state.selected = idx;
        return true;
      }
    }
    return false;
  }

  getSelectedDefenderConfig() {
    return this.state.defenderConfigs[this.state.selected];
  }

  drawCursor(gameState) {
    push();
    if (gameState == "NORMAL") {
      let x = this.config.consts.xPos;
      let y = this.config.consts.yPos;
      for (let i = 0; i < this.config.consts.itemCount; i++) {
        if (this._mouseInRectangle(x, y, this.config.consts.itemWidth,
            this.config.consts.itemHeight)) {
          this.game._highlightRectangle(x, y, this.config.consts.itemWidth,
                                        this.config.consts.itemHeight,
                                        color(255, 255, 0, 100));
        }
        x = x + this.config.consts.itemWidth;
      }
    } else if (gameState == "SELECTED") {
      let xpos = this.config.consts.xPos +
          (this.config.consts.itemWidth*this.getSelected());
      let ypos = this.config.consts.yPos;
      this.game._highlightRectangle(xpos, ypos, this.config.consts.itemWidth,
                                    this.config.consts.itemHeight,
                                    color(0, 255, 255, 100));
    }
    pop();
  }

  draw() {
    push();
    translate(this.config.consts.xPos, this.config.consts.yPos);
    for (let i = 0; i < this.config.consts.itemCount; i++) {
       push();
       strokeWeight(1); stroke(0); fill(255);
       rect(this.config.consts.itemWidth*i, 0, this.config.consts.itemWidth,
            this.config.consts.itemHeight);
       pop();
    }
    let x = 0;
    for (let defenderConfig of this.state.defenderConfigs) {
       if (defenderConfig.imgs.idle.img != undefined) {
         image(defenderConfig.imgs.idle.img, x+10, 0,
               this.config.consts.itemImgWidth,
               this.config.consts.itemImgHeight, 0, 0,
               this.config.consts.itemImgWidth,
               this.config.consts.itemImgHeight);
       }
       push();
       noStroke(); fill(0); textSize(10);
       text(defenderConfig.name, x+10, 85);
       text('HP:' + defenderConfig.startingHealth, x+60, 85);
       text('XP:' + defenderConfig.cost, x+60, 95);
       pop();
       x += this.config.consts.itemWidth;
    }
    pop();
  }

  reset() {
    this.state = {};
    this.state.defenderConfigs = [];
    this.state.selected = -1;
  }
}
