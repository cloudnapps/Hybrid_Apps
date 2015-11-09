(function () {
  angular.module('order', ['starter.services'])
    .controller('OrdersAllCtrl', function ($scope, $state, $stateParams, $ionicPopup, OrderApi) {
      $scope.init = function () {
        $scope.items = [];
        $scope.page = 1;
        $scope.hasMore = false;
        $scope.filter = {};
        $scope.orderState = 1;
      };

      $scope.getOrders = function () {
        OrderApi.getOrderList($scope.page, $scope.filter, function (result) {
          if (result.status === 1) {
            $scope.hasMore = false;
          }
          else {
            $scope.hasMore = true;
            $scope.items = $scope.items.concat(result.data);
          }

          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      };

      $scope.switchOrder = function (type) {
        $scope.init();

        if (type === 'all') {
          //全部
          $scope.orderState = 1;
          $scope.filter = {};
        }
        else if (type === 'nopay') {
          //待付款
          $scope.orderState = 2;
          $scope.filter = {
            pay_status: 0
          };
        }
        else if (type === 'noship') {
          //待发货
          $scope.orderState = 3;
          $scope.filter = {
            ship_status: 0
          };
        }
        else if (type === 'shipped') {
          //待收货
          $scope.orderState = 4;
          $scope.filter = {
            ship_status: 1
          };
        }
        else if (type === 'commenting') {
          //待评价
          $scope.orderState = 5;
          $scope.filter = {
            comment_status: 0
          };
        }

        $scope.getOrders();
      };

      $scope.$on('$ionicView.beforeEnter', function () {
        if ($stateParams.type) {
          $scope.switchOrder($stateParams.type);
        }
      });

      $scope.loadMore = function () {
        $scope.page++;
        $scope.getOrders();
      };

      $scope.cancelOrder = function (item) {
        var myPopup = $ionicPopup.show({
          title: '取消订单',
          template: '您确定取消此订单吗？取消后，如您想购买需再次生成订单后方可购买哦~~',
          buttons: [
            {text: '我后悔了'},
            {
              text: '<b>确定</b>',
              type: 'button-positive',
              onTap: function () {
                OrderApi.deleteOrder(item.order_id, function (result) {
                  if (result.status === 1) {
                    var alertPopup = $ionicPopup.alert({
                      title: '取消订单',
                      template: result.msg
                    });
                    alertPopup.then(function (res) {
                      console.log(res);
                    });
                  }
                });
              }
            }
          ]
        });

        console.log(myPopup);
      };

      $scope.confirmOrder = function (item) {
        OrderApi.receiveOrder(item.order_id, function (result) {
          //if (result.status === 1) {
          var alertPopup = $ionicPopup.alert({
            title: '确认收货',
            template: result.msg
          });
          alertPopup.then(function (res) {
            console.log(res);
          });
          //}
        });
      };

      $scope.payOrder = function (item) {
        $state.go('order-pay', {orderId: item.order_id}, {reload: true});
      };

      $scope.commentOrder = function (item) {
        $state.go('order-comment', {orderId: item.order_id}, {reload: true});
      };
    })

    .controller('OrderDetailCtrl', function ($scope, $stateParams, OrderApi) {
      OrderApi.getOrderDetail($stateParams.orderId, function (result) {
        $scope.item = result.data;
      });
    })

    .controller('OrderPayCtrl', function ($scope, $stateParams, $rootScope, $ionicLoading, $ionicPopup,
                                          $q, orderApi, OrderApi, paymentApi) {
      $scope.cart = {};
      $scope.orderId = $stateParams.orderId;

      OrderApi.getPayInfo($scope.orderId, function (result) {
        if (result.status === 0 && result.data) {
          $scope.cart.payments = result.data.payments;
        }
      });

      $scope.pay = function (payment) {
        $ionicLoading.show();

        var order = {
          order_id: $scope.orderId,
          pay_app_id: payment.pay_app_id
        };

        orderApi.getPayInfo(order)
          .then(function (response) {
            console.log(order, order.pay_app_id);

            if (order.pay_app_id === 'micbcpay') {
              console.log(response);
              $rootScope.micbcpayData = response.data;
              $scope.tabStateGo($scope.tabIndex.cart, 'tab.iframe');
              return;
            }
            if (response.data.status !== 0) {
              $ionicPopup.alert({
                title: '未能获取支付信息',
                template: response.data.msg
              });

              return $q.reject();
            }

            return paymentApi.pay(response.data.data)
              .then(function (data) {
                alert('order.js   success ' + data);
              }, function (err) {
                alert('order.js  error  ' + err);
                $ionicPopup.alert({
                  title: '支付失败',
                  template: err
                })
                .then(function () {
                  $state.go('tab.order-payed', {
                    isFailed: true
                  });
                });
              });
          });

        $ionicLoading.hide();
      };
    })

    .controller('OrderTrackCtrl', function ($scope, $stateParams, OrderApi) {
      OrderApi.getOrderDetail($stateParams.orderId, function (result) {
        $scope.orderInfo = result.data;
      });

      OrderApi.getOrderTrack($stateParams.orderId, function (result) {
        $scope.items = result.data;
      });
    })

    .controller('CommentRequestCtrl', function ($scope, $stateParams, OrderApi) {
      // 初始商户四项评分为 5星
      $scope.item_0_level = 5;
      $scope.item_1_level = 5;
      $scope.item_2_level = 5;
      $scope.item_3_level = 5;
      $scope.commentInfo = {};
      $scope.commentInfo.comment = [];
      $scope.commentInfo.seller_point = [];

      OrderApi.getMemberRate($stateParams.orderId, function (result) {
        if (result.status === 0) {
          $scope.item = result.data;
          $scope.commentInfo.order_id = $stateParams.orderId;
          $scope.commentInfo.seller_id = $scope.item[0].id;
          for (var i = 1; i < $scope.item.length; i++) {
            $scope.commentInfo.comment.push({
              product_id: $scope.item[i].product_id,
              goods_id: $scope.item[i].goods_id,
              goods_comment: '',
              point: [{
                type_id: '1'
              }]
            })
          }

          for (var j = 0; j < $scope.item[0].rate.length; j++) {
            $scope.commentInfo.seller_point.push({
              type_id: $scope.item[0].rate[j].type_id,
              value: '5'
            })
          }
        }
      });

      $scope.start_level_0 = function (level) {
        $scope.item_0_level = level;
        $scope.commentInfo.seller_point[0].value = level;
      };
      $scope.start_level_1 = function (level) {
        $scope.item_1_level = level;
        $scope.commentInfo.seller_point[1].value = level;
      };
      $scope.start_level_2 = function (level) {
        $scope.item_2_level = level;
        $scope.commentInfo.seller_point[2].value = level;
      };
      $scope.start_level_3 = function (level) {
        $scope.item_3_level = level;
        $scope.commentInfo.seller_point[3].value = level;
      };

      $scope.submitRequest = function () {
        OrderApi.getMemberRate($scope.commentInfo, function (result) {
          var alertPopup = $ionicPopup.alert({
            title: '确认收货',
            template: result.msg
          });
          alertPopup.then(function (res) {
            console.log(res);
          });
        })
      };
    })

    .controller('OrderReturnCtrl', function ($scope, $state, OrderApi) {
      $scope.items = [];

      $scope.filter = {
        return_value: '1'
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
        if ($scope.isActive) {
          $scope.loadMore();
        }
      });

      $scope.requestReturn = function (item) {
        $state.go('return-request', {orderId: item.order_id}, {reload: true});
      };
    })

    .controller('OrderComplaintCtrl', function ($scope, $state, OrderApi) {
      $scope.items = [];

      $scope.filter = {
        is_complaint: true
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
        if ($scope.isActive) {
          $scope.loadMore();
        }
      });

      $scope.requestComplaint = function (item) {
        $state.go('complaint-request', {orderId: item.order_id}, {reload: true});
      };
    })

    .factory('OrderApi', function ($http, apiEndpoint, transformRequestAsFormPost, userService) {
      var sendRequest = function (url, data, callback) {
        var request = $http({
          method: 'post',
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
          member_id: userService.get('memberId'),
          token: userService.get('token')
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
          member_id: userService.get('memberId'),
          token: userService.get('token'),
          order_id: orderId
        };

        sendRequest(url, data, callback);
      };

      var deleteOrder = function (orderId, callback) {
        var url = apiEndpoint.url + '/member-cancelorder.html';
        var data = {
          member_id: userService.get('memberId'),
          token: userService.get('token'),
          order_id: orderId
        };

        sendRequest(url, data, callback);
      };

      var receiveOrder = function (orderId, callback) {
        var url = apiEndpoint.url + '/member-orderReceives.html';
        var data = {
          member_id: userService.get('memberId'),
          token: userService.get('token'),
          order_id: orderId
        };

        sendRequest(url, data, callback);
      };

      var getMemberRate = function (orderId, callback) {
        var url = apiEndpoint.url + '/member-member_rate.html';
        var data = {
          member_id: userService.get('memberId'),
          token: userService.get('token'),
          order_id: orderId
        };

        sendRequest(url, data, callback);
      };

      var saveMemberRate = function (commentInfo, callback) {
        var url = apiEndpoint.url + '/member-save_rate.html';
        commentInfo.member_id = userService.get('memberId');
        commentInfo.token = userService.get('token');

        sendRequest(url, commentInfo, callback);
      };

      var getOrderTrack = function (orderId, callback) {
        var url = apiEndpoint.url + '/member-getOrderTrack.html';
        var data = {
          member_id: userService.get('memberId'),
          token: userService.get('token'),
          order_id: orderId
        };

        sendRequest(url, data, callback);
      };

      var getPayInfo = function (orderId, callback) {
        var url = apiEndpoint.url + '/member-get_payinfo.html';
        var data = {
          member_id: userService.get('memberId'),
          token: userService.get('token'),
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
        saveMemberRate: saveMemberRate,
        getOrderTrack: getOrderTrack,
        getPayInfo: getPayInfo
      };
    });
})();
