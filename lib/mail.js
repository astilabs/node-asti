var AstiError = require('./error')();
var async = require('async');
var emailTemplates = require('email-templates');
var nodemailer = require('nodemailer');

// email client
// var smtpTransport;
// var templates;

module.exports = function(config, callback) {
  return new Mail(config, callback);
};

// Mail()
// ----------------
//
// Initializes the mail module
//
// __Parameters__
// * config: `config` - _Object_
// * callback: `callback` - _Function_
//
// ```
// {
//    send: true/false,
//    service: 'SendGrid',
//    transport: 'SMTP',
//    connection: {user: 'user', password: 'xxxx'},
//    templates {path: 'templatesPath'}
// }
// ```

var Mail = function(config, callback) {
  if(!config.transport) {
    config.transport = 'SMTP';
  }
  if(!config.connection || !config.connection.user || !config.connection.password) {
    throw new AstiError('NoMailConnectionProvided', 'node-asti.mail');
  }
  if(!config.templates || !config.templates.path) {
    throw new AstiError('NoEmailTemplatesPathProvided', 'node-asti.mail');
  }
  if(config.logger) {
    this._logger = config.logger;
  }
  this._canSend = config.send || false;

  // create smtp transport
  this._smtpTransport = nodemailer.createTransport(config.transport, {
    service: config.service || 'SendGrid',
    auth: {
      user: config.connection.user,
      pass: config.connection.password
    },
    //secureConnection: config.connection.ssl || true
  });

  emailTemplates(__dirname+config.templates.path, {open: '{{', close: '}}'}, function(err, template) {
    if(err) {
      // TODO: this.emit('error');
      if(callback) {
        callback(new AstiError('EmailTemplatesError', 'node-asti.mail'));
      }
      else {
        throw new AstiError('EmailTemplatesError', 'node-asti.mail');
      }
    }
    this._templates = template;
    if(callback) {
      callback(null);
    }
  }.bind(this));
};
Mail.prototype.name = 'mail';

// Mail.send
// ----------------
//
// Sends mail using template.
//
// __Parameters__
// * template: `templateName` - _String_
// * locals: `locals` - _Object_
// * callback: `callback` - _Function_
//
// ```
// {
//    from: 'fromEmail@email.com',
//    email: 'toEmail@email.com',
//    subject: 'emailSubject'
//    ...: data used for template
// }
// ```

Mail.prototype.send = function send(template, locals, callback) {
  var mail = this;
  if(!template || typeof template !== 'string') {
    return callback(new AstiError('NoEmailTemplateProvided', 'node-asti.mail'));
  }
  if(!locals || typeof locals !== 'object') {
    return callback(new AstiError('NoEmailLocalsProvided', 'node-asti.mail'));
  }
  if(!locals.from || !locals.email || !locals.subject) {
    return callback(new AstiError('NoEmailOptionsProvided', 'node-asti.mail'));
  }
  mail._templates(template, locals, function(err, html, text) {
    if(err) {
      callback(new AstiError('EmailTemplateError', 'node-asti.mail', err));
    }
    else {
      var mailOptions = {
        from: locals.from,
        to: locals.email,
        subject: locals.subject,
        text: text
      };
      if(mail._canSend) {
        mail._smtpTransport.sendMail(mailOptions, function(err, responseStatus) {
          if(err) {
            return callback(new AstiError('SendEmailError', 'node-asti.mail', err));
          }
          else {
            mail._log(responseStatus.message, 'Email Sent');
            callback(null, responseStatus.message);
          }
        });
      }
      else {
        mail._log(mailOptions, 'Log email, not sending.');
        callback(null);
      }
    }
  });
};

Mail.prototype._log = function(obj, msg) {
  if(this._logger) {
    this._logger.debug(obj, msg);
  }
};