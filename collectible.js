
// Rudimentary collectible instance.
class Collectible {
  constructor(game, row, col, img, xp, lifespan) {
    this.game = game;
    this.state = "FALLING";
    this.height = MAP_CELL_HEIGHT / 2;
    this.width = MAP_CELL_WIDTH / 2;
    this.img = img;
    this.x_pos = MAP_X + (col * MAP_CELL_WIDTH);
    this.y_pos = 0 - MAP_CELL_HEIGHT;
    this.target_y_pos = MAP_Y + (row * MAP_CELL_HEIGHT);
    this.speed = 1;
    this.xp = xp;
    this.lifespan = lifespan;
  }

  draw() {
    push();
    image(this.img, this.x_pos, this.y_pos, this.width, this.height);
    pop();
  }

  update() {
    if (this.state == "LANDED") {
      if (this.lifespan > 0) {
        this.lifespan -= 1;
      } else {
        helper.removeFromArray(this.game.activeCollectibles, this);
      }
    }
    if (this.y_pos < this.target_y_pos) {
      this.y_pos += this.speed;
    } else {
      this.state = "LANDED";
    }
  }
}
