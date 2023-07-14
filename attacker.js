
// Rudimentary attacker instance.
class Attacker {
  constructor(game, row, img, hp) {
    this.game = game;
    this.row = row;
    this.img = img;
    this.hp = hp;
    this.x_pos = game.config.consts.xResolution + MAP_CELL_WIDTH;
    this.y_pos = MAP_Y + row * MAP_CELL_HEIGHT;
    this.speed = 1;
    this.width = MAP_CELL_WIDTH;
  }

  hit() {
    this.hp -= 100;
    if (this.hp <= 0) {
      this.game.map_state[this.row][this.col] = undefined;
      _removeFromArray(this.game.attackersByRow[this.row], this);
      _removeFromArray(this.game.activeAttackers, this);
    }
  }

  update() {
      // Order is important here. If we check for attack after we check for
      // neighboring attacker, then we stop hitting.

      // Check for attack condition.
      let defendersToTheLeft = this.game.defendersByRow[this.row]
          .filter(a => a.x_pos < this.x_pos);
      let defender =
          this.game._nextTo(this, defendersToTheLeft, MAP_CELL_WIDTH);
      if (defender != undefined) {
        defender.hit();
        return;
      }

      // Stand back if next to another attacker.
      let attackersToTheLeft = this.game.attackersByRow[this.row]
          .filter(a => a.x_pos < this.x_pos);
      let other_attacker = this.game._nextTo(this, attackersToTheLeft,
                                             MAP_ENEMY_QUEUE_OFFSET);

      if (other_attacker != undefined) {
        return;
      }

      // Move left at speed.
      this.x_pos -= this.speed;
  }
}
