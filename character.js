
class Character {
  constructor(game, characterConfig, state, row, col, x_pos, y_pos, health) {
    this.game = game;
    // Static config:
    // name, uid, img, width, height, speed
    this.config = config;
    // Instance config:
    this.state = state;
    this.row = row;
    this.col = col;
    this.x_pos = x_pos;
    this.y_pos = y_pos;
    this.health = health;
  }
}

class DefenderCharacter extends Character {
  constructor(game, defenderConfig, row, col) {
    super(
        game, defenderConfig,
        /*state=*/"IDLE", row, col,
        /*x_pos=*/this.game.gameMap.config.consts.xPos + (this.game.gameMap.config.consts.cellWidth * col),
        /*y_pos=*/this.game.gameMap.config.consts.yPos + (this.game.gameMap.config.consts.cellHeight * row),
        defenderConfig.health);
  }
}
