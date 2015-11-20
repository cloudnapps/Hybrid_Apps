(function () {
  angular.module('feedback', ['starter.services'])
    .controller('FeedbacksCtrl', function ($scope, $state, $stateParams, ReturnApi, ComplaintApi) {
      $scope.init = function () {
        $scope.items = [];
        $scope.page = 1;
        $scope.hasMore = false;
        $scope.type = 'returns';
        $scope.filter = '';
        $scope.feedbackState = 1;
      };

      $scope.getReturnList = function () {
        ReturnApi.getReturnList($scope.page, $scope.filter, function (result) {
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

      $scope.getComplaints = function () {
        ComplaintApi.getComplaintList($scope.page, $scope.filter, function (result) {
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

      function getItems() {
        if ($scope.type === 'returns') {
          $scope.feedbackState = 1;
          $scope.getReturnList();
        }
        else if ($scope.type === 'complaints') {
          $scope.feedbackState = 2;
          $scope.getComplaints();
        }
      }

      $scope.$on('$ionicView.beforeEnter', function () {
        $scope.init();
        getItems();
      });

      $scope.loadMore = function () {
        $scope.page++;
        getItems();
      };

      $scope.switchFeedbacks = function (type) {
        $scope.init();

        $scope.type = type;

        getItems();
      };
    })
})();
