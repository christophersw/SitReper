var scrypt = require('scrypt');

function getHash(pass, callback){
    var scryptParameters = scrypt.params(.5); //maxtime, maxmem[optional], maxmemfrac[optional]
    
    scrypt.hash.config.keyEncoding = "ascii";
    scrypt.hash.config.outputEncoding = "base64";
    scrypt.hash(pass, scryptParameters, function(err, result){
        if(err){
            callback(err);
        } else {
            callback(null, result);
        }
    });
}
module.exports.getHash = getHash;

function checkPass(pass, hash, callback){
    scrypt.verifyHash(hash, pass, function(err, result) {
        if(err){
            callback(err);
        } else {
            callback(null, result);
        }
    });
}
module.exports.checkPass = checkPass;