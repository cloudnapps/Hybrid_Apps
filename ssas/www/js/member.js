angular.module('starter.member', ['starter.services'])

  .factory('MemberApi', function ($http, apiEndpoint, transformRequestAsFormPost) {
    console.log(apiEndpoint);

    var getOrders = function (callback) {
      var url = apiEndpoint.url + '/member-orders.html';
      var data = {
        member_id: 13,
        token: '11b4f4bd44ee8814d41680dc753a75e4'
      };

      var request = $http({
        method: "post",
        url: url,
        transformRequest: transformRequestAsFormPost,
        data: data,
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}
      });

      request.success(
        function (result) {
          console.log(result);
          callback(result);
        }
      );
    };

    return {
      getOrders: getOrders
    };
  });
