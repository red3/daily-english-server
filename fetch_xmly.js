var request = require('request');
var fs = require('fs');
var path = require('path');
var DB = require('./db.js');
var db = new DB();

var options = {
    url: 'http://140.207.215.242/mobile/v1/album/ts-1509945693482?albumId=4486765&device=iPhone&pageSize=10&source=0&trackId=55806539',
    headers: {
        'Cookie': process.env.XMLY_Cookie,
        'x-viewId': 'XMSoundFeedViewController_UIView',
        'User-Agent': 'ting_v6.3.33_c5(CFNetwork, iOS 11.1, iPhone9,1)',
        'Accept-Language': 'en-us',
        'x-abtest-bucketIds': '9,12'
    }
};

function fetchData () {
    return new Promise(function(resolve, reject) {

        request.get(options, function(err,httpResponse,body){
            if (err) {
                reject(err);
            }
            var info = JSON.parse(body);
            var array = info.data.tracks.list;
            resolve(array);
        })
    })
}

function check_exist(element) {
    return db.exist(2, element)
    .then(function (exist) {
        if (exist) {
            // do exist on done db.
            return exist;
        }
        return db.exist(1, element);
    })
    .then(function (exist) {
        if (exist) {
            // do exist on done db or todo db.
            // console.log('exist on todo or done db');
            return exist;
        }
        return false;
       
    })
    .then(function(ret) {
        if (ret) {
            // do exist on todo db.
            return false;
        }
        // need to download
        console.log('db not found, need download');                    
        return element;
    })
}


function on_process(element) {
   
    // 1. try to download file   
    return download(element)
    .then(success => {
        // 2. if success, insert to todo db.
       return db.insert(1, element);
    })
    .then(function (ret) {
        return Promise.resolve({msg: 'insert to todo db', title: element.title });        
    })
}


function download(element) {

    return new Promise(function(resolve, reject) {
        console.log('downloading the ' + element.title);
        var url = element.url;
        // var url = 'http://audio.xmcdn.com/group35/M06/68/68/wKgJnVoMrZKx2JLJAAkeGSNrGPU152.m4a';
        var fileName = path.basename(url);
        request.get(url, function(err, httpResponse, body) {
            if (err) {
              reject(err);
            }
            resolve(true);
          })
        .pipe(fs.createWriteStream(__dirname + '/audios/' + fileName))
    }) 
}


function do_your_own_work() {
    fetchData()
    .then(elements => {
     
        var maped = elements.map(function (element) {
            // assign url property
            element.url = element.playPathAacv224;
            return check_exist(element);
        }) 
        return Promise.all(maped);
    }, error => {
        console.log('fetch from xmly fail,', error);    
    })
    .then(function (results) {
       
        var filtered = results.filter(element => {
            if(element) {
                return true;
            }
            return false;
        })
        console.log('new track found, ', filtered.length);
        var maped = filtered.map(function (element) {
            return on_process(element);
        }) 
        return Promise.all(maped);
    })
    .then(function (results) {
        results.forEach(function (result) {
            console.log(result);
        }, this)
        return true;
    })
    .then(function (success) {
        console.log('fetch xmly job done');
        // process.exit(0);
        
    }, function (error) {
        console.log('fetch xmly job failure, ', error);
        // process.exit(1);   
    });

}


function Ximayala () {
    
}
    
Ximayala.prototype.work = function () {
    do_your_own_work();
}
    
module.exports = Ximayala;
