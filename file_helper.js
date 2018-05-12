var fs = require('fs');

function File() {
}

File.prototype.unlink = function (path) {
    return new Promise(function(resolve, reject) {
        fs.unlink(path, function (error) {
            if (error) {
                reject(error);
            }
            resolve(true);
        })
    })
}

module.exports = File;
