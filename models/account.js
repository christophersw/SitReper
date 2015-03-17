var   validator = require('validator')
    , uuid = require('uuid')
    , hbs  = require('express-handlebars').create()
    , context = require('../contexts/accountFileContext')
    , messaging  = require('../messaging/messaging')
    , config = require('../config')
    , passwords = require('../models/passwords');

/*
 *   Account Model
 */
function account (){
    this.email = null;
    this.hashedPass = null;
    this.sitRepId = null;
    return this;
}

/*
    Get an account, by providing an email.
*/
function get(email, sitRepId, callback){
    context.getById(email, sitRepId, function(err, account){
        if(err){
            callback(err);
        } else {
            callback(null, account);
        }
    });
}
module.exports.get = get;

/*
    Replaces an account with new model.
*/
function replace(account, sitRepId, callback){
    context.replace(account, sitRepId, function(err){
        if(err){
            callback(err);
        } else {
            callback(null);
        }
    });
}
module.exports.replace = replace;

/* 
    Create a new account
*/
function create (email, sitRepId, password, callback){
    if(validator.isEmail(email)){
        
        var newAccount = new account();
        newAccount.email = email;
        newAccount.sitRepId = sitRepId;
        
        passwords.getHash(password, function(err, hashedPass){
            if(err){
                callback(err);
            } else {
                newAccount.hashedPass = hashedPass;
                context.create(newAccount, sitRepId, function(err){
                    if(err){
                        callback(err);
                    } else {
                        callback(null, newAccount);
                    }
                });
            }
        });
    } else {
        callback(new Error('not a valid email'));
    }
}
module.exports.create = create;