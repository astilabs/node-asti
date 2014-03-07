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
//    statsd: {
//      host: hostname,
//      port: port number
//      prefix: prefix for stats
//    }
// }
// ```

module.exports = function(config) {
  if(config.statsd) {
    var metrics = new Lynx(config.statsd.host, config.statsd.port, {prefix: config.statsd.prefix});
    return metrics;
  }
};
