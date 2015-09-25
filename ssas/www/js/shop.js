(function(){
  var shop = angular.module('shop', [])
  
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('tab.shop', {
      url: '/shop',
      views: {
        'tab-shop': {
          templateUrl: 'templates/shop/shop-index.html',
          controller: 'ShopController'
        }
      }
    })
    .state('tab.categories', {
      url: '/categories',
      views : {
        'tab-categories': {
          templateUrl: 'templates/shop/shop-categories.html',
          controller: 'CategoryController'
        }
      }
    }) 
    // .state('tab.chat-detail', {
    //   url: '/chats/:chatId',
    //   views: {
    //     'tab-chats': {
    //       templateUrl: 'templates/chat-detail.html',
    //       controller: 'ChatDetailCtrl'
    //     }
    //   }
    // })
  })

  .controller('CategoryController', ['$scope', 'shopApi', function($scope, shopApi){
    $scope.categories = [];

    shopApi.getCategories().then(function(result) {
      $scope.categories = [];
      var categories = result.data.data;
      for(var firstLv in categories) {
        $scope.categories.push(categories[firstLv])
      }      
    });
  }]) // end of CategoryController

  .controller('ShopController', ['$scope', 'shopApi', function ($scope, shopApi) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    $scope.items = [];

    shopApi.getGallery().then(function (result) {
      $scope.items = result.data.data;
    })


    // $scope.chats = Chats.all();
    // $scope.remove = function(chat) {
    //   Chats.remove(chat);
    // };
  }]) // end of ShopController

  .factory('shopApi', ['$http', 'apiEndpoint', 'transformRequestAsFormPost',
    function($http, apiEndpoint, transformRequestAsFormPost) {
     
      var getGallery = function(){
        var data = {};
        var request = $http({
            method: "post",
            url: apiEndpoint.url + "/gallery.html",
            transformRequest: transformRequestAsFormPost,
            data: data,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          });

        return request.success(function(result){
            console.log('got data:' + result);
            return result;
        })        
      }

      var getCategories = function() {
        var data = {};
        var request = $http({
          method: "post",
          url: apiEndpoint.url + '/gallery-cat_list.html',
          transformRequest: transformRequestAsFormPost,
          data: data,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

        return request.success(function(result){
          return result;
        })
      }

      return {
        getGallery : getGallery,
        getCategories: getCategories
      }

  } // end of anonymous function
  ]
  ); // end of shopApi
})(); 
