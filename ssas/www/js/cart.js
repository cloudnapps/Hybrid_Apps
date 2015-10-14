(function(){
  var cart = angular.module('cart', ['components'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('tab.cart', {
        url: '/cart',
        cache: false,
        views: {
          'tab-cart': {
            templateUrl: 'templates/cart/cart-index.html',
            controller: 'CartController'
          }
        }
      })
      .state('tab.cart-checkout', {
        url: '/cart-checkout?nature',
        views: {
          'tab-cart': {
            templateUrl: 'templates/cart/cart-checkout.html',
            controller: 'CartCheckoutController'
          }
        }
      })
      .state('tab.cart-payment', {
        url: '/cart-payment',
        views: {
          'tab-cart': {
            templateUrl: 'templates/cart/cart-payment.html',
            controller: 'CartPaymentController'
          }
        }
      })
      .state('tab.order-payed', {
        url: '/order-payed',
        views: {
          'tab-cart': {
            templateUrl: 'templates/cart/order-payed.html',
            controller: 'OrderPayedController'
          }
        }
      })

	}) // end of config

	.controller('CartController', ['$scope', 'cartApi', 'tabStateService', 'userService', function ($scope, cartApi, tabStateService, userService) {

    $scope.$on('$ionicView.beforeEnter', function(){
      if(!userService.isLogin()) {
        userService.backIndex =$scope.tabIndex.cart;
        $scope.tabStateGo($scope.tabIndex.member);
      }
    });

    cartApi.getCart().success(function (responseData){
      var dataStatus = responseData.status;
      if (dataStatus === 0) {
        $scope.cart = responseData.data;
        $scope.cartLoaded = true;
      }
    });
    $scope.toggleSeller = function (seller) {
      angular.forEach(seller.goods_list, function (item) {
        item.selected = seller.selected;
      });
      cartApi.nocheck(seller.goods_list).success(function (responseData){
        var dataStatus = responseData.status;
        if (dataStatus === 0) {
          $scope.cart = responseData.data;
        }
      });
    };

    $scope.toggleGood = function (good) {
      cartApi.nocheck([good]).success(function (responseData){
        var dataStatus = responseData.status;
        if (dataStatus === 0) {
          $scope.cart = responseData.data;
        }
      });
    };

    $scope.updateGoodQuantity = function (good) {
      cartApi.updateCart(good).success(function (responseData){
        var dataStatus = responseData.status;
        if (dataStatus === 0) {
          $scope.cart = responseData.data;
        }
      });
    };

    $scope.removeGood = function (good) {
      cartApi.remove([good]).success(function (responseData){
        var dataStatus = responseData.status;
        if (dataStatus === 0) {
          $scope.cart = responseData.data;
        }
      });
    };
	}]) // end of CartController
  .controller('CartCheckoutController', ['$rootScope', '$scope', '$stateParams', '$ionicModal', 'cartApi', function ($rootScope, $scope, $stateParams, $ionicModal, cartApi) {
    $scope.checkout = function () {
      cartApi.checkout($scope.cart, $stateParams.nature).success(function (responseData){
        var dataStatus = responseData.status;
        if (dataStatus === 0) {
          $scope.cart = responseData.data;
        }
      });
    };
    $scope.checkout();
    $scope.confirm = function () {
      $rootScope.confirmedCart = $scope.cart;
    };
  }])
  .controller('CartPaymentController', ['$rootScope', '$scope', '$state', '$ionicModal', '$ionicPopup', 'cartApi', 'orderApi', 'paymentApi', function ($rootScope, $scope, $state, $ionicModal, $ionicPopup, cartApi, orderApi, paymentApi) {
    $scope.cart = $rootScope.confirmedCart;
    delete $rootScope.confirmedCart;

    $scope.pay = function (payment) {
      cartApi.createOrder($scope.cart)
      .success(function (responseData){
        if (responseData.status !== 0) {
          $ionicPopup.alert({
            title: '未能创建订单',
            template: responseData.msg
          });

          return;
        }

        var order = responseData.data;
        $rootScope.justCreatedOrder = order;
        orderApi.getPayInfo(order)
        .success(function (responseData){
          if (responseData.status !== 0) {
            $ionicPopup.alert({
              title: '未能获取支付信息',
              template: responseData.msg
            });

            return;
          }

          paymentApi.pay(responseData.data)
          .then(function (data) {
            alert(data);
            $state.go('tab.order-payed');
          }, function (err) {
            $ionicPopup.alert({
              title: '支付失败',
              template: err
            });
          });
        });
      });
    };
  }])
  .controller('OrderPayedController', ['$rootScope', '$scope', '$q', 'orderApi', function ($rootScope, $scope, $q, orderApi) {
    var justCreatedOrder = $rootScope.justCreatedOrder;
    delete $rootScope.justCreatedOrder;

    $scope.load = function () {
      var promises = [];
      angular.forEach((justCreatedOrder || {}).order_id, function (order_id) {
        promises.push($q(function (resolve, reject) {
          orderApi.getOrderDetail(order_id).success(function (responseData) {
            resolve(responseData.data);
          });
        }));
      });

      $q.all(promises)
      .then(function (responses) {
        $scope.orders = responses;
      });
    };

    $scope.load();
  }])
})();