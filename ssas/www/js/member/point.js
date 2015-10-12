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
        .state('tab.points_list', {
          url: '/point/list',
          views: {
            'tab-member': {
              templateUrl: 'templates/member/point-list.html',
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
        })
        .state('tab.golds_list', {
          url: '/gold/list',
          views: {
            'tab-member': {
              templateUrl: 'templates/member/gold-list.html',
              controller: 'GoldsCtrl'
            }
          }
        });
    })
    .controller('PointsCtrl', function ($scope, PointApi) {
      $scope.pointInfo = {};

      PointApi.getPointInfo(null, 'point', function (result) {
        if (result.status === 0) {
          $scope.pointInfo.total = result.data.total;
          $scope.pointInfo.items = result.data.log;
        }
      });
    })
    .controller('GoldsCtrl', function ($scope, PointApi) {
      $scope.goldInfo = {};

      PointApi.getPointInfo(null, 'gold', function (result) {
        if (result.status === 0) {
          $scope.goldInfo.total = result.data.total;
          $scope.goldInfo.items = result.data.log;
        }
      });
    })
    .factory('PointApi', function ($http, apiEndpoint, transformRequestAsFormPost) {
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

      var getPointInfo = function (page, type, callback) {
        var url = apiEndpoint.url + '/member-point_log.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
          type: type
        };

        if (page) {
          data.page = page;
        }

        sendRequest(url, data, callback);
      };

      var addGold = function (value, reason, callback) {
        var url = apiEndpoint.url + '/member-add_gold.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
          add_value: value,
          reason: reason
        };

        sendRequest(url, data, callback);
      };

      return {
        getPointInfo: getPointInfo,
        addGold: addGold
      };
    });
})();
