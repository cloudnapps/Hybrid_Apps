(function () {
  angular.module('home', ['seller', 'point'])
    .controller('HomeController', function ($scope, $ionicSlideBoxDelegate, $ionicLoading,
                                            $rootScope, barcode, $cordovaInAppBrowser, userService, $ionicPopup,
                                            $state, $ionicPopover, $window, $interval, $ionicScrollDelegate,
                                            HomeApi, SellerApi, $http, shopApi, $ionicLoading) {
      $scope.homeInfo = {};
      $scope.sellerInfo = {};

      $scope.activityInfo = {};

      $scope.goodsInfo = {};

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

      $scope.doRefresh = function(){
        $scope.getHomeInfo();
      };

      $scope.changeSearchKind = function (kind) {
        $scope.popover.hide();
        $scope.kind = kind;
      };

      $scope.search = function () {
        if (!$scope.kind) {
          return $state.go('products', {keywords: $scope.keywords.value});
        }
        return $state.go('sellers', {keywords: $scope.keywords.value});
      };

      $scope.clearSearch = function (event) {
        $scope.keywords.value = '';
        event.stopPropagation();
      };

      SellerApi.getSellerList(null, null, null, function (result) {
        if (result.status === 0) {
          $scope.sellerInfo.items = result.data;
        }
      });

      $scope.getHomeInfo = function () {
        HomeApi.getHomeContent().then(function (result) {
          $scope.homeInfo = result.data.data;

          $scope.slideimgs = $scope.homeInfo.once;
          $scope.activityInfo = $scope.homeInfo.act_info;

          $scope.getProducts = function () {
            var query = {
              page: $scope.page,
              filter: {
                brand_id: $scope.homeInfo.goods_gallery[0].filter.brand,
                cat_id: $scope.homeInfo.goods_gallery[0].filter.cat_id
              }
            };

            shopApi.getGallery(query).then(function (result) {
              $scope.goodsInfo = result.data.data;
            });
          };

          $scope.getProducts();

          var promise = $interval(function () {
            $ionicSlideBoxDelegate.$getByHandle('slideimgs').update();
          }, 2000);

          $scope.$on('$destroy', function () {
            $interval.cancel(promise);
          });
        })
        .finally(function() {
           // Stop the ion-refresher from spinning
           $scope.$broadcast('scroll.refreshComplete');
         });
      };

      $scope.getHomeInfo();

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
          $state.go('product', {productId: item.id});
        }
      };


      $scope.loginPortal = function () {
        var state = {
          success: success
        };

        userService.checkLogin(state);
      };

      function parseQueryString(url) {
        var json = {};
        var arr = url.substr(url.indexOf('?') + 1).split('&');
        arr.forEach(function (item) {
          var tmp = item.split('=');
          json[tmp[0]] = tmp[1];
        });
        return json;
      }

      var success = function (caller, args) {
        var acIP;
        var params = {};
        hoko.checkConnection("http://www.baidu.com", function (result) {
            alert(result.location);
            acIP = result.location.split('/')[2];
            params = parseQueryString(result.location);
            alert(JSON.stringify(params));

            if (!acIP || !params) {
              alert('一键上网失败');
            }
            else {
              var url = 'http://' + acIP + '/quickauth.do?isapp=1&wlanacname=' + params.wlanacname +
                '&wlanuserip=' + params.ip + '&userid=' + userService.get('mobile');
              alert(url);
              $http({
                method: 'GET',
                url: url
              })
                .then(function successCallback(response) {
                  alert('step2' + JSON.stringify(response));
                  $http({
                    method: 'GET',
                    url: 'https://securelogin.arubanetworks.com/auth/index.html/u?password=8888&username='
                    + userService.get('mobile')
                  })
                    .then(function successCallback(response) {
                      toastService.setToast('一键上网成功');
                      alert('step3' + JSON.stringify(response));
                    }, function errorCallback(response) {
                      alert('step3' + JSON.stringify(response));
                    });
                },
                function errorCallback(response) {
                  alert('step2' + JSON.stringify(response));
                });
            }
          },
          function (error) {
            alert(JSON.stringify(error));
          });
      };

      $scope.openWeb = function () {
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
      };

      $scope.showMap = function () {
        $ionicLoading.show();
        navi.showMapNavigator("", "1",
          function () {
            $ionicLoading.hide();
          },
          function () {
            $ionicLoading.hide();
          });
      };

      $scope.shake = function () {
        shake.shakeByBeacon();
      };

      $scope.monitor = function () {
        beaconMonitor.monitorByBeacon();
      };
    }) // end of HomeController

    .controller('ActivityController', function ($scope, ActivityApi) {
      $scope.activityInfo = {};

      ActivityApi.getActivityContent().then(function (result) {
        $scope.activityInfo = result.data.data;
      });
    }) // end of ActivityController

    .controller('SigninController', function ($scope, $ionicPopup, $cordovaGeolocation, PointApi) {
      var lat_constant = 31,
        long_constant = 121;

      function radius(d) {
        return d * Math.PI / 180.0;//经纬度转换成三角函数中度分表形式。
      }

      //计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
      function getDistance(lat1, lng1, lat2, lng2) {
        var radLat1 = radius(lat1);
        var radLat2 = radius(lat2);
        var a = radLat1 - radLat2;
        var b = radius(lng1) - radius(lng2);
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
            Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * 6378.137;// EARTH_RADIUS;
        s = Math.round(s * 10000) / 10000; //输出为公里
        //s=s.toFixed(4);
        return s;
      }

      $scope.signedIn = function () {
        navigator.geolocation.getCurrentPosition(function (response) {
            //alert(JSON.stringify(response));
            var distantce = getDistance(response.coords.latitude, response.coords.longitude,
              lat_constant, long_constant);
            //alert(distantce);
            PointApi.addGold(10, '签到送金币', function (result) {
              var alertPopup = $ionicPopup.alert({
                title: '签到成功',
                template: '恭喜你获得10个金币，请到会员中心查看'
              });
              alertPopup.then(function (res) {
                console.log(res);
              });
            });
          }, function (err) {
            console.log(JSON.stringify(err));
          },
          {
            enableHighAccuracy: false,
            timeout: 60 * 1000,
            maximumAge: 1000 * 60 * 10
          });
      };
    }) // end of SigninController

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
