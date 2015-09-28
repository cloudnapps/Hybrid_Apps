(function(){
  var shop = angular.module('shop', [])
  
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
    
    .state('tab.categories', {
      url: '/categories',
      views : {
        'tab-shop': {
          templateUrl: 'templates/shop/shop-categories.html',
          controller: 'CategoryController'
        }
      }
    }) 
    .state('tab.products', {
      url: '/products?categoryId',
      views: {
        'tab-shop': {
          templateUrl: 'templates/shop/shop-products.html',
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

  .controller('CategoryController', ['$scope', '$state', 'shopApi',
    function($scope, $state, shopApi){
    $scope.categoryObj = {};
    $scope.categories = [];
    $scope.subCategories = [];

    shopApi.getCategories().then(function(result) {
      $scope.categories = [];
      $scope.categoryObj = result.data.data;
      for(var firstLv in $scope.categoryObj) {
        $scope.categories.push($scope.categoryObj[firstLv])
      }

      if($scope.categories.length > 0) {
        $scope.populateSubCategories($scope.categories[0].cat_id);
      }      
    });

    $scope.populateSubCategories = function(categoryId) {
      $scope.subCategories = [];
      var category = $scope.categoryObj[categoryId];
      if (category.lv2 !== undefined) {
        var cateListObj = category.lv2;
        for(var name in cateListObj) {
          $scope.subCategories.push(cateListObj[name]);
        }  
      };      
    }

    $scope.navToProductList = function(categoryId) {
      $state.go('tab.products', {categoryId: categoryId});
    }
  }]) // end of CategoryController

  .controller('ShopController', ['$scope', '$state', 'shopApi', 
    function ($scope, $state, shopApi) {
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
