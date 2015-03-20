var   validator = require('validator')
    , uuid = require('uuid')
    , hbs  = require('express-handlebars').create()
    , getSlug = require('speakingurl')
    , context = require('../contexts/sitRepFileContext')
    , messaging  = require('../messaging/messaging')
    , accounts = require('./account')
    , config = require('../config');

function sitRep(){
    this.name = null;
    this.id = null;
    this.owners = [];
    this.setupToken = null;
    return this;
}

/*
    Create a new sitRep
*/
function create(name, ownerEmail, password, callback){
    var newSitRep = new sitRep();
    
    newSitRep.name = name;
    newSitRep.id = getSlug(name);
    newSitRep.setupToken = uuid.v4();
    
    // Cannot create if name conflict exists. 
    if(exists(newSitRep.id)){
        callback(new Error('A sitRep with that id already exists.'));
    } else {
        
        //Process for creating with new SitRep & New Users, all at once.
        accounts.create(ownerEmail, newSitRep.id, password, function(err, ownerAccount){
            if(err){
                callback(err);
            } else {
                newSitRep.owners.push(ownerAccount.email);
                
                // Save to HD
                context.create(newSitRep, function(err){
                    if(err){
                        callback(err);
                    } else {
                        // Send the Email
                        SendNewSitRepEmail(newSitRep, ownerAccount, function(err){
                            if(err){
                                callback(err);
                            } else {
                                callback(null, newSitRep);   
                            }
                        });
                    }
                });
            }
        });
    }
}
module.exports.create = create;

/*
    Gets a sitRep model from the context, looking it up by id. 
*/
function get(id, callback){
    context.getById(id, function(err, sitRep){
        if(err){
            callback(err);
        } else {
            callback(null, sitRep);
        }
    });
}
module.exports.get = get;

/*
    Replaces a sitRep with a new one.
*/
function replace(sitRep, callback){
    if(!context.exists(sitRep.id)){
        callback(new Error('SitRep does not exist. You cannot replace something that doesnt exist. please use create.'));
    } else {
        context.replace(sitRep, callback);
    } 
}
module.exports.replace = replace;

/*
    Replaces a sitRep with a new one.
*/
function exists(sitRepId){
    return context.exists(sitRepId);
}
module.exports.exists = exists;

/*
    Sends a new account email after creating both a new SitRep and NewAccount
*/
function SendNewSitRepEmail(sitRep, ownerAccount, callback){
    var link = config.main.domain + '/sitrep/' + sitRep.id + '/setup?email=' + ownerAccount.email + '&token=' + sitRep.setupToken;
            hbs.render('./views/emails/newSitRep.handlebars',
                        {
                            sitRep: sitRep,
                            link: link
                        }).done( 
                        function(html) {
                            var email = new messaging.email({
                                            to: 'NoReply@' + config.email.options.domain,
                                            from:  ownerAccount.email,
                                            subject: 'New SitRep Created',
                                            text: 'A new SitRep has been created, visit this link to view:' + link,
                                            html: html 
                                        });
                            email.send(function(err){
                                if(err){
                                    callback(err);
                                } else {
                                    callback(null);
                                }
                            });
                        });
}

