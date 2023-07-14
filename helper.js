function _removeFromArray(arr, elem) {
  const index = arr.indexOf(elem);
  if (index != -1) {
    arr.splice(index, 1);
  }
}

function _makePath(rootDir, uid, key) {
  return rootDir + '/' + uid + '_' + key;
}

function _expandPath(rootDir, path) {
  return rootDir + '/' + path;
}

// Create config.<key> object if it doesn't exist, populate
// config.<key>.path with "<rootDir>/<uid>_<path> if it
// doesn't exist, else expand config.<key>.path to
// "<rootDir>/<config.<key>.path>" if it exists.
function _makeOrExpandAssetPath(config, key, rootDir, uid,
path) {
  if (config[key] == undefined) {
    config[key] = {};
  }
  if (config[key].path == undefined) {
    config[key].path = _makePath(rootDir, uid, path);
  } else {
    config[key].path =
        _expandPath(rootDir, config[key].path);
  }
}

// Return the value of |fieldId| in |config| if defined,
// else |defaultValue| if defined, else returns `null`.
function _getField(fieldId, config, defaultValue) {
  let result = null;
  if (defaultValue != undefined) {
    result = defaultValue;
  }
  if (config[fieldId] != undefined) {
    result = config[fieldId];
  }
  return result;
}

// Return the value of |fieldId| in |config| if defined,
// else the value from |defaultConfig| if defined, else
// returns `null`.
function _getFieldDefaultConfig(fieldId, config, defaultConfig) {
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

// Return a promise while we asynchronously load the
// p5.Image at |path| if it is available, and return it via
// the resolve() callback, else return `null` via the
// reject() callback.
function _asyncLoadImageFromPath(path) {
  return new Promise((resolve, reject) => {
    loadImage(
        path,
        img => { resolve(img); return img; },
        event => { reject(event); return null; });
  });
}
