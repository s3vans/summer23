class Helper {
  constructor() { }

  mouseInRectangle(scaledMouseX, scaledMouseY, x, y, width, height) {
    let mX = scaledMouseX;
    let mY = scaledMouseY;
    if (mX < x || mX > x+width) {
      return false;
    }
    if (mY < y || mY > y+height) {
      return false;
    }
    return true;
  }

  highlightRectangle(x, y, width, height, color, transparency) {
    push();
    fill(color);
    rect(x, y, width, height);
    pop();
  }

  // Return |other_character| from |characters| if |character| is within
  // |distance| as measured between their centers, else return undefined.
  //
  // We use the center of the characters to avoid dealing with edges.
  nextTo(character, characters, distance) {
    for (let other of characters) {
      if (other == character) {
        continue;
      }
      let C = (character.x_pos + (character.x_pos+character.width)) / 2;
      let CO = (other.x_pos + (other.x_pos+other.width)) / 2;
      if (Math.abs(C - CO) <= distance) {
        return other;
      }
    }
    return undefined;
  }

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

