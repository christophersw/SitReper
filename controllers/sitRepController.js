var validator = require('validator')
  , accounts = require('../models/account')
  , sitReps = require('../models/sitRep')
  , passwords = require('../models/passwords')
  , _ = require('underscore');

function getSetup(req, res){
   var sitRepId = req.params.id;
   
   sitReps.get(sitRepId, function(err, sitRep) {
      if(err){
         //TODO handle Error
         throw new Error('Not Found!');
      } else {
         res.render('sitrep/setup', {
            email: req.query.email,
            sitRep:sitRep,
            validationMessage: null
         });
      }
   });
}
module.exports.getSetup = getSetup;

function postSetup(req, res){
   var  email = req.query.email
      , token = req.query.token
      , data = req.body
      , sitRepId = req.params.id
      , password = data.password
      , confirm = data.confirm;
   
   //Check that pass' match
   if(password !== confirm){
       sitReps.get(sitRepId, function(err, sitRep) {
         if(err){
            //TODO handle Error
            throw new Error('Not Found!');
         } else {
            res.render('sitrep/setup', {
               email: req.query.email,
               sitRep:sitRep,
               validationMessage: "Opps. Those password entries didn't match."
            });
            return;
         }
      });
      return;
   }
   
   if(!validator.isLength(password, 10, 200)){
      sitReps.get(sitRepId, function(err, sitRep) {
         if(err){
            //TODO handle Error
            throw new Error('Not Found!');
         } else {
            res.render('sitrep/setup', {
               email: req.query.email,
               sitRep:sitRep,
               validationMessage: "Opps. That password is too short. Try something longer. (10+)"
            });
            return;
         }
      });
      return;
   }
   
   //LookUp Account
   if(!sitReps.exists(sitRepId)){
      //TODO handle Error
      throw new Error('Not Found!');
   } else {
      sitReps.get(sitRepId, function(err, sitRep){
         if(err){
            //TODO handle Error
            throw err;
         } else {
            //Check that user exists, and is owner.
            if(_.contains(sitRep.owners, email)){
               accounts.get(email, sitRep.id, function(err, account){
                  if(err){
                     //TODO handle Error
                     throw err; 
                  } else {
                     //Check token
                     if(account.setupToken === token){
                        //Blank the token... 
                        account.setupToken = null;
                        
                        passwords.getHash(password, function(err, hashedPass){
                           if(err){
                              //TODO handle Error
                              throw err;
                           } else {
                              account.hashedPass = hashedPass;
                              accounts.replace(account, sitRepId, function(err){
                                 if(err){
                                    //TODO handle Error
                                    throw err;
                                 } else {
                                    //res.redirect('/sitrep/' + sitRepId);
                                 }
                              });
                           }
                        });
                     } else {
                        //TODO handle Error
                        throw new Error('Invalid Token.');
                     }
                  }
               });
            } else {
               //TODO handle Error
               throw new Error('Not a valid owner.');
            }
         }
      });
   }
}
module.exports.postSetup = postSetup;