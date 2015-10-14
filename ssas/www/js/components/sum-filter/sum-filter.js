'use strict';

angular.module('components').filter('sum', function() {
  return function(items, property) {
    var result = 0;
    if(property) {
      angular.forEach(items, function (item) {
        result += parseFloat(item[property]);
      });
      return result;
    }
    angular.forEach(items, function (item) {
      result += item;
    });
    return result;
  };
});
