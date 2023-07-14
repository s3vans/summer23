
function expandLevelConfig(rootDir, config) {
  let uid = _getField("uid", config);
  if (uid == null) {
    console.log("Level config is missing required uid.");
    return null;
  }

  if (config.startingMoney == undefined) {
    config.startingMoney = config.consts.defaultStartingMoney;
  }

  if (config.imgs == undefined) {
    config.imgs = {};
  }
  _makeOrExpandAssetPath(config.imgs, "background", rootDir, uid,
                         "background.png");
  let defaultAnimationConfig = {
    "frameHeight": levelConfig.consts.defaultFrameHeight,
    "fps": levelConfig.consts.defaultFps,
    "isLooping": levelConfig.consts.defaultIsLooping,
  }
  // NOTE: loadAnimationFromConfig() updates the |img| value asynchronously
  // after the image loads or fails to load.
  loadAnimationFromConfig(config.imgs.background, defaultAnimationConfig);

  // TODO: Load the audio from config.
  if (config.mp3s == undefined) {
    config.mp3s = {};
  }
  _makeOrExpandAssetPath(config.mp3s, "background", rootDir, uid,
                         "background.mp3");
  _makeOrExpandAssetPath(config.mp3s, "start", rootDir, uid, "start.mp3");
  _makeOrExpandAssetPath(config.mp3s, "win", rootDir, uid, "win.mp3");
  _makeOrExpandAssetPath(config.mp3s, "lose", rootDir, uid, "lose.mp3");
}

class Level {
  constructor(gameConfig, levelConfig) {
    levelConfig.consts = {};
    levelConfig.consts.defaultStartingMoney = 0;
    levelConfig.consts.defaultFrameHeight = gameConfig.consts.yResolution;
    levelConfig.consts.defaultFps = 1;
    levelConfig.consts.defaultIsLooping = false;

    expandLevelConfig(gameConfig.rootDir, levelConfig);
    this.config = levelConfig;
    this.state = {};
    this.state.money = this.config.startingMoney;
  }
};
