
function buildLevelFromConfig(rootDir, levelConfig, defaultLevelConfig) {
  let config = levelConfig;
  let defaultConfig = defaultLevelConfig; 
 
  let uid = _getField("uid", config, defaultConfig);
  if (uid == null) {
    console.log("Level config is missing required uid.");
    return null;
  }

  let startingMoney = _getField("startingMoney", config, defaultConfig);
  if (startingMoney == null) {
    startingMoney = 0;
  }
  
  // To load an image we need:
  // 1) img path from config, or default path
  // 2) loaded img from server
  // 3) created animation from img and animation settings from config
  let background_path = rootDir + '/' + uid + '_background

  return new Level(uid, startingMoney);
}

class Level {
  constructor(uid, startingMoney) {
    this.config = {};
    this.config.uid = uid;
    this.config.startingMoney = startingMoney;
    this.config.imgs = {};
    this.config.imgs.background = null;
    this.config.mp3s = {};
    this.config.mp3s.background = null;
    this.config.mp3s.start = null;
    this.config.mp3s.win = null; ;
    this.config.mp3s.lose = null;
    this.config.defenders = [];
    this.config.attckers = [];
    this.config.sequence = [];

    this.state = {};
    this.state.money = 0;
  }

  // Given a pointer to a level's config, returns "" on success, or an error
  // string if there is an error parsing the config.
  initFromConfig(rootDir, config) {
    if (config.uid === undefined) {
      return "Level config is missing required uid";
    }
    this.config.uid = config.uid;

    if (config.startingMoney !== undefined) {
      this.config.startingMoney = config.startingMoney);
    }

    let path;
    let obj;

    _loadImage(rootDir+'/levels/', config, 'background');

    path = rootDir + '/levels/' + this.config.uid + '_background.mp3';
    if (config.mp3s.background !== undefined) {
        path = rootDir + '/' + config.mp3s.background;
    }
    obj = loadSoundFromPath(path);
    if (obj == undefined) {
      console.log(path + ": sound not found");
    } else {
      this.config.imgs.background = obj;
    }

    this.config.imgs = {};
    this.config.imgs.background = undefined;
    this.config.mp3s = {};
    this.config.mp3s.background = undefined;
    this.config.mp3s.start = undefined;
    this.config.mp3s.win = undefined; ;
    this.config.mp3s.lose = undefined;

    for (let defenderConfig of config.defenders) {
      let defender = new Defender();
      let error = defender.initFromConfig(rootDir, defenderConfig);
      if (error !== "") {
        return error;
      }
    }

    for (let attackerConfig of config.attackers) {
      let attacker = new Attacker();
      let error = attacker.initFromConfig(rootDir, attackerConfig);
      if (error !== "") {
        return error;
      }
    }

    for (let sequenceItem of config.sequence) {
    }
  }
};
