var exec = require('cordova/exec');

var shake = {
  shakeByBeacon: function() {
    exec(null, null, 'Shake',  'shakeByBeacon', []);
  }
}

module.exports = shake;
