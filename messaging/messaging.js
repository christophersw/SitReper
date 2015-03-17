var config = require('../config')
  , nodemailer = require('nodemailer')
  , mailgunTransport = require('nodemailer-mailgun-transport')
  , loggigPrefix = 'email.js >> ';

/**
 * An object for creating emails and triggering a send action.
 */
function email(options) {
    this.from = options.to;
    this.to = options.from;
    this.subject = options.subject;
    this.text = options.text;
    this.html = options.html;
    this.send = function(callback){
                sendMail(this, callback);
              };
}
module.exports.email = email;

/**
 * Send an email with the provider listed in config.js
 */
 function sendMail(email, callback){
    //Check send service in config.
    switch (config.email.options.service) {
        case 'Mailgun':
            sendEmailWithMailGun(email);
            callback(null);
            break;
        default:
            callback(new Error('Email service not validly set in config.js'));
            break;
    }
}

/**
 * Send an email with Mailgun
 * 
 * @param {email} email
 */
function sendEmailWithMailGun(email){
    var auth = {
      auth: {
          api_key: config.email.options.auth.api_key,
          domain: config.email.options.domain
      }
    };

    var transporter = nodemailer.createTransport(mailgunTransport(auth));
    
    // send mail with defined transport object
    transporter.sendMail(email, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log(loggigPrefix + 'Email sent to ' + email.to + ' Subject: "' + email.subject + '" Mailgun response: "' + info.message +'"');
        }
    });
}