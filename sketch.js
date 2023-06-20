let levels = [{
    "uid": "level1",
    "name": "Level 1",
    "img": "assets/pokemon/levels/level1.png",
    "levelXp": 500,
    "defenderConfigs": [{
        "uid": "pikachu",
        "name": "Pikachu",
        "img": "assets/pokemon/defenders/pikachu.png",
        "xp_cost": 150,
        "hp": 200,
    }],
    "attackerConfigs": [{
        "uid": "evee",
        "name": "Evee",
        "img": "assets/pokemon/attackers/evee.png",
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

function mouseClicked() {
  game.mouseClicked();
}

function windowResized() {
  game.windowResized();
}
