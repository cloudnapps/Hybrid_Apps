angular.module('components')
  .directive('hideTabs', function($rootScope) {
    return {
      restrict: 'A',
      link: function(scope, element, attributes) {
        
        $rootScope.justHideTabs = false;
        scope.$on('$ionicView.beforeEnter', function() {
          var value = scope.$eval(attributes.hideTabs);
          if (value === undefined) {
            $rootScope.hideTabs = false;
          }
          else {
            $rootScope.justHideTabs = true;
            $rootScope.hideTabs = value;
          }
        });

        scope.$on('$ionicView.afterEnter', function() {
          $rootScope.justHideTabs = false;
        });

        scope.$on('$ionicView.beforeLeave', function() {
          if (!$rootScope.justHideTabs) {
            $rootScope.hideTabs = false;
          }
        });
      }
    };
  });
