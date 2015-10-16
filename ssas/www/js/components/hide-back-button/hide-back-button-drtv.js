angular.module('components')
  .directive('hideBackButton', function($rootScope, $ionicNavBarDelegate) {
    return {
      restrict: 'A',
      link: function(scope, element, attributes) {
        $rootScope.justHideBackButton = false;
        scope.$on('$ionicView.beforeEnter', function() {
          var value = scope.$eval(attributes.hideBackButton);
          if (value === undefined) {
            $ionicNavBarDelegate.showBackButton(true);
          }
          else {
            $rootScope.justHideBackButton = true;
            $ionicNavBarDelegate.showBackButton(false);
          }
        });

        scope.$on('$ionicView.afterEnter', function() {
          $rootScope.justHideBackButton = false;
        });

        scope.$on('$ionicView.beforeLeave', function() {
          if (!$rootScope.justHideBackButton) {
            $ionicNavBarDelegate.showBackButton(true);
          }
        });
      }
    };
  });
