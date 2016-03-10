(function () {
  angular.module('activity', [])

    .controller('ActivityInfoController', function ($scope, $stateParams, ActivityApi) {
      $scope.actId = $stateParams.actId;
      $scope.page = 1;
      $scope.hasMore = false;

      $scope.title = "";
      $scope.products = [];

      $scope.getProducts = function () {
        var query = {
          page: $scope.page,
          act_id:$scope.actId
        };
        if ($scope.orderBy) {
          query.orderBy = $scope.orderBy;
        }
        ActivityApi.getActivityContent(query).then(function (result) {
          if (result.data !== undefined &&
              result.data.data !== undefined &&
              result.data.data.product_info !== undefined &&
              result.data.data.product_info.length > 0) {
            for (var i = 0; i < result.data.data.product_info.length; i++) {
              $scope.products.push(result.data.data.product_info[i]);
            }
            $scope.hasMore = true;
          } else {
            $scope.hasMore = false;
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      }

      $scope.loadMore = function () {
        $scope.page++;
        $scope.getProducts();
      };

      $scope.getProducts();
    }) // end of ActivityController

    .factory('ActivityApi', ['$http', 'apiEndpoint', 'transformRequestAsFormPost',
      function ($http, apiEndpoint, transformRequestAsFormPost) {

        var getActivityContent = function (data) {
          var request = $http({
            method: 'post',
            url: apiEndpoint.url + '/activity-gallery.html',
            transformRequest: transformRequestAsFormPost,
            data: data,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          });

          return request.success(function (result) {
            console.log('got data:' + result);
            console.log(result);
            return result;
          });
        };

        return {
          getActivityContent: getActivityContent
        };
      } // end of anonymous function
    ]);

})();
