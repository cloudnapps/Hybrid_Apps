angular.module('components').directive('focus', function($timeout) {
  return {
    scope: { 
      trigger: '=focus' 
    },
    link: function(scope, element, attr) {
      scope.$watch('trigger', function(value) {
        if(value === true) {
          $timeout(function() {
            element[0].focus(); 
          });
        }
      });
    }
  };
});
