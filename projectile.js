
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

  draw() {
    push();
    this.animation.draw(this.x_pos, this.y_pos, this.width, this.height);
      //image(this.img, this.x_pos, this.y_pos, this.width, this.height);
    pop();
  }

  update() {
    this.animation.update();
    //this.img.update();
    if (this.state == "FLYING") {
      // Handle hits first.
      let attackersToTheRight = this.game.gameMap.state.attackersByRow[this.row]
          .filter(a => a.x_pos > this.x_pos);
      let attacker =
          helper.nextTo(this, attackersToTheRight, this.game.gameMap.config.consts.cellWidth);
      if (attacker != undefined) {
        attacker.hit(this.hp);
        helper.removeFromArray(this.game.gameMap.state.activeProjectiles, this);
        return;
      }
      if (this.x_pos < game.config.consts.xResolution + this.game.gameMap.config.consts.cellWidth) {
        this.x_pos += this.speed;
      } else {
        // Remove it once offscreen.
        helper.removeFromArray(this.game.gameMap.state.activeProjectiles, this);
      }
    }
  }
}
