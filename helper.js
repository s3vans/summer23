
// Returns the value of |fieldId| in |config| if defined,
// or the value from |defaultConfig| if defined, or
// returns `null`.
function _getField(fieldId, config, defaultConfig) {
  let result = null;
  if (defaultConfig != undefined) {
    if (defaultConfig[fieldId] != undefined) {
      result = defaultConfig[fieldId];
    }
  }
  if (config[fieldId] != undefined) {
    result = config[fieldId];
  }
  return result;
}

// Synchronously loads and returns the p5.Image at |path|
// if it is available, else returns `null`.
function _loadImageFromPath(path) {
  let img = loadImage(
      path,
      (img) => {
          return img,
      },
      (err) => {
          console.log(path + ": image not available -- " + err);
          return null;
      });
  return img;
}
