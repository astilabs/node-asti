var util = require('util');

var api = {};
module.exports = api;

var _environment = 'development';

// api.init
// ----------------
//
// Sets the _environment
//
// __Parameters__
// * config: `Object` - _Object_

api.init = function(config) {
  _environment = config.environment || _environment;
};

// api.AstiError
// ----------------
//
// Sets the _environment
//
// __Parameters__
// * message: `String` - _String_
// * type: `String` - _String_
// * details: `Object` - _Object_
// * cause: `Object` - _Object_
//
// __Return__
// * AstiError: `Object` - _Asti Error Object_

api.AstiError = function(message, type, details, cause) {
  Error.call(this, message);
  Error.captureStackTrace(this, this.constructor);
  this.name = type;
  this.message = message;
  this.details = details || null;
  this.cause = cause || null;
};
util.inherits(api.AstiError, Error);
api.AstiError.prototype.name = 'AstiError';
api.AstiError.prototype.toObject = function() {
  console.log('in toObject');
  var rval = {
    message: this.message,
    type: this.name,
    details: this.details,
    cause: null
  };
  if(_environment === 'development') {
    rval.stack = this.stack;
  }
  if(this.cause) {
    if(this.cause instanceof api.AstiError) {
      rval.cause = this.cause.toObject();
    }
    else {
      rval.cause = {
        message: this.cause.message,
        type: this.cause.name,
        details: {
          inspect: util.inspect(this.cause, false, 10)
        }
      };
      if(_environment === 'development') {
        rval.cause.stack = this.cause.stack;
      }
    }
  }
  return rval;
};