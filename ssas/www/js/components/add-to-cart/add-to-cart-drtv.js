angular
  .module('components')
  .directive('addToCart', function() {
    return {
      restrict: 'EA',
      templateUrl: 'templates/cart/add-to-cart.tpl.html',
      scope: {
        product: '=addToCart'
      },
      replace: true,
      controller: function($scope, cartApi) {
        $scope.addToCart = function(product) {
          cartApi.addToCart(product);
        };
      }
    };
  });
