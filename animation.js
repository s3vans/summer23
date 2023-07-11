
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
  }

  update(deltaTime) {
    let nowMs = Date.now();
    if (this.numFrames === null) {
      this.numFrames = Math.floor(this.img.height / this.frameHeight);
    }
    if (this.lastFrameTime === null) {
      this.lastFrameTime = nowMs;
    }
    let timeSinceLastFrame = nowMs - this.lastFrameTime;
    let numFramesToAdvance = Math.floor(timeSinceLastFrame / this.msPerFrame);
    this.currentFrameNum = (this.currentFrameNum + numFramesToAdvance) % this.numFrames;
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
