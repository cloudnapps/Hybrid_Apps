angular.module('components')
  .directive('quantityInput', function() {
    return {
      restrict: 'EA',
      templateUrl: 'templates/components/quantity-input.tpl.html',
      require: 'ngModel',
      link : function(scope, element, attrs, ctrl){
        scope.updateModel = function () {
          ctrl.$setViewValue(scope.ngModel);
        };
        ctrl.$viewChangeListeners.push(function() {
          scope.$eval(attrs.ngChange);
        });
        ctrl.$render = function () {
          scope.ngModel = ctrl.$viewValue;
        };
      }
    };
  });
