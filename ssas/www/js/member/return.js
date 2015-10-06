(function () {
  angular.module('return', ['starter.services'])
    .config(function ($stateProvider) {

      // Ionic uses AngularUI Router which uses the concept of states
      // Learn more here: https://github.com/angular-ui/ui-router
      // Set up the various states which the app can be in.
      // Each state's controller can be found in controllers.js
      $stateProvider

        .state('return_request', {
          url: '/returns/request/:orderId',
          views: {
            'main-view': {
              templateUrl: 'templates/member/return-request.html',
              controller: 'ReturnsRequestCtrl'
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

    .controller('ReturnsRequestCtrl', function ($scope, $stateParams, ReturnApi) {
      ReturnApi.getReturnIndex($stateParams.orderId, function (result) {
        if(result.status === 0) {
          $scope.orderInfo = result.data;
        }
      });
    })

    .controller('ReturnsCtrl', function ($scope, ReturnApi) {
      $scope.items = [];

      ReturnApi.getReturnList(null, null, function (result) {
        $scope.items = result.data;
      });


      ReturnApi.getReturnIndex(item.order_id, function (result) {
        var alertPopup = $ionicPopup.alert({
          title: '订单售后',
          template: result.msg
        });
        alertPopup.then(function (res) {
          console.log(res);
        });
      })
    })

    .controller('ReturnDetailCtrl', function ($scope, $stateParams, ReturnApi) {
      ReturnApi.getReturnDetail($stateParams.returnId, function (result) {
        if(result.status === 0) {
          $scope.item = result.data;
        }
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

      var getReturnIndex = function (orderId, callback) {
        var url = apiEndpoint.url + '/member-return_index.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
          order_id: orderId
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
        getReturnIndex: getReturnIndex,
        addReturnRequest : addReturnRequest,
        getReturnDetail : getReturnDetail,
        getReturnList: getReturnList
      };
    });
})();
