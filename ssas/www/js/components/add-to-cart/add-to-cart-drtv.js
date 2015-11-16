angular
  .module('components')
  .directive('addToCart', function () {
    return {
      restrict: 'EA',
      templateUrl: 'templates/cart/add-to-cart.tpl.html',
      scope: {
        product: '=addToCart',
        showSpecModal: '=showSpecModal'
      },
      replace: true,
      controller: function ($scope, $state, cartApi, FavoriteApi, toastService, tabStateService, userService) {
        // 跨tab之间的跳转
        $scope.tabIndex = tabStateService.tabIndex;
        $scope.tabStateGo = tabStateService.go;

        $scope.addGoodsFavorite = function () {
          userService.checkLogin({
            success: function () {
              FavoriteApi.addGoodsFavorite([$scope.product.goods_id], function (data) {
                if (data.status === 0) {
                  toastService.setToast(data.msg);
                  $scope.product.good_has_fav = true;
                  $scope.product.favTitle = $scope.product.good_has_fav ? '已收藏' : '收藏';
                  $state.go('.', {}, {reload: true});
                }
                else {
                  toastService.setToast(data.msg);
                }
              });
            }
          });

        };
        $scope.addToCart = function () {
          return $scope.showSpecModal();
        };

        $scope.goToCart = function () {
          userService.checkLogin({
            success: function () {
              cartApi
                .addToCart($scope.product)
                .then(function (data) {
                  if (data && data.data && data.data.status === 1) {
                    toastService.setToast(data.data.msg)
                  }
                  else if (data && data.data && data.data.status === 0) {
                    $scope.tabStateGo(tabStateService.tabIndex.cart, 'tab.cart',
                      {productId: $scope.product.product_id, nature: $scope.product.nature},
                      {reload: true});
                  }
                })
                .catch(function () {
                });
            }
          });
        };
      }
    };
  });
