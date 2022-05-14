const ws = require('ws');

exports.handleMessage = (message) => {
    try {
        jsn = JSON.parse(message);
        console.log(jsn)
    } catch {
        console.log("Invalid message");
    }
}