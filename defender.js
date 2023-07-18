
// Rudimentary defender instance.
class Defender {
  constructor(game, row, col, uid, imgConfig, hp) {
    this.game = game;
    this.row = row;
    this.col = col;
    this.uid = uid;
    this.animation = null;
    if (imgConfig.img != null) {
      this.animation = loadAnimationFromConfig(imgConfig);
    }
    this.hp = hp;
    this.x_pos = this.game.gameMap.config.consts.xPos + (this.game.gameMap.config.consts.cellWidth * col);
    this.y_pos = this.game.gameMap.config.consts.yPos + (this.game.gameMap.config.consts.cellHeight * row);
    this.height = this.game.gameMap.config.consts.cellHeight;
    this.width = this.game.gameMap.config.consts.cellWidth;
    let defenderConfig = this.game.config.defenders[this.uid];
    let projectileUid = defenderConfig.projectile;
    let projectileConfig = this.game.config.projectiles[projectileUid];
    this.recharge = projectileConfig.reloadTimeMs;
    this.charge = this.recharge;
    this.lastFrame = 0;
    this.frameRate = 5;
    this.spriteX = 0;
    this.spriteY = 0;
  }

  hit() {
    this.hp -= 1;
    if (this.hp <= 0) {
      this.game.gameMap.state.map_state[this.row][this.col] = undefined;
      helper.removeFromArray(this.game.gameMap.state.defendersByRow[this.row], this);
      helper.removeFromArray(this.game.gameMap.state.activeDefenders, this);
    }
  }

  update(deltaT) {
    this.animation.update();
    if (this.game.gameMap.state.attackersByRow[this.row].length > 0) {
      if (this.charge == this.recharge) {
        let defenderConfig = this.game.config.defenders[this.uid];
        let projectileUid = defenderConfig.projectile;
        let projectileConfig = this.game.config.projectiles[projectileUid];
        let projectile = new Projectile(this.game, this.row, this.col,
                                        projectileConfig.imgs.flying.img,
                                        projectileConfig.damage,
                                        projectileConfig.speed);
        this.game.gameMap.state.activeProjectiles.push(projectile);
        this.charge = 0;
      }
    }
    if (this.charge < this.recharge) {
      this.charge++;
    }
  }

  draw(deltaT) {
    push();
    this.animation.draw(this.x_pos, this.y_pos, this.width, this.height);
    noStroke(); fill(255); textSize(10);
    console.log(this, this.game.config.consts);
    text('Health:' + this.hp, this.x_pos+this.game.gameMap.config.consts.health_xoffset, this.y_pos+this.game.gameMap.config.consts.health_yoffset);
    pop();
  }

}
