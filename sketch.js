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
//   * game.projectiles.mp3s.hit
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
let game_config = {
  "root_dir": "assets/pokemon",
  "projectiles": [{
      "uid": "bolt",
      "damage": 50,
      "reloadTimeMs": 1000,
      "speed": 10,
  }],
  "defenders": [
    {
      "uid": "pikachu",
      "startingHealth": 200,
      "cost": 150,
      "restockTimeMs": 200,
      "projectile": "bolt",
    }, {
      "uid": "bulbasaur",
      "startingHealth": 300,
      "cost": 50,
      "restockTime": 200,
      "projectile": "splash",
    }
  ],
  "attackers": [
    {
      "uid": "evee",
      "startingHealth": 200,
      "damage": 200,
      "reloadTimeMs": 200,
    }
  ],
  "collectibles": [{
      "uid": "raspberries",
      "xp": 50,
      "lifespan": 250,
  }],
  "levels": [
    {
      "uid": "level1",
      "startingMoney": 500,
      "defenders": [
          "pikachu",
          "bulbasaur",
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

let game = new Game(game_config);

function preload() {
  game.loadLevel(levels[0]);
}

function setup() {
  game.setup();
}

function draw() {
  game.update();
  game.draw();
}

function mouseClicked() {
  game.mouseClicked();
}

function windowResized() {
  game.windowResized();
}

// onMouseClicked() wasn't working in Safari on our iPad. This code was
// suggested at: https://github.com/processing/p5.js/issues/5358
// It should prevent the browser from processing some default touch events.
document.addEventListener('touchstart', {}); // <-- mysterious HACK.
function touchStarted() {
  mouseClicked();
  return false;
}
function touchMoved() {
  return false;
}
function touchEnded() {
  return false;
}
