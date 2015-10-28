angular.module('components')
  .factory('paymentApi', ['$q',
    function ($q) {
      var payByAlipay = function (payment) {
        //alert("alipay");
        var deferred = $q.defer();
        var payObj = {};
        payObj["pay_info"] = payment.orderInfo;
        var paymentString = JSON.stringify(payObj);

        alipay.payment(payObj, function (cb_success) {
            //alert(cb_success);
            deferred.resolve(cb_success);
          },
          function (cb_failure) {
            alert(cb_failure);
            deferred.reject(cb_failure);
          });
        return deferred.promise;
      };

      var payByWechat = function (payment) {
        //alert("wxPay");
        var deferred = $q.defer();
        var payObj = {};
        payObj["noncestr"] = payment.noncestr;
        payObj["package"] = payment.package;
        payObj["partnerid"] = payment.partnerid;
        payObj["prepayid"] = payment.prepayid;
        payObj["timestamp"] = payment.timestamp;
        payObj["sign"] = payment.sign;
        var paymentString = JSON.stringify(payObj);

        wxpay.payment(payObj, function (cb_success) {
            //alert(cb_success);
            deferred.resolve(cb_success);
          },
          function (cb_failure) {
            alert(cb_failure);
            deferred.reject(cb_failure);
          });
        return deferred.promise;
      };

      var pay = function (payment) {
        // var deferred = $q.defer();
        // deferred.resolve();
        // return deferred.promise;
        var payMetods = {
          alipayWallet: payByAlipay,
          wxApppay: payByWechat
        };
        var payMethod = payMetods[payment.pay_app_id];
        if (payMethod) {
          return payMethod(payment);
        }
        return $q.reject('不支持的支付方式');
      };

      return {
        payByAlipay: payByAlipay,
        payByWechat: payByWechat,
        pay: pay
      };

    }]);
