var yodlr = require('../');
var should = require('should');

describe('node-yodlr.statsd', function() {
  var statsd;
  var timer;
  var config = {};
  config = {
    host: 'localhost',
    port: 80,
    prefix: 'node-yodlr.statsd'
  };

  beforeEach(function() {
    statsd = yodlr.statsd(config);
  });

  describe('contructor', function() {
    it('should fail to create statsd object with no config', function() {
      (function(){
        yodlr.statsd();
      }).should.throw('ConfigNotProvided');
    });

    it('should create a statsd object', function() {
      should.exist(statsd);
      should.exist(statsd.createTimer);
      should.exist(statsd.increment);
      should.exist(statsd.decrement);
      should.exist(statsd.gauge);
      should.exist(statsd.set);
    });

    it('should create a timer', function() {
      timer = statsd.createTimer('node-yodlr.statsd.timer');
      should.exist(timer);
      should.exist(timer.stop);
    });
  });
});
