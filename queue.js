var DB = require('./db.js');
var db = new DB();
var Qiniu = require('./up_qiniu.js');
var qiniu = new Qiniu();
var Lizhi = require('./up_lizhi.js');
var lizhi = new Lizhi();
var File = require('./file_helper.js');
var file = new File();
var path = require('path');
var Weixin = require('./wx_notification.js');
var weixin = new Weixin();

function do_your_own_work() {
    return db.fetch(1)
    .then(function (results) {
        if(results.length == 0) {
            console.log('pop nothing from todo database.')
            return false;
        } else {
            var track = results[0];
            return consume_track(track);            
        }
    })
}



function consume_track (track) {

    console.log('process track : ', track.title);
    return qiniu.upload(track)
    .then(ret => {
        console.log('upload to qiniu success');
        return ret;

    }, error => {
        console.log('upload to qiniu fail,', error);    
    })
    .then(function (ret) {
        return lizhi.upload(ret.key, track);
    })
    .then(function (success) {
        if (success) {
            console.log('upload to lizhi success');
            return success;
        }
    })
    .then(function (success) {
   
        // insert to done db, and delete record from todo db.
        return Promise.all([db.insert(2, track), db.delete(1, track)])
    })
    .then(function (success) {
        console.log('db done');
         // then delete local file.
         var fileName = path.basename(track.url);
         var filePath = __dirname + '/audios/' + fileName;
         return file.unlink(filePath);
    })
    .then(function (success) {
        console.log('local audio file deleted');
        console.log('job done');
        // push msg to wx
        weixin.push_msg(track);
    }, function (error) {
        console.log('job failure : ', error);
        return Promise.reject(error);
    })
    .then(function(ret) {
        // success push msg to wx
        console.log('push to weixin success');
    }, function (error) {
        // fail to push msg to wx
        console.log('push to weixin failure, ', error);
    })
}

function Queue () {

}

Queue.prototype.work = function () {
    do_your_own_work();
}

module.exports = Queue;
