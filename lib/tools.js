var api = {};
module.exports = api;

/**
 * Returns true if the given value is an Object.
 *
 * @param value the value to check.
 *
 * @return true if it is an Object, false if not.
 */
api.isObject = function(value) {
  return (Object.prototype.toString.call(value) === '[object Object]');
};

/**
 * Returns true if the given Object is empty.
 *
 * @param value the object to check.
 *
 * @return true if the Object is empty, false otherwise.
 */
api.isEmpty = function(object) {
  return !Object.keys(object).length;
};

/**
 * Clones a value. If the value is an array or an object it will be deep cloned.
 *
 * @param value the value to clone.
 *
 * @return the clone.
 */
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

/**
 * Generates a new v4 UUID.
 *
 * @return the new v4 UUID.
 */
api.uuid = function() {
  // taken from: https://gist.github.com/1308368
  /* jshint ignore:start */
  return (function(a,b) {
    for(b=a='';a++<36;b+=a*51&52?(a^15?8^Math.random()*(a^20?16:4):4)
      .toString(16):'-'){}return b;})();
  /* jshint ignore:end */
};
