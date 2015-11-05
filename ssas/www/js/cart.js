angular.module('cart', ['components'])

.controller('CartController', function ($scope, $state, $ionicLoading, cartApi, tabStateService, userService) {

  $scope.$on('$ionicView.beforeEnter', function(){
    userService.checkLogin('tab.cart');    
  });

  $scope.load = function () {
    $ionicLoading.show();
    cartApi.getCart().success(function (responseData){
      var dataStatus = responseData.status;
      if (dataStatus === 0) {
        $scope.cart = responseData.data;
      }
    })
    .finally(function () {
      $scope.cartLoaded = true;
      $ionicLoading.hide();
    });
  };

  $scope.load();

  $scope.toggleGoods = function (goods) {
    $ionicLoading.show();
    cartApi.nocheck(goods).success(function (responseData){
      var dataStatus = responseData.status;
      if (dataStatus === 0) {
        $scope.cart = responseData.data;
      }
    })
    .finally(function () {
      $ionicLoading.hide();
    });
  };

  $scope.toggleNature = function (nature) {
    var goods = [];
    angular.forEach(nature.aSelCart, function (seller) {
      seller.seller_info.selected = nature.selected;
      angular.forEach(seller.goods_list, function (item) {
        item.selected = seller.seller_info.selected;
        goods.push(item);
      });
    });
    $scope.toggleGoods(goods);
  };

  $scope.toggleSeller = function (seller) {
    angular.forEach(seller.goods_list, function (item) {
      item.selected = seller.seller_info.selected;
    });
    $scope.toggleGoods(seller.goods_list);
  };

  $scope.toggleGood = function (good) {
    $scope.toggleGoods([good]);
  };

  $scope.updateGoodQuantity = function (good) {
    $ionicLoading.show();
    cartApi.updateCart(good).success(function (responseData){
      var dataStatus = responseData.status;
      if (dataStatus === 0) {
        $scope.cart = responseData.data;
      }
    })
    .finally(function () {
      $ionicLoading.hide();
    });
  };

  $scope.removeGoods = function (goods) {
    $ionicLoading.show();
    cartApi.remove(goods).success(function (responseData){
      var dataStatus = responseData.status;
      if (dataStatus === 0) {
        $scope.cart = responseData.data;
      }
    })
    .finally(function () {
      $ionicLoading.hide();
    });
  };

  $scope.removeNature = function (nature) {
    var goods = [];
    angular.forEach(nature.aSelCart, function (seller) {
      seller.seller_info.selected = nature.selected;
      angular.forEach(seller.goods_list, function (item) {
        item.selected = seller.seller_info.selected;
        goods.push(item);
      });
    });
    $scope.removeGoods(goods);
  };

  $scope.removeSeller = function (seller) {
    angular.forEach(seller.goods_list, function (item) {
      item.selected = seller.seller_info.selected;
    });
    $scope.removeGoods(seller.goods_list);
  };

  $scope.removeGood = function (good) {
    $scope.removeGoods([good]);
  };
}) // end of CartController
.controller('CartCheckoutController', function ($rootScope, $scope, $state, $stateParams, $ionicModal, $ionicLoading, cartApi) {
  $scope.checkout = function () {
    $ionicLoading.show();
    cartApi.checkout($scope.cart, $stateParams.nature).success(function (responseData){
      var dataStatus = responseData.status;
      if (dataStatus === 0) {
        $scope.cart = responseData.data;
      }
      else {
        $scope.back();
      }
    })
    .finally(function () {
      $scope.$broadcast('$addressSelect.afterEnter');
      $ionicLoading.hide();
    });
  };

  $scope.$on('$ionicView.afterEnter', $scope.checkout);

  $scope.confirm = function () {
    $rootScope.confirmedCart = $scope.cart;
    $state.go('tab.cart-payment');
  };
})
.controller('CartPaymentController', function ($rootScope, $scope, $state, $ionicModal, $ionicPopup, $ionicLoading, cartApi, orderApi, paymentApi, $q) {
  $scope.cart = $rootScope.confirmedCart;
  delete $rootScope.confirmedCart;

  $scope.pay = function (/*payment*/) {
    $ionicLoading.show();
    cartApi.createOrder($scope.cart)
    .then(function (response){
      if (response.data.status !== 0) {
        $ionicPopup.alert({
          title: '未能创建订单',
          template: response.data.msg
        });

        return $q.reject();
      }

      var order = response.data.data;
      $rootScope.justCreatedOrder = order;

      return orderApi.getPayInfo(order)
      .then(function (response){
        console.log(order, order.pay_app_id);
        if(order.pay_app_id === 'micbcpay') {
          console.log(response);
          $rootScope.micbcpayData = response.data;
          $state.go('iframe');
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
          console.log(data);
          $state.go('tab.order-payed');
        }, function (err) {
          $ionicPopup.alert({
            title: '支付失败',
            template: err
          });
          return $q.reject();
        });
      });
    })
    .finally(function () {
    });
    $ionicLoading.hide();
  };
})
.controller('OrderPayedController', function ($rootScope, $scope, $q, $ionicLoading, orderApi) {
  var justCreatedOrder = $rootScope.justCreatedOrder;
  delete $rootScope.justCreatedOrder;

  $scope.load = function () {
    $ionicLoading.show();
    var promises = [];
    angular.forEach((justCreatedOrder || {}).order_id, function (order_id) {
      promises.push(orderApi.getOrderDetail(order_id));
    });

    $q.all(promises)
    .then(function (responses) {
      $scope.orders = [];
      angular.forEach(responses, function (response) {
        if(response.data.status === 0) {
          $scope.orders.push(response.data.data);
        }
      });
    })
    .finally(function () {
      $ionicLoading.hide();
    });
  };

  $scope.load();
})
.controller('iframeController', function ($rootScope, $scope) {
  $scope.html = $rootScope.micbcpayData;
  delete $rootScope.micbcpayData;
});
