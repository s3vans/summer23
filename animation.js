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

  // NOTE: Because loading is asynchronous, the returned
  // animation is initialized with a `null` |img| field.
  // When loading is finished, a callback will either
  // populate the |img| field or leave it as `null.
  let animation =
      new Animation(null, frameHeight, fps, isLooping);

  // NOTE: To make it easier to read, this function is
  // written like it returns the new animation, but we must
  // set it manually here to avoid a race condition where
  // the following asynchronous code tries to update the
  // |img| field inside the animation.
  animationConfig.img = animation;

  helper.asyncLoadImageFromPath(path)
      .then((img) => {
        animationConfig.img.img = img;
      })
      .catch((err) => {
        console.log("Error loading ", path);
        animationConfig.img.img = null;
      });
  return animation;
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

  update(deltaTime) {
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

  draw(deltaTime, x, y, width, height) {
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
