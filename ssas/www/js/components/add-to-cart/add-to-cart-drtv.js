angular
  .module('components')
  .directive('addToCart', function() {
    return {
      restrict: 'EA',
      templateUrl: 'templates/cart/add-to-cart.tpl.html',
      scope: {
        product: '=addToCart',
        showSpecModal: '=showSpecModal'
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
          return $scope.showSpecModal();
        };

        $scope.goToCart = function() {
          userService.checkLogin({
            success: function() {
              cartApi
                .addToCart($scope.product)
                .then(function(data) {
                  if(data && data.data && data.data.status === 1) {
                    toastService.setToast(data.data.msg)
                  }
                  else if(data && data.data && data.data.status === 0) {
                    userService.checkLogin('tab.cart');
                  }
                })
                .catch(function() {});
            }
          });
        };
      }
    };
  });
