var asti = require('../');
var assert = require('assert');
describe('node-asti.tools', function() {

  describe('api.isObject', function() {

    var isObject = asti.tools.isObject;
    it('should return true if input is object', function() {
      assert(isObject({}));
    });

    it('should return false if input is null', function() {
      assert(!isObject(null));
    });

    it('should return false if input is undefined', function() {
      assert(!isObject(undefined));
    });

    it('should return false if input is string', function() {
      assert(!isObject('hello there!'));
    });

  });

});
