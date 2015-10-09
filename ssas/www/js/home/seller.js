(function () {
  var home = angular.module('seller', [])
    .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider
        .state('tab.sellers', {
          url: '/sellers',
          views: {
            'tab-home': {
              templateUrl: 'templates/home/seller-list.html',
              controller: 'SellerListController'
            }
          }
        })

        .state('tab.seller_detail', {
          url: '/sellers/:sellerId',
          views: {
            'tab-home': {
              templateUrl: 'templates/home/seller-detail.html',
              controller: 'SellerDetailController'
            }
          }
        })
    }) // end of config

    .controller('SellerListController', function ($scope, $state, $cordovaInAppBrowser, SellerApi) {
      $scope.items = [];

      $scope.init = function () {
        if ($scope.items.length === 0) {
          $scope.items = [];
          $scope.page = 0;
          $scope.hasMore = true;
        }
      };

      $scope.loadMore = function () {
        SellerApi.getSellerList($scope.page + 1, null, null, function (result) {
          if (result.status === 1) {
            $scope.hasMore = false;
          }
          else {
            $scope.items = $scope.items.concat(result.data);
            $scope.page += 1;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
        });
      };

      $scope.$on('$ionicView.enter', function () {
        $scope.isActtive = true;
        $scope.init();
      });

      $scope.$on('$ionicView.beforeLeave', function () {
        $scope.isActtive = false;
      });

      $scope.$on('$stateChangeSuccess', function () {
        if ($scope.isActtive)
          $scope.loadMore();
      });

      $scope.goDetail = function (item) {
        $state.go("tab.seller_detail", {sellerId: item.seller_id}, {reload: true});
      };

      //test plugin features
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
        payObj["appid"] = "1234";
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
      }

      $scope.showMap = function () {
        alert("navi");

        navi.showMapNavigator("07550002F0110050", "1");
      }

      $scope.shake = function () {
        alert("shake");

        shake.shakeByBeacon();
      }

      $scope.monitor = function () {
        alert("monitor");
        beaconMonitor.monitorByBeacon();
      }
    }) // end of SellersListController

    .controller('SellerDetailController', function ($scope, $stateParams, $timeout, $ionicSlideBoxDelegate, SellerApi) {
      $scope.products = [];

      $scope.showAdvertise = function () {
        $scope.products = $scope.item.second;
      };

      $scope.showRecommend = function () {
        $scope.products = $scope.item.third;
      };

      $scope.showItem = function () {
        $scope.products = $scope.item.fourth;
      };

      SellerApi.getSellerDetail($stateParams.sellerId, function (result) {
        $scope.item = result.data;

        $scope.slideimgs = $scope.item.once.recommend;
        $timeout(function () {
          $ionicSlideBoxDelegate.$getByHandle('slideimgs').update();
        }, 1000);

        $scope.showAdvertise();
      });
    })

    .factory('SellerApi', function ($http, apiEndpoint, transformRequestAsFormPost) {
      console.log(apiEndpoint);

      var sendRequest = function (url, data, callback) {
        var request = $http({
          method: "post",
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
      }
    })
})();
