(function () {
  'use strict';
  var shop = angular.module('shop', ['components', 'seller']);

  shop.controller('CategoryController', function ($scope, $state, shopApi) {
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

      angular.forEach($scope.categoryObj, function (cate) {
        if (cate.cat_id === categoryId) {
          if (cate.lv2 !== undefined) {
            var cateListObj = cate.lv2;
            for (var name in cateListObj) {
              $scope.subCategories.push(cateListObj[name]);
              var lv3Obj = cateListObj[name].lv3;
              cateListObj[name].lv3Arr = [];
              for (var i in lv3Obj) {
                cateListObj[name].lv3Arr.push(lv3Obj[i]);
              }
            }
          }
        }
      });
    };

    $scope.navToProductList = function (categoryId) {
      $state.go('tab.products', {categoryId: categoryId});
    };
  }) // end of CategoryController

    .controller('ShopController', function ($scope, $state, $stateParams, $document, $ionicModal, shopApi) {
      // With the new view caching in Ionic, Controllers are only called
      // when they are recreated or on app start, instead of every page change.
      // To listen for when this page is active (for example, to refresh data),
      // listen for the $ionicView.enter event:
      //
      //$scope.$on('$ionicView.enter', function(e) {
      //});

      $scope.products = [];
      $scope.page = 1;
      $scope.cates = [];
      $scope.brandId = $stateParams.brand;
      $scope.keywords = {value: ''};
      $scope.filter = {};
      $scope.filter.cat_id = $stateParams.categoryId;
      $scope.filter.brand = $scope.brandId;
      $scope.filter.seller_id = $stateParams.sellerId;
      $scope.hasMore = false;
      $scope.isShowGalleryFilter = false;
      $scope.priceSection = {};
      $scope.searchEnd = false;

      $scope.getProducts = function () {
        var query = {
          page: $scope.page,
          filter: $scope.filter
        };
        if ($scope.orderBy) {
          query.orderBy = $scope.orderBy;
        }
        shopApi.getGallery(query).then(function (result) {
          if (result.data.data !== undefined && result.data.data.length > 0) {
            for (var i = 0; i < result.data.data.length; i++) {
              $scope.products.push(result.data.data[i]);
            }
            $scope.hasMore = true;
          } else {
            $scope.hasMore = false;
          }
          $scope.searchEnd = true;
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      };

      $scope.loadMore = function () {
        $scope.page++;
        $scope.getProducts();
      };

      $scope.doRefresh = function () {
        $scope.products = [];
        $scope.page = 1;
        $scope.hasMore = false;
        $scope.searchEnd = false;

        if ($stateParams.keywords) {
          $scope.keywords.value = $stateParams.keywords;
          $scope.search();
        }
        else {
          $scope.getProducts();
        }

        $scope.$broadcast('scroll.refreshComplete');
      };

      $scope.search = function () {
        $scope.searchEnd = false;

        angular.forEach($document.find('input'), function (node) {
          if (node.type === 'search') {
            node.blur();
          }
        });

        $scope.filter = {
          cat_id: $scope.filter.cat_id,
          seller_id: $scope.filter.seller_id
        };
        $scope.filter.keywords = $scope.keywords.value;
        clearData(true);
        $scope.isSearch = true;
        $scope.getProducts();
      };

      $scope.clearSearch = function (event) {
        $scope.filter = {
          cat_id: $scope.filter.cat_id,
          seller_id: $scope.filter.seller_id
        };
        $scope.filter.keywords = '';
        $scope.keywords.value = '';
        clearData(true);
        $scope.getProducts();
        event.stopPropagation();
      };

      $scope.orderState = 1;
      $scope.changeOrder = function (type) {
        if (type === 'price') {
          if ($scope.orderBy === 'price asc') {
            $scope.orderBy = 'price desc';
          }
          else {
            $scope.orderBy = 'price asc';
          }

          $scope.orderState = 3;
        }
        else if (type === 'buy_count') {
          if ($scope.orderBy === 'buy_count asc') {
            $scope.orderBy = 'buy_count desc';
          }
          else {
            $scope.orderBy = 'buy_count asc';
          }

          $scope.orderState = 2;
        }
        else {
          $scope.orderBy = '';

          $scope.orderState = 1;
        }
        clearData();
        $scope.getProducts();
      };

      $scope.showSpecModal = function showSpecModal() {
        $scope.orderState = 4;

        $ionicModal.fromTemplateUrl('templates/shop/product-gallery-filter.html', {
          scope: $scope
        }).then(function (modal) {
          $scope.modal = modal;
          $scope.modal.show();
          $scope.hideModal = function () {
            $scope.modal.hide();
            $scope.modal.remove();
          };
        });
      };

      $scope.setBrandId = function (brandId) {
        if (brandId === $scope.brandId) {
          return ($scope.brandId = '');
        }
        $scope.brandId = brandId;
      };

      $scope.setPropIndex = function (propIndex) {
        if (propIndex === $scope.propIndex) {
          return ($scope.propIndex = '');
        }
        $scope.propIndex = propIndex;
      };

      $scope.setCategoryId = function (cateId) {
        var index = $scope.cates.indexOf(cateId);
        if (index === -1) {
          $scope.cates = $scope.cates.concat(cateId);
        }
        else {
          $scope.cates.splice(index, 1);
        }
      };

      $scope.galleryFilterSave = function (isClear) {
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

        if ($scope.cates && $scope.cates.length > 0) {
          $scope.filter.cat_id = $scope.cates;
        }

        clearData();
        return $scope.getProducts();
      };

      function clearData(isClearModel) {
        if (isClearModel) {
          $scope.brandId = '';
          $scope.propIndex = '';
          delete $scope.filter.cat_id;
          delete $scope.filter.brand;
          delete $scope.filter.prop_index;
          delete $scope.filter.min_price;
          delete $scope.filter.max_price;
          $scope.priceSection = {};
          if ($stateParams.categoryId) {
            $scope.filter.cat_id = $stateParams.categoryId;
          }
        }
        $scope.isSearch = false;
        $scope.page = 1;
        $scope.products.length = 0;
      }

      function getGalleryFilter() {
        shopApi
          .getGalleryFilter($scope.filter.cat_id)
          .then(function (data) {
            $scope.galleryFilter = (data && data.data && data.data.data) || [];
            console.log($scope.galleryFilter);
          })
          .catch(function (e) {
            console.log(e);
          });
      }

      getGalleryFilter();

      if ($stateParams.keywords) {
        $scope.keywords.value = $stateParams.keywords;
        $scope.search();
      }
      else {
        $scope.getProducts();
      }

      // 和遮罩层有关
      $scope.isShow = {};

    }) // end of ShopController

    /*
     * ProductDetailController
     */
    .controller('ProductDetailController',
    ['$scope', '$state', '$interval', '$stateParams', '$timeout', '$ionicSlideBoxDelegate', '$ionicModal', '$ionicLoading', 'shopApi', 'cartApi', 'toastService', 'userService', 'tabStateService',
      function ($scope, $state, $interval, $stateParams, $timeout, $ionicSlideBoxDelegate, $ionicModal, $ionicLoading, shopApi, cartApi, toastService, userService, tabStateService) {

        $scope.productId = $stateParams.productId;
        $scope.product = {};
        $scope.product.favTitle = $scope.product.good_has_fav ? '已收藏' : '收藏';
        $scope.html = '';
        $scope.showSpecModal = showSpecModal;
        $scope.getProductGoodsSpec = getProductGoodsSpec;

        // 跨tab之间的跳转
        $scope.tabIndex = tabStateService.tabIndex;
        $scope.tabStateGo = tabStateService.go;

        getProductGoodsSpec($scope.productId);
        $scope.good = {
          quantity: 1
        };

        var timer = null;
        $scope.slideHasChanged = function (index) {
          $timeout.cancel(timer);
          if (index > 0 && index === $scope.slideimgs.length - 1) {
            timer = $timeout(function () {
              $ionicSlideBoxDelegate.$getByHandle('slideimgs').slide(0);
            }, 4000);
          }
        };

        shopApi.getProduct($scope.productId).success(function (responseData) {
          if (responseData.status === 0) {
            $scope.point = responseData.data.point || {};
            $scope.product = responseData.data.product;
            $scope.product.favTitle = $scope.product.good_has_fav ? '已收藏' : '收藏';
            $scope.slideimgs = $scope.product.urls;
            $scope.comment = (responseData.data.comment || [])[0];

            var promise = $interval(function () {
              $ionicSlideBoxDelegate.$getByHandle('slideimgs').update();
            }, 2000);

            $scope.$on('$destroy', function () {
              $interval.cancel(promise);
            });

            console.log('getProduct', responseData);
          }

          $scope.hasMore = true;
        });

        $scope.hasMore = false;
        $scope.getIntrocution = function (goodsId) {
          $scope.hasMore = false;
          shopApi
            .getProductIntro(goodsId)
            .success(function (result) {
              $scope.html = result && result.data && result.data.html || '';
            })
            .error(function (e) {
              $scope.html = '';
            });
        };

        $scope.loadMore = function () {
          if ($scope.product && $scope.product.goods_id) {
            $scope.getIntrocution($scope.product.goods_id);
          }
          else {
            $scope.hasMore = false;
          }
        };

        $scope.showDescModel = function () {
          $ionicModal.fromTemplateUrl('templates/shop/product-tax-description.html', {
            scope: $scope
          }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
            $scope.hideModal = function () {
              $scope.modal.hide();
              $scope.modal.remove();
            };
          });
        };

        $scope.showTax = function () {
          $state.go('membertax');
        };

        function showSpecModal() {
          $ionicModal.fromTemplateUrl('templates/shop/shop-product-spec.html', {
            scope: $scope,
            backdropClickToClose: true
          }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
            $scope.hideModal = function () {
              $scope.modal.hide();
              $scope.modal.remove();
            };
          });
        }

        $scope.showDirectModal = function () {
          $ionicModal.fromTemplateUrl('templates/shop/shop-product-directgo.html', {
            scope: $scope,
            backdropClickToClose: true
          }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
            $scope.hideModal = function () {
              $scope.modal.hide();
              $scope.modal.remove();
            };
          });
        };

        function getProductGoodsSpec(productId /*, isSpecState*/) {
          $ionicLoading.show();
          shopApi
            .getProductGoodsSpec(productId)
            .success(function (responseData) {
              $ionicLoading.hide();
              $scope.goodsSpec = responseData && responseData.data || {};
              // // 非 选择规格框中的数据, 即商品详情页的数据
              // if (!isSpecState) {
              //   $scope.specs = $scope.goodsSpec.spec || [];
              // }
            })
            .error(function (e) {
              $ionicLoading.hide();
              console.log(e);
            });
        }

        $scope.addToCart = function (product) {
          if (!userService.isLogin()) {
            $scope.hideModal();
          }
          userService.checkLogin({
            success: function () {
              product.num = $scope.good.quantity;
              cartApi
                .addToCart(product)
                .then(function (data) {
                  if (data && data.data && data.data.status === 0) {
                    $scope.hideModal();
                    return toastService.setToast(data.data.msg);
                  }
                  toastService.setToast(data && data.data && data.data.msg || '加入失败');
                })
                .catch(function (e) {
                  console.log(e);
                  toastService.setToast('加入失败');
                });
            }
          });
        };

        $scope.goToCart = function () {
          if (!userService.isLogin()) {
            $scope.hideModal();
          }

          userService.checkLogin({
            success: function () {
              $scope.product.num = $scope.good.quantity;

              cartApi
                .addToCart($scope.product)
                .then(function (data) {
                  if (data && data.data && data.data.status === 1) {
                    toastService.setToast(data.data.msg)
                  }
                  else if (data && data.data && data.data.status === 0) {
                    $scope.hideModal();
                    $scope.tabStateGo(tabStateService.tabIndex.cart, 'tab.cart',
                      {productId: $scope.product.product_id, nature: $scope.product.nature, num: $scope.product.num},
                      {reload: true});
                  }
                })
                .catch(function () {
                });
            }
          });
        };

        $scope.showPictures = function () {
          $state.go('pictures', {productId: $scope.productId}, {reload: true});
        }
      }]) // end of ProductDetailController

    .controller('ProductImagesController',
    ['$scope', '$stateParams', '$ionicLoading', 'shopApi',
      function ($scope, $stateParams, $ionicLoading, shopApi) {

        $scope.productId = $stateParams.productId;
        $scope.product = {};

        shopApi.getProduct($scope.productId).success(function (responseData) {
          if (responseData.status === 0) {
            $scope.product = responseData.data.product;
            $scope.slideimgs = $scope.product.urls;

            console.log('getProduct', responseData);
          }
        });


      }]) // end of ProductImagesController

    .controller('ProductCommentController', function ($scope, $stateParams, shopApi) {
      $scope.page = 0;
      $scope.comments = [];
      $scope.hasMore = true;

      $scope.loadMore = function () {
        $scope.page++;
        getProductComment($stateParams.id);
      };

      function getProductComment(goodsId) {
        shopApi
          .getProductComment(goodsId, $scope.page)
          .success(function (data) {
            console.log(data);
            var comments = data && data.data || [];
            if (!comments.length) {
              $scope.hasMore = false;
            }
            else {
              $scope.comments.push.apply($scope.comments, comments);
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
          })
          .error(function (e) {
            console.log(e);
          });
      }

    }) // end of ProductCommentController

    .factory('shopApi', ['$http', 'userService', 'apiEndpoint', 'transformRequestAsFormPost',
      function ($http, userService, apiEndpoint, transformRequestAsFormPost) {

        var getGallery = function (data) {
          var request = $http({
            method: 'post',
            url: apiEndpoint.url + '/gallery.html',
            transformRequest: transformRequestAsFormPost,
            data: data,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          });

          return request.success(function (result) {
            console.log('got data:' + result);
            return result;
          });
        };

        var getCategories = function (data) {
          var request = $http({
            method: 'post',
            url: apiEndpoint.url + '/gallery-cat_list.html',
            transformRequest: transformRequestAsFormPost,
            data: data,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          });

          return request.success(function (result) {
            return result;
          });
        };

        var getProduct = function (productId) {
          var data = {
            product_id: productId,
            member_id: userService.get('memberId'),
            token: userService.get('token')
          };

          var request = $http({
            method: 'post',
            url: apiEndpoint.url + '/product.html',
            transformRequest: transformRequestAsFormPost,
            data: data,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          });

          return request;
        };

        var getProductGoodsSpec = function (productId) {
          var data = {'product_id': productId};
          var request = $http({
            method: 'post',
            url: apiEndpoint.url + '/product-goods_spec.html',
            transformRequest: transformRequestAsFormPost,
            data: data,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          });

          return request;
        };

        var getGalleryFilter = function (catId) {
          var data = {'cat_id': catId};
          var request = $http({
            method: 'post',
            url: apiEndpoint.url + '/gallery-filter.html',
            transformRequest: transformRequestAsFormPost,
            data: data,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          });

          return request;
        };

        var getProductComment = function (goods_id, page) {
          var data = {'goods_id': goods_id, page: page || 1};
          var request = $http({
            method: 'post',
            url: apiEndpoint.url + '/product-comment.html',
            transformRequest: transformRequestAsFormPost,
            data: data,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          });

          return request;
        };

        var getProductIntro = function (goods_id) {
          var data = {'goods_id': goods_id};
          var request = $http({
            method: 'post',
            url: apiEndpoint.url + '/product-intro.html',
            transformRequest: transformRequestAsFormPost,
            data: data,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          });
          return request;
        };

        var getProductIdByBarcode = function (barcode) {
          var data = {'value': barcode};
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
          getGallery: getGallery,
          getCategories: getCategories,
          getProduct: getProduct,
          getProductGoodsSpec: getProductGoodsSpec,
          getProductIdByBarcode: getProductIdByBarcode
        };

      } // end of anonymous function
    ]
  ); // end of shopApi
})();
