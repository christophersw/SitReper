var  fs = require('fs')
    , _ = require('underscore')
    , mkdirp = require('mkdirp')
    , path = './appdata/sitreps/';

function create(sitRepId, sectionId, update, callback){
    if(typeof sitRepId != 'string'){
        callback(new Error('sitRepId does not appear to be a valid string.'));
        return;
    }
    
    mkdirp.sync(path + sitRepId + '/sections');
    fs.writeFile(path + sitRepId + '/sections/section-' + sectionId + '/' + update.id + '.json', JSON.stringify(update), function(err){
        if(err){
            callback(err);
        } else {
            callback(null);
        }
    });
}
module.exports.create = create;

function getById(updateId, sectionId, sitRepId, callback){
    fs.readFile(path + sitRepId + '/sections/section-' + sectionId + '/' + updateId + '.json', function(err, data){
        if(err){
            callback(err);
        } else {
            var update = JSON.parse(data);
            callback(null, update); 
        }
    });
}
module.exports.getById = getById;