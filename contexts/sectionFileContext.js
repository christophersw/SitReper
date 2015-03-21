var  fs = require('fs')
    , _ = require('underscore')
    , mkdirp = require('mkdirp')
    , path = './appdata/sitreps/';

function create(section, sitRepId, callback){
    if(typeof sitRepId != 'string'){
        callback(new Error('sitRepId does not appear to be a valid string.'));
        return;
    }
    
    mkdirp.sync(path + sitRepId + '/sections');
    fs.writeFile(path + sitRepId + '/sections/section-' + section.id + '/section.json', JSON.stringify(section), function(err){
        if(err){
            callback(err);
        } else {
            callback(null);
        }
    });
}
module.exports.create = create;

function getById(sectionId, sitRepId, callback){
    fs.readFile(path + sitRepId + '/sections/section-' + sectionId + '/section.json', function(err, data){
        if(err){
            callback(err);
        } else {
            var section = JSON.parse(data);
            callback(null, section); 
        }
    });
}
module.exports.getById = getById;

function replace(section, sitRepId, callback){
    fs.writeFile(path + sitRepId + '/sections/section-' + section.id + '/section.json', JSON.stringify(section), function(err){
        if(err){
            callback(err);
        } else {
            callback(null);
        }
    });   
}
module.exports.replace = replace;