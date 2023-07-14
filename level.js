
class Level {
  constructor(gameConfig, expandedLevelConfig) {
    this.config = expandedLevelConfig;
    this.state = {};
    this.state.money = this.config.startingMoney;
  }
};
