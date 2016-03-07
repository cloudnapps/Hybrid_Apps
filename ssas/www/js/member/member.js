(function () {
  angular.module('member', ['starter.services', 'login'])
    .controller('MemberCtrl', function ($scope, $ionicPopover, $state, $ionicHistory, SettingApi, userService, $ionicActionSheet,
                                        orderStateService, favoriteStateService, $ionicPopup) {
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

      $scope.$on('$ionicView.afterEnter', function () {
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

      $scope.callService = function () {
        $ionicPopup.show({
          title: '联系客服',
          template: '请拨打客服热线400-1398888',
          buttons: [
            {text: '取消'},
            {
              text: '<b>确定</b>',
              type: 'button-positive',
              onTap: function () {
                phonedialer.dial("400-1398888", function (err) {
                  console.log(err);
                });
              }
            }
          ]
        });
      }
    })
    .controller('MemberItemController', function ($scope) {
    })
    .controller('MemberHelpController', function ($scope) {
    })
    .controller('MemberTaxController', function ($scope) {
    });
})();
