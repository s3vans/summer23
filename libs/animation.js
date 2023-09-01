// Assumes that animationConfig.img is already loaded.
function loadAnimationFromConfig(animationConfig, defaultAnimationConfig) {
  let config = animationConfig;
  let defaultConfig = defaultAnimationConfig;

  let path = helper.getFieldDefaultConfig("path", config, defaultConfig);
  if (path == null) {
    return null;
  }

  let frameHeight =
      helper.getFieldDefaultConfig("frameHeight", config, defaultConfig);
  if (frameHeight == null) {
    return null;
  }

  let fps =  helper.getFieldDefaultConfig("fps", config, defaultConfig);
  if (fps == null) {
    return null;
  }

  let isLooping = helper.getFieldDefaultConfig("isLooping", config,
                                               defaultConfig);
  if (isLooping == null) {
    return null;
  }

  return new Animation(animationConfig.img, frameHeight, fps, isLooping);
}

class Animation {
  constructor(img, frameHeight, fps, isLooping) {
    this.img = img;
    this.frameHeight = frameHeight;
    this.fps = fps;
    this.isLooping = isLooping;

    this.numFrames = null;
    this.lastFrameTime = null;
    this.msPerFrame = Math.floor(1000 / this.fps);
    this.currentFrameNum = 0;
    this.isDone = false;
  }

  reset() {
    this.currentFrameNum = 0;
    this.isDone = false;
  }

  update() {
    if (this.img == null) {
      return;
    }
    if (this.isDone) {
      return;
    }
    let nowMs = Date.now();
    if (this.numFrames === null) {
      this.numFrames = Math.floor(this.img.height / this.frameHeight);
    }
    if (this.lastFrameTime === null) {
      this.lastFrameTime = nowMs;
    }
    let timeSinceLastFrame = nowMs - this.lastFrameTime;
    let numFramesToAdvance = Math.floor(timeSinceLastFrame / this.msPerFrame);
    let nextFrame = (this.currentFrameNum + numFramesToAdvance) % this.numFrames;
    if ((!this.isLooping) && (nextFrame < this.currentFrameNum)) {
      nextFrame = this.numFrames - 1;
      this.isDone = true;
    }
    this.currentFrameNum =  nextFrame;
    if (numFramesToAdvance > 0) {
      this.lastFrameTime = nowMs;
    }
  }

  draw(x, y, width, height) {
    if (this.img == null) {
      return;
    }
    let srcX = 0;
    let srcY = this.frameHeight * this.currentFrameNum;
    let srcWidth = this.img.width;
    let srcHeight = this.frameHeight;
    image(this.img, x, y, width, height, srcX, srcY, srcWidth, srcHeight);
  }
}
