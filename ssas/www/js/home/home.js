(function () {
  angular.module('home', ['seller', 'point'])
    .controller('HomeController', function ($scope, $ionicSlideBoxDelegate, $ionicLoading, toastService,
                                            $rootScope, barcode, $cordovaInAppBrowser, userService, wechatService,
                                            $state, $ionicPopover, $ionicPopup, $window, $interval, $ionicScrollDelegate, $timeout,
                                            HomeApi, SellerApi, $http, shopApi) {
      $scope.homeInfo = {};
      $scope.sellerInfo = {};

      $scope.activityInfo = {};

      $scope.goodsInfo = {};

      $scope.showBtns = false;

      $scope.keywords = {};

      $scope.keywords.kind = '0';

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

      $scope.doRefresh = function () {
        $scope.getHomeInfo();


      };

      function testApp(url) {
        var timeout, t = 1000;

        setTimeout(function () {
          document.body.removeChild(ifr);
        }, 2000);

        var t1 = Date.now();
        var ifr = document.createElement("iframe");
        ifr.setAttribute('src', url);
        ifr.setAttribute('style', 'display:none');
        document.body.appendChild(ifr);
        timeout = setTimeout(function () {
          var t2 = Date.now();
          if (!t1 || t2 - t1 < t + 100) {
            wechatService.set(false);
          }
        }, t);
      }

      testApp('weixin://');
      testApp('wechat://');

      $scope.changeSearchKind = function (kind) {
        $scope.popover.hide();
        $scope.keywords.kind = kind;
      };

      $scope.search = function () {
        if ($scope.keywords.kind === '0') {
          return $state.go('products', {keywords: $scope.keywords.value});
        }
        else {
          return $state.go('sellers', {keywords: $scope.keywords.value});
        }
      };

      $scope.clearSearch = function (event) {
        $scope.keywords.value = '';
        $scope.keywords.kind = '0';
        event.stopPropagation();
      };

      SellerApi.getSellerList(null, null, null, function (result) {
        if (result.status === 0) {
          $scope.sellerInfo.items = result.data;
        }
      });

      var timer = null;
      $scope.slideHasChanged = function (index) {
        $timeout.cancel(timer);
        if (index > 0 && index === $scope.slideimgs.length - 1) {
          timer = $timeout(function () {
            $ionicSlideBoxDelegate.$getByHandle('slideimgs').slide(0);
          }, 4000);
        }
      };

      $scope.slideimgs = [];
      $scope.getHomeInfo = function () {
        HomeApi.getHomeContent().then(function (result) {
          $scope.homeInfo = result.data.data;

          if (!$scope.slideimgs || $scope.slideimgs.length === 0) {
            $timeout(function () {
              $scope.slideimgs = $scope.homeInfo.once;
            }, 0);
          }
          else {
            $timeout(function () {
              $scope.slideimgs = $scope.homeInfo.once;
            }, 2000);
          }

          $scope.activityInfo = $scope.homeInfo.act_info;

          $scope.getProducts = function () {
            var query = {
              page: $scope.page,
              filter: {
                brand: $scope.homeInfo.goods_gallery[0].filter.brand,
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
          .finally(function () {
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
        else if (item.type === 'url' && item.outurl) {
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
        $ionicLoading.show();
        hoko.checkConnection("http://www.baidu.com", function (result) {
            if (!result.location) {
              $ionicLoading.hide();
              toastService.setToast('一键上网失败');
            }
            else {
              acIP = result.location.split('/')[2];
              params = parseQueryString(result.location);
              //alert(JSON.stringify(params));

              if (!acIP || !params) {
                $ionicLoading.hide();
                toastService.setToast('一键上网失败');
              }
              else {
                var url = 'http://' + acIP + '/quickauth.do?isapp=1&wlanacname=' + params.wlanacname +
                  '&wlanuserip=' + params.ip + '&userid=' + userService.get('mobile');
                //alert(url);
                $http({
                  method: 'GET',
                  url: url
                })
                  .then(function successCallback(response) {
                    //alert('step2' + JSON.stringify(response));
                    $http({
                      method: 'GET',
                      url: 'https://securelogin.arubanetworks.com/auth/index.html/u?password=8888&username='
                      + userService.get('mobile')
                    })
                      .then(function successCallback(response) {
                        $ionicLoading.hide();
                        toastService.setToast('一键上网成功');
                        //alert('step3' + JSON.stringify(response));
                      }, function errorCallback(response) {
                        $ionicLoading.hide();
                        //alert('step3 error' + JSON.stringify(response));
                        toastService.setToast('一键上网失败');
                      });
                  },
                  function errorCallback(response) {
                    //alert('step2 error' + JSON.stringify(response));
                    $ionicLoading.hide();
                    toastService.setToast('一键上网失败');
                  });
              }
            }
          },
          function (error) {
            //alert('step1 error' + JSON.stringify(error));
            $ionicLoading.hide();
            toastService.setToast('一键上网失败');
          });
      };

      $scope.openWeb = function () {
        $ionicLoading.show();
        var options = {
          location: 'no',
          clearcache: 'yes',
          toolbar: 'no'
        };
        $cordovaInAppBrowser.open('http://map.baidu.com/mobile/webapp/search/search/qt=s&wd=深圳前海港货中心&vt=map', '_self', options)
          .then(function (event) {
            $ionicLoading.hide();
          })
          .catch(function (event) {
            $ionicLoading.hide();
          });
        //$cordovaInAppBrowser.close();
      };

      $scope.showMap = function () {
        var confirmPopup = $ionicPopup.confirm({
          title: '提示',
          template: '请确保您的蓝牙设备已经开启?',
          cancelText: '取消', // String (默认: 'Cancel')。一个取消按钮的文字。
          okText: '确定' // String (默认: 'OK')。OK按钮的文字。
        });

        confirmPopup.then(function (res) {
          $ionicLoading.show();
          navi.showMapNavigator("", "1",
            function () {
              $ionicLoading.hide();
            },
            function () {
              $ionicLoading.hide();
            });
        })
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

    .controller('SigninController', function ($scope, toastService, userService, $cordovaGeolocation, PointApi) {
      /*      var lat_constant = 31,
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
       }*/

      $scope.signedIn = function () {
        var state = {
          success: success
        };

        userService.checkLogin(state);
      };

      var success = function (caller, args) {
        PointApi.addGold(10, '签到送金币', function (result) {
          if (result.status === 0) {
            var msg = '签到成功，恭喜您获得' + result.data.gold_num + '个金币，请到会员中心查看';
            toastService.setToast(msg);
          }
          else {
            toastService.setToast(result.msg);
          }
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
})
();
