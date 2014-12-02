var yodlr = require('../');
var assert = require('assert');
var should = require('should');
describe('node-yodlr.tools', function() {

  describe('api.isObject', function() {

    var isObject = yodlr.tools.isObject;
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

    it('should return false if input is number', function() {
      assert(!isObject(55));
    });
  });

  describe('api.isEmpty', function() {
    var isEmpty = yodlr.tools.isEmpty;
    it('should return true if object is empty', function() {
      assert(isEmpty({}));
    });

    it('should return false if object is not empty', function() {
      assert(!isEmpty({me: 'hello'}));
    });

    it('should return true if array is empty', function() {
      assert(isEmpty([]));
    });

    it('should return false if array is not empty', function() {
      assert(!isEmpty([5]));
    });

  });

  describe('api.clone', function() {
    var clone = yodlr.tools.clone;

    var obj, obj2, num, str;

    beforeEach(function() {
      num = 5;
      str = 'hello world';
      obj2 = { str: str };
      obj = {
        num: num,
        obj2: obj2
      };
    });

    it('should copy number', function() {
      var test = clone(num);
      test.should.eql(num);
      num = 6;
      test.should.not.eql(num);
    });

    it('should copy string', function() {
      var test = clone(str);
      test.should.eql(str);
      str = 'how are you?';
      test.should.not.eql(str);
    });

    it('should copy object', function() {
      var test = clone(obj);
      test.should.eql(obj);
    });

    it('object should not be the same object', function() {
      var test = clone(obj);
      assert(test !== obj);
    });

    it('object should have property be equal', function() {
      var test = clone(obj);
      test.num.should.eql(obj.num);
    });

    it('object should have property that doesnt change', function() {
      var test = clone(obj);
      test.num.should.eql(obj.num);
      obj.num = 6;
      test.num.should.not.eql(obj.num);
    });

    it('should do a deep copy of object', function() {
      var test = clone(obj);
      test.obj2.should.eql(obj.obj2);
    });

    it('sub obj should not be the same object', function() {
      var test = clone(obj);
      assert(test.obj2 !== obj.ojb2);
    });

  });

  describe('api.uuid', function() {
    var uuid = yodlr.tools.uuid;
    it('should generate a uuid', function() {
      should.exist(uuid());
    });

    it('should be a string', function() {
      should(typeof uuid() === 'string').be.ok;
    });
  });

});
