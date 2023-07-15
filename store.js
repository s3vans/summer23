class Store {
  constructor(game) {
    this.consts = {};
    this.consts.XPOS = 100;
    this.consts.YPOS = 0;
    this.consts.ITEM_COUNT = 6;
    this.consts.ITEM_WIDTH = 100;
    this.consts.ITEM_HEIGHT = 100;
    this.consts.ITEM_IMG_WIDTH = 80;
    this.consts.ITEM_IMG_HEIGHT = 80;

    this.game = game;

    this.reset();
  };

  addDefenderConfig(defenderConfig) {
    this.defenderConfigs.push(defenderConfig);
  }

  _getNumDefenderConfigs() {
    return this.defenderConfigs.length;
  }

  _getSelectedStoreItemIdx() {
    let mX = this.game._scaleMouse(mouseX);
    let mY = this.game._scaleMouse(mouseY);
    let x = this.consts.XPOS;
    let y = this.consts.YPOS;
    for (let i = 0; i < this.consts.ITEM_COUNT; i++) {
      if (mX >= x+(this.consts.ITEM_WIDTH*i) &&
          mX < x+(this.consts.ITEM_WIDTH*(i+1))) {
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

  handleCharacterSelection() {
    let idx = this._getSelectedStoreItemIdx();
    if (idx != -1) {
      if (this.game.currentLevel.state.money >= this.defenderConfigs[idx].cost) {
        this.game.state.gameState = "SELECTED";
        this.selected = idx;
        return true;
      }
    }
    return false;
  }

  getSelectedDefenderConfig() {
    return this.defenderConfigs[this.selected];
  }

  draw() {
    push();
    translate(this.consts.XPOS, this.consts.YPOS);
    for (let i = 0; i < this.consts.ITEM_COUNT; i++) {
       push();
       strokeWeight(1); stroke(0); fill(255);
       rect(this.consts.ITEM_WIDTH*i, 0, this.consts.ITEM_WIDTH,
            this.consts.ITEM_HEIGHT);
       pop();
    }
    let x = 0;
    for (let defenderConfig of this.defenderConfigs) {
       if (defenderConfig.imgs.idle.img != undefined) {
         image(defenderConfig.imgs.idle.img, x+10, 0, this.consts.ITEM_IMG_WIDTH,
               this.consts.ITEM_IMG_HEIGHT, 0, 0, this.consts.ITEM_IMG_WIDTH,
               this.consts.ITEM_IMG_HEIGHT);
       }
       push();
       noStroke(); fill(0); textSize(10);
       text(defenderConfig.name, x+10, 85);
       text('HP:' + defenderConfig.startingHealth, x+60, 85);
       text('XP:' + defenderConfig.cost, x+60, 95);
       pop();
       x += this.consts.ITEM_WIDTH;
    }
    pop();
  }

  reset() {
    this.defenderConfigs = [];
    this.selected = -1;
  }
}
