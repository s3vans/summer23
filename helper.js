
function _getField(fieldId, config, defaultConfig) {
  let result;
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

