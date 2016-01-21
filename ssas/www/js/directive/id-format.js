/**
 * Created by xianlong on 1/20/16.
 */

angular.module('starter')
  .directive('idFormat', ['$filter', function ($filter) {
    var dateFilter = $filter('idtransform');
    return {
      require: 'ngModel',
      link: function (scope, elm, attrs, ctrl) {

        function formatter(value) {
          return dateFilter(value); //format
        }

        ctrl.$formatters.push(formatter);
      }
    };
  }]);
