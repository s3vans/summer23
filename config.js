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
      "reloadTimeMs": 300,
      "speed": 10,
    },
    "ember": {
      "damage": 45,
      "reloadTimeMs": 250,
      "speed": 5,
    },
    "energyball": {
      "damage": 10,
      "reloadTimeMs": 200,
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
      "cost": 350,
      "restockTime": 200,
      "projectile": "ember",
    },
    "meowth": {
      "startingHealth": 400,
      "cost": 450,
      "restockTime": 200,
      "projectile": "bolt",
    },
    "squirtle": {
      "startingHealth": 255,
      "cost": 150,
      "restockTime": 200,
      "projectile": "bolt",
    },
  },
  "attackers": {
    "evee": {
      "startingHealth": 200,
      "damage": 40,
      "reloadTimeMs": 150,
      "imgs": {
        "idle": {
          "frameHeight": 100,
        }
      },
    },
    "diglet": {
      "startingHealth": 200,
      "damage": 40,
      "reloadTimeMs": 150,
      "imgs": {
        "idle": {
          "frameHeight": 100,
        }
      }
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
      "startingMoney": 1250,
      "defenders": [
          "pikachu",
          "bulbasaur",
          "charmander",
          "meowth",
          "squirtle",
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
          [ "attack", "evee", /*row=*/1 ],
          [ "wait", 5000 ],
          [ "attack", "evee", /*row=*/3 ],
          [ "wait", 2500 ],
          [ "attack", "evee", /*row=*/4 ],
          [ "wait", 1000 ],
          [ "attack", "evee", /*row=*/3 ],
          [ "wait", 500 ],
          [ "attack", "evee", /*row=*/2 ],
          [ "wait", 500 ],
          [ "attack", "evee", /*row=*/1 ],
      ],
    },
    {
      "uid": "level2",
      "startingMoney": 1250,
      "defenders": [
          "pikachu",
          "bulbasaur",
          "charmander",
          "meowth",
          "squirtle",
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
          [ "attack", "evee", /*row=*/1 ],
          [ "wait", 5000 ],
          [ "attack", "evee", /*row=*/3 ],
          [ "wait", 2500 ],
          [ "attack", "evee", /*row=*/4 ],
          [ "wait", 1000 ],
          [ "attack", "evee", /*row=*/3 ],
          [ "wait", 500 ],
          [ "attack", "evee", /*row=*/2 ],
          [ "wait", 500 ],
          [ "attack", "evee", /*row=*/1 ],
      ],
    },
    {
      "uid": "level3",
      "startingMoney": 1250,
      "defenders": [
          "pikachu",
          "bulbasaur",
          "charmander",
          "meowth",
          "squirtle",
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
          [ "attack", "evee", /*row=*/1 ],
          [ "wait", 5000 ],
          [ "attack", "evee", /*row=*/3 ],
          [ "wait", 2500 ],
          [ "attack", "evee", /*row=*/4 ],
          [ "wait", 1000 ],
          [ "attack", "evee", /*row=*/3 ],
          [ "wait", 500 ],
          [ "attack", "evee", /*row=*/2 ],
          [ "wait", 500 ],
          [ "attack", "evee", /*row=*/1 ],
      ],
    },
    {
      "uid": "level4",
      "startingMoney": 1250,
      "defenders": [
          "pikachu",
          "bulbasaur",
          "charmander",
          "meowth",
          "squirtle",
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
          [ "attack", "evee", /*row=*/1 ],
          [ "wait", 5000 ],
          [ "attack", "evee", /*row=*/3 ],
          [ "wait", 2500 ],
          [ "attack", "evee", /*row=*/4 ],
          [ "wait", 1000 ],
          [ "attack", "evee", /*row=*/3 ],
          [ "wait", 500 ],
          [ "attack", "evee", /*row=*/2 ],
          [ "wait", 500 ],
          [ "attack", "evee", /*row=*/1 ],
      ],
    },
    {
      "uid": "level5",
      "startingMoney": 1250,
      "defenders": [
          "pikachu",
          "bulbasaur",
          "charmander",
          "meowth",
          "squirtle",
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
          [ "attack", "evee", /*row=*/1 ],
          [ "wait", 5000 ],
          [ "attack", "evee", /*row=*/3 ],
          [ "wait", 2500 ],
          [ "attack", "evee", /*row=*/4 ],
          [ "wait", 1000 ],
          [ "attack", "evee", /*row=*/3 ],
          [ "wait", 500 ],
          [ "attack", "evee", /*row=*/2 ],
          [ "wait", 500 ],
          [ "attack", "evee", /*row=*/1 ],
      ],
    },
  ],
}
