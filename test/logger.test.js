var fs = require('fs');
var JSONStream = require('JSONStream');
var asti = require('../');
var should = require('should');
describe('node-asti.logger', function() {
  var log;
  var config = {};
  config = {
    name: 'node-asti.logger',
    streams: [
      {
        type: 'rotating-file',
        period: '1d',
        count: 1,
        level: 'info',
        path: 'node-asti.logger-info.log',
      },
      {
        type: 'rotating-file',
        period: '1d',
        count: 1,
        level: 'error',
        path: 'node-asti.logger-error.log',
      }
    ],
  };
  var fileInfo, fileError;

  beforeEach(function() {
    log = asti.logger(config);
  });
  after(function() {
    fs.unlink('node-asti.logger-info.log', function (err) {
      should.not.exist(err);
    });
    fs.unlink('node-asti.logger-error.log', function (err) {
      should.not.exist(err);
    });
  });

  describe('contructor', function() {
    it('should fail to create a logger without config', function() {
      (function(){
        asti.logger();
      }).should.throw('ConfigNotProvided');
    });

    it('should create a log with info type', function() {
      log.info('should create a log with info type');

      fileInfo = fs.createReadStream('node-asti.logger-info.log', {encoding: 'utf8'});
      fileInfo.pipe(JSONStream.parse()).on('data', function(data) {
        data.name.should.eql('node-asti.logger');
        data.level.should.eql(30);
        data.msg.should.eql('should create a log with info type');
      });
    });

    it('should create a log with error type', function() {
      log.error('should create a log with error type');

      fileError = fs.createReadStream('node-asti.logger-error.log', {encoding: 'utf8'});
      fileError.pipe(JSONStream.parse()).on('data', function(data) {
        data.name.should.eql('node-asti.logger');
        data.level.should.eql(50);
        data.msg.should.eql('should create a log with error type');
      });
    });

    it('should not log different log levels', function() {
      log.debug('should create a log with debug type');

      fileInfo = fs.createReadStream('node-asti.logger-info.log', {encoding: 'utf8'});
      fileInfo.pipe(JSONStream.parse()).on('data', function(data) {
        data.name.should.eql('node-asti.logger');
        data.level.should.should.not.eql(20);
        data.msg.should.not.eql('should create a log with debug type');
      });
    });

  });
});
