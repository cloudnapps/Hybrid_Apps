(function(){
  var cart = angular.module('cart', [])
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

	.controller('CartController', function(){

	}) // end of CartController
})();