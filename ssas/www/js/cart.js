angular.module('cart', ['components'])

  .controller('CartController', function ($scope, $state, $stateParams, $ionicHistory, $ionicListDelegate,
                                          $ionicLoading, cartApi) {

    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.load();
    });

    function initStatus() {
      if ($scope.cart.natureCart && $scope.cart.natureCart.bond) {
        angular.forEach($scope.cart.natureCart.bond.aSelCart, function (seller) {
          seller.seller_info.isEdited = false;
          seller.seller_info.headerBtnTitle = '编辑';
        })
      }

      if ($scope.cart.natureCart && $scope.cart.natureCart.direct_mail) {
        angular.forEach($scope.cart.natureCart.direct_mail.aSelCart, function (seller) {
          seller.seller_info.isEdited = false;
          seller.seller_info.headerBtnTitle = '编辑';
        })
      }
    }

    $scope.load = function () {
      $ionicLoading.show();
      cartApi.getCart().success(function (responseData) {
        var dataStatus = responseData.status;
        if (dataStatus === 0) {
          $scope.cart = responseData.data;

          initStatus();

          if ($stateParams.productId && $stateParams.nature) {
            if (!$ionicHistory.forwardView()) {
              if ($stateParams.nature === 'bond') {
                directCheckout($scope.cart.natureCart.bond, $stateParams.productId, $stateParams.nature);
              }
              else if ($stateParams.nature === 'direct_mail') {
                directCheckout($scope.cart.natureCart.direct_mail, $stateParams.productId, $stateParams.nature);
              }
            }
            else {
              $scope.back();
            }
          }
        }
      })
        .finally(function () {
          $scope.cartLoaded = true;
          $ionicLoading.hide();
        });
    };

    $scope.load();

    $scope.toggleGoods = function (goods) {
      $ionicLoading.show();
      cartApi.nocheck(goods).success(function (responseData) {
        var dataStatus = responseData.status;
        if (dataStatus === 0) {
          $scope.cart = responseData.data;

          initStatus();
        }
      })
        .finally(function () {
          $ionicLoading.hide();
        });
    };

    $scope.toggleNature = function (nature) {
      var goods = [];
      angular.forEach(nature.aSelCart, function (seller) {
        seller.seller_info.selected = nature.selected;
        angular.forEach(seller.goods_list, function (item) {
          item.selected = seller.seller_info.selected;
          goods.push(item);
        });
      });
      $scope.toggleGoods(goods);
    };

    $scope.toggleSeller = function (seller) {
      angular.forEach(seller.goods_list, function (item) {
        if (item.store > 0) {
          item.selected = seller.seller_info.selected;
        }
        else {
          item.selected = false;
        }
      });

      $scope.toggleGoods(seller.goods_list);
    };

    $scope.toggleGood = function (good) {
      $scope.toggleGoods([good]);
    };

    $scope.updateGoodQuantity = function (good) {
      $ionicLoading.show();
      cartApi.updateCart(good).success(function (responseData) {
        var dataStatus = responseData.status;
        if (dataStatus === 0) {
          $scope.cart = responseData.data;

          initStatus();
        }
      })
        .finally(function () {
          $ionicLoading.hide();
        });
    };

    $scope.removeGoods = function (goods) {
      $ionicLoading.show();
      cartApi.remove(goods).success(function (responseData) {
        var dataStatus = responseData.status;
        if (dataStatus === 0) {
          $scope.cart = responseData.data;

          initStatus();
        }
      })
        .finally(function () {
          $ionicLoading.hide();
        });
    };

    $scope.editSeller = function (seller) {
      seller.seller_info.isEdited = !seller.seller_info.isEdited;
      seller.seller_info.headerBtnTitle = seller.seller_info.isEdited ? '完成' : '编辑';
    };

    $scope.removeNature = function (nature) {
      var goods = [];
      angular.forEach(nature.aSelCart, function (seller) {
        angular.forEach(seller.goods_list, function (item) {
          if (item.selected) {
            goods.push(item);
          }
        });
      });
      $scope.removeGoods(goods);
    };

    $scope.removeSeller = function (seller) {
      angular.forEach(seller.goods_list, function (item) {
        item.selected = seller.seller_info.selected;
      });
      $scope.removeGoods(seller.goods_list);
    };

    $scope.removeGood = function (good) {
      $scope.removeGoods([good]);
    };

    var directCheckout = function (nature, productId, natureKey) {
      angular.forEach(nature.aSelCart, function (seller) {
          angular.forEach(seller.goods_list, function (good) {
            var pId = '' + good.product_id;
            if (pId === productId) {
              if (!good.selected) {
                good.selected = true;
                $scope.toggleGood(good);
              }

              if (good.quantity !== 1) {
                good.quantity = 1;
                $scope.updateGoodQuantity(good);
              }
            }
            else if (pId !== productId && good.selected) {
              good.selected = false;
              $scope.toggleGood(good);
            }
          });
        }
      );

      $state.go('tab.cart-checkout', {nature: natureKey}, {reload: true});
    };
  }) // end of CartController
  .
  controller('CartCheckoutController', function ($rootScope, $scope, toastService, $state, $stateParams, $ionicModal, $ionicLoading, cartApi) {
    $scope.checkout = function () {
      $ionicLoading.show();
      cartApi.checkout($scope.cart, $stateParams.nature).success(function (responseData) {
        var dataStatus = responseData.status;
        if (dataStatus === 0) {
          $scope.cart = responseData.data;
        }
        else {
          $scope.back();
        }
      })
        .finally(function () {
          $scope.$broadcast('$addressSelect.afterEnter');
          $ionicLoading.hide();
        });
    };

    $scope.$on('$ionicView.afterEnter', $scope.checkout);

    $scope.changeCoupon = function (coupon) {
      coupon.isNew = true;

      $ionicLoading.show();
      cartApi.checkout($scope.cart, $stateParams.nature).success(function (responseData) {
        var dataStatus = responseData.status;
        if (dataStatus === 0) {
          $scope.cart = responseData.data;

          angular.forEach($scope.cart.aSelCart, function (sct) {
            angular.forEach(sct.coupon_lists, function (cp) {
              if (sct.def_coupon && (cp.memc_code === sct.def_coupon.memc_code)) {
                cp.selected = true;
              }
              else {
                cp.selected = false;
              }
            });
          });
        }
        else {
          coupon.selected = false;
          toastService.setToast(responseData.msg);
        }
      })
        .finally(function () {
          $scope.$broadcast('$addressSelect.afterEnter');
          $ionicLoading.hide();
        });
    };

    $scope.confirm = function () {
      $rootScope.confirmedCart = $scope.cart;
      $state.go('tab.cart-payment');
    };
  })
  .controller('CartPaymentController', function ($rootScope, $scope, $state, $ionicModal, $ionicPopup, $ionicLoading, cartApi, orderApi, paymentApi, $q) {
    $scope.init = function () {
      $scope.cart = $rootScope.confirmedCart;
      delete $rootScope.confirmedCart;
    };

    $scope.$on('$ionicView.beforeEnter', $scope.init);

   /* $scope.back = function () {
      // var confirmPopup = $ionicPopup.confirm({
      //   title: '订单支付',
      //   template: '您确认要放弃付款?',
      //   cancelText: '取消', // String (默认: 'Cancel')。一个取消按钮的文字。
      //   okText: '确定' // String (默认: 'OK')。OK按钮的文字。
      // });

      // confirmPopup.then(function (res) {
      //   $state.go('tab.order-payed', {
      //     status: 'failed'
      //   });
      // });
    };*/

    $scope.pay = function (/*payment*/) {
      $ionicLoading.show();
      cartApi.createOrder($scope.cart)
        .then(function (response) {
          if (response.data.status !== 0) {
            $ionicPopup.alert({
              title: '未能创建订单',
              template: response.data.msg,
              okText: '确定' // String (默认: 'OK')。OK按钮的文字。
            });

            return $q.reject();
          }

          var order = response.data.data;
          $rootScope.justCreatedOrder = order;

          return orderApi.getPayInfo(order)
            .then(function (response) {
              console.log(order, order.pay_app_id);
              if (order.pay_app_id === 'micbcpay') {
                console.log(response);
                $rootScope.micbcpayData = response.data;
                $state.go('iframe');
                return;
              }
              if (response.data.status !== 0) {
                $ionicPopup.alert({
                  title: '未能获取支付信息',
                  template: response.data.msg,
                  okText: '确定' // String (默认: 'OK')。OK按钮的文字。
                });

                return $q.reject();
              }

              return paymentApi.pay(response.data.data)
                .then(function () {
                  return $state.go('tab.order-payed');
                }, function () {
                  return $state.go('tab.order-payed', {
                    status: 'failed'
                  });
                });
            });
        })
        .finally(function () {
          $ionicLoading.hide();
        });
    };
  })
  .controller('OrderPayedController', function ($rootScope, $scope, $q, $ionicLoading, $state, $stateParams, $timeout,
                                                orderApi, HomeApi, shopApi) {
    var justCreatedOrder = $rootScope.justCreatedOrder;
    delete $rootScope.justCreatedOrder;

    $scope.isFailed = $stateParams.status === 'failed';

    $scope.goOrder = function (type) {
      $state.go('tab.home');
      $timeout(function () {
        $state.go('orders', {
          type: type || 'all'
        });
      }, 10);
    };

    $scope.goHome = function () {
      $state.go('tab.cart');
      $timeout(function () {
        $state.go('tab.home');
      }, 10);
    };

    $scope.load = function () {
      $ionicLoading.show();
      var promises = [];
      angular.forEach((justCreatedOrder || {}).order_id, function (order_id) {
        promises.push(orderApi.getOrderDetail(order_id));
      });

      $q.all(promises)
        .then(function (responses) {
          $scope.orders = [];
          angular.forEach(responses, function (response) {
            if (response.data.status === 0) {
              $scope.orders.push(response.data.data);
            }
          });
        })
        .finally(function () {
          $ionicLoading.hide();
        });
    };

    $scope.load();

    $scope.homeInfo = {};
    $scope.goodsInfo = {};
    $scope.getHomeInfo = function () {
      HomeApi.getHomeContent().then(function (result) {
        $scope.homeInfo = result.data.data;

        $scope.getProducts = function () {
          var query = {
            page: $scope.page,
            filter: {
              brand: $scope.homeInfo.goods_gallery[0].filter.brand,
              cat_id: $scope.homeInfo.goods_gallery[0].filter.cat_id
            }
          };

          shopApi.getGallery(query).then(function (result) {
            $scope.goodsInfo = result.data.data;
          });
        };

        $scope.getProducts();
      });
    };

    $scope.getHomeInfo();
  })
  .controller('iframeController', function ($rootScope, $scope) {
    $scope.html = $rootScope.micbcpayData;
    delete $rootScope.micbcpayData;
  });
