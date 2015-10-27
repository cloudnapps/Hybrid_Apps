
angular.module('components')
  .factory('cartApi', ['$http', 'apiEndpoint', 'transformRequestAsFormPost', 'userService',
    function($http, apiEndpoint, transformRequestAsFormPost, userService) {

      var addToCart = function (product) {
        console.log(product);
        var data = {
          product_id: product.product_id,
          goods_id: product.goods_id,
          num: 1,
          member_id: userService.get('memberId'),
          token: userService.get('token')
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
          member_id: userService.get('memberId'),
          token: userService.get('token')
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
          member_id: userService.get('memberId'),
          token: userService.get('token')
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
          member_id: userService.get('memberId'),
          token: userService.get('token')
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
          member_id: userService.get('memberId'),
          token: userService.get('token')
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

      var checkout = function (cart, nature) {
        var shipping, addr_id, card_id;
        if(cart) {
          shipping = [];
          angular.forEach(cart.aSelCart, function (seller) {
            shipping.push({seller_id: seller.seller_info.seller_id, shipping_id: seller.def_shipping.id});
          });
          addr_id = (cart.def_addr || {}).addr_id;
          card_id = (cart.def_cardlist || {}).card_id;
        }
        var data = {
          shipping: shipping,
          addr_id: addr_id,
          card_id: card_id,
          member_id: userService.get('memberId'),
          nature: nature,
          token: userService.get('token')
        };

        var request = $http({
          method: 'post',
          url: apiEndpoint.url + '/cart-checkout.html',
          transformRequest: transformRequestAsFormPost,
          data: data,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

        return request;
      };

      var createOrder = function (cart) {
        var shipping, addr_id, nature;

        shipping = [];
        angular.forEach(cart.aSelCart, function (seller) {
          shipping.push({
            seller_id: (seller.seller_info || {}).seller_id,
            shipping_id: (seller.def_shipping || {}).id,
            is_tax:false,
            tax_company: '',
            memo: seller.memo
          });
        });
        addr_id = (cart.def_addr || {}).addr_id;
        nature = cart.nature;

        console.log(cart);

        var data = {
          shipping: shipping,
          addr_id: addr_id,
          payment: (cart.def_payment || {}).app_id,
          card_id: (cart.def_cardlist || {}).card_id,
          nature: cart.nature,
          member_id: userService.get('memberId'),
          token: userService.get('token')
        };

        var request = $http({
          method: 'post',
          url: apiEndpoint.url + '/order-create.html',
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
        remove: remove,
        checkout: checkout,
        createOrder: createOrder
      };

    }]);
