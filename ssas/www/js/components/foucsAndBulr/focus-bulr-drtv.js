angular.module('components').directive('focus', function($timeout) {
  return {
    scope: { 
      trigger: '=focus' 
    },
    link: function(scope, element, attr) {
      // console.log(scope.trigger );
      element.on('focus', function(){
        $timeout(function(){
          scope.trigger.show = true;
        });
      });
      element.on('blur', function(){
        $timeout(function(){
          scope.trigger.show = false;
        });
      });
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
