(function () {
  angular.module('favorite', ['starter.services'])
    .controller('FavoritesCtrl', function ($scope, $state, $stateParams, $ionicPopup,
                                           toastService, favoriteStateService, FavoriteApi) {
      $scope.init = function () {
        $scope.items = [];
        $scope.page = 1;
        $scope.hasMore = false;
        $scope.filter = '';
        $scope.favoriteState = 1;
      };

      $scope.getFavorities = function () {
        FavoriteApi.getFavoriteList($scope.page, $scope.filter, function (result) {
          if (result.status === 1) {
            $scope.hasMore = false;
          }
          else {
            $scope.hasMore = true;
            $scope.items = $scope.items.concat(result.data);
          }

          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      };

      $scope.switchFavorities = function (type) {
        $scope.init();

        $scope.filter = type;

        if (type == 'sellers') {
          $scope.favoriteState = 1;
        }
        else if (type == 'goods') {
          $scope.favoriteState = 2;
        }

        favoriteStateService.set(type);
        $scope.getFavorities();
      };

      $scope.$on('$ionicView.beforeEnter', function () {
        $scope.switchFavorities(favoriteStateService.get());
      });

      $scope.loadMore = function () {
        $scope.page++;
        $scope.getFavorities();
      };

      $scope.remove = function (item) {
        var confirmPopup = $ionicPopup.confirm({
          title: '删除收藏',
          template: '是否真的需要删除收藏?',
          cancelText: '取消', // String (默认: 'Cancel')。一个取消按钮的文字。
          okText: '确定' // String (默认: 'OK')。OK按钮的文字。
        });

        confirmPopup.then(function (res) {
          if (res) {
            if ($scope.filter === 'sellers') {
              FavoriteApi.deleteSellerFavorite(item.seller_id, function (result) {
                if (result.status === 1) {
                  toastService.setToast(result.msg);
                }
                else {
                  toastService.setToast(result.msg);
                  $state.go('.', {}, {reload: true});
                }
              });
            }
            else {
              FavoriteApi.deleteGoodsFavorite(item.goods_id, function (result) {
                if (result.status === 1) {
                  toastService.setToast(result.msg);
                }
                else {
                  toastService.setToast(result.msg);
                  $state.go('.', {}, {reload: true});
                }
              });
            }
          }
        });
      };
    })

    .factory('FavoriteApi', function ($http, apiEndpoint, userService, transformRequestAsFormPost) {
      var sendRequest = function (url, data, callback) {
        var request = $http({
          method: 'post',
          url: url,
          transformRequest: transformRequestAsFormPost,
          data: data,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

        request.success(
          function (result) {
            console.log(result);
            callback(result);
          }
        ).error(function (err) {
            callback(null, err);
          });
      };

      var getFavoriteList = function (page, type, callback) {
        var url = apiEndpoint.url + '/member-favorite.html';
        var data = userService.getMember();

        if (page) {
          data.page = page;
        }

        if (type) {
          data.type = type;
        }

        sendRequest(url, data, callback);
      };

      var addGoodsFavorite = function (goodsId, callback) {
        var url = apiEndpoint.url + '/member-add_favorite.html';
        var data = userService.getMember();

        data.goods_id = goodsId;

        sendRequest(url, data, callback);
      };

      var deleteGoodsFavorite = function (goodsId, callback) {
        var url = apiEndpoint.url + '/member-ajax_del_fav.html';
        var data = userService.getMember();

        data.goods_id = goodsId;

        sendRequest(url, data, callback);
      };

      var addSellerFavorite = function (sellerId, callback) {
        var url = apiEndpoint.url + '/member-seller_fav.html';
        var data = userService.getMember();

        data.seller_id = sellerId;

        sendRequest(url, data, callback);
      };

      var deleteSellerFavorite = function (sellerId, callback) {
        var url = apiEndpoint.url + '/member-del_seller_fav.html';
        var data = userService.getMember();

        data.seller_id = sellerId;

        sendRequest(url, data, callback);
      };

      return {
        getFavoriteList: getFavoriteList,
        addGoodsFavorite: addGoodsFavorite,
        deleteGoodsFavorite: deleteGoodsFavorite,
        addSellerFavorite: addSellerFavorite,
        deleteSellerFavorite: deleteSellerFavorite
      };
    });
})();
