angular.module('starter')
.config(
	function ($stateProvider, $urlRouterProvider){
		// Ionic uses AngularUI Router which uses the concept of states
	    // Learn more here: https://github.com/angular-ui/ui-router
	    // Set up the various states which the app can be in.
	    // Each state's controller can be found in controllers.js
    	$stateProvider

      	// setup an abstract state for the tabs directive
      	.state('tab', {
        	url: '/tab',
        	abstract: true,
        	views: {
          		'main-view': {
            		templateUrl: 'templates/tab-main.html',
            		controller: function($scope, tabStateService){
              		// 跨tab之间的跳转
              			$scope.tabIndex = tabStateService.tabIndex;
              			$scope.tabStateGo = tabStateService.go;
            		}
          		}
        	},
      	})
        // 会员首页
        .state('tab.member', {
          url: '/member',
          views: {
            'tab-member': {
              templateUrl: 'templates/member/member-index.html',
              controller: 'MemberCtrl'
            }
          }
        })
        // 首页
        .state('tab.home', {
          url: '/home',
          views: {
            'tab-home': {
              templateUrl: 'templates/home/home-index.html',
              controller: 'HomeController'
            }
          }
        })
        // 首页签到
        .state('signin', {
          url: '/signin',
          views: {
            'main-view': {
              templateUrl: 'templates/home/home-signin.html',
              controller: 'SigninController'
            }
          }
        })
      	// 商品分类
      	.state('tab.categories', {
        	url: '/categories',
        	views : {
          		'tab-shop': {
            		templateUrl: 'templates/shop/shop-categories.html',
            		controller: 'CategoryController'
          		}
        	}
      	})
      	// 商品列表
      	.state('products', {
        	url: '/products?categoryId&keywords&brand',
        	views: {
          		'main-view': {
            		templateUrl: 'templates/shop/shop-products.html',
            		controller: 'ShopController'
          		}
        	}
      	})
      	// 商品详情页
      	.state('product', {
        	url: '/products/:productId',
        	views: {
        		'main-view': {
          		templateUrl: 'templates/shop/product-detail.html',
          		controller: 'ProductDetailController'
        		}
        	}
      	})
        // 商品详情 评论
        .state('comments', {
          url: '/comments/:id',
          views: {
              'main-view': {
                templateUrl: 'templates/shop/product-comment.html',
                controller: 'ProductCommentController'
              }
          }
        })
        // 商户列表
        .state('sellers', {
          url: '/sellers?keywords',
          views: {
            'main-view': {
              templateUrl: 'templates/home/seller-list.html',
              controller: 'SellerListController'
            }
          }
        })
        // 商户详情
        .state('seller-detail', {
          url: '/seller/:sellerId',
          views: {
            'main-view': {
              templateUrl: 'templates/home/seller-detail.html',
              controller: 'SellerDetailController'
            }
          }
        })
        // 登录
        .state('login', {
          url: '/login',
          cache: false,
          views: {
            'main-view': {
              templateUrl: 'templates/login/user-login.html',
              controller: 'LoginCtrl'
            }
          }
        })
        // 注册
        .state('register', {
          url: '/register',
          cache: false,
          views: {
            'main-view': {
              templateUrl: 'templates/login/user-register.html',
              controller: 'LoginCtrl'
            }
          }
        })
        // 找回密码
        .state('retrieve', {
          url: '/retrieve',
          cache: false,
          views: {
            'main-view': {
              templateUrl: 'templates/login/user-retrieve-password.html',
              controller: 'RetrieveCtrl'
            }
          }
        })
        // 找回密码
        .state('wxmobile', {
          url: '/wxmobile?data',
          cache: false,
          views: {
            'main-view': {
              templateUrl: 'templates/login/user-wxlogin-mobile.html',
              controller: 'LoginCtrl'
            }
          }
        })
        // 会员设置
        .state('settings', {
          url: '/settings',
          views: {
            'main-view': {
              templateUrl: 'templates/member/setting-index.html',
              controller: 'SettingCtrl'
            }
          }
        })
        .state('setting_changepwd', {
          url: '/setting/changepwd',
          views: {
            'main-view': {
              templateUrl: 'templates/member/setting-changepwd.html',
              controller: 'ChangePwdCtrl'
            }
          }
        })
        // 收货地址管理
        .state('receivers', {
          url: '/receivers',
          views: {
            'main-view': {
              templateUrl: 'templates/member/receiver-index.html',
              controller: 'ReceiversCtrl'
            }
          }
        })
        // 收货地址修改
        .state('receiver-change', {
          url: '/receiverchange/:addrInfo',
          views: {
            'main-view': {
              templateUrl: 'templates/member/receiver-add.html',
              controller: 'ReceiverAddCtrl'
            }
          }
        })
        // 身份证管理
        .state('idcards', {
          url: '/idcards',
          views: {
            'main-view': {
              templateUrl: 'templates/member/idcard-list.html',
              controller: 'IdCardsCtrl'
            }
          }
        })
        // 身份证修改
        .state('idcard-change', {
          url: '/idcardchange/:cardInfo',
          views: {
            'main-view': {
              templateUrl: 'templates/member/idcard-add.html',
              controller: 'IdCardAddCtrl'
            }
          }
        })
        // 收藏管理
        .state('favorites', {
          url: '/favorites?type',
          views: {
            'main-view': {
              templateUrl: 'templates/member/favorite-index.html',
              controller: 'FavoritesCtrl'
            }
          }
        })
        // 积分管理
        .state('points', {
          url: '/points',
          views: {
            'main-view': {
              templateUrl: 'templates/member/point-index.html',
              controller: 'PointsCtrl'
            }
          }
        })
        // 金币管理
        .state('golds', {
          url: '/golds',
          views: {
            'main-view': {
              templateUrl: 'templates/member/gold-index.html',
              controller: 'GoldsCtrl'
            }
          }
        })
        // 优惠券管理
        .state('coupons', {
          url: '/coupons',
          views: {
            'main-view': {
              templateUrl: 'templates/member/coupon-index.html',
              controller: 'CouponsCtrl'
            }
          }
        })
        // 订单管理
        .state('orders', {
          url: '/orders?type',
          views: {
            'main-view': {
              templateUrl: 'templates/member/order-index.html',
              controller: 'OrdersAllCtrl'
            }
          }
        })
        // 订单详情
        .state('order-detail', {
          url: '/order/:orderId',
          views: {
            'main-view': {
              templateUrl: 'templates/member/order-detail.html',
              controller: 'OrderDetailCtrl'
            }
          }
        })
        // 订单跟踪详情
        .state('order-track', {
          url: '/track/:orderId',
          views: {
            'main-view': {
              templateUrl: 'templates/member/order-track.html',
              controller: 'OrderTrackCtrl'
            }
          }
        })
        // 支付方法选择
        .state('order-pay', {
          url: '/pay/:orderId',
          views: {
            'main-view': {
              templateUrl: 'templates/cart/cart-payment.html',
              controller: 'OrderPayCtrl'
            }
          }
        })
        // 订单评论
        .state('order-comment', {
          url: '/comment/:orderId',
          views: {
            'main-view': {
              templateUrl: 'templates/member/comment-request.html',
              controller: 'CommentRequestCtrl'
            }
          }
        })
        // 退货管理
        .state('return-orders', {
          url: '/return_orders',
          views: {
            'main-view': {
              templateUrl: 'templates/member/order-list-return.html',
              controller: 'OrderReturnCtrl'
            }
          }
        })
        // 投诉管理
        .state('complaint-orders', {
          url: '/complaint_orders',
          views: {
            'main-view': {
              templateUrl: 'templates/member/order-list-complaint.html',
              controller: 'OrderComplaintCtrl'
            }
          }
        })
        // 投诉申请
        .state('complaint-request', {
          url: '/complaintrequest/:orderId',
          views: {
            'main-view': {
              templateUrl: 'templates/member/complaint-request.html',
              controller: 'ComplaintRequestCtrl'
            }
          }
        })
        .state('complaints', {
          url: '/complaints',
          views: {
            'main-view': {
              templateUrl: 'templates/member/complaint-list.html',
              controller: 'ComplaintListCtrl'
            }
          }
        })
        .state('complaint-detail', {
          url: '/complaint/:oId',
          views: {
            'main-view': {
              templateUrl: 'templates/member/complaint-detail.html',
              controller: 'ComplaintDetailCtrl'
            }
          }
        })
        .state('return-request', {
          url: '/returnrequest/:orderId',
          views: {
            'main-view': {
              templateUrl: 'templates/member/return-request.html',
              controller: 'ReturnRequestCtrl'
            }
          }
        })
        .state('returns', {
          url: '/returns',
          views: {
            'main-view': {
              templateUrl: 'templates/member/return-list.html',
              controller: 'ReturnListCtrl'
            }
          }
        })
        .state('return-detail', {
          url: '/return/:returnId',
          views: {
            'main-view': {
              templateUrl: 'templates/member/return-detail.html',
              controller: 'ReturnDetailCtrl'
            }
          }
        })
        // 购物车首页
        .state('tab.cart', {
            url: '/cart?productId&nature',
            cache: false,
            views: {
              'tab-cart': {
                templateUrl: 'templates/cart/cart-index.html',
                controller: 'CartController'
              }
            }
          })

          .state('tab.cart-checkout', {
            url: '/cart-checkout?nature',
            cache: false,
            views: {
              'tab-cart': {
                templateUrl: 'templates/cart/cart-checkout.html',
                controller: 'CartCheckoutController'
              }
            }
          })
          .state('tab.cart-payment', {
            url: '/cart-payment',
            views: {
              'tab-cart': {
                templateUrl: 'templates/cart/cart-payment.html',
                controller: 'CartPaymentController'
              }
            }
          })
          .state('tab.order-payed', {
            url: '/order-payed?status',
            cache: false,
            views: {
              'tab-cart': {
                templateUrl: 'templates/cart/order-payed.html',
                controller: 'OrderPayedController'
              }
            }
          })
          .state('tab.cart-receiver-change', {
            url: '/cart-receiver-change/:addrInfo',
            views: {
              'tab-cart': {
                templateUrl: 'templates/member/receiver-add.html',
                controller: 'ReceiverAddCtrl'
              }
            }
          })
          .state('tab.cart-idcard-change', {
            url: '/idcardchange/:cardInfo',
            views: {
              'tab-cart': {
                templateUrl: 'templates/member/idcard-add.html',
                controller: 'IdCardAddCtrl'
              }
            }
          })
          .state('iframe', {
            url: '/iframe',
            views: {
              'main-view': {
                templateUrl: 'templates/cart/cart-iframe.html',
                controller: 'iframeController'
              }
            }
          })

    	// if none of the above states are matched, use this as the fallback
    	$urlRouterProvider.otherwise('/tab/home');
	}
)
