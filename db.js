var Sqlite = require('./sqlite_db.js');
var sqlite = new Sqlite();

function DB() {
    
}
    
DB.prototype.insert = function (flag, track) {
    return sqlite.insert(flag, track);
}
    
DB.prototype.delete = function (flag, track) {
    return sqlite.delete(flag, track);
}
    
DB.prototype.exist = function (flag, track) {
    return sqlite.exist(flag, track);
}
    
DB.prototype.fetch = function (flag) {
    return sqlite.fetch(flag);
}
    
DB.prototype.deleteAll = function (flag) {
    return sqlite.deleteAll(flag);
}
    
module.exports = DB;