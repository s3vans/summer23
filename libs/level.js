
class Level {
  constructor(game, expandedLevelConfig) {
    this.config = expandedLevelConfig;
    this.game = game;
    this.state = {};
    this.state.money = this.config.startingMoney;
    this.state.background =
        loadAnimationFromConfig(this.config.imgs.background);
    this.state.firstUpdate = true;
  }

  update(deltaT) {
    if (this.state.firstUpdate) {
      if (this.config.mp3s.start.mp3 != undefined) {
        helper.overrideVolume(this.config.mp3s.start);
        this.config.mp3s.start.mp3.play();
      }
      if (this.config.mp3s.background.mp3 != undefined) {
        this.config.mp3s.background.mp3.setVolume(0.10);
        helper.overrideVolume(this.config.mp3s.background);
        this.config.mp3s.background.mp3.loop();
      }
      this.state.firstUpdate = false;
    }
    this.state.background.update(deltaT);
  }

  draw(deltaT) {
    push();
    background(0);
    let xRes = this.game.config.consts.xResolution;
    let yRes = this.game.config.consts.yResolution;
    this.state.background.draw(0, 0, xRes, yRes);
    pop();
  }

  stop() {
    if (this.config.mp3s.background.mp3 != undefined) {
      this.config.mp3s.background.mp3.stop();
    }
  }
};
