(function () {
  angular.module('search', [])

    .controller('SearchController', function ($scope, $stateParams, $state, SearchApi) {
      $scope.keywords = {};
      console.log($stateParams);
      $scope.keywords.kind = $stateParams.kind;

      // 和遮罩层有关
      $scope.isShow = {};
      $scope.page = 1;
      $scope.hasMore = false;

      $scope.historyKeywords = [];

      $scope.getHistory = function () {
        var query = {
          page: $scope.page,
          kind:$scope.keywords.kind
        };
        if ($scope.orderBy) {
          query.orderBy = $scope.orderBy;
        }
        SearchApi.getActivityContent(query).then(function (result) {
          if (result.data !== undefined &&
              result.data.data !== undefined &&
              result.data.data.product_info !== undefined &&
              result.data.data.product_info.length > 0) {
            for (var i = 0; i < result.data.data.product_info.length; i++) {
              $scope.historyKeywords.push(result.data.data.product_info[i]);
            }
            $scope.hasMore = true;
          } else {
            $scope.hasMore = false;
          }

          //测试用
          for(var i = 0; i < 10; i++){
            $scope.historyKeywords.push('测试商品'+(($scope.page-1)*10+i));
          }
          $scope.hasMore = ($scope.historyKeywords.length<=50);

          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      }

      $scope.getHistory();

      $scope.loadMore = function () {
        $scope.page++;
        $scope.getHistory();
      };

      $scope.clearSearch = function (event) {
        $scope.keywords.value = '';
        $scope.keywords.kind = '0';
        event.stopPropagation();
      };

      $scope.search = function (keyword) {
        if ($scope.keywords.kind === '0') {
          return $state.go('products', {keywords: keyword});
        }
        else {
          return $state.go('sellers', {keywords: keyword});
        }
      };
    }) // end of Controller

    .factory('SearchApi', ['$http', 'apiEndpoint', 'transformRequestAsFormPost',
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
            console.log('activity-gallery.html******' + angular.toJson(result));
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
