require('dotenv').config()
// var schedule = require('node-schedule');
var Queue = require('./queue.js');
var queue = new Queue();
var Ximalaya = require('./fetch_xmly.js');
var xmly = new Ximalaya();

/*
var j = schedule.scheduleJob('0 16,20,40 06,07,08 * * *', function(){
  console.log('schedule xmly job start, date :', new Date());
  xmly.work();
});
var k = schedule.scheduleJob('0 18,22,42 06,07,08 * * *', function(){
  console.log('schedule queue job start, date :', new Date());  
  queue.work();
});
*/

console.log('schedule xmly job start, date :', new Date());

xmly.work()
.then(function (success) {
  return queue.work();

}, function (error) {
  console.log(error);
  process.exit(1);   
})
.then(function (success) {
  process.exit(0);
  
}, function (error) {
  console.log(error);
  process.exit(1);   
})


