var uuid = require('uuid')
  , context = require('../contexts/updateFileContext')
  , sections = require('../models/sections');

/*
    Update Model
*/
function update(){
    this.id = null;
    this.heading = null;
    this.content = null;
    this.sitRepId = null;
    this.sectionId = null;
    this.authorId = null;
    this.timestamp = null;
    return this;
}
module.exports.update = update;

function create(sitRepId, sectionId, authorId, heading, content, callback){
    var newUpdate = new update();
    
    newUpdate.id = uuid.v1();
    newUpdate.timestamp = new Date().getTime();
    newUpdate.authorId = authorId;
    newUpdate.sitRepId = sitRepId;
    newUpdate.sectionId = sectionId;
    newUpdate.heading = heading;
    newUpdate.content = content;
    
    // Add Update to Section. 
    sections.get(newUpdate.sectionId, newUpdate.sitRepId, function(err, section){
        if(err){
            callback(err);
        } else {
            section.updates.push(newUpdate);
            sections.replace(section, sitRepId, function(err){
                if(err){
                    callback(err);
                } else {
                    context.create(sitRepId, newUpdate.sectionId, section, function(err){
                        if(err){
                            callback(err);
                        } else {
                            callback(newUpdate);
                        }
                    });    
                }
            });
        }
    });
}
module.exports.create = create;

function get(updateId, sectionId, sitRepId, callback){
    context.getById(updateId, sectionId, sitRepId, function(err, update){
        if(err){
            callback(err);
        } else {
            callback(null, update);
        }
    });
}
module.exports.get = get;