var asti = require('../');
var should = require('should');

describe('node-asti.statsd', function() {
  var statsd;
  // statsD Metrics
  var config = {};
  config.statsd = {
    host: '162.209.78.81',
    port: 8125,
    enabled: true
  };
  config.statsd.prefix = 'node-asti.statsd';

  beforeEach(function() {
    statsd = asti.statsd(config);
  });

  describe('contructor', function() {
    it('should create a statsd object', function() {
      should.exist(statsd);
    });
  });
});
