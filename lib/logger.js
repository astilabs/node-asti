var bunyan = require('bunyan');

// Constructor
// ----------------
//
// Returns the logger object
//
// __Parameters__
// * config: `config` - _Object_
//
// ```
// {
//    logger: {
//      name: appName,
//      streams: [], //bunyan streams object
//      serializers: bunyan.stdSerializers
//    }
// }
// ```

module.exports = function(config) {
  if(config.logger) {
    if(!config.logger.serializers) {
      config.logger.serializers = bunyan.stdSerializers;
    }
    var log = bunyan.createLogger(config.logger);
    return log;
  }
};
