(function () {
  angular.module('seller', [])
      .controller('SellerListController', function ($scope, $state, $stateParams, $cordovaInAppBrowser, $cordovaBarcodeScanner, SellerApi) {

      $scope.keywords = {};

      $scope.init = function () {
        $scope.items = [];
        $scope.page = 1;
        $scope.hasMore = false;
        $scope.filter = {};
      };

      $scope.getSellers = function () {
        SellerApi.getSellerList($scope.page, null, $scope.filter, function (result) {
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

      $scope.init();

      if($stateParams.keywords) {
        $scope.keywords.value = $stateParams.keywords;
        $scope.filter = {
          keywords: $scope.keywords.value
        };
        console.log($scope.filter);
      }

      $scope.getSellers();

      $scope.loadMore = function () {
        $scope.page++;
        $scope.getSellers();
      };

      $scope.search = function () {
        $scope.filter = {
          keywords: $scope.keywords.value
        };

        $scope.init();
        $scope.getSellers();
      };
    }) // end of SellersListController

    .controller('SellerDetailController', function ($scope, $stateParams, $timeout, $ionicSlideBoxDelegate,
                                                    SellerApi, shopApi, FavoriteApi, userService, toastService) {
      $scope.init = function() {
        $scope.products = [];
        $scope.allProducts = [];
        $scope.page = 1;
        $scope.hasMore = false;
        $scope.productType = 1;
        $scope.sellerId = $stateParams.sellerId;
        $scope.item = {};
        $scope.item.title = '商户详情';
      };

      $scope.getSeller = function(){
        SellerApi.getSellerDetail($scope.sellerId, function (result) {
          $scope.item = result.data;
          $scope.item.title = $scope.item.once.name;

          $scope.getProducts();
          $scope.showAdvertise();
        });
      };

      $scope.getProducts = function () {
        var query = {
          page: $scope.page,
          filter: {seller_id: $scope.sellerId}
        };
        if ($scope.orderBy) {
          query.orderBy = $scope.orderBy;
        }
        shopApi.getGallery(query).then(function (result) {
          if (result.data.data !== undefined && result.data.data.length > 0) {
            for (var i = 0; i < result.data.data.length; i++) {
              $scope.allProducts.push(result.data.data[i]);
            }
            $scope.hasMore = true;
          } else {
            $scope.hasMore = false;
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      };

      $scope.loadMore = function () {
        if ($scope.productType === 1) {
          $scope.page++;
          $scope.getProducts();
        }
      };

      function isLogin() {
        if (!userService.isLogin()) {
          // 跳转登录
          userService.backIndex = $scope.tabIndex.shop;
          $scope.tabStateGo($scope.tabIndex.member);
          return false;
        }
        return true;
      }

      $scope.addFavorite = function () {
        if (!isLogin()) {
          return;
        }

        FavoriteApi.addSellerFavorite($scope.sellerId, function (data) {
          if (data) {
            return toastService.setToast(data.msg);
          }
          toastService.setToast('添加失败');
        });
      };

      $scope.showAdvertise = function () {
        $scope.productType = 1;
        $scope.products = $scope.allProducts;
      };

      $scope.showRecommend = function () {
        $scope.productType = 2;
        $scope.products = $scope.item.third;
      };

      $scope.showItem = function () {
        $scope.productType = 3;
        $scope.products = $scope.item.fourth;
      };

      $scope.$on('$ionicView.beforeEnter', function(){
        $scope.init();
        $scope.getSeller();
      });
    })

    .factory('SellerApi', function ($http, apiEndpoint, transformRequestAsFormPost) {
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
      };
    });
})();
