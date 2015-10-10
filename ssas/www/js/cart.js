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
    };

    $scope.orderTotal = function (channel) {
      var total = 0;
      angular.forEach(channel.aSelCart, function (seller) {
        angular.forEach(seller.goods_list, function (good) {
          if(good.selected === true) {
            total += (good.buy_price * good.quantity);
          }
        });
      });
      return total;
    };
	}]) // end of CartController
})();