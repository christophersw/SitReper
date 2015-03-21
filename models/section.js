var uuid = require('uuid')
  , context = require('../contexts/sectionFileContext')
  , sitreps = require('../models/sitRep');

/*
 *   Section model
 */
function section (){
    this.id = null;
    this.sitRepId = null;
    this.updates = [];
    return this;
}
module.exports.section = section;

/*
    Create a new section.
*/
function create(sitRepId, initialUpdate, callback){
    var newSection = new section();
    
    newSection.id = uuid.v1();
    newSection.updates.push(initialUpdate);
    
    sitreps.get(sitRepId, function(err, sitRep){
        if(err){
            callback(err);
        } else {
            // Add this section to SitRep. 
            sitRep.sections.push(newSection);
            
            //Save SitRep
            sitreps.replace(sitRep, function(err, callback){
                if(err){
                    callback(err);
                } else {
                    // Save Section
                    context.create(newSection, sitRepId, function(err){
                        if(err){
                            callback(err);
                        } else {
                            callback(null, newSection);
                        }
                    });
                }
            });
        }
    });
}
module.exports.create = create;

/*
    Get an existing section.
*/
function get(sectionId, sitRepId, callback){
    context.getById(sectionId, sitRepId, function(err, section){
        if(err){
            callback(err);
        } else {
            callback(null, section);
        }
    });
}
module.exports.get = get;

/*
    Replace an existing section.
*/
function replace(section, sitRepId, callback){
    context.replace(section, sitRepId, function(err){
        if(err){
            callback(err);
        } else {
            callback(null);
        }
    });
}
module.exports.replace = replace;