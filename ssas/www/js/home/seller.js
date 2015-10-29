(function () {
  angular.module('seller', [])
    .config(function ($stateProvider) {
      $stateProvider
        .state('tab.sellers', {
          url: '/sellers?keywords',
          views: {
            'tab-home': {
              templateUrl: 'templates/home/seller-list.html',
              controller: 'SellerListController'
            }
          }
        })

        .state('tab.seller_detail', {
  var home = angular.module('seller', [])  

    .controller('SellerListController', function ($scope, $state, $stateParams, $cordovaInAppBrowser, $cordovaBarcodeScanner, SellerApi) {

      $scope.keywords = {};

      $scope.init = function () {
        $scope.items = [];
        $scope.page = 1;
        $scope.hasMore = false;
        $scope.filter = {};
      };

      $scope.getSellers = function () {
        SellerApi.getSellerList($scope.page, null, $scope.filter, function (result) {
          if (result.status === 1) {
            $scope.hasMore = false;
          }
          else {
            $scope.hasMore = true;
            $scope.items = $scope.items.concat(result.data);
          }

          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      };

      $scope.init();

      if($stateParams.keywords) {
        $scope.keywords.value = $stateParams.keywords;
        $scope.filter = {
          keywords: $scope.keywords.value
        };
        console.log($scope.filter);
      }

      $scope.getSellers();

      $scope.loadMore = function () {
        $scope.page++;
        $scope.getSellers();
      };    

      $scope.search = function () {
        $scope.filter = {
          keywords: $scope.keywords.value
        };

        $scope.init();
        $scope.getSellers();
      };

      /*
       //test plugin features
       $scope.scanBarcode = function () {
       alert("barcode");
       $cordovaBarcodeScanner.scan().then(function (imageData) {
       alert(imageData.text);
       console.log("barcode format " + imageData.format);
       },
       function (error) {
       alert(error);
       console.log("an error " + error);
       });
       };

       $scope.openWeb = function () {
       alert("web");
       var options = {
       location: 'no',
       clearcache: 'yes',
       toolbar: 'no'
       };
       $cordovaInAppBrowser.open('http://map.baidu.com/mobile/webapp/search/search/qt=s&wd=深圳前海自贸区临海大道59号&vt=map', '_self', options)

       //$cordovaInAppBrowser.open('http://www.baidu.com', '_self', options)

       .then(function (event) {
       // success
       })
       .catch(function (event) {
       // error
       });
       //$cordovaInAppBrowser.close();
       };

       $scope.payByAlipay = function () {
       alert("alipay");
       var payObj = {};
       payObj["pay_info"] =
       "partner=\"2088101568353491\"&"
       + "seller_id=\"2088101568353491\"&"
       + "out_trade_no=\"YR2VGG3G1I31XDZ\"&"
       + "subject=\"1\"&"
       + "body=\"我是测试数据\"&"
       + "total_fee=\"0.02\"&"
       + "notify_url=\"http://www.xxx.com\"&"
       + "service=\"mobile.securitypay.pay\"&"
       + "payment_type=\"1\"&"
       + "_input_charset=\"utf-8\"&"
       + "it_b_pay=\"30m\"&"
       + "show_url=\"m.alipay.com\"&"
       + "sign=\"GsSZgPloF1vn52XAItRAldwQAbzIgkDyByCxMfTZG%2FMapRoyrNIJo4U1LUGjHp6gdBZ7U8jA1kljLPqkeGv8MZigd3kH25V0UK3Jc3C94Ngxm5S%2Fz5QsNr6wnqNY9sx%2Bw6DqNdEQnnks7PKvvU0zgsynip50lAhJmflmfHvp%2Bgk%3D\"&sign_type=\"RSA\"";
       var paymentString = JSON.stringify(payObj);

       alipay.payment(paymentString, function (cb_success) {
       alert(cb_success);
       },
       function (cb_failure) {
       alert(cb_failure);
       });
       };

       $scope.payByWechat = function () {
       alert("wxPay");
       var payObj = {};
       payObj["noncestr"] = "asdaseraerasdfasdf";
       payObj["package"] = "pakdage";
       payObj["partnerid"] = "4321";
       payObj["prepayid"] = "12414124";
       payObj["timestamp"] = "20151005";
       payObj["sign"] = "dfasldfoasifasdfas";
       var paymentString = JSON.stringify(payObj);

       wxpay.payment(paymentString, function (cb_success) {
       alert(cb_success);
       },
       function (cb_failure) {
       alert(cb_failure);
       });
       };

       $scope.logonByWechat = function () {
       alert("wxLogon");
       var scope = "snsapi_userinfo";
       wechat.auth(scope, function (cb_success) {
       alert(JSON.stringify(cb_success));
       },
       function (cb_failure) {
       alert(cb_failure);
       });
       };

       $scope.showMap = function () {
       alert("navi");

       navi.showMapNavigator("07550002F0110050", "1");
       };

       $scope.shake = function () {
       alert("shake");

       shake.shakeByBeacon();
       };

       $scope.monitor = function () {
       alert("monitor");
       beaconMonitor.monitorByBeacon();
       }*/
    }) // end of SellersListController

    .controller('SellerDetailController', function ($scope, $stateParams, $timeout, $ionicSlideBoxDelegate,
                                                    SellerApi, shopApi, FavoriteApi, userService, toastService) {
      $scope.init = function() {
        $scope.products = [];
        $scope.allProducts = [];
        $scope.page = 1;
        $scope.hasMore = false;
        $scope.productType = 1;
        $scope.sellerId = $stateParams.sellerId;
        $scope.item = {};
        $scope.item.title = '商户详情';
      };

      $scope.getSeller = function(){
        SellerApi.getSellerDetail($scope.sellerId, function (result) {
          $scope.item = result.data;
          $scope.item.title = $scope.item.once.name;

          $scope.getProducts();
          $scope.showAdvertise();
        });
      };

      $scope.getProducts = function () {
        var query = {
          page: $scope.page,
          filter: {seller_id: $scope.sellerId}
        };
        if ($scope.orderBy) {
          query.orderBy = $scope.orderBy;
        }
        shopApi.getGallery(query).then(function (result) {
          if (result.data.data !== undefined && result.data.data.length > 0) {
            for (var i = 0; i < result.data.data.length; i++) {
              $scope.allProducts.push(result.data.data[i]);
            }
            $scope.hasMore = true;
          } else {
            $scope.hasMore = false;
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      };

      $scope.loadMore = function () {
        if ($scope.productType === 1) {
          $scope.page++;
          $scope.getProducts();
        }
      };

      function isLogin() {
        if (!userService.isLogin()) {
          // 跳转登录
          userService.backIndex = $scope.tabIndex.shop;
          $scope.tabStateGo($scope.tabIndex.member);
          return false;
        }
        return true;
      }

      $scope.addFavorite = function () {
        if (!isLogin()) {
          return;
        }

        FavoriteApi.addSellerFavorite($scope.sellerId, function (data) {
          if (data) {
            return toastService.setToast(data.msg);
          }
          toastService.setToast('添加失败');
        });
      };

      $scope.showAdvertise = function () {
        $scope.productType = 1;
        $scope.products = $scope.allProducts;
      };

      $scope.showRecommend = function () {
        $scope.productType = 2;
        $scope.products = $scope.item.third;
      };

      $scope.showItem = function () {
        $scope.productType = 3;
        $scope.products = $scope.item.fourth;
      };

      $scope.$on('$ionicView.beforeEnter', function(){
        $scope.init();
        $scope.getSeller();
      });
    })

    .factory('SellerApi', function ($http, apiEndpoint, transformRequestAsFormPost) {
      console.log(apiEndpoint);

      var sendRequest = function (url, data, callback) {
        var request = $http({
          method: 'post',
          url: url,
          transformRequest: transformRequestAsFormPost,
          data: data,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

        request.success(
          function (result) {
            console.log(result);
            callback(result);
          }
        );
      };

      var getSellerList = function (page, orderby, filter, callback) {
        var url = apiEndpoint.url + '/seller-seller_list.html';
        var data = {};

        if (page) {
          data.page = page;
        }

        if (orderby) {
          data.orderBy = orderby;
        }

        if (filter) {
          data.filter = filter;
        }

        sendRequest(url, data, callback);
      };

      var getSellerDetail = function (sellerId, callback) {
        var url = apiEndpoint.url + '/seller.html';
        var data = {
          seller_id: sellerId
        };

        sendRequest(url, data, callback);
      };


      return {
        getSellerList: getSellerList,
        getSellerDetail: getSellerDetail
      };
    });
})();
