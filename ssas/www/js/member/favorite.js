(function () {
  angular.module('favorite', ['starter.services'])
    .config(function ($stateProvider) {

      // Ionic uses AngularUI Router which uses the concept of states
      // Learn more here: https://github.com/angular-ui/ui-router
      // Set up the various states which the app can be in.
      // Each state's controller can be found in controllers.js
      $stateProvider

        .state('viewfavorite', {
          url: '/member/favorites',
          views: {
            'main-view': {
              templateUrl: 'templates/member/favorite-index.html',
              controller: 'FavoritesCtrl'
            }
          }
        })
    })

    .controller('FavoritesCtrl', function ($scope, FavoriteApi) {
      $scope.selectType = "goods";

      var reload = function() {
        $scope.items = [];
        FavoriteApi.getFavoriteList(null, $scope.selectType, function (result) {
          $scope.items = result.data;
        });
      };

      reload();

      $scope.selectTab = function(tabType) {
        $scope.selectType = tabType;
        reload();
      }
    })

    .factory('FavoriteApi', function ($http, apiEndpoint, transformRequestAsFormPost) {
      console.log(apiEndpoint);

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
        );
      }

      var getFavoriteList = function (page, type, callback) {
        var url = apiEndpoint.url + '/member-favorite.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4'
        };

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
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
          goods_id: goodsId
        };

        sendRequest(url, data, callback);
      };

      var deleteGoodsFavorite = function (goodsId, callback) {
        var url = apiEndpoint.url + '/member-ajax_del_fav.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
          goods_id: goodsId
        };

        sendRequest(url, data, callback);
      };

      var addSellerFavorite = function (sellerId, callback) {
        var url = apiEndpoint.url + '/member-seller_fav.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
          seller_id: goodsId
        };

        sendRequest(url, data, callback);
      };

      var deleteSellerFavorite = function (sellerId, callback) {
        var url = apiEndpoint.url + '/member-del_seller_fav.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
          seller_id: goodsId
        };

        sendRequest(url, data, callback);
      };

      return {
        getFavoriteList : getFavoriteList,
        addGoodsFavorite : addGoodsFavorite,
        deleteGoodsFavorite : deleteGoodsFavorite,
        addSellerFavorite : addSellerFavorite,
        deleteSellerFavorite : deleteSellerFavorite
      };
    });
})();
