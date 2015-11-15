(function () {
  angular.module('member', ['starter.services', 'login'])
    .controller('MemberCtrl',
    function ($scope, $ionicPopover, $state, $ionicHistory, SettingApi, userService, $ionicActionSheet,
              orderStateService, favoriteStateService) {
      $scope.currentUser = {};

      $scope.goOrders = function (type) {
        orderStateService.set(type);
        $state.go('orders');
      };

      $scope.goFavorites = function (type) {
        favoriteStateService.set(type);
        $state.go('favorites');
      };

      // 勿删,控制设置隐藏 displayBlur selt_set
      $scope.select_setting = false;
      $scope.displayBlur = function (event) {
        $scope.select_setting = false;
      };

      $scope.selt_set = function () {
        // $scope.select_setting = !$scope.select_setting;
        if (!$scope.currentUser || $scope.currentUser.isWechat) {
          var hideSheet = $ionicActionSheet.show({
            destructiveText: '<i class="icon ion-power assertive"></i> 安全退出',
            destructiveButtonClicked: function () {
              $scope.logOut();
            },
            cancelText: '取消',
            cancel: function () {
              // add cancel code..
            }
          });
        }
        else {
          var hideSheet = $ionicActionSheet.show({
            buttons: [
              {text: '<i class="icon ion-unlocked clam"></i> 修改密码'}
            ],
            buttonClicked: function (index) {
              $state.go('setting_changepwd');
            },
            destructiveText: '<i class="icon ion-power assertive"></i> 安全退出',
            destructiveButtonClicked: function () {
              $scope.logOut();
            },
            cancelText: '取消',
            cancel: function () {
              // add cancel code..
            }
          });
        }
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
