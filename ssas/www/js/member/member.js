(function () {
  angular.module('member', ['starter.services', 'login'])
    .config(function ($stateProvider) {

      // Ionic uses AngularUI Router which uses the concept of states
      // Learn more here: https://github.com/angular-ui/ui-router
      // Set up the various states which the app can be in.
      // Each state's controller can be found in controllers.js
      $stateProvider

        .state('tab.member', {
          url: '/member',
          views: {
            'tab-member': {
              templateUrl: 'templates/member/member-index.html',
              controller: 'MemberCtrl'
            }
          }
        });
    })
    .controller('MemberCtrl', function ($scope, $ionicPopover, $state, $ionicHistory, SettingApi, userService) {
      $scope.currentUser = {};

      $scope.$on('$ionicView.beforeEnter', function () {
        if (!userService.isLogin()) {
          $scope.tabStateGo($scope.tabIndex.member, 'tab.login');
        }
        else {
          SettingApi.getMemberSetting(function(result){
            $scope.currentUser = result.data;
          })
        }
      });

      $ionicPopover.fromTemplateUrl('findPopover.html', {
        scope: $scope
      }).then(function (popover) {
        $scope.popover = popover;
      });
      $scope.openPopover = function ($event) {
        $scope.popover.show($event);
      };
      $scope.closePopover = function () {
        $scope.popover.hide();
      };
      //Cleanup the popover when we're done with it!
      $scope.$on('$destroy', function () {
        $scope.popover.remove();
      });
      // Execute action on hide popover
      $scope.$on('popover.hidden', function () {
        // Execute action
      });
      // Execute action on remove popover
      $scope.$on('popover.removed', function () {
        // Execute action
      });

      $scope.gotoPage = function (url) {
        $state.go(url, {}, {reload: true});

        $scope.closePopover();
      };

      $scope.gotoOrder = function (type) {
        $state.go('tab.orders', {type: type}, {reload: true});
      };

      $scope.logOut = function () {
        userService.logOut();
        $scope.closePopover();
        $scope.tabStateGo($scope.tabIndex.home, 'tab.home');
      }
    });
})();
