/**
 * @file
 * Date filter for scraping for feeds imports.
 */
var moment = require('moment');

module.exports = function(value, from, to) {
  return moment(value, from).format(to);
}
