angular.module('components')
  .directive('quantityInput', function($rootScope) {
    return {
      restrict: 'EA',
      templateUrl: 'templates/components/quantity-input.tpl.html',
      scope: {
        ngModel: '='
      }
    };
  });
