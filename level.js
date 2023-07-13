const LEVEL_DEFAULT_STARTING_MONEY = 0;
const LEVEL_DEFAULT_BACKGROUND_FRAME_HEIGHT = GAME_XRESOLUTION;
const LEVEL_DEFAULT_BACKGROUND_FPS = 12;
const LEVEL_DEFAULT_BACKGROUND_IS_LOOPING = true;

function expandDefenderConfig(rootDir, defenderConfig) {
  let config = defenderConfig;
}

function expandAttackerConfig(rootDir, attackerConfig) {
  let config = attackerConfig;
}

function expandSequenceConfig(rootDir, sequenceConfig) {
  let config = sequenceConfig;
}

function expandLevelConfig(rootDir, levelConfig) {
  let config = levelConfig;

  let uid = _getField("uid", config);
  if (uid == null) {
    console.log("Level config is missing required uid.");
    return null;
  }

  if (config.startingMoney == undefined) {
    config.startingMoney = LEVEL_DEFAULT_STARTING_MONEY;
  }

  if (config.imgs == undefined) {
    config.imgs = {};
  }

  _makeOrExpandAssetPath(config.imgs, "background", rootDir, uid, "background.png");
  let defaultAnimationConfig = {
    "frameHeight": LEVEL_DEFAULT_BACKGROUND_FRAME_HEIGHT,
    "fps": LEVEL_DEFAULT_BACKGROUND_FPS,
    "isLooping": LEVEL_DEFAULT_BACKGROUND_IS_LOOPING,
  }

  // HACK: loadAnimationFromConfig() actually manages this
  // value asynchronously after the image loads or fails
  // ot load, but I left this code here to make it clear
  // that this value is part of the config.
  config.imgs.background.img =
      loadAnimationFromConfig(config.imgs.background, defaultAnimationConfig);

  if (config.mp3s == undefined) {
    config.mp3s = {};
  }
  _makeOrExpandAssetPath(config.mp3s, "background", rootDir, uid, "background.mp3");
  _makeOrExpandAssetPath(config.mp3s, "start", rootDir, uid, "start.mp3");
  _makeOrExpandAssetPath(config.mp3s, "win", rootDir, uid, "win.mp3");
  _makeOrExpandAssetPath(config.mp3s, "lose", rootDir, uid, "lose.mp3");

  if (config.defenders == undefined) {
    config.defenders = [];
  }
  for (defenderConfig of config.defenders) {
    expandDefenderConfig(rootDir, defenderConfig);
  }

  if (config.attackers == undefined) {
    config.attackers = [];
  }
  for (attackerConfig of config.attackers) {
    expandAttackerConfig(rootDir, attackerConfig);
  }

  if (config.sequences == undefined) {
    config.sequences = [];
  }
  for (sequenceConfig of config.sequences) {
    expandSequenceConfig(rootDir, sequenceConfig);
  }
}

class Level {
  constructor(expandedLevelConfig) {
    this.config = expandedLevelConfig;
    this.state = {};
    this.state.money = 0;
  }
};
