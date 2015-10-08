(function () {
  angular.module('point', ['starter.services'])
    .config(function ($stateProvider) {

      // Ionic uses AngularUI Router which uses the concept of states
      // Learn more here: https://github.com/angular-ui/ui-router
      // Set up the various states which the app can be in.
      // Each state's controller can be found in controllers.js
      $stateProvider

        .state('points_index', {
          url: '/points/index',
          views: {
            'main-view': {
              templateUrl: 'templates/member/point-index.html',
              controller: 'PointsCtrl'
            }
          }
        })
        .state('points_list', {
          url: '/points/list',
          views: {
            'main-view': {
              templateUrl: 'templates/member/point-list.html',
              controller: 'PointsCtrl'
            }
          }
        });
    })
    .controller('PointsCtrl', function ($scope, PointApi) {
      $scope.pointInfo = {};

      PointApi.getPointInfo(null, function (result) {
        if(result.status === 0) {
          $scope.pointInfo.total = result.data.total;
          $scope.pointInfo.actTotal = result.data.act_total;
          $scope.pointInfo.salesTotal = result.data.sales_total;
          $scope.pointInfo.items = result.data.log;
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

      var getPointInfo = function (page, callback) {
        var url = apiEndpoint.url + '/member-point_log.html';
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
        getPointInfo: getPointInfo
      };
    });
})();