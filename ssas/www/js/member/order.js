(function () {
  angular.module('order', ['starter.services'])
    .controller('OrdersAllCtrl', function ($scope, $state, $stateParams, $ionicPopup, $ionicLoading,
                                           toastService, OrderApi, orderStateService) {

      $scope.init = function () {
        $scope.items = [];
        $scope.page = 1;
        $scope.hasMore = false;
        $scope.filter = {};
        $scope.orderState = 1;
      };

      $scope.getOrders = function () {
        $ionicLoading.show();
        OrderApi.getOrderList($scope.page, $scope.filter, function (result) {
           console.log('member-orders.html******' + angular.toJson(result));
          if (result.status === 1) {
            $scope.hasMore = false;
          }
          else {
            $scope.hasMore = true;
            $scope.items = $scope.items.concat(result.data);
          }
          $ionicLoading.hide();
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
        else {
          type = 'all';
          //全部
          $scope.orderState = 1;
          $scope.filter = {};
        }

        orderStateService.set(type);
        $scope.getOrders();
      };

      $scope.$on('$ionicView.beforeEnter', function () {
        $scope.switchOrder(orderStateService.get());
      });

      $scope.loadMore = function () {
        $scope.page++;
        $scope.getOrders();
      };

      $scope.cancelOrder = function (item) {
        $ionicPopup.show({
          title: '取消订单',
          template: '您确定取消此订单吗？取消后，如您想购买需再次生成订单后方可购买哦~~',
          buttons: [
            {text: '我后悔了'},
            {
              text: '<b>确定</b>',
              type: 'button-positive',
              onTap: function () {
                OrderApi.deleteOrder(item.order_id, function (result) {
                   console.log('member-cancelorder.html******' + angular.toJson(result));
                  if (result.status === 1) {
                    toastService.setToast(result.msg);
                  }
                  else {
                    toastService.setToast(result.msg);
                    $state.go('.', {}, {reload: true});
                  }
                });
              }
            }
          ]
        });
      };

      $scope.confirmOrder = function (item) {
        $ionicPopup.show({
          title: '确认收货',
          template: '您确定已收货吗？',
          buttons: [
            {text: '取消'},
            {
              text: '<b>确定</b>',
              type: 'button-positive',
              onTap: function () {
                OrderApi.receiveOrder(item.order_id, function (result) {
                   console.log('member-orderReceives.html******' + angular.toJson(result));
                  if (result.status === 1) {
                    toastService.setToast(result.msg);
                  }
                  else {
                    toastService.setToast(result.msg);
                    $state.go('.', {}, {reload: true});
                  }
                });
              }
            }
          ]
        });
      };

      $scope.payOrder = function (item) {
        $state.go('order-pay', {orderId: item.order_id}, {reload: true});
      };

      $scope.commentOrder = function (item) {
        $state.go('order-comment', {orderId: item.order_id}, {reload: true});
      };
    })

    .controller('OrderDetailCtrl', function ($scope, $stateParams, $state, $ionicPopup, toastService,
                                             $ionicLoading, OrderApi) {
      $scope.getOrder = function () {
        $ionicLoading.show();
        OrderApi.getOrderDetail($stateParams.orderId, function (result) {
           console.log('member-orderdetail.html******' + angular.toJson(result));
          $scope.item = result.data;
          $ionicLoading.hide();
        });
      };

      $scope.$on('$ionicView.beforeEnter', function () {
        $scope.getOrder();
      });

      $scope.cancelOrder = function () {
        $ionicPopup.show({
          title: '取消订单',
          template: '您确定取消此订单吗？取消后，如您想购买需再次生成订单后方可购买哦~~',
          buttons: [
            {text: '我后悔了'},
            {
              text: '<b>确定</b>',
              type: 'button-positive',
              onTap: function () {
                OrderApi.deleteOrder($scope.item.order_title.order_id, function (result) {
                   console.log('member-cancelorder.html******' + angular.toJson(result));
                  if (result.status === 1) {
                    toastService.setToast(result.msg);
                  }
                  else {
                    toastService.setToast(result.msg);
                    $state.go('.', {}, {reload: true});
                  }
                });
              }
            }
          ]
        });
      };

      $scope.confirmOrder = function () {
        $ionicPopup.show({
          title: '确认收货',
          template: '您确定已收货吗？',
          buttons: [
            {text: '取消'},
            {
              text: '<b>确定</b>',
              type: 'button-positive',
              onTap: function () {
                OrderApi.receiveOrder($scope.item.order_title.order_id, function (result) {
                   console.log('member-orderReceives.html******' + angular.toJson(result));
                  if (result.status === 1) {
                    toastService.setToast(result.msg);
                  }
                  else {
                    toastService.setToast(result.msg);
                    $state.go('.', {}, {reload: true});
                  }
                });
              }
            }
          ]
        });
      };

      $scope.payOrder = function () {
        $state.go('order-pay', {orderId: $scope.item.order_title.order_id}, {reload: true});
      };

      $scope.commentOrder = function () {
        $state.go('order-comment', {orderId: $scope.item.order_title.order_id}, {reload: true});
      };
    })

    .controller('OrderPayCtrl', function ($scope, $stateParams, $rootScope, $ionicLoading, $ionicPopup,
                                          $q, $state, orderApi, OrderApi, paymentApi) {
      $scope.cart = {};
      $scope.orderId = $stateParams.orderId;

      OrderApi.getPayInfo($scope.orderId, function (result) {
         console.log('member-get_payinfo.html******' + angular.toJson(result));
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
             console.log('paycenter-dopayment.html******' + angular.toJson(response));
            console.log(order, order.pay_app_id);
            if (order.pay_app_id === 'micbcpay' || order.pay_app_id === 'pospay') {
              console.log(response);
              $rootScope.micbcpayData = response.data;
              $state.go('iframe');
              return;
            }
            if (response.data.status !== 0) {
              $ionicPopup.alert({
                title: '未能获取支付信息',
                template: response.data.msg,
                okText: '确定' // String (默认: 'OK')。OK按钮的文字。
              });

              return $q.reject();
            }

            return paymentApi.pay(response.data.data)
              .then(function () {
                return $state.go('tab.order-payed');
              }, function () {
                return $state.go('tab.order-payed', {
                  status: 'failed'
                });
              });
          });

        $ionicLoading.hide();
      };
    })

    .controller('OrderTrackCtrl', function ($scope, $stateParams, OrderApi) {
      OrderApi.getOrderDetail($stateParams.orderId, function (result) {
         console.log('member-orderdetail.html******' + angular.toJson(result));
        $scope.orderInfo = result.data;
      });

      OrderApi.getOrderTrack($stateParams.orderId, function (result) {
         console.log('member-getOrderTrack.html******' + angular.toJson(result));
        $scope.items = result.data;
      });
    })

    .controller('CommentRequestCtrl', function ($scope, $stateParams, toastService, OrderApi) {
      // 初始商户四项评分为 5星
      $scope.item_0_level = 5;
      $scope.item_1_level = 5;
      $scope.item_2_level = 5;
      $scope.item_3_level = 5;
      $scope.commentInfo = {};
      $scope.commentInfo.comment = [];
      $scope.commentInfo.seller_point = [];

      OrderApi.getMemberRate($stateParams.orderId, function (result) {
         console.log('member-member_rate.html******' + angular.toJson(result));
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

      $scope.clicked = false;
      $scope.submitRequest = function () {
        $scope.clicked = true;

        OrderApi.saveMemberRate($scope.commentInfo, function (result) {
          console.log('member-member_rate.html******' + angular.toJson(result));
          $scope.clicked = false;

          toastService.setToast(result.msg);
          if (result.status === 0) {
            $scope.back();
          }
        })
      };
    })

    .controller('OrderReturnCtrl', function ($scope, $state, $ionicLoading, OrderApi) {
      $scope.init = function () {
        $scope.items = [];
        $scope.page = 1;
        $scope.hasMore = false;
        $scope.filter = {
          return_value: '1'
        };
      };

      $scope.getReturnOrders = function () {
        $ionicLoading.show();
        OrderApi.getOrderList($scope.page, $scope.filter, function (result) {
           console.log('member-orders.html******' + angular.toJson(result));
          if (result.status === 1) {
            $scope.hasMore = false;
          }
          else {
            $scope.hasMore = true;
            $scope.items = $scope.items.concat(result.data);
          }
          $ionicLoading.hide();
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      };

      $scope.loadMore = function () {
        $scope.page++;
        $scope.getReturnOrders();
      };

      $scope.$on('$ionicView.enter', function () {
        $scope.init();
        $scope.getReturnOrders();
      });
    })

    .controller('OrderComplaintCtrl', function ($scope, $state, $ionicLoading, OrderApi) {
      $scope.init = function () {
        $scope.items = [];
        $scope.page = 1;
        $scope.hasMore = false;
        $scope.filter = {
          is_complaint: true
        };
      };

      $scope.getComplaintOrders = function () {
        $ionicLoading.show();
        OrderApi.getOrderList($scope.page, $scope.filter, function (result) {
           console.log('member-orders.html******' + angular.toJson(result));
          if (result.status === 1) {
            $scope.hasMore = false;
          }
          else {
            $scope.hasMore = true;
            $scope.items = $scope.items.concat(result.data);
          }
          $ionicLoading.hide();
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      };

      $scope.loadMore = function () {
        $scope.page++;
        $scope.getComplaintOrders();
      };

      $scope.$on('$ionicView.enter', function () {
        $scope.init();
        $scope.getComplaintOrders();
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
