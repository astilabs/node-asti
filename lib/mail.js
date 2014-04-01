var AstiError = require('./error')();
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
// config.logger = logger; // node-asti logger object for logging (optional)
// ```

var Mail = function(config, callback) {
  if(!config.transport) {
    config.transport = 'SMTP';
  }
  if(!config.connection || !config.connection.user || !config.connection.password) {
    throw new AstiError('ConfigMailConnectionNotProvided', 'node-asti.mail');
  }
  if(!config.templates || !config.templates.path) {
    throw new AstiError('ConfigEmailTemplatesPathNotProvided', 'node-asti.mail');
  }
  if(config.logger) {
    this._logger = config.logger.child({widget_type: 'mail'});
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

  emailTemplates(config.templates.path, {open: '{{', close: '}}'}, function(err, template) {
    if(err) {
      // TODO: this.emit('error');
      if(callback) {
        return callback(new AstiError('EmailTemplatesError', 'node-asti.mail'));
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
// locals.from = 'fromEmail@email.com';
// locals.email = 'toEmail@email.com';
// locals.subject = 'emailSubject';
// // any other data used in the template
// ```

Mail.prototype.send = function send(template, locals, callback) {
  var mail = this;
  if(!template || typeof template !== 'string') {
    return callback(new AstiError('EmailTemplateNotProvided', 'node-asti.mail'));
  }
  if(!locals || typeof locals !== 'object') {
    return callback(new AstiError('EmailLocalsNotProvided', 'node-asti.mail'));
  }
  if(!locals.from || !locals.email || !locals.subject) {
    return callback(new AstiError('EmailOptionsNotProvided', 'node-asti.mail'));
  }
  mail._templates(template, locals, function(err, html, text) {
    if(err) {
      return callback(new AstiError('EmailTemplateError', 'node-asti.mail', err));
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
