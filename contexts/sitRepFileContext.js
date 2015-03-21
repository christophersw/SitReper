var  fs = require('fs')
    , _ = require('underscore')
    , mkdirp = require('mkdirp')
    , path = './appdata/sitreps/';
    
function create(sitRep, callback){
    //Check to see if the file exists...
    if(_.contains(index, sitRep.slug)){
        callback(new Error("SitRep name already taken"));
    } else {
        
        mkdirp.sync(path + sitRep.id);
        
        fs.writeFile(path + sitRep.id + '/sitRep.json', JSON.stringify(sitRep), function(err){
            if(err){
                callback(err);
            } else {
                index.push(sitRep.id);
                updateIndex(function(err){
                    if(err){
                        callback(err);
                    } else {
                        callback(null);
                    }
                });
            }
        }); 
    }
}
module.exports.create = create;

function getById(id, callback){
    fs.readFile(path + id + '/sitRep.json', function(err, data){
        if(err){
            callback(err);
        } else {
            var account = JSON.parse(data);
            callback(null, account); 
        }
    });
}
module.exports.getById = getById;


function replace(sitRep, callback){
    if(!exists(sitRep.id)){
        callback(new Error('SitRep could not be found to be replaced.'));
        return;
    }
    fs.writeFile(path + sitRep.id + '/sitRep.json', JSON.stringify(sitRep), function(err){
        if(err){
            callback(err);
        } else {
            callback(null);
        }
    });   
}
module.exports.replace = replace;

function exists(sitRepId){
    return _.contains(index, sitRepId);
}
module.exports.exists = exists;

function updateIndex(callback){
    fs.writeFile(path + 'index.json', JSON.stringify(index), function(err){
        if(err){
            callback(err);
        } else {
            callback(null);
        }
    }); 
}

(function LookupIndex(){
    
    fs.readFile(path + 'index.json', function(err, data){
        if(err){
            console.log('Could not read sitReps index file, writing new one.');
            fs.writeFile(path + 'index.json', '[]', function(err){
                if(err){
                    throw err;
                }
            });
        } else {
            index = JSON.parse(data);
            console.log('SitRep Index Loaded. ' + index.length + ' sitReps loaded.');
        }
    });
})();