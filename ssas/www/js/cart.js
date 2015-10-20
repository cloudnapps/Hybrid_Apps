angular.module('cart', ['components'])
.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('tab.cart', {
      url: '/cart',
      cache: false,
      views: {
        'tab-cart': {
          templateUrl: 'templates/cart/cart-index.html',
          controller: 'CartController'
        }
      }
    })
    .state('tab.cart-checkout', {
      url: '/cart-checkout?nature',
      views: {
        'tab-cart': {
          templateUrl: 'templates/cart/cart-checkout.html',
          controller: 'CartCheckoutController'
        }
      }
    })
    .state('tab.cart-payment', {
      url: '/cart-payment',
      views: {
        'tab-cart': {
          templateUrl: 'templates/cart/cart-payment.html',
          controller: 'CartPaymentController'
        }
      }
    })
    .state('tab.order-payed', {
      url: '/order-payed',
      views: {
        'tab-cart': {
          templateUrl: 'templates/cart/order-payed.html',
          controller: 'OrderPayedController'
        }
      }
    })
    .state('tab.iframe', {
      url: '/iframe',
      views: {
        'tab-cart': {
          templateUrl: 'templates/cart/cart-iframe.html',
          controller: 'iframeController'
        }
      }
    });

}) // end of config

.controller('CartController', function ($scope, $state, $ionicLoading, cartApi, tabStateService, userService) {

  $scope.$on('$ionicView.beforeEnter', function(){
    if(!userService.isLogin()) {
      userService.backIndex =$scope.tabIndex.cart;
      $scope.tabStateGo($scope.tabIndex.member);
    }
  });

  $scope.load = function () {
    $ionicLoading.show();
    cartApi.getCart().success(function (responseData){
      var dataStatus = responseData.status;
      if (dataStatus === 0) {
        $scope.cart = responseData.data;
      }
    })
    .finally(function () {
      $scope.cartLoaded = true;
      $ionicLoading.hide();
    });
  };

  $scope.load();

  $scope.toggleSeller = function (seller) {
    angular.forEach(seller.goods_list, function (item) {
      item.selected = seller.seller_info.selected;
    });
    $ionicLoading.show();
    cartApi.nocheck(seller.goods_list).success(function (responseData){
      var dataStatus = responseData.status;
      if (dataStatus === 0) {
        $scope.cart = responseData.data;
      }
    })
    .finally(function () {
      $ionicLoading.hide();
    });
  };

  $scope.canCheckout = function (nature) {
    return (nature.aSelCart || []).some(function (seller) {
      return (seller.goods_list || []).some(function (good) {
        return good.selected;
      });
    });
  };

  $scope.toggleGood = function (good) {
    $ionicLoading.show();
    cartApi.nocheck([good]).success(function (responseData){
      var dataStatus = responseData.status;
      if (dataStatus === 0) {
        $scope.cart = responseData.data;
      }
    })
    .finally(function () {
      $ionicLoading.hide();
    });
  };

  $scope.updateGoodQuantity = function (good) {
    $ionicLoading.show();
    cartApi.updateCart(good).success(function (responseData){
      var dataStatus = responseData.status;
      if (dataStatus === 0) {
        $scope.cart = responseData.data;
      }
    })
    .finally(function () {
      $ionicLoading.hide();
    });
  };

  $scope.removeGood = function (good) {
    $ionicLoading.show();
    cartApi.remove([good]).success(function (responseData){
      var dataStatus = responseData.status;
      if (dataStatus === 0) {
        $scope.cart = responseData.data;
      }
    })
    .finally(function () {
      $ionicLoading.hide();
    });
  };
}) // end of CartController
.controller('CartCheckoutController', function ($rootScope, $scope, $state, $stateParams, $ionicModal, $ionicLoading, cartApi) {
  $scope.checkout = function () {
    $ionicLoading.show();
    cartApi.checkout($scope.cart, $stateParams.nature).success(function (responseData){
      var dataStatus = responseData.status;
      if (dataStatus === 0) {
        $scope.cart = responseData.data;
      }
    })
    .finally(function () {
      $ionicLoading.hide();
    });
  };
  $scope.checkout();
  $scope.confirm = function () {
    $rootScope.confirmedCart = $scope.cart;
    $state.go('tab.cart-payment');
  };
})
.controller('CartPaymentController', function ($rootScope, $scope, $state, $ionicModal, $ionicPopup, $ionicLoading, cartApi, orderApi, paymentApi) {
  $scope.cart = $rootScope.confirmedCart;
  delete $rootScope.confirmedCart;

  $scope.pay = function (payment) {
    $ionicLoading.show();
    cartApi.createOrder($scope.cart)
    .then(function (response){
      if (response.data.status !== 0) {
        $ionicPopup.alert({
          title: '未能创建订单',
          template: response.data.msg
        });

        return $q.reject();
      }

      var order = response.data.data;
      $rootScope.justCreatedOrder = order;

      return orderApi.getPayInfo(order)
      .then(function (response){
        if (response.data.status !== 0) {
          $ionicPopup.alert({
            title: '未能获取支付信息',
            template: response.data.msg
          });

          return $q.reject();
        }

        return paymentApi.pay(response.data.data)
        .then(function (data) {
          alert(data);
          $state.go('tab.order-payed');
        }, function (err) {
          $ionicPopup.alert({
            title: '支付失败',
            template: err
          });
          return $q.reject();
        });
      });
    })
    .finally(function () {
      $ionicLoading.hide();
    });
  };
})
.controller('OrderPayedController', function ($rootScope, $scope, $q, $ionicLoading, orderApi) {
  var justCreatedOrder = $rootScope.justCreatedOrder;
  delete $rootScope.justCreatedOrder;

  $scope.load = function () {
    $ionicLoading.show();
    var promises = [];
    angular.forEach((justCreatedOrder || {}).order_id, function (order_id) {
      promises.push(orderApi.getOrderDetail(order_id));
    });

    $q.all(promises)
    .then(function (responses) {
      $scope.orders = [];
      angular.forEach(responses, function (response) {
        if(response.data.status === 0) {
          $scope.orders.push(response.data.data);
        }
      });
    })
    .finally(function () {
      $ionicLoading.hide();
    });
  };

  $scope.load();
})
.controller('iframeController', function ($scope) {
  var str = ['<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /></head><body onload="javascript:document.pay_form.submit();"><form id="pay_form" name="pay_form" action="http://wap1.dccnet.com.cn:84/servlet/ICBCWAPEBizServlet" method="post">    <input type="hidden" name="interfaceName" id="interfaceName" value="ICBC_WAPB_B2C" />', 
'    <input type="hidden" name="interfaceVersion" id="interfaceVersion" value="1.0.0.3" />', 
'    <input type="hidden" name="tranData" id="tranData" value="PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iR0JLIiBzdGFuZGFsb25lPSJubyI/PjxCMkNSZXE+PGludGVyZmFjZU5hbWU+SUNCQ19XQVBCX0IyQzwvaW50ZXJmYWNlTmFtZT48aW50ZXJmYWNlVmVyc2lvbj4xLjAuMC4zPC9pbnRlcmZhY2VWZXJzaW9uPjxvcmRlckluZm8+PG9yZGVyRGF0ZT4yMDE1MTAyMDEzMTM1MTwvb3JkZXJEYXRlPjxvcmRlcmlkPjE1MTAyMDEyMDU0OTAwMDI8L29yZGVyaWQ+PGFtb3VudD44ODguMDAwPC9hbW91bnQ+PGluc3RhbGxtZW50VGltZXM+MTwvaW5zdGFsbG1lbnRUaW1lcz48Y3VyVHlwZT4wMDE8L2N1clR5cGU+PG1lcklEPjQwMDBFQzIwMDAwNDM2PC9tZXJJRD48bWVyQWNjdD40MDAwMDIzMDI5MjAwMTI0OTQ2PC9tZXJBY2N0Pjwvb3JkZXJJbmZvPjxjdXN0b20+PExhbmd1YWdlPnpoX0NOPC9MYW5ndWFnZT48L2N1c3RvbT48bWVzc2FnZT48Z29vZHNJRD48L2dvb2RzSUQ+PGdvb2RzTmFtZT48L2dvb2RzTmFtZT48Z29vZHNOdW0+PC9nb29kc051bT48Y2FycmlhZ2VBbXQ+PC9jYXJyaWFnZUFtdD48bWVySGludD48L21lckhpbnQ+PHJlbWFyazE+PC9yZW1hcmsxPjxyZW1hcmsyPjwvcmVtYXJrMj48bWVyVVJMPmh0dHA6Ly96ZGYuam9vYXUuY29tL2luZGV4LnBocC9vcGVuYXBpL2VjdG9vbHNfcGF5bWVudC9wYXJzZS9lY3Rvb2xzX3BheW1lbnRfcGx1Z2luX21pY2JjcGF5L2NhbGxiYWNrLzwvbWVyVVJMPjxtZXJWQVI+PC9tZXJWQVI+PC9tZXNzYWdlPjwvQjJDUmVxPg==" />', 
'    <input type="hidden" name="merSignMsg" id="merSignMsg" value="okCvvxUsor1K1ToarI7/5VG6SjAASQxTcJpFVjGeBuJp15cRxcBgwVYWqe/Q7azgzxsjquEsfjEfl1NBMnnzbFpN212rP4ITqsxcsRARO+/jL4n9SQ2IowdTcMTeySFdkVUzALpRhTMp8n5v4u/mlSOQIGddKDPPib4qSe82kRg=" />', 
'    <input type="hidden" name="merCert" id="merCert" value="MIIDCzCCAfOgAwIBAgIKG5LKECVWAAJRUDANBgkqhkiG9w0BAQUFADA7MR8wHQYDVQQDExZJQ0JDIFRlc3QgQ29ycG9yYXRlIENBMRgwFgYDVQQKEw90ZXN0aWNiYy5jb20uY24wHhcNMTQxMjMxMDgyOTA2WhcNMTUxMjMxMDgyOTA2WjA/MRQwEgYDVQQDEwtycDAzLmUuNDAwMDENMAsGA1UECxMENDAwMDEYMBYGA1UEChMPdGVzdGljYmMuY29tLmNuMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDCV4rtgUAUOJzEAhFUzr2IZoXkUSA16SdUq/BzRzgR783bU7FPE5H0e5FGBE6it/rF43hlvD05a2faNJi1EAyXNTYH7NywALnzDem7IpxIhX0m/6U/CemgXft2DUQzvdKeI8uN0hqdAS/QOFN3oaz0OcCVOjXlwSURWXM78/6LswIDAQABo4GQMIGNMB8GA1UdIwQYMBaAFER9t5AsN6TZ7WzipIdXZwq18E0UMEsGA1UdHwREMEIwQKA+oDykOjA4MQ4wDAYDVQQDEwVjcmwzMTEMMAoGA1UECxMDY3JsMRgwFgYDVQQKEw90ZXN0aWNiYy5jb20uY24wHQYDVR0OBBYEFM8iOikUdyO4Aw8fPEQVxqPovaUUMA0GCSqGSIb3DQEBBQUAA4IBAQBR2fCTt9oJFZYAbn+Zczegt/Oa5FC+o99nfKT/iGuACJUJprVuB/Piv+pzNKr6y870QHLLKRbwBZXnS9x0nzxoIjxiNZNspnQPOpJ//4sJCjP/pAc4vPK3xPllp5SxlyWLwfbDazGP+nyjQ6dcQYMULMGDzWhOZgPrPdK4Ma1xZn6u0AwmImhAGYVzf9c5XMewxzt91TiQLnwiUzDGVnvWFm1rbJjnc6pMp0KmAPUdGG9Fj8C+7tYhoAfHWBb1nVmrETU6+FTPS4VYC64pGgVyYxP59ptM/hurNXOUsgXTvLyVY6rhh9LzEW44QofG8bK7CIrOqYWj1LWDHzMtbaNH" />', 
'<input type="submit" type="hidden"></form></body></html>'].join('');
  $scope.html = str;
});