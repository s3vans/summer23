let screens = [];
let nextZ = 0;

// Screens start out invisible and in the forground.
class Screen {
  constructor(bgImg) {
    this.bgImg = bgImg;
    this.visible = false;
    this.elements = [];
  }

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }

  addElement(e) {
    this.elements.push(e);
    this.elements.sort((a,b) => a.z < b.z);
  }

  handleClick() {
    for (element of this.elements) {
      if (element.handleClick()) {
        return true;
      }
    }
    return false;
  }

  update() {
    for (element of this.elements) {
      element.update();
    }
  }

  draw() {
    if (this.visible) {
      image(this.bgImg, 0, 0);
      for (elements of this.elements) {
        element.draw();
      }
    }
  }

}
