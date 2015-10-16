(function () {
  angular.module('point', ['starter.services'])
    .config(function ($stateProvider) {

      // Ionic uses AngularUI Router which uses the concept of states
      // Learn more here: https://github.com/angular-ui/ui-router
      // Set up the various states which the app can be in.
      // Each state's controller can be found in controllers.js
      $stateProvider

        .state('tab.points', {
          url: '/points',
          views: {
            'tab-member': {
              templateUrl: 'templates/member/point-index.html',
              controller: 'PointsCtrl'
            }
          }
        })
        .state('tab.golds', {
          url: '/golds',
          views: {
            'tab-member': {
              templateUrl: 'templates/member/gold-index.html',
              controller: 'GoldsCtrl'
            }
          }
        });
    })
    .controller('PointsCtrl', function ($scope, PointApi) {
      $scope.pointInfo = {};

      $scope.pointInfo.isShow = false;

      $scope.pointInfo.items = [];

      $scope.init = function () {
        if ($scope.pointInfo.items.length === 0) {
          $scope.pointInfo.items = [];
          $scope.pointInfo.page = 0;
          $scope.pointInfo.hasMore = true;
        }
      };

      $scope.loadMore = function () {
        PointApi.getPointInfo($scope.page + 1, 'point', function (result) {
          if (result.status === 1) {
            $scope.hasMore = false;
          }
          else {
            $scope.pointInfo.total = result.data.total;
            $scope.pointInfo.items = $scope.pointInfo.items.concat(result.data.log);
            $scope.pointInfo.page += 1;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
        });
      };

      $scope.$on('$ionicView.enter', function () {
        $scope.isActive = true;
        $scope.init();
      });

      $scope.$on('$ionicView.beforeLeave', function () {
        $scope.isActive = false;
      });

      $scope.$on('$stateChangeSuccess', function () {
        if ($scope.isActive)
          $scope.loadMore();
      });

      $scope.loadMore();

      $scope.showHistory = function () {
        $scope.pointInfo.isShow = !$scope.pointInfo.isShow;
      }
    })
    .controller('GoldsCtrl', function ($scope, PointApi) {
      $scope.goldInfo = {};

      $scope.goldInfo.isShow = false;

      $scope.goldInfo.items = [];

      $scope.init = function () {
        if ($scope.goldInfo.items.length === 0) {
          $scope.goldInfo.items = [];
          $scope.goldInfo.page = 0;
          $scope.goldInfo.hasMore = true;
        }
      };

      $scope.loadMore = function () {
        PointApi.getPointInfo($scope.page + 1, 'gold', function (result) {
          if (result.status === 1) {
            $scope.hasMore = false;
          }
          else {
            $scope.goldInfo.total = result.data.total;
            $scope.goldInfo.items = $scope.goldInfo.items.concat(result.data.log);
            $scope.goldInfo.page += 1;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
        });
      };

      $scope.$on('$ionicView.enter', function () {
        $scope.isActive = true;
        $scope.init();
      });

      $scope.$on('$ionicView.beforeLeave', function () {
        $scope.isActive = false;
      });

      $scope.$on('$stateChangeSuccess', function () {
        if ($scope.isActive)
          $scope.loadMore();
      });

      $scope.loadMore();

      $scope.showHistory = function () {
        $scope.goldInfo.isShow = !$scope.goldInfo.isShow;
      }
    })
    .factory('PointApi', function ($http, apiEndpoint, userService, transformRequestAsFormPost) {
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


      var currentUser = userService.get();

      var init = function () {
        if (!currentUser) {
          currentUser = userService.get();
        }

        return data = {
          member_id: currentUser.memberId,
          token: currentUser.token
        }
      };

      var getPointInfo = function (page, type, callback) {
        var url = apiEndpoint.url + '/member-point_log.html';
        var data = init();

        data.type = type;

        if (page) {
          data.page = page;
        }

        sendRequest(url, data, callback);
      };

      var addGold = function (value, reason, callback) {
        var url = apiEndpoint.url + '/member-add_gold.html';
        var data = init();

        data.add_value = value;
        data.reason = reason;

        sendRequest(url, data, callback);
      };

      return {
        getPointInfo: getPointInfo,
        addGold: addGold
      };
    });
})();
