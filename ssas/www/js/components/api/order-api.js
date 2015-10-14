
angular.module('components')
  .factory('orderApi', ['$http', 'apiEndpoint', 'transformRequestAsFormPost',
    function($http, apiEndpoint, transformRequestAsFormPost) {

      var pay = function (order) {
        var data = {
          order_id: order.order_id,
          pay_app_id: order.pay_app_id,
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4'
        };

        var request = $http({
          method: 'post',
          url: apiEndpoint.url + '/paycenter-dopayment.html',
          transformRequest: transformRequestAsFormPost,
          data: data,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

        return request;
      };

      return {
        pay: pay
      };

    }]);