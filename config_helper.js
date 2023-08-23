class ConfigHelper {
  constructor() { };

  _expandAnimationConfig(animationConfig, defaultAnimationConfig) {
    let config = animationConfig;
    let defaultConfig = defaultAnimationConfig;

    let path = helper.getFieldDefaultConfig("path", config, defaultConfig);
    animationConfig.path = path;

    animationConfig.frameHeight =
        helper.getFieldDefaultConfig("frameHeight", config, defaultConfig);

    animationConfig.fps =
        helper.getFieldDefaultConfig("fps", config, defaultConfig);

    animationConfig.isLooping =
        helper.getFieldDefaultConfig("isLooping", config, defaultConfig);
    if (isLooping == null) {
      return null;
    }

    animationConfig.img = null;
    helper.asyncLoadImageFromPath(path)
        .then((img) => {
          //console.log("Loaded " + path);
          animationConfig.img = img;
        })
        .catch((err) => {
          //console.log("Error loading " + path);
          //console.log(err);
          animationConfig.img = null;
        });
  }

  // NOTE: This failed every way that I tried it. It seemed to always return an
  // error, even when the file existed, ut the asyncLoaSoundFromPath() function
  // never actually failed. The entire page failed to load. The
  // loadMp3FromPath() function worked, so I'm abandoning this.
  _expandSoundConfig(soundConfig, defaultSoundConfig) {
    let config = soundConfig;
    let defaultConfig = defaultSoundConfig;

    soundConfig.mp3 = null;
    //soundConfig.mp3 = loadSound(soundConfig.path);
    helper.asyncLoadSoundFromPath(soundConfig.path)
        .then((mp3) => {
          //console.log("Loaded " + path);
          soundConfig.mp3 = mp3;
        })
        .catch(() => {
          //console.log("Error loading " + soundConfig.path);
          soundConfig.mp3 = null;
        });
  }

  _expandAttackerConfig(expandedGameConfig, rootDir, uid, attackerConfig) {
    attackerConfig.consts = {};
    attackerConfig.consts.defaultStartingHealth = 100;
    attackerConfig.consts.defaultDamage = 10;
    attackerConfig.consts.defaultReloadTimeMs = 3000;
    attackerConfig.consts.defaultFrameHeight =
        expandedGameConfig.gameMap.consts.cellHeight;
    attackerConfig.consts.defaultFps = 12;
    attackerConfig.consts.defaultIsLooping = true;

    if (attackerConfig.name == undefined) {
      attackerConfig.name = uid;
    }

    if (attackerConfig.startingHealth == undefined) {
      attackerConfig.startingHealth =
          attackerConfig.consts.defaultStartingHealth;
    }

    if (attackerConfig.damage == undefined) {
      attackerConfig.damage =
          attackerConfig.consts.defaultDamage;
    }

    if (attackerConfig.reloadTimeMs == undefined) {
      attackerConfig.reloadTimeMs =
          attackerConfig.consts.defaultReloadTimeMs;
    }

    if (attackerConfig.imgs == undefined) {
      attackerConfig.imgs = {};
    }
    let defaultAnimationConfig = {
      "frameHeight": attackerConfig.consts.defaultFrameHeight,
      "fps": attackerConfig.consts.defaultFps,
      "isLooping": attackerConfig.consts.defaultIsLooping,
    }
    let modes = ["idle", "walking", "injured", "hitting", "died"];
    for (let mode of modes) {
      helper.expandAssetPath(attackerConfig.imgs, mode, rootDir, uid, "png");
      // NOTE: loadAnimationFromConfig() updates the |img| value asynchronously
      // after the image loads or fails to load.
      this._expandAnimationConfig(attackerConfig.imgs[mode],
                                  defaultAnimationConfig);
    }

    if (attackerConfig.mp3s == undefined) {
      attackerConfig.mp3s = {};
    }
    modes = ["placed", "injured", "died"];
    for (let mode of modes) {
      helper.expandAssetPath(attackerConfig.mp3s, mode, rootDir, uid, "mp3");
      helper.loadMp3FromPath(attackerConfig.mp3s[mode],
                             attackerConfig.mp3s[mode].path);
    }
  }

  _expandDefenderConfig(expandedGameConfig, rootDir, uid, defenderConfig) {
    defenderConfig.consts = {};
    defenderConfig.consts.defaultStartingHealth = 100;
    defenderConfig.consts.defaultCost = 100;
    defenderConfig.consts.defaultRestockTimeMs = 0;
    defenderConfig.consts.defaultProjectile = null;
    defenderConfig.consts.defaultFrameHeight =
        expandedGameConfig.gameMap.consts.cellHeight;
    defenderConfig.consts.defaultFps = 12;
    defenderConfig.consts.defaultIsLooping = true;

    if (defenderConfig.name == undefined) {
      defenderConfig.name = uid;
    }

    if (defenderConfig.startingHealth == undefined) {
      defenderConfig.startingHealth =
          defenderConfig.consts.defaultStartingHealth;
    }

    if (defenderConfig.cost == undefined) {
      defenderConfig.cost =
          defenderConfig.consts.defaultCost;
    }

    if (defenderConfig.restockTimeMs == undefined) {
      defenderConfig.restockTimeMs =
          defenderConfig.consts.defaultRestockTimeMs;
    }

    if (defenderConfig.projectile == undefined) {
      defenderConfig.projectile =
          defenderConfig.consts.defaultProjectile;
    }

    if (defenderConfig.imgs == undefined) {
      defenderConfig.imgs = {};
    }
    let defaultAnimationConfig = {
      "frameHeight": defenderConfig.consts.defaultFrameHeight,
      "fps": defenderConfig.consts.defaultFps,
      "isLooping": defenderConfig.consts.defaultIsLooping,
    }
    let modes = ["idle", "injured", "died"];
    for (let mode of modes) {
      helper.expandAssetPath(defenderConfig.imgs, mode, rootDir, uid, "png");
      // NOTE: loadAnimationFromConfig() updates the |img| value asynchronously
      // after the image loads or fails to load.
      this._expandAnimationConfig(defenderConfig.imgs[mode],
                                  defaultAnimationConfig);
    }

    if (defenderConfig.mp3s == undefined) {
      defenderConfig.mp3s = {};
    }
    modes = ["placed", "injured", "died"];
    for (let mode of modes) {
      helper.expandAssetPath(defenderConfig.mp3s, mode, rootDir, uid, "mp3");
      helper.loadMp3FromPath(defenderConfig.mp3s[mode],
                             defenderConfig.mp3s[mode].path);
    }
  }

  _expandProjectileConfig(expandedGameConfig, rootDir, uid, projectileConfig) {
    projectileConfig.consts = {};
    projectileConfig.consts.defaultDamage = 50;
    projectileConfig.consts.defaultReloadTimeMs = 3000;
    projectileConfig.consts.defaultSpeed = 10;
    projectileConfig.consts.defaultFrameHeight =
        expandedGameConfig.gameMap.consts.cellHeight;
    projectileConfig.consts.defaultFps = 12;
    projectileConfig.consts.defaultIsLooping = true;

    if (projectileConfig.name == undefined) {
      projectileConfig.name = uid;
    }

    if (projectileConfig.imgs == undefined) {
      projectileConfig.imgs = {};
    }
    let defaultAnimationConfig = {
      "frameHeight": projectileConfig.consts.defaultFrameHeight,
      "fps": projectileConfig.consts.defaultFps,
      "isLooping": projectileConfig.consts.defaultIsLooping,
    }
    let modes = ["launching", "flying", "hitting"];
    for (let mode of modes) {
      helper.expandAssetPath(projectileConfig.imgs, mode, rootDir, uid, "png");
      // NOTE: loadAnimationFromConfig() updates the |img| value asynchronously
      // after the image loads or fails to load.
      this._expandAnimationConfig(projectileConfig.imgs[mode],
                                  defaultAnimationConfig);
    }

    if (projectileConfig.mp3s == undefined) {
      projectileConfig.mp3s = {};
    }
    modes = ["launching", "hitting"];
    for (let mode of modes) {
      helper.expandAssetPath(projectileConfig.mp3s, mode, rootDir, uid, "mp3");
      helper.loadMp3FromPath(projectileConfig.mp3s[mode],
                             projectileConfig.mp3s[mode].path);
    }
  }

  _expandCollectibleConfig(expandedGameConfig, rootDir, uid,
                           collectibleConfig) {
    collectibleConfig.consts = {};
    collectibleConfig.consts.defaultFallSpeed = 10;
    collectibleConfig.consts.defaultClickRadius = 50;
    collectibleConfig.consts.defaultFrameHeight =
        expandedGameConfig.consts.yResolution;
    collectibleConfig.consts.defaultFps = 1;
    collectibleConfig.consts.defaultIsLooping = true;

    if (collectibleConfig.name == undefined) {
      collectibleConfig.name = uid;
    }

    if (collectibleConfig.fallSpeed == undefined) {
      collectibleConfig.fallSpeed =
          collectibleConfig.consts.defaultFallSpeed;
    }

    if (collectibleConfig.clickRadius == undefined) {
      collectibleConfig.clickRadiuis =
          collectibleConfig.consts.defaultClickRadius;
    }

    if (collectibleConfig.imgs == undefined) {
      collectibleConfig.imgs = {};
    }
    let defaultAnimationConfig = {
      "frameHeight": collectibleConfig.consts.defaultFrameHeight,
      "fps": collectibleConfig.consts.defaultFps,
      "isLooping": collectibleConfig.consts.defaultIsLooping,
    }
    let modes = ["falling", "landed", "collected"];
    for (let mode of modes) {
      helper.expandAssetPath(collectibleConfig.imgs, mode, rootDir, uid, "png");
      // NOTE: loadAnimationFromConfig() updates the |img| value asynchronously
      // after the image loads or fails to load.
      this._expandAnimationConfig(collectibleConfig.imgs[mode],
                                  defaultAnimationConfig);
    }

    if (collectibleConfig.mp3s == undefined) {
      collectibleConfig.mp3s = {};
    }
    modes = ["appeared", "landed", "collected"];
    for (let mode of modes) {
      helper.expandAssetPath(collectibleConfig.mp3s, mode, rootDir, uid, "mp3");
      helper.loadMp3FromPath(collectibleConfig.mp3s[mode],
                             collectibleConfig.mp3s[mode].path);
    }
  }

  _expandStoreConfig(expandedGameConfig) {
    if (expandedGameConfig.store == undefined) {
      expandedGameConfig.store = {};
    }
    expandedGameConfig.store.consts = {};
    expandedGameConfig.store.consts.xPos = 100;
    expandedGameConfig.store.consts.yPos = 0;
    expandedGameConfig.store.consts.itemCount = 6;
    expandedGameConfig.store.consts.itemWidth = 100;
    expandedGameConfig.store.consts.itemHeight = 100;
    expandedGameConfig.store.consts.itemImgWidth = 80;
    expandedGameConfig.store.consts.itemImgHeight = 80;
  }

  _expandGameMapConfig(expandedGameConfig) {
    if (expandedGameConfig.gameMap == undefined) {
      expandedGameConfig.gameMap = {};
    }
    expandedGameConfig.gameMap.consts = {};
    expandedGameConfig.gameMap.consts.xPos = 100;
    expandedGameConfig.gameMap.consts.yPos = 100;
    expandedGameConfig.gameMap.consts.cellColCount = 7;
    expandedGameConfig.gameMap.consts.cellRowCount = 5;
    expandedGameConfig.gameMap.consts.cellWidth = 100;
    expandedGameConfig.gameMap.consts.cellHeight = 100;
    expandedGameConfig.gameMap.consts.cellImgWidth = 100;
    expandedGameConfig.gameMap.consts.cellImgHeight = 100;
    expandedGameConfig.gameMap.consts.enemyQueueOffset = 50;
    expandedGameConfig.gameMap.consts.health_xoffset = 50;
    expandedGameConfig.gameMap.consts.health_yoffset = 100;
  }

  _expandLevelConfig(expandedGameConfig, rootDir, levelConfig) {
    levelConfig.consts = {};
    levelConfig.consts.defaultStartingMoney = 0;
    levelConfig.consts.defaultFrameHeight =
        expandedGameConfig.consts.yResolution;
    levelConfig.consts.defaultFps = 1;
    levelConfig.consts.defaultIsLooping = false;

    let uid = helper.getField("uid", levelConfig);
    if (uid == null) {
      console.log("Level config is missing required uid.");
      return null;
    }

    if (levelConfig.startingMoney == undefined) {
      levelConfig.startingMoney = levelConfig.consts.defaultStartingMoney;
    }

    if (levelConfig.imgs == undefined) {
      levelConfig.imgs = {};
    }
    helper.expandAssetPath(levelConfig.imgs, "background", rootDir, uid, "png");
    let defaultAnimationConfig = {
      "frameHeight": levelConfig.consts.defaultFrameHeight,
      "fps": levelConfig.consts.defaultFps,
      "isLooping": levelConfig.consts.defaultIsLooping,
    }
    // NOTE: loadAnimationFromConfig() updates the |img| value asynchronously
    // after the image loads or fails to load.
    this._expandAnimationConfig(levelConfig.imgs.background,
                                defaultAnimationConfig);

    if (levelConfig.mp3s == undefined) {
      levelConfig.mp3s = {};
    }
    let modes = ["background", "start", "win", "lose"];
    for (let mode of modes) {
      helper.expandAssetPath(levelConfig.mp3s, mode, rootDir, uid, "mp3");
      helper.loadMp3FromPath(levelConfig.mp3s[mode],
                             levelConfig.mp3s[mode].path);
    }
  }

  // Must be called from preload() so that p5js library is loaded.
  expandGameConfig(gameConfig) {
    gameConfig.consts = {};
    gameConfig.consts.xResolution = 800;
    gameConfig.consts.yResolution = 600;
    gameConfig.consts.minScaleFactor = .5;
    gameConfig.consts.maxScaleFactor = 3;
    gameConfig.consts.overlayX = 700;
    gameConfig.consts.overlayY = 0;
    gameConfig.consts.overlayWidth = 100;
    gameConfig.consts.overlayHeight = 100;
    gameConfig.consts.ageRateMs = 30;    // Time to decrease lifespan by 1.
    gameConfig.consts.chargeRateMs = 30; // Time to increase charge by 1.
    gameConfig.consts.speedRateMs = 30;  // Time to move by 1px.

    let rootDir = "";
    if (gameConfig.rootDir != undefined) {
      rootDir = gameConfig.rootDir;
    }

    this._expandStoreConfig(gameConfig);
    // Note: Some configs below use consts from this config. Order matters.
    this._expandGameMapConfig(gameConfig);

    if (gameConfig.attackers == undefined) {
      gameConfig.attackers = {};
    }
    for (let [uid, attackerConfig] of Object.entries(gameConfig.attackers)) {
      this._expandAttackerConfig(gameConfig, rootDir, uid, attackerConfig);
    }

    if (gameConfig.defenders == undefined) {
      gameConfig.defenders = {};
    }
    for (let [uid, defenderConfig] of Object.entries(gameConfig.defenders)) {
      this._expandDefenderConfig(gameConfig, rootDir, uid, defenderConfig);
    }

    if (gameConfig.projectiles == undefined) {
      gameConfig.projectiles = {};
    }
    for (let [uid, projectileConfig] of
        Object.entries(gameConfig.projectiles)) {
      this._expandProjectileConfig(gameConfig, rootDir, uid, projectileConfig);
    }

    if (gameConfig.collectibles == undefined) {
      gameConfig.collectibles = {};
    }
    for (let [uid, collectibleConfig] of
        Object.entries(gameConfig.collectibles)) {
      this._expandCollectibleConfig(gameConfig, rootDir, uid,
                                    collectibleConfig);
    }

    if (gameConfig.levels == undefined) {
      gameConfig.levels = [];
    }
    for (let level of gameConfig.levels) {
      this._expandLevelConfig(gameConfig, rootDir, level);
    }
  }
}

let configHelper = new ConfigHelper();
