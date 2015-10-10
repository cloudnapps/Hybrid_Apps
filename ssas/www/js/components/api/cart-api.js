
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

      return {
        addToCart : addToCart,
        getCart: getCart
      };

    }]);