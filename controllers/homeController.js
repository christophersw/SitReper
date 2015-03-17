var express = require('express') 
  //, exphbs  = require('express-handlebars')
  //, bodyParser = require('body-parser')
  , config = require('../config.js')
  , getSlug = require('speakingurl')
  , validator = require('validator')
  //, messaging = require('./messaging/messaging')
  , sitReps = require('../models/sitRep')
  , accounts = require('../models/account');
  //, app = express();

function getIndex(req, res){
    res.render('home/index', {
      validationMessage: null,
      domain: config.main.domain
    });
}
module.exports.getIndex = getIndex;

function postIndex(req, res){
    var   data = req.body
        , name = data.proposedId
        , email = data.ownerEmail
        , slug = getSlug(name);
    
    //Validation.
    if(!validator.matches(name, '[a-zA-Z0-9\s]+')){
       res.render('home/index', {
        validationMessage: "Sorry, that name not allowed, please use only letters, numbers, and spaces.",
        domain: config.main.domain
      });
      return;
    }
    
    if(!validator.isEmail(email)){
      res.render('home/index', {
        validationMessage: "Sorry, that does not appear to be a valid email.",
        domain: config.main.domain
      });
      return;
    }
    
    
    if(sitReps.exists(slug)){
      res.render('home/index', {
        validationMessage: "Sorry, that name is already taken. Try something else.",
        domain: config.main.domain
      });
      return;
    } else {
      sitReps.create(name, email, function(err){
        if(err){
          
          //TODO - something more than simply log this...
          console.error(err.message);
          
          res.render('home/index', {
            validationMessage: "Oh No! Something bad happened on our end. :(",
            domain: config.main.domain
          });
        } else {
          res.render('home/sitRepCreated');
        }
      }); 
    }
}
module.exports.postIndex = postIndex;