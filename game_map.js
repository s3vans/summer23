class GameMap {
  constructor(game, gameMapConfig) {
    this.game = game;
    this.config = gameMapConfig;
    this.reset();
  }

  reset() {
    this.state = {};
    this.state.attackerConfigs = [];
    this.state.attackersByRow = [];
    for (let row = 0; row < this.config.consts.cellRowCount; row++) {
      this.state.attackersByRow[row] = [];
    }
    this.state.defendersByRow = [];
    for (let row = 0; row < this.config.consts.cellRowCount; row++) {
      this.state.defendersByRow[row] = [];
    }
    this.state.activeAttackers = [];
    this.state.activeDefenders = [];
    this.state.activeCollectibles = [];
    this.state.activeProjectiles = [];
    this.state.map_state = [];
    for (let row = 0; row < this.config.consts.cellRowCount; row++) {
      this.state.map_state[row] = [];
      for (let col = 0; col < this.config.consts.cellColCount; col++) {
        this.state.map_state[row][col] = undefined;
      }
    }
    this.state.collectibleConfigs = [];
  }

  addAttackerConfigs(levelAttackers, gameAttackers) {
    for (let uid of levelAttackers) {
      this.state.attackerConfigs.push(gameAttackers[uid]);
    }
  }

  addCollectibleConfigs(levelCollectibles, gameCollectibles) {
    for (let uid of levelCollectibles) {
      this.state.collectibleConfigs.push(gameCollectibles[uid]);
    }
  }

  sendAttacker() {
    if (this.state.attackerConfigs.length == 0) {
      console.log("No attackers defined for this level.");
      return;
    }
    let row = Math.floor(Math.random() * this.config.consts.cellRowCount);
    let num = Math.floor(Math.random() * this.state.attackerConfigs.length);
    let attackerConfig = this.state.attackerConfigs[num];
    let attacker =
        new Attacker(game, row, attackerConfig.imgs.idle,
                     attackerConfig.startingHealth);
    this.state.activeAttackers.push(attacker);
    this.state.attackersByRow[row].push(attacker);
  }

  sendCollectible() {
    if (this.state.collectibleConfigs.length == 0) {
      console.log("No collectibles defined for this level.");
      return;
    }
    let row = Math.floor(Math.random() * this.config.consts.cellRowCount);
    let col = Math.floor(Math.random() * this.config.consts.cellColCount);
    let num = Math.floor(Math.random() * this.state.collectibleConfigs.length);
    let collectibleConfig = this.state.collectibleConfigs[num];
    this.state.activeCollectibles.push(
        new Collectible(game, row, col, collectibleConfig.imgs.falling.img,
                        collectibleConfig.health, collectibleConfig.lifespan));
  }

  handleCollectibleClick(scaledMouseX, scaledMouseY) {
    let mX = scaledMouseX;
    let mY = scaledMouseY;
    let topOfMap = this.config.consts.yPos;
    let leftOfMap = this.config.consts.xPos;
    if ((mY >= topOfMap) && (mX >= leftOfMap)) {
      for (let collectible of this.state.activeCollectibles) {
        let center_x = collectible.x_pos + (collectible.width / 2);
        let center_y = collectible.y_pos + (collectible.height / 2);
        let hit_distance = collectible.width / 2;
        if ((Math.abs(center_x - mX) <= hit_distance) &&
            (Math.abs(center_y - mY) <= hit_distance)) {
        }
        if ((Math.abs(center_x - mX) <= hit_distance) &&
            (Math.abs(center_y - mY) <= hit_distance)) {
          game.currentLevel.state.money += collectible.health;
          helper.removeFromArray(this.state.activeCollectibles, collectible);
          return true;
        }
      }
    }
    return false;
  }

  _getSelectedMapRowCol(scaledMouseX, scaledMouseY) {
      let y = this.config.consts.yPos;
      for (let row = 0; row < this.config.consts.cellRowCount; row++) {
        let x = this.config.consts.xPos;
        for (let col = 0; col < this.config.consts.cellColCount; col++) {
          if (helper.mouseInRectangle(scaledMouseX, scaledMouseY, x, y,
              this.config.consts.cellWidth, this.config.consts.cellHeight)) {
            return [row, col]
          }
          x = x + this.config.consts.cellWidth;
        }
        y = y + this.config.consts.cellHeight;
      }
      return [-1, -1];
  }

  handleCharacterPlacement(scaledMouseX, scaledMouseY) {
    let [row, col] = this._getSelectedMapRowCol(scaledMouseX, scaledMouseY);
    if (row == -1) {
      return false;
    }
    if (this.state.map_state[row][col] != undefined) {
      return false;
    }
    let defenderConfig = game.store.getSelectedDefenderConfig();
    let defenderUid = game.currentLevel.config.defenders[game.store.getSelected()];
    let defender = new Defender(game, row, col, defenderUid,
                                defenderConfig.imgs.idle.img,
                                defenderConfig.startingHealth,
                                /*projectile_recharge=*/3000);
    this.state.map_state[row][col] = defender
    this.state.activeDefenders.push(defender);
    this.state.defendersByRow[row].push(defender);
    game.currentLevel.state.money -= defenderConfig.cost;
    game.state.gameState = "NORMAL";
    game.store.resetSelected();
    return true;
  }

  update() {
    for (let attacker of this.state.activeAttackers) {
      // Check for GAME OVER condition.
      if (attacker.x_pos < this.config.consts.xPos - (this.config.consts.cellWidth / 2)) {
        game.state.gameState = "GAMEOVER";
        return;
      }
      attacker.update();
    }

    for (let defender of this.state.activeDefenders) {
      defender.update();
    }

    for (let collectible of this.state.activeCollectibles) {
      collectible.update();
    }

    for (let projectile of this.state.activeProjectiles) {
      projectile.update();
    }
  }

  // Draws all of the characters.
  _drawCharacters() {
    // FIXME: This is hacked together for drawing defenders. Attackers move and
    // aren't aligned with the grids.
    let y = this.config.consts.yPos;
    for (let row = 0; row < this.config.consts.cellRowCount; row++) {
      let x = this.config.consts.xPos;
      for (let col = 0; col < this.config.consts.cellColCount; col++) {
        let defender = this.state.map_state[row][col];
        if (defender != undefined) {
          image(defender.img, x, y, this.config.consts.cellImgWidth, this.config.consts.cellImgHeight,
                defender.spriteX, defender.spriteY, this.config.consts.cellImgWidth,
                this.config.consts.cellImgHeight);
          push();
          noStroke(); fill(255); textSize(10);
          text('Health:' + defender.hp, x+this.config.consts.health_xoffset, y+this.config.consts.health_yoffset);
          pop();
        }
        x = x + this.config.consts.cellWidth;
      }
      y = y + this.config.consts.cellHeight;
    }

    // FIXME: Here's another hack for drawing the attackers.
    for (let attacker of this.state.activeAttackers) {
      attacker.draw();
      push();
      noStroke(); fill(255); textSize(10);
      text('HP:' + attacker.hp, attacker.x_pos+this.config.consts.health_xoffset,
           attacker.y_pos+this.config.consts.health_yoffset);
      pop();
    }
  }

  // This draws all of the projectiles.
  _drawProjectiles() {
    for (let projectile of this.state.activeProjectiles) {
      projectile.draw();
    }
  }

  // This draws all of the collectibles.
  _drawCollectibles() {
    for (let collectible of this.state.activeCollectibles) {
      collectible.draw();
    }
  }

  // TODO: This draws all of the overlayed effects.
  _drawEffects() {
  }

  drawCursor(scaledMouseX, scaledMouseY) {
    push();
    let y = this.config.consts.yPos;
    for (let row = 0; row < this.config.consts.cellRowCount; row++) {
      let x = this.config.consts.xPos;
      for (let col = 0; col < this.config.consts.cellColCount; col++) {
        if (helper.mouseInRectangle(scaledMouseX, scaledMouseY, x, y,
            this.config.consts.cellWidth, this.config.consts.cellHeight)) {
          if (this.state.map_state[row][col] == undefined) {
            helper.highlightRectangle(x, y, this.config.consts.cellWidth, this.config.consts.cellHeight,
                                      color(255, 255, 0, 100));
          } else {
            helper.highlightRectangle(x, y, this.config.consts.cellWidth, this.config.consts.cellHeight,
                                      color(255, 0, 0, 100));
          }
        }
        x = x + this.config.consts.cellWidth;
      }
      y = y + this.config.consts.cellHeight;
    }
    pop();
  }

  draw() {
    this._drawCharacters();
    this._drawProjectiles();
    this._drawCollectibles();
    this._drawEffects();
  }
}
