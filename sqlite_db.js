var sqlite = require('sqlite');
var sqlite3 = require('sqlite3').verbose();
var dbPath = __dirname + "/sqlite/default.db";
// import sqlite from 'sqlite';
const dbPromise = sqlite.open(dbPath, { Promise });

const scheme = '($trackId,$url,$title,$duration,$createdAt)';

var create_todo_db = 'CREATE TABLE IF NOT EXISTS todo ( \
    trackId integer PRIMARY KEY, \
    url text, \
    title text, \
    duration integer, \
    createdAt integer \
)'

var create_done_db = 'CREATE TABLE IF NOT EXISTS done( \
    trackId integer PRIMARY KEY, \
    url text, \
    title text, \
    duration integer, \
    createdAt integer \
)'

function test () {


    var db = new sqlite3.Database(dbPath);    
    db.serialize(function() {
     
        db.run(create_todo_db);

   //db.run("INSERT INTO todo VALUES (?,?,?,?,?)", [123, "url", "title", 120, 123456789]);
    // db.run("INSERT INTO todo VALUES ($trackId,$url,$title,$duration,$createdAt)", {
    //     $trackId: 123,
    //     $url: 'url',
    //     $title: 'title',
    //     $duration: 120,
    //     $createdAt: 1234565780
    // })

        var stmt = db.prepare("INSERT INTO todo VALUES ($trackId,$url,$title,$duration,$createdAt)");
        var obj = {
            $trackId: 123,
            $url: 'url',
            $title: 'title',
            $duration: 120,
            $createdAt: 1234565780
        };
        stmt.run(obj);
        stmt.finalize();
    // db.run("UPDATE tbl SET name = $name WHERE id = $id", {
    //     $id: 2,
    //     $name: "bar"
    // });

        db.each("SELECT rowid AS id, title FROM todo", function(err, row) {
            console.log("---- db.each")

            console.log(row.id + ": " + row.title);
        });


        db.all("SELECT * from todo where title like '%tit%'",function(err,rows){
            console.log("---- db.all")

            console.dir(rows);
        });


        db.get("SELECT * from todo where title='title'", function (err, row) {
            console.log("---- db.get")

            console.log(row);
        });
    });

    db.close();
}


function Sqlite () {

}

function getDB () {
    return dbPromise
    .then(function (db) {
        // sqlite.open(dbPath, { Promise })
        return db;
    })  
    .then(function (db) {
        db.run(create_todo_db);
        db.run(create_done_db);
        return db;
    })
}

function _insert (flag, track) {

    return getDB()
    .then(function (db) {
        var stmt = 'INSERT INTO todo VALUES ' + scheme;        
        if (flag == 2) {
            stmt = 'INSERT INTO done VALUES ' + scheme;  
        }
        var obj = {
            $trackId: track.trackId,
            $url: track.url,
            $title: track.title,
            $duration: track.duration,
            $createdAt: track.createdAt
        };
        return db.run(stmt, obj)
    })
    .then(function (res) {
        return true;
        // return db.close();
    })
}

function _fetch(flag) {
    return getDB()
    .then(function (db) { 
        var stmt = 'SELECT * FROM todo order by createdAt asc';        
        if (flag == 2) {
            stmt = 'SELECT * FROM done order by createdAt asc';  
        }
        return db.all(stmt);
    })
    .then(function (res) {
        // db.close();
        return res;
    })
}

function _delete(flag, track) {
    return getDB()
    .then(function (db) {
        var stmt = 'DELETE FROM todo where trackId = $trackId';        
        if (flag == 2) {
            stmt = 'DELETE FROM done where trackId = $trackId';  
        }
        var obj = {
            $trackId: track.trackId
        };
        return db.run(stmt, obj);
    })
    .then(function (res) {
        return true;
        // db.close();
    })
}

function _exist(flag, track) {

    return getDB()
    .then(function (db) {
        var stmt = 'SELECT * from todo where trackId = $trackId';    
        if (flag == 2) {
            stmt = 'SELECT * from done where trackId = $trackId';  
        } 
        var obj = {
            $trackId: track.trackId
        };
        return db.get(stmt, obj);
    })
    .then(function (res) {

        if(res) {
            return true;
        } else {
            return false;
        }
        // db.close();
    })
}

function _deleteAll(flag) {
    return getDB()
    .then(function (db) {
        var stmt = 'DELETE FROM todo';        
        if (flag == 2) {
            stmt = 'DELETE FROM done';  
        }
        return db.run(stmt);
    })
    .then(function (res) {
        return true;
        // db.close();
    })
}

var track = {
    trackId: 123,
    url: 'url',
    title: 'example',
    duration: 256,
    createdAt: 113355666,
    test: 'xxx'
}
//_insert(1, track);
// _delete(1, track);
// _deleteAll(1);
// _fetch();
// _exist(1, track);

Sqlite.prototype.insert = function (flag, track) {
    return _insert(flag, track);
}
Sqlite.prototype.delete = function (flag, track) {
    return _delete(flag, track); 
}

Sqlite.prototype.exist = function (flag, track) {
    return _exist(flag, track);  
}
Sqlite.prototype.fetch = function (flag) {
    return _fetch(flag);
}
Sqlite.prototype.deleteAll = function (flag) {
    return _deleteAll(flag);
}

module.exports = Sqlite;





