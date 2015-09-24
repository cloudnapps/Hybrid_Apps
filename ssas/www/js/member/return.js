(function () {
  angular.module('return', ['starter.services'])
    .config(function ($stateProvider) {

      // Ionic uses AngularUI Router which uses the concept of states
      // Learn more here: https://github.com/angular-ui/ui-router
      // Set up the various states which the app can be in.
      // Each state's controller can be found in controllers.js
      $stateProvider

        .state('tab.return', {
          url: '/member/returns',
          views: {
            'tab-member': {
              templateUrl: 'templates/member/list-returns.html',
              controller: 'ReturnsCtrl'
            }
          }
        })
        .state('tab.return-detail', {
          url: '/member/returns/:returnId',
          views: {
            'tab-member': {
              templateUrl: 'templates/member/detail-return.html',
              controller: 'ReturnDetailCtrl'
            }
          }
        });
    })

    .controller('ReturnsCtrl', function ($scope, ReturnApi) {
      $scope.items = [];

      ReturnApi.getReturnList(null, null, function (result) {
        $scope.items = result.data;
      });
    })

    .controller('ReturnDetailCtrl', function ($scope, $stateParams, ReturnApi) {
      ReturnApi.getReturnDetail($stateParams.returnId, function (result) {
        $scope.item = result.data;
      });
    })

    .factory('ReturnApi', function ($http, apiEndpoint, transformRequestAsFormPost) {
      console.log(apiEndpoint);

      var sendRequest = function (url, data, callback) {
        var request = $http({
          method: "post",
          url: url,
          transformRequest: transformRequestAsFormPost,
          data: data,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

        request.success(
          function (result) {
            console.log(result);
            callback(result);
          }
        );
      };

      var addReturnRequest = function (orderId, returnInfo, callback) {
        var url = apiEndpoint.url + '/member-return_save.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
          order_id: orderId,
          return_type: returnInfo.type,
          title: returnInfo.title,
          content: returnInfo.content,
          product_bn: returnInfo.product
        };

        sendRequest(url, data, callback);
      };

      var getReturnDetail = function (returnId, callback) {
        var url = apiEndpoint.url + '/member-return_info.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
          return_id: returnId
        };

        sendRequest(url, data, callback);
      };

      var getReturnList = function (page, filter, callback) {
        var url = apiEndpoint.url + '/member-return_list.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4'
        };

        if (page) {
          data.page = page;
        }

        if (filter) {
          data.filter = filter;
        }

        sendRequest(url, data, callback);
      };

      return {
        addReturnRequest : addReturnRequest,
        getReturnDetail : getReturnDetail,
        getReturnList: getReturnList
      };
    });
})();
