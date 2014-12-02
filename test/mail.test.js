var yodlr = require('../');
var should = require('should');

describe('node-yodlr.mail', function() {
  var mail;
  var config = {};
  config = {};
  config.service = 'SendGrid';
  config.templates = {};
  config.templates.path = __dirname+'/email-templates';
  config.connection = {
    host: 'smtp.sendgrid.net',
    user: 'fakeUser',
    password: 'fakePass',
    ssl: true,
    timeout: 30
  };
  config.send = false;
  var locals = {
    supportDomain: 'getyodlr.com',
    serviceName: 'node-yodlr',
    email: 'dev@getyodlr.com',
    from: 'dev@getyodlr.com',
    subject: 'mail.test'
  };
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
  config.logger = log;

  describe('contructor', function() {
    it('should fail to initialize without connection', function(done) {
      var settings = {};

      (function(){
        mail = yodlr.mail(settings);
      }).should.throw('ConfigMailConnectionNotProvided');
      done();
    });

    it('should fail to initialize without templates path', function(done) {
      var settings = {};
      settings.connection = {
        host: 'smtp.sendgrid.net',
        user: 'fakeUser',
        password: 'fakePass',
        ssl: true,
        timeout: 30
      };
      settings.templates = {};

      (function(){
        mail = yodlr.mail(settings);
      }).should.throw('ConfigEmailTemplatesPathNotProvided');
      done();
    });

    it('should fail to initialize with incorrect templates path', function(done) {
      var settings = {};
      settings.connection = {
        host: 'smtp.sendgrid.net',
        user: 'fakeUser',
        password: 'fakePass',
        ssl: true,
        timeout: 30
      };
      settings.templates = {};
      settings.templates.path = '/../test/email-templatesError';

      mail = yodlr.mail(settings, function(err) {
        should.exist(err);
        err.message.should.eql('EmailTemplatesError');
        done();
      });
    });

    it('should initialize', function(done) {
      mail = yodlr.mail(config, function(err) {
        should.not.exist(err);
        done();
      });
    });
  });
  describe('api.send', function() {
    it('should fail to send email without template', function(done) {
      mail = yodlr.mail(config, function() {
        mail.send('', locals, function(err) {
          should.exist(err);
          err.message.should.eql('EmailTemplateNotProvided');
          done();
        });
      });
    });

    it('should fail to send email with inexistant template', function(done) {
      mail = yodlr.mail(config, function() {
        mail.send('node-yodlr.mail.noTemplate', locals, function(err) {
          should.exist(err);
          err.message.should.eql('EmailTemplateError');
          done();
        });
      });
    });

    it('should fail to send email without locals', function(done) {
      mail = yodlr.mail(config, function() {
        mail.send('node-yodlr.mail.test', '', function(err) {
          should.exist(err);
          err.message.should.eql('EmailLocalsNotProvided');
          done();
        });
      });
    });

    it('should fail to send email without mail options', function(done) {
      var mailOptions = {};
      mail = yodlr.mail(config, function() {
        mail.send('node-yodlr.mail.test', mailOptions, function(err) {
          should.exist(err);
          err.message.should.eql('EmailOptionsNotProvided');
          done();
        });
      });
    });

    it('should send an email', function(done) {
      mail = yodlr.mail(config, function() {
        mail.send('node-yodlr.mail.test', locals, function(err) {
          should.not.exist(err);
          done();
        });
      });
    });
  });
});
