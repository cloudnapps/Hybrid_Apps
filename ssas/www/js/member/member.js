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
          $scope.currentUser.isWechat = userService.get('isWechat');
        });
      };

      $scope.logOut = function () {
        userService.logOut();
        $state.go('tab.home');
      };
    });
})();
