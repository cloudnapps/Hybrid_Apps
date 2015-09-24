(function () {
  angular.module('order', ['starter.services'])
    .config(function ($stateProvider) {

      // Ionic uses AngularUI Router which uses the concept of states
      // Learn more here: https://github.com/angular-ui/ui-router
      // Set up the various states which the app can be in.
      // Each state's controller can be found in controllers.js
      $stateProvider

        .state('tab.orders', {
          url: '/member/orders',
          views: {
            'tab-member': {
              templateUrl: 'templates/member/list-orders.html',
              controller: 'OrdersCtrl'
            }
          }
        })
        .state('tab.order-detail', {
          url: '/member/orders/:orderId',
          views: {
            'tab-member': {
              templateUrl: 'templates/member/detail-order.html',
              controller: 'OrderDetailCtrl'
            }
          }
        });
    })

    .controller('OrdersCtrl', function ($scope,  $ionicPopup, OrderApi) {
      $scope.items = [];

      OrderApi.getOrderList(null, null, function (result) {
        $scope.items = result.data;
      });

      $scope.getReturn = function(item) {
        OrderApi.getReturnIndex(item.order_id, function(result) {
          var alertPopup = $ionicPopup.alert({
            title: '订单售后',
            template: result.msg
          });
          alertPopup.then(function(res) {
            console.log(res);
          });
        })
      }

      $scope.remove = function (item) {
        var confirmPopup = $ionicPopup.confirm({
          title: '取消订单',
          template: '是否真的需要取消订单?'
        });

        confirmPopup.then(function (res) {
          if (res) {
            OrderApi.deleteOrder(item.order_id, function (result) {
              var alertPopup = $ionicPopup.alert({
                title: '取消订单',
                template: result.msg
              });
              alertPopup.then(function(res) {
                console.log(res);
              });
            })
          }
        });
      }
    })

    .controller('OrderDetailCtrl', function ($scope, $stateParams, OrderApi) {
      OrderApi.getOrderDetail($stateParams.orderId, function (result) {
        $scope.item = result.data;
      });
    })

    .factory('OrderApi', function ($http, apiEndpoint, transformRequestAsFormPost) {
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
      }

      var getOrderList = function (page, filter, callback) {
        var url = apiEndpoint.url + '/member-orders.html';
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

      var getOrderDetail = function (orderId, callback) {
        var url = apiEndpoint.url + '/member-orderdetail.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
          order_id: orderId
        };

        sendRequest(url, data, callback);
      };

      var deleteOrder = function (orderId, callback) {
        var url = apiEndpoint.url + '/member-cancelorder.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
          order_id: orderId
        };

        sendRequest(url, data, callback);
      };

      var receiveOrder = function (orderId, callback) {
        var url = apiEndpoint.url + '/member-orderReceives.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
          order_id: orderId
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

      return {
        getOrderList: getOrderList,
        getOrderDetail: getOrderDetail,
        deleteOrder: deleteOrder,
        receiveOrder: receiveOrder,
        getReturnIndex: getReturnIndex
      };
    });
})();
