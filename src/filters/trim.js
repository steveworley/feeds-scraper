/**
 * @file
 * Contains trim filter.
 */

module.exports = function(value) {
  if (typeof value != 'string') {
    return value;
  }
  
  return value
    .replace(/(\r|\r\n|\n)/gm, '')
    .replace(/(<!-- -->)/gm, '')
    .trim();
};
