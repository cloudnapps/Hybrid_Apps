(function () {
  angular.module('point', ['starter.services'])
    .controller('PointsCtrl', function ($scope, PointApi) {
      $scope.pointInfo = {};

      $scope.pointInfo.isShow = false;

      $scope.pointInfo.items = [];

      $scope.init = function () {
        $scope.pointInfo.items = [];
        $scope.pointInfo.page = 1;
        $scope.pointInfo.hasMore = false;
        $scope.pointInfo.isShow = false;
      };

      $scope.getPointInfo = function () {
        PointApi.getPointInfo($scope.pointInfo.page, 'point', function (result) {
          if (result.status === 1) {
            $scope.pointInfo.hasMore = false;
          }
          else {
            $scope.pointInfo.hasMore = true;
            $scope.pointInfo.total = result.data.total;
            $scope.pointInfo.items = $scope.pointInfo.items.concat(result.data.log);

            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
        });
      };

      $scope.$on('$ionicView.beforeEnter', function () {
        $scope.init();
        $scope.getPointInfo();
      });

      $scope.loadMore = function () {
        $scope.pointInfo.page++;
        $scope.getPointInfo();
      };

      $scope.showHistory = function () {
        $scope.pointInfo.isShow = !$scope.pointInfo.isShow;
      };
    })
    .controller('GoldsCtrl', function ($scope, PointApi) {
      $scope.goldInfo = {};

      $scope.goldInfo.isShow = false;

      $scope.goldInfo.items = [];

      $scope.init = function () {
        $scope.goldInfo.items = [];
        $scope.goldInfo.page = 1;
        $scope.goldInfo.hasMore = false;
        $scope.goldInfo.isShow = false;
      };

      $scope.getPointInfo = function () {
        PointApi.getPointInfo($scope.goldInfo.page, 'gold', function (result) {
          if (result.status === 1) {
            $scope.goldInfo.hasMore = false;
          }
          else {
            $scope.goldInfo.hasMore = true;
            $scope.goldInfo.total = result.data.total;
            $scope.goldInfo.items = $scope.goldInfo.items.concat(result.data.log);

            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
        });
      };

      $scope.$on('$ionicView.beforeEnter', function () {
        $scope.init();
        $scope.getPointInfo();
      });

      $scope.loadMore = function () {
        $scope.goldInfo.page++;
        $scope.getPointInfo();
      };

      $scope.showHistory = function () {
        $scope.goldInfo.isShow = !$scope.goldInfo.isShow;
      };
    })
    .factory('PointApi', function ($http, apiEndpoint, userService, transformRequestAsFormPost) {
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

      var getPointInfo = function (page, type, callback) {
        var url = apiEndpoint.url + '/member-point_log.html';
        var data = userService.getMember();

        data.type = type;

        if (page) {
          data.page = page;
        }

        sendRequest(url, data, callback);
      };

      var addGold = function (value, reason, callback) {
        var url = apiEndpoint.url + '/member-add_gold.html';
        var data = userService.getMember();

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
