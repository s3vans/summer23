let levels = [{
    "uid": "level1",
    "name": "Level 1",
    "img": "assets/pokemon/levels/level1.png",
    "mp3_bg": "assets/pokemon/levels/level1_bg.mp3",
    "mp3_start": "asstes/pokemon/levels/level1_start.mp3",
    "mp3_win": "asstes/pokemon/levels/level1_start.mp3",
    "mp3_lose": "asstes/pokemon/levels/level1_start.mp3",
    "startingXp": 500,
    "levelXp": 500,  // TODO: remove
    "defenderConfigs": [{
        "uid": "pikachu",
        "name": "Pikachu",
        "img": "assets/pokemon/defenders/pikachu_sprites.png",
        "img_idle": "", // Defaults used if not specified.
        "img_hurt": "",
        "img_die": "",
        "mp3_place": "", // place on map
        "mp3_hurt": "",
        "mp3_die": "",
        "xp_cost": 150,
        "hp": 200,
        "projectile_img": "assets/pokemon/objects/bolt.png",
        "projectile_mp3_launch": "assets/pokemon/objects/bolt.mp3",
        "projectile_mp3_hit": "assets/pokemon/objects/bolt.mp3",
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
        "projectile_mp3": "assets/pokemon/objects/bolt.mp3",
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
        "projectile_mp3": "assets/pokemon/objects/bolt.mp3",
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
        "projectile_mp3": "assets/pokemon/objects/bolt.mp3",
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
        "projectile_mp3": "assets/pokemon/objects/bolt.mp3",
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
let game_config = {
  "root_dir": "assets/pokemon",
  "levels": [
    {
      "uid": "level1",
      "startingMoney": 500,
      "defenders": [
        {
          "uid": "pikachu",
          "startingHealth": 200,
          "cost": 150,
          "restockTime": 200,
          "projectile": {
            "uid": "bolt",
            "maxHitDamage": 150,
            "reloadTime": 200,
          },
        }, {
          "uid": "bulbasaur",
          "startingHealth": 300,
          "cost": 50,
          "restockTime": 200,
          "projectile": {
            "uid": "splash",
            "maxHitDamage": 250,
            "reloadTime": 200,
          },
        }
      ],
      // Should attackers and defenders be global game config as opposed to per-level?
      // Note: We could allow per-level overrides, if that was ever even necessary.
      "attacker": [
        {
          "uid": "evee",
          "startingHealth": 200,
          "maxHitDamage": 200,
          "reloadTime": 200,
        }
      ],
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
//
////
//// Unrefined example of explicit game config that shows some of the implicit.
//// (Needs to be reworked to match the above config.)
////
//let levels_new = [{
//    "root": "assets/pokemon",
//    "uid": "level1",
//    "name": "Level 1",
//    "imgs": {
//        "background": {
//            "img": "levels/level1.png",  // Defaults to {root}/levels/{uid}.png"
//            "fps": 12, // Defaults to 1
//            "numFrames": 9,  // Defaults to 1
//            "frameHeight": undefined,  // Defaults to (img.height / fps)
//            "loop": true,  // Defaults to true.
//         }
//    },
//    // These are all optional.
//    "mp3s": {
//        "background": "levels/level1_background.mp3",  // Defaults to {root}/levels/level1_background.mp3"
//        "start": "levels/level1_start.mp3",  // Default to {root}/levels/level1_start.mp3
//        "win": "levels/level1_win.mp3",  // Default to {root}/levels/level1_win.mp3
//        "lose": "levels/level1_lose.mp3",  // Default to {root}/levels/level1_lose.mp3
//    },
//    "startingMoney": 500,
//    "defenderConfigs": [{
//        "uid": "pikachu",
//        "name": "Pikachu",
//        "moneyCost": 150,
//        "startingHealth": 200,
//        "imgs": {
//            "default": {
//                "img": "defenders/pikachu_default.png",  // Defaults to {root}/defenders/{uid}_default.png"
//                "fps": 12, // Defaults to 1
//                "numFrames": 9,  // Defaults to 1
//                "frameHeight": undefined,  // Defaults to (img.height / fps)
//                "loop": true,  // Defaults to true.
//            },
//            "hurt":  {
//                "img": "defenders/pikachu_hurt.png",  // Defaults to {root}/defenders/{uid}_hurt.png"
//                "loop": false,  // TODO: We can let death animations play out over some fixed OR configurable time period.
//            },
//            "die":  {
//                "img": "defenders/pikachu_die.png",  // Defaults to {root}/defenders/{uid}_die.png"
//            },
//        },
//        "mp3s": {
//            "default": {
//            },
//            "place":  {
//            },
//            "hurt":  {
//            },
//            "die":  {
//            },
//        },
//        "projectiles": [{
//            "uid": "bolt",
//            "healthDamage": 50,
//            "randomDamage": false,
//            "img": {
//                // "assets/pokemon/objects/bolt.png"
//            },
//            "mp3s": {
//                "launch": {
//                },
//                "hit": {
//                },
//            },
//            "rechargeTimeMs": 1000,
//        }],
//    }],
//    "collectibleConfigs": [{
//        "uid": "raspberries",
//        "name": "Raspberries",
//        "img": "assets/pokemon/objects/raspberries.png",
//        "mp3": "assets/pokemon/objects/raspberries.mp3",
//        "xp": 50,
//        "lifespan": 250,
//    }],
//    // TODO: Consider alternative that lists enemies of what type and max
//    // duration between respawns, then use randomness to distribute.  Maybe
//    // make sequences recordable in level design mode.
//    "attackerSequence": [{
//        "uid": "evee",
//        "elapsedTime": 1000,
//        "row": -1, // if not a valid row 1-5, then random
//   }, {
//        "uid": "evee2",
//        "elapsedTime": 1500,
//        "row": -1, // if not a valid row 1-5, then random
//   }],
//}];

let game = new Game();

let animation;

function preload() {
  game.loadLevel(levels[0]);

  let p = loadImage('assets/pokemon/defenders/pikachu_sprites.png');
  animation = new Animation(p, 100, 12, true);
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
