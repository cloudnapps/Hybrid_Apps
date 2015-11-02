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
      controller: function($scope, cartApi, FavoriteApi, toastService, tabStateService, userService) {
        // 跨tab之间的跳转
        $scope.tabIndex = tabStateService.tabIndex;
        $scope.tabStateGo = tabStateService.go;

        $scope.addGoodsFavorite = function() {
          userService.checkLogin({
            success: function() {
              FavoriteApi
                .addGoodsFavorite([$scope.product.goods_id], function(data) {
                  if (data) {
                    return toastService.setToast(data.msg);
                  }
                  toastService.setToast('添加失败');
                });
            }
          });

        };
        $scope.addToCart = function() {
          userService.checkLogin({
            success: function() {
              cartApi
                .addToCart($scope.product)
                .then(function(data) {
                  toastService.setToast(data && data.data && data.data.msg || '');
                })
                .catch(function() {
                  toastService.setToast('添加失败');
                });
            }
          });
        };

        $scope.goToCart = function() {
          userService.checkLogin({
            success: function() {
              cartApi
                .addToCart($scope.product)
                .then(function() {
                  userService.checkLogin('tab.cart');
                })
                .catch(function() {});
            }
          });
        };
      }
    };
  });
