var validator = require('validator')
  , accounts = require('../models/account')
  , sitReps = require('../models/sitRep')
  , _ = require('underscore');

function getSetup(req, res){
   var  sitRepId = req.params.id
      , token = token = req.query.token;
   
   sitReps.get(sitRepId, function(err, sitRep) {
      if(err){
         res.send(404);
      } else {
         
         // If this is already created, then the token on the sitRep will be null.
         if(sitRep.setupToken === null){
            res.redirect('/sitRep/' + sitRep.id);
            return;
         }
         
         // Does token match?
         if(!sitRep.setupToken === token){
            res.send(404);
         } else {
            sitRep.setupToken = null;
            
            sitReps.replace(sitRep, function(err){
               if(err){
                  // TODO handle error
                  res.send(500);
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
   var  sitRepId = req.params.id;
   
   sitReps.get(sitRepId, function(err, sitRep) {
      if(err){
         res.send(404);
      } else {
         // If this is not activated we can't continue.
         if(sitRep.setupToken !== null){
            res.render('sitrep/notActivated');
         } else {
            res.render('sitrep/index', {layout:'sitrep', data: sitRep});
         }
      }   
   });
}
module.exports.getSitRep = getSitRep;