var util = require('util')
var TODODB = require('./realm_todo_db.js');
var DONEDB = require('./realm_done_db.js');
var todo = new TODODB().getDB();
var done = new DONEDB().getDB();


function _insert(db, track) {
    db.write(() => {
        db.create('Track', track, true);
    })
}

function _delete(db, track) {

    try {
        db.write(() => {
            var filter = util.format('trackId = %d', track.trackId);
            var result = db.objects('Track').filtered(filter);
            db.delete(result);
        })

    } catch (e) {
        console.log("Error on Delete : ", e);
        
    }
}

function _deleteAll(db) {
    try {
        db.write(() => {
            var results = db.objects('Track');
            db.delete(results);
        })

    } catch (e) {
        console.log("Error on Delete : ", e); 
    }  
}
function _exist(db, track) {
    var filter = util.format('trackId = %d', track.trackId);
    var result = db.objects('Track').filtered(filter);
    if (result.length > 0) {
        return true;
      } else {
        return false;
      }
}

function getDB(flag) {
    var db = todo;
    if (flag == 1) {
        db = todo;
    } else {
        db = done;
    }
    return db;
}

function Realm() {

}

Realm.prototype.insert = function (flag, track) {
    var db = getDB(flag);
    return _insert(db, track);
}

Realm.prototype.delete = function (flag, track) {
    var db = getDB(flag);
    return _delete(db, track);
}

Realm.prototype.exist = function (flag, track) {
    var db = getDB(flag);
    return _exist(db, track);
}

Realm.prototype.fetch = function (flag) {
    var db = getDB(flag);    
    var results = db.objects('Track').sorted('createdAt', false);
    var mappedArray = results.map(function(record) {
        return JSON.parse(JSON.stringify(record));
    })
    return mappedArray;
}

Realm.prototype.deleteAll = function (flag) {
    var db = getDB(flag);
    return _deleteAll(db);
}

module.exports = Realm;
