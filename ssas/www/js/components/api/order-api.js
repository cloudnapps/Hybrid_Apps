
angular.module('components')
  .factory('orderApi', ['$http', 'apiEndpoint', 'transformRequestAsFormPost', 'userService',
    function($http, apiEndpoint, transformRequestAsFormPost, userService) {

      var getPayInfo = function (order) {
        var data = {
          order_id: order.order_id,
          pay_app_id: order.pay_app_id,
          member_id: userService.get('memberId'),
          token: userService.get('token')
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

      var getOrderDetail = function (orderId) {
        var data = {
          order_id: orderId,
          member_id: userService.get('memberId'),
          token: userService.get('token')
        };

        var request = $http({
          method: 'post',
          url: apiEndpoint.url + '/member-orderdetail.html',
          transformRequest: transformRequestAsFormPost,
          data: data,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

        return request;
      };

      return {
        getPayInfo: getPayInfo,
        getOrderDetail: getOrderDetail
      };

    }]);