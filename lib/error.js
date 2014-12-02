var util = require('util');

var _environment = 'development';

// api.init
// ----------------
//
// Sets the _environment
//
// __Parameters__
// * config: `Object` - _Object_

module.exports = init = function(config) {
  if (!config) {
    config = {};
  }
  _environment = config.environment || _environment;
  return YodlrError;
};

// YodlrError
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
// * YodlrError: `Object` - _Yodlr Error Object_

var YodlrError = function(message, type, details, cause) {
  Error.call(this, message);
  Error.captureStackTrace(this, this.constructor);
  this.name = type;
  this.message = message;
  this.details = details || null;
  this.cause = cause || null;
};
util.inherits(YodlrError, Error);
YodlrError.prototype.name = 'YodlrError';
YodlrError.prototype.toObject = function() {
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
    if(this.cause instanceof YodlrError) {
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