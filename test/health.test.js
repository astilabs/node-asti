var yodlr = require('../');
var should = require('should');

describe('node-yodlr.health', function() {
  var health;
  var statsd;

  var statsConfig = {
    host: 'localhost',
    port: 80,
    prefix: 'node-yodlr.health'
  };
  statsd = yodlr.statsd(statsConfig);
  var logger = {
    name: 'node-yodlr.mail',
    streams: [
      {
      level: 'debug',
      stream: process.stdout
      }
    ],
  };
  var log = yodlr.logger(logger);
  var config = {
    statsd: statsd,
    logger: log
  };

  describe('contructor', function() {
    it('should fail to create health object without config', function() {
      (function(){
        yodlr.health();
      }).should.throw('ConfigNotProvided');
    });

    it('should fail to create health object without stats', function() {
      var opts = {};
      (function(){
        yodlr.health(opts);
      }).should.throw('ConfigStatsdNotProvided');
    });

    it('should create a health object', function() {
      (function(){
        health = yodlr.health(config);
      }).should.not.throw();
    });
  });

  describe('toobusy', function() {
    it('should be able to stop toobusy', function() {
      (function(){
        health = yodlr.health(config);
        health.stopMonitoring();
      }).should.not.throw();
    });
  });

});