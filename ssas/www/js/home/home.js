(function () {
  angular.module('home', ['seller', 'point'])
    .config(function ($stateProvider) {
      $stateProvider
        .state('tab.home', {
          url: '/home',
          views: {
            'tab-home': {
              templateUrl: 'templates/home/home-index.html',
              controller: 'HomeController'
            }
          }
        })
        .state('tab.home-search-history', {
          url: '/home',
          views: {
            'tab-home': {
              templateUrl: 'templates/home/home-search-history.html',
              controller: 'HomeSearchHistoryController'
            }
          }
        })
        .state('tab.signin', {
          url: '/signin',
          views: {
            'tab-home': {
              templateUrl: 'templates/home/home-signin.html',
              controller: 'SigninController'
            }
          }
        })
        .state('tab.activity', {
          url: '/activity',
          views: {
            'tab-home': {
              templateUrl: 'templates/home/activity-list.html',
              controller: 'ActivityController'
            }
          }
        });
    }) // end of config

    .controller('HomeController', function ($scope, $timeout, $ionicSlideBoxDelegate, $ionicLoading, barcode,
                                            $state, $ionicPopover, $window, $interval, $cordovaInAppBrowser,
                                            HomeApi, SellerApi, toastService, $ionicScrollDelegate, $rootScope) {
      $scope.homeInfo = {};

      $scope.sellerInfo = {};

      $scope.activityInfo = {};

      $scope.showBtns = false;

      $scope.keywords = {};

      $rootScope.barcodeScan = barcode.scan;

      $ionicPopover.fromTemplateUrl('shopPopover.html', {
        scope: $scope
      }).then(function (popover) {
        $scope.popover = popover;
      });
      $scope.openPopover = function ($event) {
        $scope.popover.show($event);
      };
      $scope.closePopover = function () {
        $scope.popover.hide();
      };
      //Cleanup the popover when we're done with it!
      $scope.$on('$destroy', function () {
        $scope.popover.remove();
      });
      // Execute action on hide popover
      $scope.$on('popover.hidden', function () {
        // Execute action
      });
      // Execute action on remove popover
      $scope.$on('popover.removed', function () {
        // Execute action
      });

      $scope.changeSearchKind = function (kind) {
        $scope.popover.hide();
        $scope.kind = kind;
      };

      $scope.search = function () {
        if (!$scope.kind) {
          return $scope.tabStateGo($scope.tabIndex.shop, 'tab.products', {keywords: $scope.keywords.value});
        }
        return $scope.tabStateGo($scope.tabIndex.home, 'tab.sellers', {keywords: $scope.keywords.value});
      };

      $scope.clearSearch = function (event) {
        $scope.keywords.value = '';
        event.stopPropagation();
      };

      HomeApi.getHomeContent().then(function (result) {
        $scope.homeInfo = result.data.data;

        $scope.slideimgs = $scope.homeInfo.once;
        $scope.activityInfo = $scope.homeInfo.act_info;

        $scope.activityInfo.updateDiff = function () {

          var end_time = new Date($scope.activityInfo.end_time);
          var now_time = new Date();

          var diff_time = (end_time.getTime() - now_time.getTime()) / 1000;
          var diff_hour = parseInt(diff_time / (60 * 60));
          var diff_minute = parseInt((diff_time - diff_hour * 60 * 60) / 60);
          var diff_second = parseInt(diff_time - diff_hour * 60 * 60 - diff_minute * 60);

          $scope.activityInfo.diff_time = diff_hour + ':' + diff_minute + ':' + diff_second;
        };

        $timeout(function () {
          $ionicSlideBoxDelegate.$getByHandle('slideimgs').update();
        }, 1000);

        var promise = $interval(function () {
          $scope.activityInfo.updateDiff();
        }, 1000);

        $scope.$on('$destroy', function () {
          $interval.cancel(promise);
        });
      });

      $scope.openBtns = function () {
        $scope.showBtns = !$scope.showBtns;

        $ionicScrollDelegate.scrollTop();
      };

      $scope.openItem = function (item) {
        if (item.type === 'seller') {
          $state.go('tab.seller_detail', {sellerId: item.id}, {reload: true});
        }
        else if (item.type === 'url') {
          $window.location.href = item.outurl;
        }
        else if (item.type === 'product') {
          $scope.tabStateGo($scope.tabIndex.shop, 'tab.product', {productId: item.id});
        }
      };

      SellerApi.getSellerList(null, null, null, function (result) {
        if (result.status === 0) {
          $scope.sellerInfo.items = result.data;
        }
      });

      $scope.signIn = function () {
        $state.go('tab.signin', {}, {reload: true});
      };

      $scope.openWeb = function () {
        $ionicLoading.show();
        var options = {
          location: 'no',
          clearcache: 'yes',
          toolbar: 'no'
        };
        $cordovaInAppBrowser.open('http://map.baidu.com/mobile/webapp/search/search/qt=s&wd=深圳前海自贸区临海大道59号&vt=map', '_self', options)
          .then(function (event) {
            // success
          })
          .catch(function (event) {
            // error
          });
        //$cordovaInAppBrowser.close();

        $ionicLoading.hide();
      };

      $scope.showMap = function () {
        $ionicLoading.show();

        navi.showMapNavigator("07550002F0110050", "1");

        $ionicLoading.hide();
      };

      $scope.shake = function () {
        $ionicLoading.show();

        shake.shakeByBeacon();

        $ionicLoading.hide();
      };

      $scope.monitor = function () {
        $ionicLoading.show();

        beaconMonitor.monitorByBeacon();

        $ionicLoading.hide();
      };
    }) // end of HomeController

    .controller('ActivityController', function ($scope, ActivityApi) {
      $scope.activityInfo = {};

      ActivityApi.getActivityContent().then(function (result) {
        $scope.activityInfo = result.data.data;
      });
    }) // end of ActivityController

    .controller('SigninController', function ($scope, $ionicPopup, PointApi) {
      $scope.signedIn = function () {
        PointApi.addGold(10, '签到送积分', function (result) {
          if (result.status === 0) {
            var alertPopup = $ionicPopup.alert({
              title: '签到成功',
              template: '恭喜你获得10个金币，请到会员中心查看'
            });
            alertPopup.then(function (res) {
              console.log(res);
            });
          }
        });
      };
    }) // end of HomeController

    .factory('HomeApi', ['$http', 'apiEndpoint', 'transformRequestAsFormPost',
      function ($http, apiEndpoint, transformRequestAsFormPost) {

        var getHomeContent = function () {
          var data = {};
          var request = $http({
            method: 'post',
            url: apiEndpoint.url + '/home.html',
            transformRequest: transformRequestAsFormPost,
            data: data,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          });

          return request.success(function (result) {
            console.log('got data:' + result);
            return result;
          });
        };

        return {
          getHomeContent: getHomeContent
        };
      } // end of anonymous function
    ])

    .factory('ActivityApi', ['$http', 'apiEndpoint', 'transformRequestAsFormPost',
      function ($http, apiEndpoint, transformRequestAsFormPost) {

        var getActivityContent = function () {
          var data = {};
          var request = $http({
            method: 'post',
            url: apiEndpoint.url + '/activity-gallery.html',
            transformRequest: transformRequestAsFormPost,
            data: data,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          });

          return request.success(function (result) {
            console.log('got data:' + result);
            return result;
          });
        };

        return {
          getActivityContent: getActivityContent
        };
      } // end of anonymous function
    ]);
})();
