var YodlrError = require('./error')();
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
// config.name = appName;
// config.streams = []; //bunyan streams object
// config.serializers = bunyan.stdSerializers;
// ```

module.exports = function(config) {
  if(!config) {
    throw new YodlrError('ConfigNotProvided', 'node-yodlr.logger');
  }
  if(!config.name) {
    throw new YodlrError('ConfigNameNotProvided', 'node-yodlr.logger');
  }
  if(!config.serializers) {
    config.serializers = bunyan.stdSerializers;
  }

  return bunyan.createLogger(config);
};
