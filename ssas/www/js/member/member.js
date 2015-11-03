(function () {
  angular.module('member', ['starter.services', 'login'])
    .controller('MemberCtrl', function ($scope, $ionicPopover, $state, $ionicHistory, SettingApi, userService) {
      $scope.currentUser = {};

      // 勿删,控制设置隐藏 displayBlur selt_set
      $scope.select_setting = false;
      $scope.displayBlur = function(event) {
        $scope.select_setting = false;
      };

      $scope.selt_set = function () {
        $scope.select_setting = !$scope.select_setting;
      };

      $scope.$on('$ionicView.beforeEnter', function () {
        $scope.getUserInfo();
      });

      $scope.getUserInfo = function () {
        SettingApi.getMemberSetting(function (result) {
          $scope.currentUser = result.data;
        });
      };

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
        // $scope.closePopover();
      };

      $scope.logOut = function () {
        // $scope.closePopover();
        userService.logOut();
        $state.go('tab.home');
      };
    });
})();
