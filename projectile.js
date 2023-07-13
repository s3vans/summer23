
class Projectile {
  constructor(game, row, col, img, hp, speed) {
    this.game = game;
    this.state = "FLYING";
    this.row = row;
    this.col = col;
    this.height = MAP_CELL_HEIGHT / 2;
    this.width = MAP_CELL_WIDTH / 2;
    this.img = img;
    this.x_pos = MAP_X + (col * MAP_CELL_WIDTH);
    this.y_pos = MAP_Y + (row * MAP_CELL_HEIGHT);
    this.speed = speed;
    this.hp = hp;
  }

  draw() {
    push();
    image(this.img, this.x_pos, this.y_pos, this.width, this.height);
    pop();
  }

  update() {
    if (this.state == "FLYING") {
      // Handle hits first.
      let attackersToTheRight = this.game.attackersByRow[this.row]
          .filter(a => a.x_pos > this.x_pos);
      let attacker =
          this.game._nextTo(this, attackersToTheRight, MAP_CELL_WIDTH);
      if (attacker != undefined) {
        attacker.hit();
        removeFromArray(this.game.activeProjectiles, this);
        return;
      }
      if (this.x_pos < game.config.consts.xResolution + MAP_CELL_WIDTH) {
        this.x_pos += this.speed;
      } else {
        // Remove it once offscreen.
        removeFromArray(this.game.activeProjectiles, this);
      }
    }
  }
}
