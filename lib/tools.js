var os = require('os');
var api = {};
module.exports = api;

// api.isObject
// ----------------
//
// Returns true if the given value is an Object.
//
// __Parameters__
// * object: `Object` - _Object_
//
// __Return__
// * value: `true/false` - _Boolean_

api.isObject = function(value) {
  return (Object.prototype.toString.call(value) === '[object Object]');
};

// api.isEmpty
// ----------------
//
// Returns true if the given Object is empty.
//
// __Parameters__
// * object: `Object` - _Object_
//
// __Return__
// * value: `true/false` - _Boolean_

api.isEmpty = function(object) {
  return !Object.keys(object).length;
};

// api.clone
// ----------------
//
// Returns a clone of a value. If the value is an Array or Object, it will be deep cloned.
//
// __Parameters__
// * value: `Number/String/Object` - _Number/String/Object_
//
// __Return__
// * value: `Number/String/Object` - _Number/String/Object_

api.clone = function(value) {
  var rval;
  if(Array.isArray(value)) {
    rval = [];
    value.forEach(function(e) {
      rval.push(api.clone(e));
    });
  }
  else if(api.isObject(value)) {
    rval = {};
    Object.keys(value).forEach(function(name) {
      rval[name] = api.clone(value[name]);
    });
  }
  else {
    rval = value;
  }
  return rval;
};

// api.uuid
// ----------------
//
// Returns a generated v4 UUID.
//
// __Parameters__
// * object: `Array/Object` - _Array or Object_
//
// __Return__
// * uuid: `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx` - _String_

api.uuid = function() {
  // taken from: https://gist.github.com/1308368
  /* jshint ignore:start */
  return (function(a,b) {
    for(b=a='';a++<36;b+=a*51&52?(a^15?8^Math.random()*(a^20?16:4):4)
      .toString(16):'-'){}return b;})();
  /* jshint ignore:end */
};


api.getDatacenter = function getDatacenter() {
  var hostname = os.hostname();
  var dataCenter = hostname.split('-')[1].split('.')[0];
  return dataCenter;
};

api.getNode = function getNode() {
  var hostname = os.hostname();
  var node = hostname.split('-')[0];
  return node;
};
