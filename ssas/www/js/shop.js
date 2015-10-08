(function () {
  'use strict';
  var shop = angular.module('shop', []);
  
  shop.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('tab.categories', {
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
      .state('tab.search', {
        url: '/search?keywords&categoryId',
        views: {
          'tab-shop': {
            templateUrl: 'templates/shop/shop-products-search.html',
            controller: 'ShopController'
          }
        }
      })
      .state('tab.product', {
        url: '/products/:productId',
        views: {
          'tab-shop': {
            templateUrl: 'templates/shop/product-detail.html',
            controller: 'ProductDetailController'
          }
        }
      });
    // .state('tab.chat-detail', {
    //   url: '/chats/:chatId',
    //   views: {
    //     'tab-chats': {
    //       templateUrl: 'templates/chat-detail.html',
    //       controller: 'ChatDetailCtrl'
    //     }
    //   }
    // })
  });

  shop.controller('CategoryController', ['$scope', '$state', 'shopApi',
    function ($scope, $state, shopApi) {
      $scope.categoryObj = {};
      $scope.categories = [];
      $scope.subCategories = [];

      shopApi.getCategories().then(function (result) {
        $scope.categories = [];
        $scope.categoryObj = result.data.data;
        var firstLvName;
        for (firstLvName in $scope.categoryObj) {
          $scope.categories.push($scope.categoryObj[firstLvName]);
        }

        if ($scope.categories.length > 0) {
          $scope.populateSubCategories($scope.categories[0].cat_id);
        }
      });

      $scope.populateSubCategories = function (categoryId) {
        $scope.subCategories = [];
        var category = $scope.categoryObj[categoryId];
        if (category.lv2 !== undefined) {
          var cateListObj = category.lv2;
          for (var name in cateListObj) {
            $scope.subCategories.push(cateListObj[name]);
          }  
        };      
      }

      $scope.navToProductList = function(categoryId) {
        $state.go('tab.products', {categoryId: categoryId});
      }
  }]) // end of CategoryController

  .controller('ShopController', ['$scope', '$state', '$stateParams', 'shopApi', 
    function ($scope, $state, $stateParams, shopApi) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    $scope.products = [];
    $scope.page = 1;
    $scope.categoryId = $stateParams.categoryId;
    $scope.keywords = {value: ''};
    $scope.filter = {};
    if($stateParams.keywords) {
      $scope.filter.keywords = $stateParams.keywords;
      $scope.keywords.value = $stateParams.keywords;
    }
    $scope.filter.cat_id = $scope.categoryId;
    $scope.hasMore = false;

    $scope.getProducts = function() {
      var query = {   
        page: $scope.page, 
        filter: $scope.filter
      };
      if ($scope.orderBy) {
        query.orderBy = $scope.orderBy
      }
      shopApi.getGallery(query).then(function (result) {
        if (result.data.data != undefined && result.data.data.length > 0) {
          for(var i = 0; i < result.data.data.length; i++) {
            $scope.products.push(result.data.data[i]);  
          }  
          $scope.hasMore = true;
        } else {
          $scope.hasMore = false;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');        
      })
    };

    $scope.loadMore = function() {
      $scope.page ++;
      $scope.getProducts();
    };  

    $scope.search = function(isPage){
      if (isPage) {
        $state.go('tab.search', {
          keywords: $scope.keywords.value,
          categoryId: $stateParams.categoryId
        });
      }
      else {
        $scope.filter.keywords = $scope.keywords.value;
        clearData();
        $scope.getProducts();  
      }
    };

    $scope.changeOrder = function(type){
      if (type === 'price') {
        if ($scope.orderBy === 'price asc') {
          $scope.orderBy = 'price desc';
        }
        else {
          $scope.orderBy = 'price asc';
        }
      }
      else if(type === 'buy_count'){
        if ($scope.orderBy === 'buy_count asc') {
          $scope.orderBy = 'buy_count desc';
        }
        else {
          $scope.orderBy = 'buy_count asc';
        }
      }
      else {
        $scope.orderBy = '';
      }
      clearData();
      $scope.getProducts();    
    };

    function clearData(){
      $scope.page = 1;
      $scope.products.length = 0;
    }

    $scope.getProducts();    
    // $scope.chats = Chats.all();
    // $scope.remove = function(chat) {
    //   Chats.remove(chat);
    // };
  }]) // end of ShopController
  
  /*
   * ProductDetailController
   */
  .controller('ProductDetailController', 
              ['$scope', '$stateParams', '$ionicSlideBoxDelegate', 'shopApi',                              
    function($scope, $stateParams, $ionicSlideBoxDelegate, shopApi){
      $scope.productId = $stateParams.productId;
      $scope.product = {};  
      shopApi.getProduct($scope.productId).success(function(responseData){
        var dataStatus = responseData.status;
        if (dataStatus === 0) {
          $scope.product = responseData.data.product;
          $ionicSlideBoxDelegate.update();
        }       
      });
      
      shopApi.getProductGoods($scope.productId).success(function(responseData){
      });

  }]) // end of ProductDetailController

  .factory('shopApi', ['$http', 'apiEndpoint', 'transformRequestAsFormPost',
    function($http, apiEndpoint, transformRequestAsFormPost) {
     
      var getGallery = function(data){        
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

      var getCategories = function(data) {        
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

      var getProduct = function(productId) {
        var data = {"product_id": productId};
        var request = $http({
          method: "post",
          url: apiEndpoint.url + '/product.html',
          transformRequest: transformRequestAsFormPost,
          data: data,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

        return request;
      }
      
      var getProductGoods = function(productId) {
        var data = {"product_id": productId};
        var request = $http({
          method: 'post',
          url: apiEndpoint.url + '/product-goods_spec.html',
          transformRequest: transformRequestAsFormPost,
          data: data,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}          
        });
        
        return request;
      }
      
      

      return {
        getGallery : getGallery,
        getCategories: getCategories,
        getProduct: getProduct,
        getProductGoods: getProductGoods
      }

  } // end of anonymous function
  ]
  ); // end of shopApi
})(); 