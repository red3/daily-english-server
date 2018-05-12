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

var formData = {
    // Pass a simple key-value pair
    name: '538. The Disney Institute, Employee Engagement copy',
    info: '',
    audio_img: '',
    audio_file: '',
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    imgRatio: 1,
    avatar: 1,
    ptime: '',
    fileKey: '15118549488298624089684',
    domain: 'qnapp.lizhi.fm',
    bucket: 'lizhi-fm-nj-uploader',
    tags: '',
    labelId: '24229951168847536',
    payFlag: 0,
    amount: 0,
    auditionTime: 0
};

function Lizhi() {

}

Lizhi.prototype.upload = function (fileKey, track) {
    return new Promise(function(resolve, reject) {
        formData.name = track.title;
        formData.fileKey = fileKey;

        var options = {
            url: 'https://nj.lizhi.fm/radio/json_uploadfinish_cloud',
            headers: header,
            formData: formData
        };

        request.post(options, function(err,httpResponse,body){
            if (err) {
                console.error('upload record to lizhi failed :', err);
                reject(err);
            }
            if(httpResponse.statusCode != 200) {
                console.log(body);  
                reject('error occur when upload record to lizhi.');            
            }
            resolve(true);
        })
    });
}

module.exports = Lizhi;
  