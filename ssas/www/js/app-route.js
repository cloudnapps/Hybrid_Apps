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
        	url: '/products?categoryId&keywords',
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
      	// 产品图文详情
      	.state('product-intro', {
        	url: '/goods/:id/intro?productId&sellerId',
        	views: {
          		'main-view': {
            		templateUrl: 'templates/shop/product-intro.html',
            		controller: 'ProductIntroController'
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
        .state('receiver_change', {
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

    	// if none of the above states are matched, use this as the fallback
    	$urlRouterProvider.otherwise('/tab/home');
	}
)