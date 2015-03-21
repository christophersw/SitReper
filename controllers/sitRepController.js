var validator = require('validator')
  , accounts = require('../models/account')
  , sitReps = require('../models/sitRep')
  , passwords = require('../models/passwords')
  , auth = require('basic-auth')
  , _ = require('underscore');

function getSetup(req, res){
   var  sitRepId = req.params.id
      , token = token = req.query.token;
   
   sitReps.get(sitRepId, function(err, sitRep) {
      if(err){
         res.sendStatus(404);
      } else {
         
         // If this is already created, then the token on the sitRep will be null.
         if(sitRep.setupToken === null){
            res.redirect('/sitRep/' + sitRep.id);
            return;
         }
         
         // Does token match?
         if(!sitRep.setupToken === token){
            res.sendStatus(404);
         } else {
            sitRep.setupToken = null;
            
            sitReps.replace(sitRep, function(err){
               if(err){
                  // TODO handle error
                  res.sendStatus(500);
               } else {
                  res.redirect('/sitRep/' + sitRep.id);
               }
            });
         }
      }
   });
}
module.exports.getSetup = getSetup;

function getSitRep(req, res){
   var  sitRepId = req.params.id
      , login = req.query.login
      , user = auth(req);
   
   sitReps.get(sitRepId, function(err, sitRep) {
      if(err){
         res.sendStatus(404);
      } else {
         // If this is not activated we can't continue.
         if(sitRep.setupToken !== null){
            res.render('sitrep/notActivated');
         } else if(login == 'true'){
               // Request indicated they want to login, but haven't
               if(typeof user == 'undefined'){
                  res.set({
                     'WWW-Authenticate': 'Basic'
                  });
                  res.sendStatus(401);
                  return;
               } else {
                  isAuthorized(sitRepId, user, function(err, authorized){
                     if(err){
                        // TODO: Something with this error
                        res.sendStatus(500);
                     } else {
                        //Logged In Render
                        if(authorized){
                           res.render('sitrep/index', {
                              layout: 'sitrep',
                              sitRep: sitRep, 
                              user: user.name
                           });
                        } else {
                           res.set({
                              'WWW-Authenticate': 'Basic'
                           });
                           res.sendStatus(401);
                           return;
                        }
                     }
                  });
               }
            } else {
               res.render('sitrep/index', {
                  layout:'sitrep',
                  sitRep: sitRep, 
                  user: null
               });
               return;
            }
      }
   });
}
module.exports.getSitRep = getSitRep;

function isAuthorized(sitRepId, user, callback){
   
   //Is this a valid sitRep?
    sitReps.get(sitRepId, function(err, sitRep) {
      if(err){
         callback(err);
      } else {
         // Is the account in question associated with sitRep?
         if(_.contains(sitRep.owners, user.name)){
            //Check the password
            accounts.get(user.name, sitRep.id, function(err, account){
               if(err){
                  callback(err);
               } else {
                  passwords.checkPass(user.pass, account.hashedPass, function(err, matches){
                     if(err){
                       callback(err);
                     } else {
                        if(matches){
                          callback(null, true);
                        } else {
                          callback(null, false);
                        }
                     }
                  });
               }
            });
         } else {
            callback(null, false);
         }
      }   
   });
}

function unauthorized(res){
  
}