  (function () {
  'use strict';
  var shop = angular.module('shop', ['components', 'seller']);
  
  shop.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      // 商品分类
      .state('tab.categories', {
        url: '/categories',
        views : {
          'tab-shop': {
            templateUrl: 'templates/shop/shop-categories.html',
            controller: 'CategoryController'
          }
        }
      }) // 商品列表
      .state('tab.products', {
        url: '/products?categoryId',
        views: {
          'tab-shop': {
            templateUrl: 'templates/shop/shop-products.html',
            controller: 'ShopController'
          }
        }
      }) // 商品搜索列表 no used
      .state('tab.search', {
        url: '/search?keywords&categoryId',
        views: {
          'tab-shop': {
            templateUrl: 'templates/shop/shop-products-search.html',
            controller: 'ShopController'
          }
        }
      }) // 商品详情页
      .state('tab.product', {
        url: '/products/:productId',
        views: {
          'tab-shop': {
            templateUrl: 'templates/shop/product-detail.html',
            controller: 'ProductDetailController'
          }
        }
      }) // no used
      .state('tab.comments', {
        url: '/goods/:id/comments',
        views: {
          'tab-shop': {
            templateUrl: 'templates/shop/product-comment.html',
            controller: 'ProductCommentController'
          }
        }
      }) // 产品图文详情
      .state('tab.intro', {
        url: '/goods/:id/intro?productId&sellerId',
        views: {
          'tab-shop': {
            templateUrl: 'templates/shop/product-intro.html',
            controller: 'ProductIntroController'
          }
        }
      })// 抽象状态, 为跳转 其他 tab做 历史 no used
      .state('tab.product_shadow', {
        url: '/product_shadow',
        abstract: true,
        views: {
          'tab-shop': { // name="tab-shop-shadow" 和 下面的 state name相同
            template: '<ion-nav-view name="tab-shop-shadow"></ion-nav-view>'
          }
        }
      })// seller_detail 做历史记录, 从 seller_detail 中拷贝过来 no used
      .state('tab.product_shadow.seller_detail', {
        url: '/sellers/:sellerId',
        views: {
          'tab-shop-shadow': {
            templateUrl: 'templates/home/seller-detail.html',
            controller: 'SellerDetailController'
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

  shop.controller('CategoryController', function ($scope, $state, shopApi, toastService) {
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
      $scope.index = 0;
      $scope.populateSubCategories = function (categoryId, index) {
        if (index !== undefined) {
          $scope.index = index;
        }
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
    
    $scope.scan = function(){      
      cordova.plugins.barcodeScanner.scan(
        function (result) {          
          if (!result.cancelled 
              && result.text !== undefined && result.text !== null) {
            shopApi.getProductIdByBarcode(result.text).success(
              function(response){
                var result = response.data;
                var status = response.status;
                if (status === 0) {
                  var productId = result["product_id"];
                  if (productId !== undefined) {
                    $scope.tabStateGo($scope.tabIndex.shop, 'tab.product', {productId: productId});
                  }
                } else {
                  toastService.setToast(response.msg);  
                }            
              }); // end of getProductIdByBarcode success
          } else {
            toastService.setToast('没有找到商品');  
          }// end of if
        }, // end of scan success 
        function (error) {
          toastService.setToast('扫码失败');  
        } // end of scan error
      );
    }
  }) // end of CategoryController

  .controller('ShopController', function ($scope, $state, $stateParams, $ionicModal, shopApi) {
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
    $scope.priceSection = {};


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
      $scope.filter = {
        cat_id: $scope.filter.cat_id 
      };
      $scope.filter.keywords = $scope.keywords.value;
      clearData(true);
      $scope.getProducts();
    };

    $scope.clearSearch = function(event){
      $scope.filter = {
        cat_id: $scope.filter.cat_id 
      };
      $scope.filter.keywords = '';
      $scope.keywords.value = '';
      clearData(true);
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


    $scope.showSpecModal = function showSpecModal(){
      $ionicModal.fromTemplateUrl('templates/shop/product-gallery-filter.html', {
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

    $scope.setBrandId = function(brandId){
      $scope.brandId = brandId;
    };

    $scope.setPropIndex = function(propIndex){
      $scope.propIndex = propIndex;
    };

    $scope.galleryFilterSave = function(isClear){
      $scope.isShowGalleryFilter = false;
      $scope.hideModal();
      if (isClear) {
        clearData(true);
        return $scope.getProducts();
      }
      $scope.filter.brand = $scope.brandId;
      $scope.filter.prop_index = $scope.propIndex;
      if ($scope.priceSection.min) {
        $scope.filter.min_price = parseFloat($scope.priceSection.min);
      }
      else {
        delete $scope.filter.min_price;
      }
      if ($scope.priceSection.max) {
        $scope.filter.max_price = parseFloat($scope.priceSection.max);
      }
      else {
        delete $scope.filter.max_price;
      }
      clearData();
      return $scope.getProducts();
    };

    function clearData(isClearModel){
      if (isClearModel) {
        $scope.brandId = '';
        $scope.propIndex = '';
        delete $scope.filter.brand;
        delete $scope.filter.prop_index;
        delete $scope.filter.min_price;
        delete $scope.filter.max_price;
        $scope.priceSection = {};
      }
      
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
  }) // end of ShopController
  
  /*
   * ProductDetailController
   */
  .controller('ProductDetailController', 
              ['$scope', '$stateParams', '$ionicSlideBoxDelegate', '$ionicModal', '$ionicLoading','shopApi',  'cartApi', '$state', 'tabStateService',                            
    function($scope, $stateParams, $ionicSlideBoxDelegate, $ionicModal, $ionicLoading,shopApi, cartApi, $state){

      $scope.productId = $stateParams.productId;
      $scope.product = {};
      $scope.showSpecModal = showSpecModal;
      $scope.getProductGoodsSpec = getProductGoodsSpec;

      getProductGoodsSpec($scope.productId);

      shopApi.getProduct($scope.productId).success(function(responseData){
        var dataStatus = responseData.status;
        if (dataStatus === 0) {
          $scope.point = responseData.data.point || {};
          $scope.product = responseData.data.product;
          $scope.comment = (responseData.comment || [])[0];
          $ionicSlideBoxDelegate.update();
          
          console.log('getProduct', responseData);
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

      $scope.addToCart = function (product) {
        cartApi.addToCart(product);
      };

  }]) // end of ProductDetailController

  .controller('ProductIntroController', function($scope, $stateParams, shopApi) {

    $scope.product = {
      goods_id: $stateParams.id,
      product_id: $stateParams.productId,
      seller_id: $stateParams.sellerId
    };

    $scope.product.goods_id = 60;

    shopApi
      .getProductIntro($scope.product.goods_id)
      .success(function(responseData){
        $scope.html = responseData && responseData.data && responseData.data.html || '';
      });
  }) // end of ProductIntroController

  .controller('ProductCommentController', function($scope, $stateParams, shopApi){
    console.log($stateParams.id);
    $stateParams.id = 16;  // goodsId 16为测试

    $scope.page = 0;
    $scope.comments = [];
    $scope.hasMore = true;

    $scope.loadMore = function() {
      $scope.page++;
      getProductComment($stateParams.id);
    };

    function getProductComment(goodsId){
      shopApi
        .getProductComment(goodsId, $scope.page)
        .success(function(data){
          var comments = data && data.data || [];
          console.log('comments/page', comments, $scope.page);
          if (!comments.length) {
            $scope.hasMore = false;
          }
          else {
            $scope.comments.push.apply($scope.comments, comments);
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        })
        .error(function(e){
          console.log(e);
        });
    }

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
      
      var getProductIdByBarcode = function(barcode) {
        var data = {"value":barcode};
        var request = $http({
          method: 'post',
          url: apiEndpoint.url + '/product-get_productId.html',
          transformRequest: transformRequestAsFormPost,
          data: data,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}  
        });
        return request;
      }; // end of getProductByBarcode

      return {
        getProductIntro: getProductIntro,
        getProductComment: getProductComment,
        getGalleryFilter: getGalleryFilter,
        getGallery : getGallery,
        getCategories: getCategories,
        getProduct: getProduct,
        getProductGoodsSpec: getProductGoodsSpec,
        getProductIdByBarcode: getProductIdByBarcode
      };

  } // end of anonymous function
  ]
  ); // end of shopApi
})(); 
