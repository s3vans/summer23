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
        "img": "assets/pokemon/defenders/pikachu.png",
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
        "projectile_recharge": 1000,
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
    }],
    "collectibleConfigs": [{
        "uid": "raspberries",
        "name": "Raspberries",
        "img": "assets/pokemon/objects/raspberries.png",
        "xp": 50,
        "lifespan": 250,
    }],
  }];

let game = new Game();

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
