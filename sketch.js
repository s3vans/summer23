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
      }, {
        "uid": "pika2",
        "name": "Pikachu2",
        "img": "assets/pokemon/attackers/evee.png",
        "xp_cost": 50,
        "hp": 300,
      }, {
        "uid": "pika3",
        "name": "Pikachu3",
        "img": "assets/pokemon/defenders/pikachu.png",
        "xp_cost": 75,
        "hp": 300,
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
