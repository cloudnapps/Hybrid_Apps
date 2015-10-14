(function () {
  angular.module('order', ['starter.services'])
    .config(function ($stateProvider) {

      // Ionic uses AngularUI Router which uses the concept of states
      // Learn more here: https://github.com/angular-ui/ui-router
      // Set up the various states which the app can be in.
      // Each state's controller can be found in controllers.js
      $stateProvider

        .state('tab.orders', {
          url: '/orders',
          views: {
            'tab-member': {
              templateUrl: 'templates/member/order-index.html'
            }
          }
        })
        .state('tab.orders.all', {
          url: '/all',
          views: {
            'tab-orders': {
              templateUrl: 'templates/member/order-list.html',
              controller: 'OrdersAllCtrl'
            }
          }
        })
        .state('tab.orders.nopay', {
          url: '/nopay',
          views: {
            'tab-orders': {
              templateUrl: 'templates/member/order-list.html',
              controller: 'OrdersNopayCtrl'
            }
          }
        })
        .state('tab.orders.noship', {
          url: '/noship',
          views: {
            'tab-orders': {
              templateUrl: 'templates/member/order-list.html',
              controller: 'OrdersNoshipCtrl'
            }
          }
        })
        .state('tab.orders.shipped', {
          url: '/shipped',
          views: {
            'tab-orders': {
              templateUrl: 'templates/member/order-list.html',
              controller: 'OrderShippedCtrl'
            }
          }
        })
        .state('tab.orders.return', {
          url: '/return',
          views: {
            'tab-orders': {
              templateUrl: 'templates/member/order-list.html',
              controller: 'OrderReturnCtrl'
            }
          }
        })
        .state('tab.order_detail', {
          url: '/order/:orderId',
          views: {
            'tab-member': {
              templateUrl: 'templates/member/order-detail.html',
              controller: 'OrderDetailCtrl'
            }
          }
        })
        .state('tab.order_track', {
          url: '/track/:orderId',
          views: {
            'tab-member': {
              templateUrl: 'templates/member/order-track.html',
              controller: 'OrderTrackCtrl'
            }
          }
        });
    })

    .controller('OrdersAllCtrl', function ($scope, $state, $ionicPopup, OrderApi) {
      $scope.items = [];

      $scope.init = function () {
        if ($scope.items.length === 0) {
          $scope.items = [];
          $scope.page = 0;
          $scope.hasMore = true;
        }
      };

      $scope.loadMore = function () {
        OrderApi.getOrderList($scope.page + 1, null, function (result) {
          if (result.status === 1) {
            $scope.hasMore = false;
          }
          else {
            $scope.items = $scope.items.concat(result.data);
            $scope.page += 1;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
        });
      };

      $scope.$on('$ionicView.enter', function () {
        $scope.isActive = true;
        $scope.init();
      });

      $scope.$on('$ionicView.beforeLeave', function () {
        $scope.isActive = false;
      });

      $scope.$on('$stateChangeSuccess', function () {
        if ($scope.isActive)
          $scope.loadMore();
      });

      $scope.viewDetail = function (item) {
        $state.go("tab.order_detail", {orderId: item.order_id}, {reload: true});
      };

      $scope.cancelOrder = function (item) {
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
              alertPopup.then(function (res) {
                console.log(res);
              });
            })
          }
        });
      };

      $scope.trackOrder = function (item) {
        $state.go("tab.order_track", {orderId: item.order_id}, {reload: true});
      };

      $scope.payOrder = function (item) {

      };

      $scope.requestOrder = function (item) {
        $state.go('tab.feedbacks.returns', {orderId: item.order_id}, {reload: true});
      };
    })

    .controller('OrdersNopayCtrl', function ($scope, $state, OrderApi) {
      $scope.items = [];

      //待付款
      $scope.filter = {
        pay_status: 0
      };

      $scope.init = function () {
        if ($scope.items.length === 0) {
          $scope.items = [];
          $scope.page = 0;
          $scope.hasMore = true;
        }
      };

      $scope.loadMore = function () {
        OrderApi.getOrderList($scope.page + 1, $scope.filter, function (result) {
          if (result.status === 1) {
            $scope.hasMore = false;
          }
          else {
            $scope.items = $scope.items.concat(result.data);
            $scope.page += 1;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
        });
      };

      $scope.$on('$ionicView.enter', function () {
        $scope.isActive = true;
        $scope.init();
      });

      $scope.$on('$ionicView.beforeLeave', function () {
        $scope.isActive = false;
      });

      $scope.$on('$stateChangeSuccess', function () {
        if ($scope.isActive)
          $scope.loadMore();
      });
    })

    .controller('OrdersNoshipCtrl', function ($scope, $state, OrderApi) {
      $scope.items = [];

      //待发货
      $scope.filter = {
        ship_status: 0
      };

      $scope.init = function () {
        if ($scope.items.length === 0) {
          $scope.items = [];
          $scope.page = 0;
          $scope.hasMore = true;
        }
      };

      $scope.loadMore = function () {
        OrderApi.getOrderList($scope.page + 1, $scope.filter, function (result) {
          if (result.status === 1) {
            $scope.hasMore = false;
          }
          else {
            $scope.items = $scope.items.concat(result.data);
            $scope.page += 1;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
        });
      };

      $scope.$on('$ionicView.enter', function () {
        $scope.isActtive = true;
        $scope.init();
      });

      $scope.$on('$ionicView.beforeLeave', function () {
        $scope.isActtive = false;
      });

      $scope.$on('$stateChangeSuccess', function () {
        if ($scope.isActtive)
          $scope.loadMore();
      });
    })

    .controller('OrderShippedCtrl', function ($scope, $state, OrderApi) {
      $scope.items = [];

      //待收货
      $scope.filter = {
        ship_status: 1
      };

      $scope.init = function () {
        if ($scope.items.length === 0) {
          $scope.items = [];
          $scope.page = 0;
          $scope.hasMore = true;
        }
      };

      $scope.loadMore = function () {
        OrderApi.getOrderList($scope.page + 1, $scope.filter, function (result) {
          if (result.status === 1) {
            $scope.hasMore = false;
          }
          else {
            $scope.items = $scope.items.concat(result.data);
            $scope.page += 1;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
        });
      };

      $scope.$on('$ionicView.enter', function () {
        $scope.isActive = true;
        $scope.init();
      });

      $scope.$on('$ionicView.beforeLeave', function () {
        $scope.isActive = false;
      });

      $scope.$on('$stateChangeSuccess', function () {
        if ($scope.isActive)
          $scope.loadMore();
      });
    })

    .controller('OrderReturnCtrl', function ($scope, $state, OrderApi) {
      $scope.items = [];

      $scope.filter = {
        ship_status: 1
      };

      $scope.init = function () {
        if ($scope.items.length === 0) {
          $scope.items = [];
          $scope.page = 0;
          $scope.hasMore = true;
        }
      };

      $scope.loadMore = function () {
        OrderApi.getOrderList($scope.page + 1, $scope.filter, function (result) {
          if (result.status === 1) {
            $scope.hasMore = false;
          }
          else {
            $scope.items = $scope.items.concat(result.data);
            $scope.page += 1;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
        });
      };

      $scope.$on('$ionicView.enter', function () {
        $scope.isActive = true;
        $scope.init();
      });

      $scope.$on('$ionicView.beforeLeave', function () {
        $scope.isActive = false;
      });

      $scope.$on('$stateChangeSuccess', function () {
        if ($scope.isActive)
          $scope.loadMore();
      });

      $scope.requestOrder = function (item) {
        $state.go('tab.feedbacks.returns', {orderId: item.order_id}, {reload: true});
      };
    })

    .controller('OrderDetailCtrl', function ($scope, $stateParams, OrderApi) {
      OrderApi.getOrderDetail($stateParams.orderId, function (result) {
        $scope.item = result.data;
      });
    })

    .controller('OrderTrackCtrl', function ($scope, $stateParams, OrderApi) {
      OrderApi.getOrderDetail($stateParams.orderId, function (result) {
        $scope.orderInfo = result.data;
      });

      OrderApi.getOrderTrack($stateParams.orderId, function (result) {
        $scope.items = result.data;
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
      };

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

      var getMemberRate = function (orderId, callback) {
        var url = apiEndpoint.url + '/member-member_rate.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
          order_id: orderId
        };

        sendRequest(url, data, callback);
      };

      var getOrderTrack = function (orderId, callback) {
        var url = apiEndpoint.url + '/member-getOrderTrack.html';
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
        getMemberRate: getMemberRate,
        getOrderTrack: getOrderTrack
      };
    });
})();
