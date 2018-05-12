var DB = require('./db.js');

var db = new DB();


var track = {
    trackId: 58333845,
    playPathAacv224: 'url',
    title: 'example',
    duration: 256,
    createdAt: 113355666,
    test: 'xxx'
}

db.fetch(1)
    .then(function (results) {
        if(results.length == 0) {
            console.log('pop nothing from todo database.')
        } else {
            var track = results[0];
            console.log(JSON.stringify(track))
        }
    })

// db.deleteAll(1);