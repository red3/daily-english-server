require('dotenv').config()
var DB = require('./db.js');

var db = new DB();
var Weixin = require('./wx_notification.js');
var weixin = new Weixin();



var track = {
    trackId: 58333845,
    playPathAacv224: 'url',
    title: 'example',
    duration: 256,
    createdAt: 113355666,
    test: 'xxx'
}



function transformTracksFromTodoToDone () {
    db.fetch(1)
    .then(function (results) {
        if(results.length == 0) {
            console.log('pop nothing from todo database.')
        } else {
            // var track = results[0];
            // console.log(JSON.stringify(track))
            results.forEach(element => {
                db.insert(2, element);
            });
            db.deleteAll(1);
        }
})
}



// transformTracksFromTodoToDone();
// db.deleteAll(1);

weixin.push_msg(track)
.then(function (result) {
    console.log('done');
}, function (error) {
    console.log(error);
})
