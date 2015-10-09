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
	}]) // end of CartController
})();