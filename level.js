
class Level {
  constructor(game, expandedLevelConfig) {
    this.config = expandedLevelConfig;
    this.game = game;
    this.state = {};
    this.state.money = this.config.startingMoney;
    this.state.background =
        loadAnimationFromConfig(this.config.imgs.background);
  }

  update(deltaT) {
    this.state.background.update(deltaT);
  }

  draw(delta) {
    push();
    background(0);
    let xRes = this.game.config.consts.xResolution;
    let yRes = this.game.config.consts.yResolution;
    this.state.background.draw(0, 0, xRes, yRes);
    pop();
  }
};
