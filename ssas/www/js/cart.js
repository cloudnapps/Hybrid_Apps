(function(){
  var cart = angular.module('cart', ['components'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('tab.cart', {
        url: '/cart',
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
  .controller('CartPaymentController', ['$scope', '$ionicModal', 'cartApi', function ($scope, $ionicModal, cartApi) {
    $scope.pay = function (payment) {
      cartApi.createOrder($scope.confirmedCart).success(function (responseData){
        var dataStatus = responseData.status;
        if (dataStatus === 0) {
          console.log(responseData.data);
        }
      });
    };
  }])
})();