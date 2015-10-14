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
          if(!isLogin()) {
            return;
          }
          FavoriteApi
            .addGoodsFavorite([$scope.product.goods_id], function(data, errReason) {
              if (data) {
                return toastService.setToast(data.msg);
              }
              toastService.setToast('添加失败');
            });
        };
        $scope.addToCart = function() {
          if(!isLogin()) {
            return;
          }
          cartApi
            .addToCart($scope.product)
            .then(function(data) {
              toastService.setToast(data && data.data && data.data.msg || '');
            })
            .catch(function(e) {
              toastService.setToast('添加失败');
            });
        };

        function isLogin(){
          if(!userService.isLogin()) {
            // 跳转登录
            userService.backIndex = $scope.tabIndex.shop;
            $scope.tabStateGo($scope.tabIndex.member);
            return false;
          }
          return true;
        }
      }
    };
  });
