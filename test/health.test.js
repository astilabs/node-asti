var asti = require('../');
var should = require('should');

describe('node-asti.health', function() {
  var health;
  beforeEach(function() {
    health = asti.health;
  });

  describe('contructor', function() {
    it('should create a health object', function() {
      should.exist(health);
    });
  });

  describe('toobusy', function() {
    it('should have a toobusy object', function() {
      should.exist(health.toobusy);
    });
  });

});