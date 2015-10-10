var exec = require('cordova/exec');

var wxpay = {
  payment: function(json, successFn, failureFn) {
    exec(successFn, failureFn, 'WeixinPay', 'payment', [json]);
  }
}

module.exports = wxpay;
