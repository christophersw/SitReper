var  fs = require('fs')
    , _ = require('underscore')
    , mkdirp = require('mkdirp')
    , path = './appdata/sitreps/';

function create(account, sitRepId, callback){
    if(typeof sitRepId != 'string'){
        callback(new Error('sitRepId does not appear to be a valid string.'));
        return;
    }
    
    mkdirp.sync(path + sitRepId + '/accounts');
    fs.writeFile(path + sitRepId + '/accounts/' + account.email + '.json', JSON.stringify(account), function(err){
        if(err){
            callback(err);
        } else {
            callback(null);
        }
    });
}
module.exports.create = create;

function getById(accountId, sitRepId, callback){
    fs.readFile(path + sitRepId + '/accounts/' + accountId + '.json', function(err, data){
        if(err){
            callback(err);
        } else {
            var account = JSON.parse(data);
            callback(null, account); 
        }
    });
}
module.exports.getById = getById;

function replace(account, sitRepId, callback){
    fs.writeFile(path + sitRepId + '/accounts/' + account.email +  '.json', JSON.stringify(account), function(err){
        if(err){
            callback(err);
        } else {
            callback(null);
        }
    });   
}
module.exports.replace = replace;