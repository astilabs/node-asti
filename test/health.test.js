var asti = require('../');
var should = require('should');

describe('node-asti.health', function() {
  var health;
  var statsd;

  var statsConfig = {
    host: 'localhost',
    port: 80,
    prefix: 'node-asti.health'
  };
  statsd = asti.statsd(statsConfig);
  var logger = {
    name: 'node-asti.mail',
    streams: [
      {
      level: 'debug',
      stream: process.stdout
      }
    ],
  };
  var log = asti.logger(logger);
  var config = {
    statsd: statsd,
    logger: log
  };

  describe('contructor', function() {
    it('should fail to create health object without config', function() {
      (function(){
        asti.health();
      }).should.throw('ConfigNotProvided');
    });

    it('should fail to create health object without stats', function() {
      var opts = {};
      (function(){
        asti.health(opts);
      }).should.throw('ConfigStatsdNotProvided');
    });

    it('should create a health object', function() {
      (function(){
        health = asti.health(config);
      }).should.not.throw();
    });
  });

  describe('toobusy', function() {
    it('should be able to stop toobusy', function() {
      (function(){
        health = asti.health(config);
        health.stopMonitoring();
      }).should.not.throw();
    });
  });

});