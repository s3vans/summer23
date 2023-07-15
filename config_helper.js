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

  _expandAttackerConfig(expandedGameConfig, rootDir, uid, attackerConfig) {
    attackerConfig.consts = {};
    attackerConfig.consts.defaultStartingHealth = 100;
    attackerConfig.consts.defaultDamage = 10;
    attackerConfig.consts.defaultReloadTimeMs = 3000;
    attackerConfig.consts.defaultFrameHeight =
        expandedGameConfig.consts.cellRowHeight;
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
      // TODO: Load the audio.
    }
  }

  _expandDefenderConfig(expandedGameConfig, rootDir, uid, defenderConfig) {
    defenderConfig.consts = {};
    defenderConfig.consts.defaultStartingHealth = 100;
    defenderConfig.consts.defaultCost = 100;
    defenderConfig.consts.defaultRestockTimeMs = 0;
    defenderConfig.consts.defaultProjectile = null;
    defenderConfig.consts.defaultFrameHeight =
        expandedGameConfig.consts.cellRowHeight;
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
      // TODO: Load the audio.
    }
  }

  _expandProjectileConfig(expandedGameConfig, rootDir, uid, projectileConfig) {
    projectileConfig.consts = {};
    projectileConfig.consts.defaultDamage = 50;
    projectileConfig.consts.defaultReloadTimeMs = 3000;
    projectileConfig.consts.defaultSpeed = 10;
    projectileConfig.consts.defaultFrameHeight =
        expandedGameConfig.consts.cellRowHeight;
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
      // TODO: Load the audio.
    }
  }

  _expandCollectibleConfig(expandedGameConfig, rootDir, uid, collectibleConfig) {
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
      // TODO: Load the audio.
    }
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

    // TODO: Load the audio.
    if (levelConfig.mp3s == undefined) {
      levelConfig.mp3s = {};
    }
    helper.expandAssetPath(levelConfig.mp3s, "background", rootDir, uid, "mp3");
    helper.expandAssetPath(levelConfig.mp3s, "start", rootDir, uid, "mp3");
    helper.expandAssetPath(levelConfig.mp3s, "win", rootDir, uid, "mp3");
    helper.expandAssetPath(levelConfig.mp3s, "lose", rootDir, uid, "mp3");
  }

  // Must be called from preload() so that p5js library is loaded.
  expandGameConfig(gameConfig) {
    gameConfig.consts = {};
    gameConfig.consts.xResolution = 800;
    gameConfig.consts.yResolution = 600;
    gameConfig.consts.minScaleFactor = .5;
    gameConfig.consts.maxScaleFactor = 3;

    let rootDir = "";
    if (gameConfig.rootDir != undefined) {
      rootDir = gameConfig.rootDir;
    }

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
    for (let [uid, projectileConfig] of Object.entries(gameConfig.projectiles)) {
      this._expandProjectileConfig(gameConfig, rootDir, uid, projectileConfig);
    }

    if (gameConfig.collectibles == undefined) {
      gameConfig.collectibles = {};
    }
    for (let [uid, collectibleConfig] of Object.entries(gameConfig.collectibles)) {
      this._expandCollectibleConfig(gameConfig, rootDir, uid, collectibleConfig);
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