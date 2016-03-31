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

      if ($stateParams.keywords) {
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

    .controller('SellerDetailController', function ($scope, $state, $stateParams, $timeout, $ionicSlideBoxDelegate, $window,
                                                    SellerApi, shopApi, FavoriteApi, userService, toastService,
                                                    $interval) {
      $scope.init = function () {
        $scope.products = [];
        $scope.allProducts = [];
        $scope.page = 1;
        $scope.hasMore = false;
        $scope.productType = 1;
        $scope.sellerId = $stateParams.sellerId;
        $scope.item = {};
        $scope.item.title = '商户详情';
        $scope.item.favTitle = '收藏店铺';
        $scope.keywords = {value: ''};
      };

      // 和遮罩层有关
      $scope.isShow = {};

      var timer = null;
      $scope.slideHasChanged = function (index) {
        $timeout.cancel(timer);
        if (index > 0 && index === $scope.slideimgs.length - 1) {
          timer = $timeout(function () {
            $ionicSlideBoxDelegate.$getByHandle('slideimgs').slide(0);
          }, 4000);
        }
      };

      $scope.getSeller = function () {
        SellerApi.getSellerDetail($scope.sellerId, function (result) {
          $scope.item = result.data;
          $scope.item.title = $scope.item.once.name;
          $scope.item.favTitle = $scope.item.once.seller_has_fav ? '已收藏' : '收藏店铺';
          $scope.slideimgs = $scope.item.once.recommend;

          var promise = $interval(function () {
            $ionicSlideBoxDelegate.$getByHandle('slideimgs').update();
          }, 2000);

          $scope.$on('$destroy', function () {
            $interval.cancel(promise);
          });

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

      $scope.addFavorite = function () {
        var state = {
          success: success
        };

        userService.checkLogin(state);
      };

      var success = function (caller, args) {
        FavoriteApi.addSellerFavorite($scope.sellerId, function (data) {
          if (data) {
            toastService.setToast(data.msg);
            $scope.item.once.seller_has_fav = true;
            $scope.item.favTitle = $scope.item.once.seller_has_fav ? '已收藏' : '收藏店铺';
            $state.go('.', {}, {reload: true});
          }
        });
      };

      $scope.showAdvertise = function () {
        $scope.productType = 1;
        $scope.products = $scope.allProducts;
      };

      $scope.showRecommend = function () {
        $scope.productType = 2;
        $scope.products = $scope.item.third;
        $scope.hasMore = false;
      };

      $scope.showItem = function () {
        $scope.productType = 3;
        $scope.products = $scope.item.fourth;
        $scope.hasMore = false;
      };

      $scope.openItem = function (item) {
        if (item.type === 'seller') {
          $state.go('seller-detail', {sellerId: item.id}, {reload: true});
        }
        else if (item.type === 'url' && item.outurl) {
          $window.open(item.outurl, '_blank', 'location=no');
        }
        else if (item.type === 'product') {
          $state.go('product', {productId: item.id});
        }
      };

      $scope.search = function () {
        return $state.go('products', {keywords: $scope.keywords.value, sellerId: $scope.sellerId});
      };

      $scope.clearSearch = function (event) {
        $scope.keywords.value = '';
        event.stopPropagation();
      };

      $scope.$on('$ionicView.beforeEnter', function () {
        $scope.init();
        $scope.getSeller();
      });
    })

    .factory('SellerApi', function ($http, apiEndpoint, userService, transformRequestAsFormPost) {
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
          seller_id: sellerId,
          member_id: userService.get('memberId'),
          token: userService.get('token')
        };

        sendRequest(url, data, callback);
      };


      return {
        getSellerList: getSellerList,
        getSellerDetail: getSellerDetail
      };
    });
})();
