(function () {
  var home = angular.module('home', ['seller'])
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
    }) // end of config

    .controller('HomeController', function ($scope, $timeout, $ionicSlideBoxDelegate, $ionicPopover, HomeApi, SellerApi) {
      $scope.homeInfo = {};

      $scope.sellerInfo = {};

      HomeApi.getHomeContent().then(function (result) {
        $scope.homeInfo = result.data.data;
        $scope.slideimgs = $scope.homeInfo.once;
        $timeout(function(){
          $ionicSlideBoxDelegate.$getByHandle('slideimgs').update();
        } , 1000);
      });

      $ionicPopover.fromTemplateUrl('findPopover.html', {
        scope: $scope,
      }).then(function(popover) {
        $scope.popover = popover;
      });
      $scope.openPopover = function($event) {
        $scope.popover.show($event);
      };
      $scope.closePopover = function() {
        $scope.popover.hide();
      };
      //Cleanup the popover when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.popover.remove();
      });
      // Execute action on hide popover
      $scope.$on('popover.hidden', function() {
        // Execute action
      });
      // Execute action on remove popover
      $scope.$on('popover.removed', function() {
        // Execute action
      });

      SellerApi.getSellerList(null, null, null, function (result) {
        if (result.status === 0) {
          $scope.sellerInfo.items = result.data;
        }
      });
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
    ]
  );
})();
