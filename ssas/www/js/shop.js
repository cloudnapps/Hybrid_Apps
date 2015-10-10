(function () {
  'use strict';
  var shop = angular.module('shop', ['components']);
  
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
      })
      .state('tab.comments', {
        url: '/goods/:id/comments',
        views: {
          'tab-shop': {
            templateUrl: 'templates/shop/product-comment.html',
            controller: 'ProductCommentController'
          }
        }
      })
      .state('tab.intro', {
        url: '/goods/:id/intro',
        views: {
          'tab-shop': {
            templateUrl: 'templates/shop/product-intro.html',
            controller: 'ProductIntroController'
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
        }  
      };

      $scope.navToProductList = function(categoryId) {
        $state.go('tab.products', {categoryId: categoryId});
      };
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
    $scope.filter.cat_id = $scope.categoryId;
    $scope.hasMore = false;
    $scope.isShowGalleryFilter = false;

    $scope.getProducts = function() {
      var query = {   
        page: $scope.page, 
        filter: $scope.filter
      };
      if ($scope.orderBy) {
        query.orderBy = $scope.orderBy;
      }
      shopApi.getGallery(query).then(function (result) {
        if (result.data.data !== undefined && result.data.data.length > 0) {
          for(var i = 0; i < result.data.data.length; i++) {
            $scope.products.push(result.data.data[i]);  
          }  
          $scope.hasMore = true;
        } else {
          $scope.hasMore = false;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    };

    $scope.loadMore = function() {
      $scope.page ++;
      $scope.getProducts();
    };  

    $scope.search = function(){
      $scope.filter.keywords = $scope.keywords.value;
      clearData();
      $scope.getProducts();
    };

    $scope.clearSearch = function(event){
      $scope.filter.keywords = '';
      $scope.keywords.value = '';
      clearData();
      $scope.getProducts();
      event.stopPropagation();
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

    

    $scope.setBrandId = function(brandId){
      $scope.brandId = brandId;
    };

    $scope.setPropIndex = function(propIndex){
      $scope.propIndex = propIndex;
    };

    $scope.galleryFilterSave = function(isClear){
      $scope.isShowGalleryFilter = false;
      if (isClear) {
        $scope.brandId = '';
        $scope.propIndex = '';
        delete $scope.filter.brand;
        delete $scope.filter.prop_index;
        clearData();
        return $scope.getProducts();
      }
      $scope.filter.brand = $scope.brandId;
      $scope.filter.prop_index = $scope.propIndex;
      clearData();
      return $scope.getProducts();
    };

    function clearData(){
      $scope.page = 1;
      $scope.products.length = 0;
    }

    function getGalleryFilter(){
      shopApi
        .getGalleryFilter($scope.filter.cat_id)
        .then(function(data){
          $scope.galleryFilter = (data && data.data && data.data.data) || [];
          console.log($scope.galleryFilter);
        })
        .catch(function(e){
          console.log(e);
        });
    }

    getGalleryFilter();

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
              ['$scope', '$stateParams', '$ionicSlideBoxDelegate', '$ionicModal', '$ionicLoading','shopApi',  'cartApi', '$state',                             
    function($scope, $stateParams, $ionicSlideBoxDelegate, $ionicModal, $ionicLoading,shopApi, cartApi, $state){
      $scope.productId = $stateParams.productId;
      $scope.product = {};
      $scope.showSpecModal = showSpecModal;
      $scope.getProductGoodsSpec = getProductGoodsSpec;

      getProductGoodsSpec($scope.productId);

      shopApi.getProduct($scope.productId).success(function(responseData){
        var dataStatus = responseData.status;
        if (dataStatus === 0) {
          $scope.product = responseData.data.product;
          $ionicSlideBoxDelegate.update();
          getProductComment($scope.product.goods_id);
        }       
      });

      function showSpecModal(){
        $ionicModal.fromTemplateUrl('templates/shop/shop-product-spec.html', {
          scope: $scope
        }).then(function(modal) {
          $scope.modal = modal;
          $scope.modal.show();
          $scope.hideModal = function(){
            $scope.modal.hide();
            $scope.modal.remove();
          };
        });
      }

      function getProductGoodsSpec(productId, isSpecState){
        $ionicLoading.show();
        shopApi
          .getProductGoodsSpec(productId)
          .success(function(responseData){
            $ionicLoading.hide();
            $scope.goodsSpec = responseData && responseData.data || {};
            // // 非 选择规格框中的数据, 即商品详情页的数据
            // if (!isSpecState) {
            //   $scope.specs = $scope.goodsSpec.spec || [];
            // }
          })
          .error(function(e){
            $ionicLoading.hide();
            console.log(e);
          });
      }

      function getProductComment(goods_id){
        goods_id = 16;
        shopApi
          .getProductComment(goods_id, 1)
          .success(function(data){
            $scope.comment = data && data.data && data.data[0] || {};
          })
          .error(function(e){
            console.log(e);
          });
      }

      $scope.addToCart = function (product) {
        cartApi.addToCart(product);
      };

  }]) // end of ProductDetailController

  .controller('ProductIntroController', function($scope, $stateParams, shopApi){
    console.log($stateParams.id);
    $stateParams.id = 60;
    shopApi.getProductIntro($stateParams.id).success(function(responseData){
      $scope.html = responseData && responseData.data && responseData.data.html || '';
    });
  }) 

  .controller('ProductCommentController', function($scope, $stateParams, shopApi){
    console.log($stateParams.id);
    $stateParams.id = 16;
    shopApi
      .getProductComment($stateParams.id, 1)
      .success(function(data){
        $scope.comments = data && data.data || [];
        console.log('comments', $scope.comments);
      })
      .error(function(e){
        console.log(e);
      });
  }) // end of ProductCommentController

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
        });        
      };

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
        });
      };

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
      };
      
      var getProductGoodsSpec = function(productId) {
        var data = {"product_id": productId};
        var request = $http({
          method: 'post',
          url: apiEndpoint.url + '/product-goods_spec.html',
          transformRequest: transformRequestAsFormPost,
          data: data,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}          
        });
        
        return request;
      };

      var getGalleryFilter = function(catId){
        var data = {"cat_id": catId};
        var request = $http({
          method: 'post',
          url: apiEndpoint.url + '/gallery-filter.html',
          transformRequest: transformRequestAsFormPost,
          data: data,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}          
        });
        
        return request;
      };

      var getProductComment = function(goods_id, page){
        var data = {"goods_id": goods_id, page: page || 1};
        var request = $http({
          method: 'post',
          url: apiEndpoint.url + '/product-comment.html',
          transformRequest: transformRequestAsFormPost,
          data: data,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}          
        });
        
        return request;
      };

      var getProductIntro = function(goods_id){
        var data = {"goods_id": goods_id};
        var request = $http({
          method: 'post',
          url: apiEndpoint.url + '/product-intro.html',
          transformRequest: transformRequestAsFormPost,
          data: data,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}          
        });
        return request;
      };
      
      return {
        getProductIntro: getProductIntro,
        getProductComment: getProductComment,
        getGalleryFilter: getGalleryFilter,
        getGallery : getGallery,
        getCategories: getCategories,
        getProduct: getProduct,
        getProductGoodsSpec: getProductGoodsSpec
      };

  } // end of anonymous function
  ]
  ); // end of shopApi
})(); 
