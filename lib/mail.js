var YodlrError = require('./error')();
var emailTemplates = require('email-templates');
var nodemailer = require('nodemailer');

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
// config.send = true/false;
// config.service =  'SendGrid';
// config.transport = 'SMTP';
// config.connection = {user: 'user', password: 'xxxx'};
// config.templates = {path: 'templatesPath'};
// config.logger = logger; // node-yodlr logger object for logging (optional)
// ```

var Mail = function(config, callback) {
  if(!config.transport) {
    config.transport = 'SMTP';
  }
  if(!config.connection || !config.connection.user || !config.connection.password) {
    throw new YodlrError('ConfigMailConnectionNotProvided', 'node-yodlr.mail');
  }
  if(!config.templates || !config.templates.path) {
    throw new YodlrError('ConfigEmailTemplatesPathNotProvided', 'node-yodlr.mail');
  }
  if(config.logger) {
    this._logger = config.logger.child({widget_type: 'mail'});
  }
  this._canSend = config.send || false;

  // create smtp transport
  this._smtpTransport = nodemailer.createTransport({
    service: config.service || 'SendGrid',
    auth: {
      user: config.connection.user,
      pass: config.connection.password
    },
    //secureConnection: config.connection.ssl || true
  });

  emailTemplates(config.templates.path, {open: '{{', close: '}}'}, function(err, template) {
    if(err) {
      // TODO: this.emit('error');
      if(callback) {
        return callback(new YodlrError('EmailTemplatesError', 'node-yodlr.mail'));
      }
      else {
        throw new YodlrError('EmailTemplatesError', 'node-yodlr.mail');
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
// locals.from = 'fromEmail@email.com';
// locals.email = 'toEmail@email.com';
// locals.subject = 'emailSubject';
// // any other data used in the template
// ```

Mail.prototype.send = function send(template, locals, callback) {
  var mail = this;
  if(!template || typeof template !== 'string') {
    return callback(new YodlrError('EmailTemplateNotProvided', 'node-yodlr.mail'));
  }
  if(!locals || typeof locals !== 'object') {
    return callback(new YodlrError('EmailLocalsNotProvided', 'node-yodlr.mail'));
  }
  if(!locals.from || !locals.email || !locals.subject) {
    return callback(new YodlrError('EmailOptionsNotProvided', 'node-yodlr.mail'));
  }
  mail._templates(template, locals, function(err, html, text) {
    if(err) {
      return callback(new YodlrError('EmailTemplateError', 'node-yodlr.mail', err));
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
            return callback(new YodlrError('SendEmailError', 'node-yodlr.mail', err));
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
