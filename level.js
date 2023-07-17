
class Level {
  constructor(game, expandedLevelConfig) {
    this.config = expandedLevelConfig;
    this.game = game;
    this.state = {};
    this.state.money = this.config.startingMoney;
    this.state.img = this.config.imgs.background.img;
  }

  draw() {
    push();
    background(0);
    let xRes = this.game.config.consts.xResolution;
    let yRes = this.game.config.consts.yResolution;
    image(this.state.img, 0, 0, xRes, yRes);
    pop();
  }
};
