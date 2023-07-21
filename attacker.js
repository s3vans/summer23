
// Rudimentary attacker instance.
class Attacker {
  constructor(game, attackerConfig, row, imgConfig, health) {
    this.game = game;
    this.config = attackerConfig;
    this.row = row;
    this.animation = null;
    if (imgConfig.img != null) {
      this.animation = loadAnimationFromConfig(imgConfig);
    }
    this.health = health;
    const gameMapPosY = this.game.gameMap.config.consts.yPos;
    const gameMapCellWidth = this.game.gameMap.config.consts.cellWidth;
    const gameMapCellHeight = this.game.gameMap.config.consts.cellHeight;
    // Initial x position is off the right side of the canvas.
    this.x_pos = game.config.consts.xResolution + gameMapCellWidth;
    this.y_pos = gameMapPosY + (row * gameMapCellHeight);
    this.speed = 1;
    this.width = gameMapCellWidth;
    this.height = gameMapCellHeight;
    this.recharge = this.config.reloadTimeMs;
    this.charge = this.recharge;
  }

  hit(damage) {
    this.health -= damage;
    if (this.health <= 0) {
      this.game.gameMap.state.map_state[this.row][this.col] = undefined;
      let attackersInRow = this.game.gameMap.state.attackersByRow[this.row];
      helper.removeFromArray(attackersInRow, this);
      helper.removeFromArray(this.game.gameMap.state.activeAttackers, this);
      if (this.config.mp3s['died'].mp3 != undefined) {
        this.config.mp3s['died'].mp3.play();
      }
    } else {
      if (this.config.mp3s['injured'].mp3 != undefined) {
        this.config.mp3s['injured'].mp3.play();
      }
    }
  }

  draw(deltaT) {
    this.animation.draw(this.x_pos, this.y_pos, this.width, this.height);
    push();
    noStroke(); fill(255); textSize(10);
    const gameMapHealthOffsetX = this.game.gameMap.config.consts.health_xoffset;
    const gameMapHealthOffsetY = this.game.gameMap.config.consts.health_yoffset;
    text('Health:' + this.health,
         this.x_pos+gameMapHealthOffsetX,
         this.y_pos+gameMapHealthOffsetY);
    pop();
  }

  update(deltaT) {
    this.animation.update();

    if (this.charge < this.recharge) {
      this.charge++;
      return;
    }

    // Order is important here. If we check for attack after we check for
    // neighboring attacker, then we stop hitting.

    // Check for attack condition.
    let defendersToTheLeft = this.game.gameMap.state.defendersByRow[this.row]
        .filter(a => a.x_pos < this.x_pos);
    const gameMapCellWidth = this.game.gameMap.config.consts.cellWidth;
    let defender =
        helper.nextTo(this, defendersToTheLeft, gameMapCellWidth);
    if (defender != undefined && this.charge == this.recharge) {
      defender.hit(this.config.damage);
      this.charge = 0;
      return;
    }

    // Stand back if next to another attacker.
    let attackersToTheLeft = this.game.gameMap.state.attackersByRow[this.row]
        .filter(a => a.x_pos < this.x_pos);
    const gameMapEnemyQueueOffset =
        this.game.config.gameMap.consts.enemyQueueOffset;
    let other_attacker =
        helper.nextTo(this, attackersToTheLeft, gameMapEnemyQueueOffset);

    if (other_attacker != undefined) {
      return;
    }

    // Move left at speed.
    this.x_pos -= this.speed;
  }
}
