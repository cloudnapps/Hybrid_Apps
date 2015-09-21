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

  .controller('ShopController', function ($scope, shopApi) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    $scope.items = [];

    shopApi.getGallery().then(function (result) {
      $scope.items = result.data.data.goodslist;
    })


    // $scope.chats = Chats.all();
    // $scope.remove = function(chat) {
    //   Chats.remove(chat);
    // };
  }) // end of ShopController

  .factory('shopApi', function($http, apiEndpoint) {
    console.log(apiEndpoint);

    var getGallery = function(){
      return $http.get(apiEndpoint.url + "/gallery.html")
        .then(function(result){
          console.log('got data:' + result);
          return result;
        })
    }

    return {
      getGallery: getGallery
    };
  }); // end of shopApi
})();
