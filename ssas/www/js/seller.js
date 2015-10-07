(function () {
  var home = angular.module('seller', [])
    .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider
        .state('seller_index', {
          url: '/sellers/index',
          views: {
            'main-view': {
              templateUrl: 'templates/shop/seller-list.html',
              controller: 'SellerListController'
            }
          }
        })

        .state('seller_detail', {
          url: '/seller/:sellerId',
          views: {
            'main-view': {
              templateUrl: 'templates/shop/seller-detail.html',
              controller: 'SellerDetailController'
            }
          }
        })
    }) // end of config

    .controller('SellerListController', function ($scope, $state, SellerApi) {
      $scope.items = [];

      $scope.init = function () {
        if ($scope.items.length === 0) {
          $scope.items = [];
          $scope.page = 0;
          $scope.hasMore = true;
        }
      };

      $scope.loadMore = function () {
        SellerApi.getSellerList($scope.page + 1, null, null, function (result) {
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

      $scope.goDetail = function (item) {
        $state.go("seller_detail", {sellerId: item.seller_id}, {reload: true});
      };
    }) // end of SellersListController

    .controller('SellerDetailController', function ($scope, $stateParams, $timeout, $ionicSlideBoxDelegate, SellerApi) {
      $scope.products = [];

      $scope.showAdvertise = function() {
        $scope.products = $scope.item.second;
      };

      $scope.showRecommend = function() {
        $scope.products = $scope.item.third;
      };

      $scope.showItem = function() {
        $scope.products = $scope.item.fourth;
      };

      SellerApi.getSellerDetail($stateParams.sellerId, function (result) {
        $scope.item = result.data;

        $scope.slideimgs = $scope.item.once.recommend;
        $timeout(function () {
          $ionicSlideBoxDelegate.$getByHandle('slideimgs').update();
        }, 1000);

        $scope.showAdvertise();
      });
    })

    .factory('SellerApi', function ($http, apiEndpoint, transformRequestAsFormPost) {
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
      };

      var getSellerList = function (page, orderby, filter, callback) {
        var url = apiEndpoint.url + '/seller-seller_list.html';
        var data = {};

        if (page) {
          data.page = page;
        }

        if (orderby) {
          data.orderBy = orderby;
        }

        if (filter) {
          data.filter = filter;
        }

        sendRequest(url, data, callback);
      };

      var getSellerDetail = function (sellerId, callback) {
        var url = apiEndpoint.url + '/seller.html';
        var data = {
          seller_id: sellerId
        };

        sendRequest(url, data, callback);
      };


      return {
        getSellerList: getSellerList,
        getSellerDetail: getSellerDetail
      }
    })
})();
