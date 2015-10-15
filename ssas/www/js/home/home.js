(function () {
  var home = angular.module('home', ['seller', 'point'])
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

    .controller('HomeController', function ($scope, $timeout, $ionicSlideBoxDelegate,
                                            $state, $ionicPopover, $window,
                                            HomeApi, SellerApi, ActivityApi) {
      $scope.homeInfo = {};

      $scope.sellerInfo = {};

      $scope.activityInfo = {};

      HomeApi.getHomeContent().then(function (result) {
        $scope.homeInfo = result.data.data;
        $scope.slideimgs = $scope.homeInfo.once;
        $timeout(function () {
          $ionicSlideBoxDelegate.$getByHandle('slideimgs').update();
        }, 1000);
      });

      $ionicPopover.fromTemplateUrl('findPopover.html', {
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

      ActivityApi.getActivityContent().then(function (result) {
        $scope.activityInfo = result.data.data;
      })
    }) // end of HomeController

    .controller('ActivityController', function ($scope, ActivityApi) {
      $scope.activityInfo = {};

      ActivityApi.getActivityContent().then(function (result) {
        $scope.activityInfo = result.data.data;
      })
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
      }
    }) // end of HomeController

    .factory('HomeApi', ['$http', 'apiEndpoint', 'transformRequestAsFormPost',
      function ($http, apiEndpoint, transformRequestAsFormPost) {

        var getHomeContent = function () {
          var data = {};
          var request = $http({
            method: "post",
            url: apiEndpoint.url + "/home.html",
            transformRequest: transformRequestAsFormPost,
            data: data,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          });

          return request.success(function (result) {
            console.log('got data:' + result);
            return result;
          })
        };

        return {
          getHomeContent: getHomeContent
        }
      } // end of anonymous function
    ])

    .factory('ActivityApi', ['$http', 'apiEndpoint', 'transformRequestAsFormPost',
      function ($http, apiEndpoint, transformRequestAsFormPost) {

        var getActivityContent = function () {
          var data = {};
          var request = $http({
            method: "post",
            url: apiEndpoint.url + "/activity-gallery.html",
            transformRequest: transformRequestAsFormPost,
            data: data,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          });

          return request.success(function (result) {
            console.log('got data:' + result);
            return result;
          })
        };

        return {
          getActivityContent: getActivityContent
        }
      } // end of anonymous function
    ]);
})();
