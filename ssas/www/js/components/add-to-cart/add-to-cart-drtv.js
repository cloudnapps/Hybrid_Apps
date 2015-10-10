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
      controller: function($scope, cartApi, FavoriteApi) {
        $scope.addGoodsFavorite = function(){
          FavoriteApi.addGoodsFavorite([$scope.product.goods_id], function(){
            console.log(arguments);
          });
        };
        $scope.addToCart = function() {
          cartApi.addToCart($scope.product);
        };
      }
    };
  });
