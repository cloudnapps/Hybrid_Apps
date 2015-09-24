(function () {
  angular.module('coupon', ['starter.services'])
    .config(function ($stateProvider) {

      // Ionic uses AngularUI Router which uses the concept of states
      // Learn more here: https://github.com/angular-ui/ui-router
      // Set up the various states which the app can be in.
      // Each state's controller can be found in controllers.js
      $stateProvider

        .state('tab.coupons', {
          url: '/member/coupons',
          views: {
            'tab-member': {
              templateUrl: 'templates/member/list-coupons.html',
              controller: 'CouponsCtrl'
            }
          }
        })
    })

    .controller('CouponsCtrl', function ($scope,  $ionicPopup, CouponApi) {
      $scope.items = [];

      CouponApi.getCouponList(null, function (result) {
        $scope.items = result.data;
      });
    })

    .factory('CouponApi', function ($http, apiEndpoint, transformRequestAsFormPost) {
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

      var getCouponList = function (page, callback) {
        var url = apiEndpoint.url + '/member-coupon_list.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4'
        };

        if (page) {
          data.page = page;
        }

        sendRequest(url, data, callback);
      };

      return {
        getCouponList: getCouponList
      };
    });
})();
