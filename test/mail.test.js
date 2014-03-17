var asti = require('../');
var should = require('should');

describe('node-asti.mail', function() {
  var mail;
  var config = {};
  config = {};
  config.service = 'SendGrid';
  config.templates = {};
  config.templates.path = '/../test/email-templates';
  config.connection = {
    host: 'smtp.sendgrid.net',
    user: 'fakeUser',
    password: 'fakePass',
    ssl: true,
    timeout: 30
  };
  config.send = false;
  var locals = {
    supportDomain: 'labs.asti-usa.com',
    serviceName: 'Node-ASTi',
    email: 'dev@labs.asti-usa.com',
    from: 'dev@labs.asti-usa.com',
    subject: 'mail.test'
  };
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
  config.logger = log;

  describe('contructor', function() {
    it('should fail to initialize without connection', function(done) {
      var settings = {};

      (function(){
        mail = asti.mail(settings);
      }).should.throw('NoMailConnectionProvided');
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
        mail = asti.mail(settings);
      }).should.throw('NoEmailTemplatesPathProvided');
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

      mail = asti.mail(settings, function(err) {
        should.exist(err);
        err.message.should.eql('EmailTemplatesError');
        done();
      });
    });

    it('should initialize', function(done) {
      mail = asti.mail(config, function(err) {
        should.not.exist(err);
        done();
      });
    });
  });
  describe('api.send', function() {
    it('should fail to send email without template', function(done) {
      mail = asti.mail(config, function() {
        mail.send('', locals, function(err) {
          should.exist(err);
          err.message.should.eql('NoEmailTemplateProvided');
          done();
        });
      });
    });

    it('should fail to send email with inexistant template', function(done) {
      mail = asti.mail(config, function() {
        mail.send('node-asti.mail.noTemplate', locals, function(err) {
          should.exist(err);
          err.message.should.eql('EmailTemplateError');
          done();
        });
      });
    });

    it('should fail to send email without locals', function(done) {
      mail = asti.mail(config, function() {
        mail.send('node-asti.mail.test', '', function(err) {
          should.exist(err);
          err.message.should.eql('NoEmailLocalsProvided');
          done();
        });
      });
    });

    it('should fail to send email without mail options', function(done) {
      var mailOptions = {};
      mail = asti.mail(config, function() {
        mail.send('node-asti.mail.test', mailOptions, function(err) {
          should.exist(err);
          err.message.should.eql('NoEmailOptionsProvided');
          done();
        });
      });
    });

    it('should send an email', function(done) {
      mail = asti.mail(config, function() {
        mail.send('node-asti.mail.test', locals, function(err) {
          should.not.exist(err);
          done();
        });
      });
    });
  });
});
