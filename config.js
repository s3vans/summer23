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
  "mp3s": {
    "credits": {
      "path": "game_credits.ogg",
    },
  },
  "projectiles": {
    "bolt": {
      "damage": 50,
      "reloadTimeMs": 200,
      "speed": 10,
    },
    "energyball": {
      "damage": 75,
      "reloadTimeMs": 200,
      "speed": 10,
    },
    "ember": {
      "damage": 45,
      "reloadTimeMs": 150,
      "speed": 5,
    },
    "bubble": {
      "damage": 35,
      "reloadTimeMs": 30,
      "speed": 5,
    },
    "scratch": {
      "damage": 150,
      "reloadTimeMs": 150,
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
      "startingHealth": 50,
      "cost": 50,
      "restockTime": 200,
      "projectile": "energyball",
    },
    "charmander": {
      "startingHealth": 300,
      "cost": 300,
      "restockTime": 200,
      "projectile": "ember",
    },
    "meowth": {
      "startingHealth": 400,
      "cost": 450,
      "restockTime": 200,
      "projectile": "scratch",
    },
    "squirtle": {
      "startingHealth": 255,
      "cost": 200,
      "restockTime": 200,
      "projectile": "bubble",
    },
  },
  "attackers": {
    "evee": {
      "startingHealth": 200,
      "damage": 40,
      "reloadTimeMs": 100,
    },
    "diglet": {
      "startingHealth": 215,
      "damage": 50,
      "reloadTimeMs": 150,
    },
    "ditto": {
      "startingHealth": 215,
      "damage": 15,
      "reloadTimeMs": 75,
    },
    "mewtwo": {
      "startingHealth": 290,
      "damage": 60,
      "reloadTimeMs": 100,
    },
    "team_rocket": {
      "startingHealth": 600,
      "damage": 250,
      "reloadTimeMs": 200,
    },
  },
  "collectibles": {
    "raspberries": {
      "health": 50,
      "lifespan": 250,
    },
  },
  "levels": [
    {
      "uid": "level1",
      "startingMoney": 450,
      "defenders": [
          "pikachu",
      ],
      "attackers": [
          "evee",
      ],
      "collectibles": [
          "raspberries",
      ],
      "sequence": [
          // 0 => any, rows 1-5, cols 1-7
          [ "wait", 4000 ],
          [ "attack", "evee", 1 ],
          [ "wait", 5000 ],
          [ "attack", "evee", 3 ],
          [ "wait", 5000 ],
          [ "attack", "evee", 4 ],
          [ "attack", "evee", 5 ],
          [ "wait", 15000 ],
          [ "attack", "evee", 4 ],
          [ "attack", "evee", 5 ],
          [ "wait", 20000 ],
          [ "attack", "evee", 1 ],
      ],
    },
    {
      "uid": "level2",
      "startingMoney": 150,
      "defenders": [
          "pikachu",
          "bulbasaur",
      ],
      "attackers": [
          "evee",
          "diglet",
      ],
      "collectibles": [
          "raspberries",
      ],
      "sequence": [
          [ "attack", "evee", /*row=*/3 ],
          [ "wait", 10000 ],

          [ "attack", "diglet", /*row=*/2 ],
          [ "attack", "diglet", /*row=*/4 ],
          [ "wait", 10000 ],

          [ "attack", "evee", /*row=*/1 ],
          [ "attack", "evee", /*row=*/5 ],
          [ "wait", 10000 ],
  

          [ "attack", "any", /*row=*/0 ],
          [ "attack", "any", /*row=*/0 ],
          [ "wait", 1000 ],
          [ "attack", "any", /*row=*/3 ],
      ],
    },
    {
      "uid": "level3",
      "startingMoney": 250,
      "mp3s": {
        "background": {
          "path": "level3_background.ogg",
        },
      },
      "defenders": [
          "pikachu",
          "bulbasaur",
          "charmander",
      ],
      "attackers": [
          "evee",
          "diglet",
          "ditto",
      ],
      "collectibles": [
          "raspberries",
      ],
      "sequence": [
          [ "wait", 10000 ],

          [ "attack", "ditto", /*row=*/1 ],
          [ "wait", 3000 ],
          [ "attack", "ditto", /*row=*/1 ],
          [ "wait", 3000 ],
          [ "attack", "ditto", /*row=*/2 ],
          [ "wait", 3000 ],
          [ "attack", "ditto", /*row=*/3 ],
          [ "wait", 7000],

          [ "attack", "ditto", /*row=*/3 ],
          [ "attack", "ditto", /*row=*/1 ],
          [ "wait", 3000 ],
          [ "attack", "ditto", /*row=*/2 ],
          [ "wait", 3000 ],
          [ "attack", "ditto", /*row=*/3 ],
          [ "wait", 30000 ],

          [ "attack", "evee", /*row=*/4 ],
          [ "wait", 500],
          [ "attack", "evee", /*row=*/5 ],
          [ "wait", 20000 ],

          [ "attack", "diglet", /*row=*/0 ],
      ],
    },
    {
      "uid": "level4",
      "startingMoney": 150,
      "defenders": [
          "pikachu",
          "bulbasaur",
          "charmander",
          "squirtle",
      ],
      "attackers": [
          "evee",
          "diglet",
          "ditto",
          "mewtwo",
      ],
      "collectibles": [
          "raspberries",
      ],
      "sequence": [
          [ "attack", "mewtwo", /*row=*/3 ],
          [ "wait", 10000],
          [ "attack", "mewtwo", /*row=*/3 ],
          [ "wait", 5000],
          [ "attack", "mewtwo", /*row=*/3 ],
          [ "wait", 5000],
          [ "attack", "any", /*row=*/1 ],
          [ "wait", 5000 ],
          [ "attack", "any", /*row=*/0 ],
          [ "wait", 2500 ],
          [ "attack", "any", /*row=*/0 ],
          [ "wait", 1000 ],
          [ "attack", "any", /*row=*/0 ],
          [ "wait", 500 ],
          [ "attack", "any", /*row=*/0 ],
          [ "wait", 500 ],
          [ "attack", "any", /*row=*/0 ],
      ],
    },
    {
      "uid": "level5",
      "startingMoney": 2250,
      "mp3s": {
        "background": {
          "path": "level5_background.ogg",
          "volume": .8,
        },
      },
      "defenders": [
          "pikachu",
          "bulbasaur",
          "charmander",
          "squirtle",
          "meowth",
      ],
      "attackers": [
          "evee",
          "diglet",
          "ditto",
          "mewtwo",
          "team_rocket",
      ],
      "collectibles": [
          "raspberries",
      ],
      "sequence": [
          [ "wait", 10000 ],

          [ "attack", "mewtwo", /*row=*/1 ],
          [ "attack", "mewtwo", /*row=*/2 ],
          [ "attack", "mewtwo", /*row=*/3 ],
          [ "attack", "mewtwo", /*row=*/4 ],
          [ "attack", "mewtwo", /*row=*/5 ],
          [ "wait", 2000 ],
          [ "attack", "mewtwo", /*row=*/1 ],
          [ "attack", "mewtwo", /*row=*/2 ],
          [ "attack", "mewtwo", /*row=*/3 ],
          [ "attack", "mewtwo", /*row=*/4 ],
          [ "attack", "mewtwo", /*row=*/5 ],
          [ "wait", 2000 ],
          [ "attack", "mewtwo", /*row=*/1 ],
          [ "attack", "mewtwo", /*row=*/2 ],
          [ "attack", "mewtwo", /*row=*/3 ],
          [ "attack", "mewtwo", /*row=*/4 ],
          [ "attack", "mewtwo", /*row=*/5 ],
          [ "wait", 1000 ],
          [ "attack", "mewtwo", /*row=*/1 ],
          [ "attack", "mewtwo", /*row=*/2 ],
          [ "attack", "mewtwo", /*row=*/3 ],
          [ "attack", "mewtwo", /*row=*/4 ],
          [ "attack", "mewtwo", /*row=*/5 ],
          [ "wait", 1000 ],
          [ "attack", "ditto", /*row=*/1 ],
          [ "attack", "ditto", /*row=*/2 ],
          [ "attack", "ditto", /*row=*/3 ],
          [ "attack", "ditto", /*row=*/4 ],
          [ "attack", "ditto", /*row=*/5 ],
          [ "wait", 10000 ],

          [ "attack", "mewtwo", /*row=*/1 ],
          [ "attack", "mewtwo", /*row=*/2 ],
          [ "attack", "mewtwo", /*row=*/3 ],
          [ "attack", "mewtwo", /*row=*/4 ],
          [ "attack", "mewtwo", /*row=*/5 ],
          [ "wait", 2000 ],
          [ "attack", "mewtwo", /*row=*/1 ],
          [ "attack", "mewtwo", /*row=*/2 ],
          [ "attack", "team_rocket", /*row=*/3 ],
          [ "attack", "mewtwo", /*row=*/4 ],
          [ "attack", "mewtwo", /*row=*/5 ],
          [ "wait", 2000 ],
          [ "attack", "mewtwo", /*row=*/1 ],
          [ "attack", "mewtwo", /*row=*/2 ],
          [ "attack", "mewtwo", /*row=*/3 ],
          [ "attack", "mewtwo", /*row=*/4 ],
          [ "attack", "mewtwo", /*row=*/5 ],
          [ "wait", 10000 ],

          [ "attack", "any", /*row=*/0 ],
          [ "attack", "any", /*row=*/0 ],
          [ "attack", "any", /*row=*/0 ],
          [ "attack", "any", /*row=*/0 ],
          [ "attack", "any", /*row=*/0 ],
          [ "attack", "any", /*row=*/0 ],
          [ "attack", "any", /*row=*/0 ],
          [ "attack", "any", /*row=*/0 ],
          [ "attack", "any", /*row=*/0 ],
          [ "attack", "any", /*row=*/0 ],
          [ "attack", "any", /*row=*/0 ],
          [ "attack", "any", /*row=*/0 ],
          [ "attack", "any", /*row=*/0 ],
          [ "attack", "any", /*row=*/0 ],
          [ "attack", "any", /*row=*/0 ],
          [ "wait", 2000 ],

      ],
    },
  ],
}
