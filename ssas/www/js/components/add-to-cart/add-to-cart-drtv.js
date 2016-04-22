angular
  .module('components')
  .directive('addToCart', function () {
    return {
      restrict: 'EA',
      templateUrl: 'templates/cart/add-to-cart.tpl.html',
      scope: {
        product: '=addToCart',
        showSpecModal: '=showSpecModal',
        showDirectModal: '=showDirectModal'
      },
      replace: true,
      controller: function ($scope, $state, cartApi, FavoriteApi, toastService, userService) {
        $scope.addGoodsFavorite = function () {
          userService.checkLogin({
            success: function () {
              FavoriteApi.addGoodsFavorite([$scope.product.goods_id], function (data) {
                 console.log('member-add_favorite.html******' + angular.toJson(data));
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
          return $scope.showDirectModal();
        };
      }
    }
  });
