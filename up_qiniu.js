var request = require('request');
var fs = require('fs');
var path = require('path');
var header = {
    "X-Requested-With": "XMLHttpRequest",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36",
    "Origin": "https://nj.lizhi.fm",
    "Referer": "https://nj.lizhi.fm/radio/upload",
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
    "Cookie": process.env.LIZHI_Cookie
};


// 1. get token
// 2. upload to qiniu

function getToken() {
    return new Promise(function(resolve, reject) {

        var options = {
            url: 'https://nj.lizhi.fm/radio/upload_token',
            headers: header,
            FormData: {
                t: new Date().getTime()
            }
        };
        request.get(options, function(err,httpResponse,body){
            if (err) {
                console.error('get upload token for qiniu failed :', err);
                reject(err);
            }
            if(httpResponse.statusCode != 200) {
                console.log(httpResponse.url);
                console.log(body);  
                reject('error occur when get upload token');            
            }

            var res = JSON.parse(body);
            if(res.code == 0) {
                resolve(res.ret);
            }
        })
    })
}

function upload_to_qiniu (ret, track) {
    return new Promise(function(resolve, reject) {
        var url = track.url;
        
        console.log("track.url"+url);
        var fileName = path.basename(url);
        var formData = {
            name: fileName,
            chunk: 0,
            chunks: 1,
            key: ret.key,
            token: ret.token,
            // Pass data via Streams
            file: fs.createReadStream(__dirname + '/audios/' + fileName)
        };

        var options = {
            url: 'https://up.qbox.me',
            headers: {
                'origin': 'https://nj.lizhi.fm',
                'referer': 'https://nj.lizhi.fm/radio/upload',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
            },
            formData: formData
        };
        request.post(options, function optionalCallback(err, httpResponse, body) {
            if (err) {
                console.error('upload to qiniu failed:', err);
                reject(err);
            }
            var res = JSON.parse(body);
            resolve(res);
        });
    })
}

function Qiniu() {

}

Qiniu.prototype.upload = function (track) {
    return Promise.all([getToken()])
    .then(values => {
        var ret = values[0];;
        return upload_to_qiniu(ret, track);

    }, error => {
        return Promise.reject(error);
    });
}

module.exports = Qiniu;