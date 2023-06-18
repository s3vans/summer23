
class GameEngine {
  constructor(xRes, yRes) {
    this.screens = [];
    this.xRes = xRes;
    this.yRes = yRes;
    this.canvas = createCanvas(this.xRes, this.yRes);
    this.canvas.mouseClicked(this.handleClick);
  }

  handleClick() {
    for (screen of this.screens) {
      if (screen.visible) {
        if (screen.handleClick()) {
          return;
        }
      }
    }
  }

  update() {
    this.screens.sort((a,b) => a.z<b.z);
    for (screen of this.screens) {
      if (screen.visible) {
        screen.update();
      }
    }
  }

  draw() {
    background(255, 0, 0);
    for (screen of this.screens) {
      if (screen.visible) {
        screen.draw();
      }
    }
  }

  addScreen(s) {
    this.screens.push(s);
    this.screens.sort((a,b) => a.z<b.z);
  }

  removeScreen(s) {
    this.screens.remove(s);
    this.screens.sort((a,b) => a.z<b.z);
  }
}

