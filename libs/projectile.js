
class Projectile {
  constructor(game, row, col, imgConfig, hp, speed) {
    this.game = game;
    this.state = "FLYING";
    this.row = row;
    this.col = col;
    this.height = this.game.gameMap.config.consts.cellHeight;
    this.width = this.game.gameMap.config.consts.cellWidth;
    if (imgConfig.img != null) {
      this.animation = loadAnimationFromConfig(imgConfig);
    }
    this.x_pos = this.game.gameMap.config.consts.xPos + (col * this.game.gameMap.config.consts.cellWidth);
    this.y_pos = this.game.gameMap.config.consts.yPos + (row * this.game.gameMap.config.consts.cellHeight);
    this.speed = speed;
    this.hp = hp;
  }

  draw(deltaT) {
    push();
    this.animation.draw(this.x_pos, this.y_pos, this.width, this.height);
      //image(this.img, this.x_pos, this.y_pos, this.width, this.height);
    pop();
  }

  update(deltaT) {
    this.animation.update();
    if (this.state == "FLYING") {
      // Handle hits first.
      // HACK: We give a 10px benefit so that projectiles can hit attackers in
      // the same space as the defender despite floating point errors. See also
      // Attacker.
      const nextToBuffer = 10;
      let attackersToTheRight = this.game.gameMap.state.attackersByRow[this.row]
          .filter(a => a.x_pos >= this.x_pos - nextToBuffer);
      let attacker =
          helper.nextTo(this, attackersToTheRight, this.game.gameMap.config.consts.cellWidth + nextToBuffer);
      if (attacker != undefined) {
        attacker.hit(this.hp);
        helper.removeFromArray(this.game.gameMap.state.activeProjectiles, this);
        return;
      }
      if (this.x_pos < game.config.consts.xResolution + this.game.gameMap.config.consts.cellWidth) {
        let distance = this.speed * (deltaT / this.game.config.consts.speedRateMs);
        this.x_pos += distance;
      } else {
        // Remove it once offscreen.
        helper.removeFromArray(this.game.gameMap.state.activeProjectiles, this);
      }
    }
  }
}
