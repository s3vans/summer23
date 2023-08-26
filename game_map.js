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
        new Attacker(game, attackerConfig, row, attackerConfig.imgs.idle,
                     attackerConfig.startingHealth);
    this.state.activeAttackers.push(attacker);
    this.state.attackersByRow[row].push(attacker);
    if (attackerConfig.mp3s.placed.mp3 != null) {
      attackerConfig.mp3s.placed.mp3.play();
    }
  }

  sendThisAttacker(row, num) {
    if (this.state.attackerConfigs.length == 0) {
      console.log("No attackers defined for this level.");
      return;
    }
    if (row >= this.config.consts.cellRowCount) {
      console.log("No row exists for number: ", row);
      return;
    }
    if (num >= this.state.attackerConfigs.length) {
      console.log("No attacker exists for number: ", num);
      return;
    }
    if (row == -1) {
      row = Math.floor(Math.random() * this.config.consts.cellRowCount);
    }
    if (num == -1) {
      num = Math.floor(Math.random() * this.state.attackerConfigs.length);
    }
    
    let attackerConfig = this.state.attackerConfigs[num];
    let attacker =
        new Attacker(game, attackerConfig, row, attackerConfig.imgs.idle,
                     attackerConfig.startingHealth);
    this.state.activeAttackers.push(attacker);
    this.state.attackersByRow[row].push(attacker);
    if (attackerConfig.mp3s.placed.mp3 != null) {
      attackerConfig.mp3s.placed.mp3.play();
    }
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
        new Collectible(game, collectibleConfig, row, col,
                        collectibleConfig.imgs.falling.img,
                        collectibleConfig.health, collectibleConfig.lifespan));
  }

  sendThisCollectible(row, col, num) {
    if (this.state.collectibleConfigs.length == 0) {
      console.log("No collectibles defined for this level.");
      return;
    }
    if (row >= this.config.consts.cellRowCount) {
      console.log("No row exists for number: ", row);
      return;
    }
    if (col >= this.config.consts.cellColCount) {
      console.log("No col exists for number: ", col);
      return;
    }
    if (num >= this.state.collectibleConfigs.length) {
      console.log("No attacker exists for number: ", num);
      return;
    }
    if (row == -1) {
      row = Math.floor(Math.random() * this.config.consts.cellRowCount);
    }
    if (col == -1) {
      col = Math.floor(Math.random() * this.config.consts.cellColCount);
    }
    if (num == -1) {
      num = Math.floor(Math.random() * this.state.collectibleConfigs.length);
    }
    let collectibleConfig = this.state.collectibleConfigs[num];
    this.state.activeCollectibles.push(
        new Collectible(game, collectibleConfig, row, col,
                        collectibleConfig.imgs.falling.img,
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
          let collectibleConfig = collectible.config;
          if (collectibleConfig.mp3s.collected.mp3 != null) {
            collectibleConfig.mp3s.collected.mp3.play();
          }
          game.state.currentLevel.state.money += collectible.health;
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
    if (defenderConfig.mp3s.placed.mp3 != null) {
      defenderConfig.mp3s.placed.mp3.play();
    }
    let defenderUid = game.state.currentLevel.config.defenders[game.store.getSelected()];
    let defender = new Defender(game, row, col, defenderUid,
                                defenderConfig.imgs.idle,
                                defenderConfig.startingHealth,
                                /*projectile_recharge=*/3000);
    this.state.map_state[row][col] = defender
    this.state.activeDefenders.push(defender);
    this.state.defendersByRow[row].push(defender);
    game.state.currentLevel.state.money -= defenderConfig.cost;
    game.state.gameState = "NORMAL";
    game.store.resetSelected();
    return true;
  }

  update(deltaT) {
    for (let attacker of this.state.activeAttackers) {
      // Check for GAME OVER condition.
      let edge = this.config.consts.xPos - (this.config.consts.cellWidth / 2);
      if (attacker.x_pos < edge) {
        game.state.gameState = "GAMEOVER";
        return;
      }
      attacker.update(deltaT);
    }

    for (let defender of this.state.activeDefenders) {
      defender.update(deltaT);
    }

    for (let collectible of this.state.activeCollectibles) {
      collectible.update(deltaT);
    }

    for (let projectile of this.state.activeProjectiles) {
      projectile.update(deltaT);
    }
  }

  // Draws all of the characters.
  _drawCharacters(deltaT) {
    for (let defender of this.state.activeDefenders) {
      defender.draw(deltaT);
    }

    for (let attacker of this.state.activeAttackers) {
      attacker.draw(deltaT);
    }
  }

  // This draws all of the projectiles.
  _drawProjectiles(deltaT) {
    for (let projectile of this.state.activeProjectiles) {
      projectile.draw(deltaT);
    }
  }

  // This draws all of the collectibles.
  _drawCollectibles(deltaT) {
    for (let collectible of this.state.activeCollectibles) {
      collectible.draw(deltaT);
    }
  }

  // TODO: This draws all of the overlayed effects.
  _drawEffects(deltaT) {
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

  draw(deltaT) {
    this._drawCharacters(deltaT);
    this._drawProjectiles(deltaT);
    this._drawCollectibles(deltaT);
    this._drawEffects(deltaT);
  }
}
