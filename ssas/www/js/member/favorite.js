(function () {
  angular.module('favorite', ['starter.services'])
    .config(function ($stateProvider) {

      // Ionic uses AngularUI Router which uses the concept of states
      // Learn more here: https://github.com/angular-ui/ui-router
      // Set up the various states which the app can be in.
      // Each state's controller can be found in controllers.js
      $stateProvider

        .state('tab.favorites', {
          url: '/favorites',
          views: {
            'tab-member': {
              templateUrl: 'templates/member/favorite-index.html'
            }
          }
        })
        .state('tab.favorites.goods', {
          url: '/goods',
          views: {
            'tab-favorites': {
              templateUrl: 'templates/member/favorite-goods.html',
              controller: 'FavoritesGoodsCtrl'
            }
          }
        })
        .state('tab.favorites.sellers', {
          url: '/sellers',
          views: {
            'tab-favorites': {
              templateUrl: 'templates/member/favorite-sellers.html',
              controller: 'FavoritesSellersCtrl'
            }
          }
        })
    })

    .controller('FavoritesGoodsCtrl', function ($scope, $ionicPopup, FavoriteApi) {
      $scope.items = [];

      $scope.selectType = "goods";

      $scope.init = function () {
        if ($scope.items.length === 0) {
          $scope.items = [];
          $scope.page = 0;
          $scope.hasMore = true;
        }
      };

      $scope.loadMore = function () {
        FavoriteApi.getFavoriteList($scope.page + 1, $scope.selectType, function (result) {
          if (result.status === 1) {
            $scope.hasMore = false;
          }
          else {
            $scope.items = $scope.items.concat(result.data);
            $scope.page += 1;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
        });
      };

      $scope.$on('$ionicView.enter', function () {
        $scope.isActtive = true;
        $scope.init();
      });

      $scope.$on('$ionicView.beforeLeave', function () {
        $scope.isActtive = false;
      });

      $scope.$on('$stateChangeSuccess', function () {
        if ($scope.isActtive)
          $scope.loadMore();
      });

      $scope.remove = function (item) {
        var confirmPopup = $ionicPopup.confirm({
          title: '删除收藏',
          template: '是否真的需要删除收藏?'
        });

        confirmPopup.then(function (res) {
          if (res) {
            FavoriteApi.deleteGoodsFavorite(item.goods_id, function (result) {
              var alertPopup = $ionicPopup.alert({
                title: '删除收藏',
                template: result.msg
              });
              alertPopup.then(function (res) {
                console.log(res);
              });
            })
          }
        });
      }
    })

    .controller('FavoritesSellersCtrl', function ($scope, $ionicPopup, FavoriteApi) {
      $scope.items = [];

      $scope.selectType = "sellers";

      $scope.init = function () {
        if ($scope.items.length === 0) {
          $scope.items = [];
          $scope.page = 0;
          $scope.hasMore = true;
        }
      };

      $scope.loadMore = function () {
        FavoriteApi.getFavoriteList($scope.page + 1, $scope.selectType, function (result) {
          if (result.status === 1) {
            $scope.hasMore = false;
          }
          else {
            $scope.items = $scope.items.concat(result.data);
            $scope.page += 1;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
        });
      };

      $scope.$on('$ionicView.enter', function () {
        $scope.isActtive = true;
        $scope.init();
      });

      $scope.$on('$ionicView.beforeLeave', function () {
        $scope.isActtive = false;
      });

      $scope.$on('$stateChangeSuccess', function () {
        if ($scope.isActtive)
          $scope.loadMore();
      });

      $scope.remove = function (item) {
        var confirmPopup = $ionicPopup.confirm({
          title: '删除收藏',
          template: '是否真的需要删除收藏?'
        });

        confirmPopup.then(function (res) {
          if (res) {
            FavoriteApi.deleteSellerFavorite(item.seller_id, function (result) {
              var alertPopup = $ionicPopup.alert({
                title: '删除收藏',
                template: result.msg
              });
              alertPopup.then(function (res) {
                console.log(res);
              });
            })
          }
        });
      }
    })

    .factory('FavoriteApi', function ($http, apiEndpoint, userService, transformRequestAsFormPost) {
      var sendRequest = function (url, data, callback) {
        var request = $http({
          method: "post",
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
