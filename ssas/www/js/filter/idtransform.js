/**
 * Created by xianlong on 1/20/16.
 */

angular.module('starter')
  .filter('idtransform', function () {
    return function (input) {
      if (input) {
        return input.slice(0, 6) + '********' + input.slice(14);
      }
    }
  });
