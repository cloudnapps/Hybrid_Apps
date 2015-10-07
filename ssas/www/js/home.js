(function () {
  var home = angular.module('home', [])
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

    .controller('HomeController', function ($scope, $timeout, $ionicSlideBoxDelegate, HomeApi) {
      $scope.homeInfo = {};

      HomeApi.getHomeContent().then(function (result) {
        $scope.homeInfo = result.data.data;
        $scope.slideimgs = $scope.homeInfo.once;
        $timeout(function(){
          $ionicSlideBoxDelegate.$getByHandle('slideimgs').update();
        } , 1000);
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
