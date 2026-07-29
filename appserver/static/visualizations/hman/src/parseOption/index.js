/**
 * Parse the config option. Return null if there is a token
 * that is not yet replaced with a value in the configOption.
 * Return the config object in all other cases.
 *
 * Please note that tokens are strings within two $ characters.
 * Dollar character can be escaped by using $$.
 */
const echarts = require('echarts'); // eslint-disable-line no-unused-vars

const _parseOption = function (configOption) {
  if (configOption == null || !Object.prototype.hasOwnProperty.call(configOption, "length")) {
    return null;
  }
  var option = {};
  var parsedConfigOption = "";
  // check if there is still a unreplaced $token$ in the config
  for (let i = 0; i < configOption.length; i++) {
    const character = configOption.charAt(i);
    if (character !== '$') {
      parsedConfigOption += character;
      continue;
    }

    if (configOption.charAt(i + 1) === '$') {
      parsedConfigOption += '$';
      i++;
      continue;
    }

    console.log("configOption contains unresolved token. Ignoring option.");
    return null;
  }
  eval("option =" + parsedConfigOption);
  console.log("configOption does not contain unresolved tokens. Using option.")
  return option;
}

module.exports = _parseOption;