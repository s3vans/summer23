let levels = [{
    "uid": "level1",
    "name": "Level 1",
    "img": "assets/pokemon/levels/level1.png",
    "startingXp": 500,
    "levelXp": 500,  // TODO: remove
    "defenderConfigs": [{
        "uid": "pikachu",
        "name": "Pikachu",
        "img": "assets/pokemon/defenders/pikachu_sprites.png",
        "xp_cost": 150,
        "hp": 200,
        "projectile_img": "assets/pokemon/objects/bolt.png",
        "projectile_hp": 50,
        "projectile_speed": 10,
        "projectile_recharge": 100,
      }, {
        "uid": "pika2",
        "name": "Pikachu2",
        "img": "assets/pokemon/defenders/pikachu2.png",
        "xp_cost": 50,
        "hp": 300,
        "projectile_img": "assets/pokemon/objects/bolt.png",
        "projectile_hp": 50,
        "projectile_speed": 10,
        "projectile_recharge": 100,
      }, {
        "uid": "bulbasaur",
        "name": "Bulbasaur",
        "img": "assets/pokemon/defenders/bulbasaur.png",
        "xp_cost": 50,
        "hp": 300,
        "projectile_img": "assets/pokemon/objects/bolt.png",
        "projectile_hp": 50,
        "projectile_speed": 10,
        "projectile_recharge": 5000,
      }, {
        "uid": "charmander",
        "name": "Charmander",
        "img": "assets/pokemon/defenders/charmander.png",
        "xp_cost": 75,
        "hp": 120,
        "projectile_img": "assets/pokemon/objects/bolt.png",
        "projectile_hp": 50,
        "projectile_speed": 10,
        "projectile_recharge": 1000,
      }, {
        "uid": "evee2",
        "name": "Evee",
        "img": "assets/pokemon/attackers/evee2.png",
        "xp_cost": 75,
        "hp": 300,
        "projectile_img": "assets/pokemon/objects/bolt.png",
        "projectile_hp": 50,
        "projectile_speed": 10,
        "projectile_recharge": 10,
    }],
    "attackerConfigs": [{
        "uid": "evee",
        "name": "Evee",
        "img": "assets/pokemon/attackers/evee.png",
        "hp": 150,
        "hit_xp": 1,
        "hit_recharge": 1,
    }],
    "collectibleConfigs": [{
        "uid": "raspberries",
        "name": "Raspberries",
        "img": "assets/pokemon/objects/raspberries.png",
        "xp": 50,
        "lifespan": 250,
    }],
    // Maybe make sequences recordable.
    "attackerSequence": [{
        "uid": "evee",
        "time": 1000,
        "row": -1, // if not a valid row 1-5, then random
   }, {
        "uid": "evee2",
        "time": 1500,
        "row": -1, // if not a valid row 1-5, then random
   }],
}];

//
// Example of minimal game config.
//
// Implicit config not shown here:
//   * game.projectiles.imgs.launching
//   * game.projectiles.imgs.flying (default)
//   * game.projectiles.imgs.hitting
//   * game.projectiles.mp3s.launching
//   * game.projectiles.mp3s.hitting
//   * game.collectibles.name
//   * game.collectibles.imgs.falling
//   * game.collectibles.imgs.landed
//   * game.collectibles.imgs.collected
//   * game.collectibles.mp3s.apeared
//   * game.collectibles.mp3s.landed
//   * game.collectibles.mp3s.collected
//   * game.defenders.name
//   * game.defenders.imgs.idle (default)
//   * game.defenders.imgs.injured
//   * game.defenders.imgs.died
//   * game.defenders.mp3s.placed
//   * game.defenders.mp3s.injured
//   * game.defenders.mp3s.died
//   * game.attackers.name
//   * game.attackers.imgs.idle (default)
//   * game.attackers.imgs.walking
//   * game.attackers.imgs.injured
//   * game.attackers.imgs.hitting
//   * game.attackers.imgs.died
//   * game.attackers.mp3s.placed
//   * game.attackers.mp3s.injured
//   * game.attackers.mp3s.died
//   * game.levels.name
//   * game.levels.imgs.background
//   * game.levels.mp3s.background
//   * game.levels.mp3s.start
//   * game.levels.mp3s.win
//   * game.levels.mp3s.lose
//
let pokemonGameConfig = {
  "rootDir": "assets/pokemon",
  "projectiles": {
    "bolt": {
      "damage": 50,
      "reloadTimeMs": 1000,
      "speed": 10,
    },
  },
  "defenders": {
    "pikachu": {
      "startingHealth": 200,
      "cost": 150,
      "restockTimeMs": 200,
      "projectile": "bolt",
    },
    "bulbasaur": {
      "startingHealth": 300,
      "cost": 50,
      "restockTime": 200,
      "projectile": "bolt",
    },
    "charmander": {
      "startingHealth": 300,
      "cost": 50,
      "restockTime": 200,
      "projectile": "bolt",
    },
  },
  "attackers": {
    "evee": {
      "startingHealth": 200,
      "damage": 200,
      "reloadTimeMs": 200,
    },
  },
  "collectibles": {
    "raspberries": {
      "xp": 50,
      "lifespan": 250,
    },
  },
  "levels": [
    {
      "uid": "level1",
      "startingMoney": 500,
      "defenders": [
          "pikachu",
          "bulbasaur",
          "charmander",
      ],
      "attackers": [
          "evee",
      ],
      "collectibles": [
          "raspberries",
      ],
      // TODO: Consider alternative that lists enemies of what type and max
      // duration between respawns, then use randomness to distribute.  Maybe
      // make sequences recordable in level design mode.
      "sequence": [
        {
          //message(/*duration*/=3000, "Level #1 - First Wave..."),
          //wait(2500),
          //attack("evee", /*row=*/-1),
          //randomWaitUpTo(2500),
          //attack("evee", /*row=*/2),
        }
      ],
    },
  ],
}

class ConfigHelper {
  constructor() { };

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
      expandAnimationConfig(attackerConfig.imgs[mode], defaultAnimationConfig);
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
      expandAnimationConfig(defenderConfig.imgs[mode], defaultAnimationConfig);
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
      expandAnimationConfig(projectileConfig.imgs[mode], defaultAnimationConfig);
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
      expandAnimationConfig(collectibleConfig.imgs[mode], defaultAnimationConfig);
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
    expandAnimationConfig(levelConfig.imgs.background, defaultAnimationConfig);

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
