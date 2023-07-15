class Helper {
  constructor() { }

  removeFromArray(arr, elem) {
    const index = arr.indexOf(elem);
    if (index != -1) {
      arr.splice(index, 1);
    }
  }
  
  // Create config.<key> object if it doesn't exist, populate config.<key>.path
  // with "<rootDir>/<uid>_<path>.<ext>" if it doesn't exist, else expand
  // config.<key>.path to "<rootDir>/<config.<key>.path>" if it exists.
  expandAssetPath(config, key, rootDir, uid, ext) {
    if (config[key] == undefined) {
      config[key] = {};
    }
    if (config[key].path == undefined) {
      config[key].path = rootDir + '/' + uid + '_' + key + "." +  ext;
    } else {
      config[key].path = rootDir + '/' + config[key].path;
    }
  }
  
  // Return the value of |fieldId| in |config| if defined, else |defaultValue|
  // if defined, else returns `null`.
  getField(fieldId, config, defaultValue) {
    let result = null;
    if (defaultValue != undefined) {
      result = defaultValue;
    }
    if (config[fieldId] != undefined) {
      result = config[fieldId];
    }
    return result;
  }
  
  // Return the value of |fieldId| in |config| if defined, else the value from
  // |defaultConfig| if defined, else returns `null`.
  getFieldDefaultConfig(fieldId, config, defaultConfig) {
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
  
  // Return a promise while we asynchronously load the p5.Image at |path| if it
  // is available, and return it via the resolve() callback, else return `null`
  // via the reject() callback. Must be called from preload() so that p5js
  // library is loaded.
  asyncLoadImageFromPath(path) {
    return new Promise((resolve, reject) => {
      loadImage(
          path,
          img => { resolve(img); return img; },
          event => { reject(event); return null; });
    });
  }
}

let helper = new Helper();

