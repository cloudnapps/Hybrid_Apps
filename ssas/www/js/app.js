// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'ngCordova', 'pascalprecht.translate', 'home', 'shop', 'cart',
  'member', 'order', 'receiver', 'favorite', 'feedback', 'return', 'setting', 'login', 'point', 'seller', 'complaint', 'coupon',
  'ngIOS9UIWebViewPatch', 'ionic-generaldata', 'ionic-citypicker', 'ionic-generalpicker', 'activity', 'search', 'invitation'])
  //For the real endpoint, we'd use this
  .run(function ($ionicPlatform, $translate, userService, $rootScope, barcode, $ionicHistory, $ionicModal) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleLightContent();
      }

      // fetch preferredLanguage
      if (typeof navigator.globalization !== 'undefined') {
        navigator.globalization.getPreferredLanguage(function (/*language*/) {
          //$translate.use((language.value).split('-')[0]);
          $translate.use('zh');
        }, null);
      }
    });

    userService.initFromLocal();

    $rootScope.back = function () {
      $ionicHistory.goBack.apply($ionicHistory, arguments);
    };
    $rootScope.checkLogin = userService.checkLogin;

    var firstLaunch = localStorage.getItem("firstLaunchFinish");
    firstLaunch = true;
    // startup slideshow
    if (!firstLaunch) {
      $ionicModal.fromTemplateUrl('templates/startup.html', {
          scope: $rootScope //,
          // animation: 'fade-in'
        }).then(function (modal) {
          $rootScope.startup = modal;
          $rootScope.startup.show();
          localStorage.setItem("firstLaunchFinish", true);
          $rootScope.hideStartup = function () {
            $rootScope.startup.hide();
            $rootScope.startup.remove();
          };
        });
    }
  }) // end of run

  .config(function ($translateProvider, $ionicConfigProvider) {
    // register language tables
    $translateProvider.translations('en', translations_en);
    $translateProvider.translations('zh', translations_zh);
    $translateProvider.translations('zh-TW', translations_zh);

    // console.log('$translateProvider initialized');
    $translateProvider.determinePreferredLanguage();
    $translateProvider.preferredLanguage('zh');

    $ionicConfigProvider.platform.ios.tabs.style('standard');
    $ionicConfigProvider.platform.ios.tabs.position('bottom');
    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('bottom');

    $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
    $ionicConfigProvider.platform.android.navBar.alignTitle('center');

    $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
    $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

    $ionicConfigProvider.platform.ios.views.transition('ios');
    $ionicConfigProvider.platform.android.views.transition('android');

    $ionicConfigProvider.backButton.text('').icon('ion-chevron-left').previousTitleText(false);
    $ionicConfigProvider.views.swipeBackEnabled(false);
  }); // end of config


