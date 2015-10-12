angular
  .module('components')
  .directive('toast', function() {
    return {
      restrict: 'AE',
      template: '<div class="toast" ng-show="toast && toast.length"><span class="msg">{{toast[0]}}</span></div>',
      replace: true,
      scope: true,
      controller: function($scope, toastService) {
        $scope.toast = toastService.getToast();
      }
    };
  });
