var exec = require('cordova/exec');

var hoko = {
  checkConnection: function(url, successFn, failureFn) {
    exec(successFn, failureFn, 'HoKo', 'checkConnection', [url]);
  }
}

module.exports = hoko;