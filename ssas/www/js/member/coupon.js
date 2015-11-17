(function () {
  angular.module('coupon', ['starter.services'])

    .controller('CouponsCtrl', function ($scope, $state, $ionicPopup, $ionicLoading, CouponApi) {
      $scope.init = function () {
        $scope.items = [];
        $scope.page = 1;
        $scope.hasMore = false;
      };

      $scope.getCoupons = function () {
        $ionicLoading.show();
        CouponApi.getCouponList($scope.page, function (result) {
          $ionicLoading.hide();

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

      $scope.loadMore = function () {
        $scope.page++;
        $scope.getCoupons();
      };

      $scope.$on('$ionicView.beforeEnter', function () {
        $scope.init();
        $scope.getCoupons();
      });
    })

    .factory('CouponApi', function ($http, apiEndpoint, userService, transformRequestAsFormPost) {
      console.log(apiEndpoint);

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

      var getCouponList = function (page, callback) {
        var url = apiEndpoint.url + '/member-coupon_list.html';
        var data = userService.getMember();

        if (page) {
          data.page = page;
        }

        sendRequest(url, data, callback);
      };

      return {
        getCouponList: getCouponList
      };
    });
})
();
