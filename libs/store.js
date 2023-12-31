class Store {
  constructor(game, storeConfig) {
    this.game = game;
    this.config = storeConfig;
    this.reset();
  };

  reset() {
    this.state = {};
    this.state.defenderConfigs = [];
    this.state.selected = -1;
  }

  addDefenderConfigs(levelDefenders, gameDefenders) {
    for (let uid of levelDefenders) {
      this.state.defenderConfigs.push(gameDefenders[uid]);
    }
  }

  getSelected() {
    return this.state.selected;
  }

  resetSelected() {
    this.state.selected = -1;
  }

  _getSelectedStoreItemIdx(scaledMouseX, scaledMouseY) {
    let mX = scaledMouseX;
    let mY = scaledMouseY;
    let x = this.config.consts.xPos;
    let y = this.config.consts.yPos;
    for (let i = 0; i < this.config.consts.itemCount; i++) {
      if (mX >= x+(this.config.consts.itemWidth*i) &&
          mX < x+(this.config.consts.itemWidth*(i+1))) {
        if (mY >= y && mY <= 120) {
          if (i < this.state.defenderConfigs.length) {
            return i;
          }
          return -1;
        }
      }
    }
    return -1;
  }

  handleCharacterSelection(availableMoney, scaledMouseX, scaledMouseY) {
    let idx = this._getSelectedStoreItemIdx(scaledMouseX, scaledMouseY);
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

  drawCursor(gameState, scaledMouseX, scaledMouseY) {
    push();
    if (gameState == "NORMAL") {
      let x = this.config.consts.xPos;
      let y = this.config.consts.yPos;
      for (let i = 0; i < this.config.consts.itemCount; i++) {
        if (helper.mouseInRectangle(scaledMouseX, scaledMouseY, x, y,
            this.config.consts.itemWidth, this.config.consts.itemHeight)) {
          helper.highlightRectangle(x, y, this.config.consts.itemWidth,
                                    this.config.consts.itemHeight,
                                    color(255, 255, 0, 100));
        }
        x = x + this.config.consts.itemWidth;
      }
    } else if (gameState == "SELECTED") {
      let xpos = this.config.consts.xPos +
          (this.config.consts.itemWidth*this.getSelected());
      let ypos = this.config.consts.yPos;
      helper.highlightRectangle(xpos, ypos, this.config.consts.itemWidth,
                                this.config.consts.itemHeight,
                                color(0, 255, 255, 100));
    }
    pop();
  }

  draw(deltaT) {
    push();
    translate(this.config.consts.xPos, this.config.consts.yPos);
    for (let i = 0; i < this.config.consts.itemCount; i++) {
       push();
       strokeWeight(1); stroke(0); fill(200);
       rect(this.config.consts.itemWidth*i, 0, this.config.consts.itemWidth,
            this.config.consts.itemHeight);
       pop();
    }
    let x = 0;
    for (let defenderConfig of this.state.defenderConfigs) {
       if (defenderConfig.imgs.idle.img != undefined) {
         push();
         let img = defenderConfig.imgs.idle.img.get();
         if (this.game.state.currentLevel.state.money < defenderConfig.cost) {
           img.filter(GRAY);
         }
         image(img, x+10, 0,
               this.config.consts.itemImgWidth,
               this.config.consts.itemImgHeight, 0, 0,
               this.config.consts.itemImgWidth,
               this.config.consts.itemImgHeight);
         if (this.game.state.currentLevel.state.money < defenderConfig.cost) {
           helper.highlightRectangle(x, 0, this.config.consts.itemWidth,
                                this.config.consts.itemHeight,
                                color(0, 0, 0, 50));
         }
         pop();
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
}
