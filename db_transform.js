var Realm  = require('./realm_db.js');
var realm = new Realm();

var Sqlite = require('./sqlite_db.js');
var sqlite = new Sqlite();


var results = realm.fetch(2);
results.forEach(function(element) {
    sqlite.exist(2, element)
    .then(function (exist) {
        if(!exist) {
            return sqlite.insert(2, element);
        }
    })
    .then(function (success) {
        console.log(element.title + success);
    })
}, this);

sqlite.fetch(2)
.then(function (results) {
    results.forEach(function(element) {
        console.log(element);
    }, this);
})
