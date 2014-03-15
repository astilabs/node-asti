var AstiError = require('./error')();
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
//    name: appName,
//    streams: [], //bunyan streams object
//    serializers: bunyan.stdSerializers
// }
// ```

module.exports = function(config) {
  if(!config) {
    throw new AstiError('ConfigNotProvided', 'node-asti.logger');
  }
  if(!config.name) {
    throw new AstiError('ConfigNameNotProvided', 'node-asti.logger');
  }
  if(!config.serializers) {
    config.serializers = bunyan.stdSerializers;
  }

  return bunyan.createLogger(config);
};
