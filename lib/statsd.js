var AstiError = require('./error')();
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
// {
//    host: hostname,
//    port: port number
//    prefix: prefix for stats
// }
// ```

module.exports = function(config) {
  if(!config) {
    throw new AstiError('ConfigNotProvided', 'node-asti.statsd');
  }
  if(!config.host) {
    throw new AstiError('ConfigHostNotProvided', 'node-asti.statsd');
  }
  if(!config.port) {
    throw new AstiError('ConfigPortNotProvided', 'node-asti.statsd');
  }
  if(!config.prefix) {
    throw new AstiError('ConfigPrefixNotProvided', 'node-asti.statsd');
  }

  return new Lynx(config.host, config.port, {prefix: config.prefix});
};
