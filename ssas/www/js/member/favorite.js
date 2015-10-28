(function () {
  angular.module('favorite', ['starter.services'])
    .config(function ($stateProvider) {

      // Ionic uses AngularUI Router which uses the concept of states
      // Learn more here: https://github.com/angular-ui/ui-router
      // Set up the various states which the app can be in.
      // Each state's controller can be found in controllers.js
      $stateProvider

        .state('tab.favorites', {
          url: '/favorites?type',
          views: {
            'tab-member': {
              templateUrl: 'templates/member/favorite-index.html',
              controller: 'FavoritesCtrl'
            }
          }
        });
    })

    .controller('FavoritesCtrl', function ($scope, $stateParams, $ionicPopup, $ionicHistory, FavoriteApi) {
      $scope.init = function () {
        $scope.items = [];
        $scope.page = 1;
        $scope.hasMore = false;
        $scope.filter = '';
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

        $scope.getFavorities();
      };

      if ($stateParams.type) {
        $scope.switchFavorities($stateParams.type);
      }

      $scope.loadMore = function () {
        $scope.page++;
        $scope.getFavorities();
      };

      $scope.remove = function (item) {
        var confirmPopup = $ionicPopup.confirm({
          title: '删除收藏',
          template: '是否真的需要删除收藏?'
        });

        confirmPopup.then(function (res) {
          if (res) {
            if ($scope.filter === 'sellers') {
              FavoriteApi.deleteSellerFavorite(item.seller_id, function (result) {
                var alertPopup = $ionicPopup.alert({
                  title: '删除收藏',
                  template: result.msg
                });
                alertPopup.then(function () {
                  $ionicHistory.goBack();
                });
              });
            }
            else {
              FavoriteApi.deleteGoodsFavorite(item.goods_id, function (result) {
                var alertPopup = $ionicPopup.alert({
                  title: '删除收藏',
                  template: result.msg
                });
                alertPopup.then(function () {
                  $ionicHistory.goBack();
                });
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
