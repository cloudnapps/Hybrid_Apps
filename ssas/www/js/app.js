// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'pascalprecht.translate', 'home', 'shop', 'cart',
  'member', 'order', 'receiver', 'favorite', 'return', 'setting', 'login', 'point', 'seller', 'complaint', 'ngIOS9UIWebViewPatch'])
  .constant("jsonEndpoint", {url: "/data"})
  //For the real endpoint, we'd use this
  .run(function ($ionicPlatform, $translate) {
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
      if (typeof navigator.globalization !== "undefined") {
        navigator.globalization.getPreferredLanguage(function (language) {
          $translate.use((language.value).split("-")[0]);
        }, null);
      }
    });
  }) // end of run

  .config(function ($stateProvider, $urlRouterProvider, $translateProvider, $ionicConfigProvider) {

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
            templateUrl: 'templates/tab-main.html'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/home');

    // register language tables
    $translateProvider.translations('en', translations_en);
    $translateProvider.translations('zh', translations_zh);
    $translateProvider.translations('zh-TW', translations_zh);

    // console.log("$translateProvider initialized");
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
  }); // end of config


