
function buildAnimationFromConfig(animationConfig, defaultAnimationConfig) {
  let config = animationConfig;
  let defaultConfig = defaultAnimationConfig;

  let img = _getField("img", config, defaultConfig);
  if (img == null) {
    return null;
  }

  let frameHeight = _getField("frameHeight", config, defaultConfig);
  if (frameHeight == null) {
    return null;
  }

  let fps =  _getField("fps", config, defaultConfig);
  if (fps == null) {
    return null;
  }

  let isLooping = _getField("isLooping", config, defaultConfig);
  if (isLooping == null) {
    return null;
  }

  return new Animation(img, frameHeight, fps, isLooping);
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

  update(deltaTime) {
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

  draw(deltaTime, x, y, width, height) {
    let srcX = 0;
    let srcY = this.frameHeight * this.currentFrameNum;
    let srcWidth = this.img.width;
    let srcHeight = this.frameHeight;
    image(this.img, x, y, width, height, srcX, srcY, srcWidth, srcHeight);
  }
}
