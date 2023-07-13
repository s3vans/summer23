
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
        /*x_pos=*/MAP_X + (MAP_CELL_WIDTH * col),
        /*y_pos=*/MAP_Y + (MAP_CELL_HEIGHT * row),
        defenderConfig.health);
  }
}
