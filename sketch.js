let levels = [{
    "uid": "level1",
    "name": "Level 1",
    "img": "assets/level1.png",
    "defenderConfigs": [{
        "uid": "pikachu",
        "name": "Pikachu",
        "img": "assets/pikachu.png",
        "xp_cost": 150,
        "hp": 200,
    }],
    "attackerConfigs": [{
        "uid": "evee",
        "name": "Evee",
        "img": "assets/evee.png",
        "hp": 150,
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

function windowResized() {
  game.windowResized();
}
