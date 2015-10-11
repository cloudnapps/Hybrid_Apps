
angular.module('components')
  .factory('cartApi', ['$http', 'apiEndpoint', 'transformRequestAsFormPost',
    function($http, apiEndpoint, transformRequestAsFormPost) {

      var addToCart = function (product) {
        console.log(product);
        var data = {
          product_id: product.product_id,
          goods_id: product.goods_id,
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4'
        };
        var request = $http({
          method: 'post',
          url: apiEndpoint.url + '/cart-addToCart.html',
          transformRequest: transformRequestAsFormPost,
          data: data,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

        return request;
      };

      var getCart = function () {
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4'
        };
        var request = $http({
          method: 'post',
          url: apiEndpoint.url + '/cart.html',
          transformRequest: transformRequestAsFormPost,
          data: data,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

        return request;
      };

      var updateCart = function (good) {
        var data = {
          obj_ident: good.obj_ident,
          num: good.quantity,
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4'
        };

        var request = $http({
          method: 'post',
          url: apiEndpoint.url + '/cart-updateCart.html',
          transformRequest: transformRequestAsFormPost,
          data: data,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

        return request;
      };

      var nocheck = function (goods) {
        var obj_idents = [];
        angular.forEach(goods, function (good) {
          obj_idents.push({obj_ident: good.obj_ident, check_ident: good.selected});
        });
        var data = {
          obj_idents: obj_idents,
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4'
        };

        var request = $http({
          method: 'post',
          url: apiEndpoint.url + '/cart-nocheck.html',
          transformRequest: transformRequestAsFormPost,
          data: data,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

        return request;
      };

      var remove = function (goods) {
        var obj_ident = [];
        angular.forEach(goods, function (good) {
          obj_ident.push(good.obj_ident);
        });
        var data = {
          obj_ident: obj_ident,
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4'
        };

        var request = $http({
          method: 'post',
          url: apiEndpoint.url + '/cart-remove_cart.html',
          transformRequest: transformRequestAsFormPost,
          data: data,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

        return request;
      };

      return {
        addToCart : addToCart,
        getCart: getCart,
        updateCart: updateCart,
        nocheck: nocheck,
        remove: remove
      };

    }]);