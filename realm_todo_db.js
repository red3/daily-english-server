'use strict';

var TodoRealm = require('realm');
var util = require('util')
var fs = require('fs');
var os = require('os');

TodoRealm.defaultPath = __dirname + "/realm_todo/todo.realm"




//   trackId: 59015750,
//   uid: 19778810,
//   playUrl64: 'http://audio.xmcdn.com/group35/M03/37/41/wKgJnFoRW6KwolBcAAxUMVMu_DQ522.mp3',
//   playUrl32: 'http://audio.xmcdn.com/group35/M03/37/41/wKgJnFoRW6PC5bJjAAYqpOb4oFo234.mp3',
//   playPathHq: '',
//   playPathAacv164: 'http://audio.xmcdn.com/group35/M06/ED/5A/wKgJnVoRW6GyrxkHAAx-iqCpsxE544.m4a',
//   playPathAacv224: 'http://audio.xmcdn.com/group35/M03/37/41/wKgJnFoRW6HhUnnJAATJ343NH3o275.m4a',
//   title: '542. Why Not You?',
//   duration: 100,
//   albumId: 4486765,
//   isPaid: false,
//   isVideo: false,
//   isDraft: false,
//   orderNo: 540,
//   processState: 2,
//   createdAt: 1511129700000,
//   coverSmall: 'http://fdfs.xmcdn.com/group9/M04/8C/79/wKgDZldZE1nS8b8qAAVOEm0qRSU201_web_meduim.jpg',
//   coverMiddle: 'http://fdfs.xmcdn.com/group9/M04/8C/79/wKgDZldZE1nS8b8qAAVOEm0qRSU201_web_large.jpg',
//   coverLarge: 'http://fdfs.xmcdn.com/group9/M04/8C/79/wKgDZldZE1nS8b8qAAVOEm0qRSU201_mobile_large.jpg',
//   nickname: '王渊源John',
//   smallLogo: 'http://fdfs.xmcdn.com/group25/M06/37/48/wKgJMVhulSbQbVMYAAAtihJeM1c00_mobile_small.jpeg',
//   userSource: 2,
//   opType: 1,
//   isPublic: true,
//   likes: 5,
//   playtimes: 2626,
//   comments: 1,
//   shares: 0,
//   status: 1

const Track = {
    name: 'Track',
    primaryKey: 'trackId',
    properties: {
      trackId: 'int',
      playPathAacv224: 'string', // compound primaryKey, format like [B:bundleId][P:platform][V:version]
      title:  'string', // 
      duration: 'int',
      createdAt: 'int'
    }
  };

var todo = new TodoRealm({schema: [Track]});


function ToDoRealmDB() {
}

ToDoRealmDB.prototype.getDB = function() {
    return todo;
}

module.exports = ToDoRealmDB;


