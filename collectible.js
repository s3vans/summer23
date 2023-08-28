
// Rudimentary collectible instance.
class Collectible {
  constructor(game, collectibleConfig, row, col, img, health, lifespan) {
    this.game = game;
    this.config = collectibleConfig;
    this.state = "FALLING";
    this.height = this.game.gameMap.config.consts.cellHeight / 2;
    this.width = this.game.gameMap.config.consts.cellWidth / 2;
    this.img = img;
    // HACK: Hard-coded offset value.
    const offsetMax = 15; // Left or Right
    // Get a +/- offset in interval [-offsetMax, offsetMax]
    const offset = offsetMax - Math.floor(Math.random() * offsetMax*2);
    this.x_pos = this.game.gameMap.config.consts.xPos +
        (col * this.game.gameMap.config.consts.cellWidth) + offset;
    this.y_pos = 0 - this.game.gameMap.config.consts.cellHeight + offset;
    this.target_y_pos = this.game.gameMap.config.consts.yPos +
        (row * this.game.gameMap.config.consts.cellHeight) + offset;
    this.speed = 1;
    this.health = health;
    this.lifespan = lifespan;
    if (this.config.mp3s.appeared.mp3 != null) {
      this.config.mp3s.appeared.mp3.play();
    }
  }

  draw(deltaT) {
    push();
    image(this.img, this.x_pos, this.y_pos, this.width, this.height);
    pop();
  }

  update(deltaT) {
    if (this.state == "LANDED") {
      if (this.lifespan > 0) {
        let age = deltaT / this.game.config.consts.ageRateMs;
        this.lifespan -= age;
        Math.max(this.lifespan, 0);
      } else {
        helper.removeFromArray(this.game.gameMap.state.activeCollectibles, this);
      }
    }
    if (this.y_pos < this.target_y_pos) {
      let distance = this.speed * (deltaT / this.game.config.consts.speedRateMs);
      this.y_pos += distance;
    } else {
      this.state = "LANDED";
      if (this.config.mp3s.landed.mp3 != null) {
        this.config.mp3s.landed.mp3.play();
      }
    }
  }
}
