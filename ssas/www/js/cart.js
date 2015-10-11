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
	}) // end of config

	.controller('CartController', ['$scope', 'cartApi', function ($scope, cartApi) {
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
          console.log(responseData.data);
        }
      });
    };
	}]) // end of CartController
})();