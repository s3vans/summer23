
// Rudimentary attacker instance.
class Attacker {
  constructor(game, row, imgConfig, hp) {
    this.game = game;
    this.row = row;
    this.animation = null;
    if (imgConfig.img != null) {
      this.animation = loadAnimationFromConfig(imgConfig);
    }
    this.hp = hp;
    this.x_pos = game.config.consts.xResolution + this.game.gameMap.config.consts.cellWidth;
    this.y_pos = this.game.gameMap.config.consts.yPos + row * this.game.gameMap.config.consts.cellHeight;
    this.speed = 1;
    this.width = this.game.gameMap.config.consts.cellWidth;
    this.height = this.game.gameMap.config.consts.cellHeight;
  }

  hit(damage) {
    this.hp -= damage;
    if (this.hp <= 0) {
      this.game.gameMap.state.map_state[this.row][this.col] = undefined;
      helper.removeFromArray(this.game.gameMap.state.attackersByRow[this.row], this);
      helper.removeFromArray(this.game.gameMap.state.activeAttackers, this);
    }
  }

  draw() {
    this.animation.draw(deltaTime, this.x_pos, this.y_pos, this.width, this.height);
  }

  update() {
    this.animation.update();

    // Order is important here. If we check for attack after we check for
    // neighboring attacker, then we stop hitting.

    // Check for attack condition.
    let defendersToTheLeft = this.game.gameMap.state.defendersByRow[this.row]
        .filter(a => a.x_pos < this.x_pos);
    let defender =
        helper.nextTo(this, defendersToTheLeft, this.game.gameMap.config.consts.cellWidth);
    if (defender != undefined) {
      defender.hit();
      return;
    }

    // Stand back if next to another attacker.
    let attackersToTheLeft = this.game.gameMap.state.attackersByRow[this.row]
        .filter(a => a.x_pos < this.x_pos);
    let other_attacker = helper.nextTo(this, attackersToTheLeft,
                                       this.game.gameMap.config.consts.enemeyQueueOffset);

    if (other_attacker != undefined) {
      return;
    }

    // Move left at speed.
    this.x_pos -= this.speed;
  }
}
