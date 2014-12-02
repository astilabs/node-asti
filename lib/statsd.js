var YodlrError = require('./error')();
var Lynx = require('lynx');

// Constructor
// ----------------
//
// Returns the statsd object
//
// __Parameters__
// * config: `config` - _Object_
//
// ```
// config.host = hostname;
// config.port = port number;
// config.prefix = prefix for stats;
// ```

module.exports = function(config) {
  if(!config) {
    throw new YodlrError('ConfigNotProvided', 'node-yodlr.statsd');
  }
  if(!config.host) {
    throw new YodlrError('ConfigHostNotProvided', 'node-yodlr.statsd');
  }
  if(!config.port) {
    throw new YodlrError('ConfigPortNotProvided', 'node-yodlr.statsd');
  }
  if(!config.prefix) {
    throw new YodlrError('ConfigPrefixNotProvided', 'node-yodlr.statsd');
  }

  return new Lynx(config.host, config.port, {prefix: config.prefix});
};
