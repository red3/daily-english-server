var request = require('request');

function push_to_wx (element) {

    return new Promise(function(resolve, reject) {

        var formData = {
            text: 'job-done',
            desp: element.title,
            sendkey: process.env.WX_Key 
        };

        var options = {
            url: 'https://pushbear.ftqq.com/sub', 
            formData: formData
        }

        request.post(options, function optionalCallback(err, httpResponse, body) {
            if (err) {
                reject(err);
            }
            resolve(true);
        });
    })
}






function Weixin () {

}

Weixin.prototype.push_msg = function (element) {
    return push_to_wx(element);
}


module.exports = Weixin;