(function () {
  angular.module('setting', ['starter.services'])
    .config(function ($stateProvider) {

      // Ionic uses AngularUI Router which uses the concept of states
      // Learn more here: https://github.com/angular-ui/ui-router
      // Set up the various states which the app can be in.
      // Each state's controller can be found in controllers.js
      $stateProvider

        .state('tab.settings', {
          url: '/settings',
          views: {
            'tab-member': {
              templateUrl: 'templates/member/setting-index.html',
              controller: 'SettingCtrl'
            }
          }
        })
        .state('tab.setting_gender', {
          url: '/setting/gender?params',
          views: {
            'tab-member': {
              templateUrl: 'templates/member/setting-gender.html',
              controller: 'SettingGenderCtrl'
            }
          }
        })
        .state('tab.setting_birthday', {
          url: '/setting/birthday?params',
          views: {
            'tab-member': {
              templateUrl: 'templates/member/setting-birthday.html',
              controller: 'SettingBirthdayCtrl'
            }
          }
        })
        .state('tab.setting_changepwd', {
          url: '/setting/changepwd',
          views: {
            'tab-member': {
              templateUrl: 'templates/member/setting-changepwd.html',
              controller: 'ChangePwdCtrl'
            }
          }
        })
        .state('tab.idcards', {
          url: '/idcards',
          views: {
            'tab-member': {
              templateUrl: 'templates/member/idcard-list.html',
              controller: 'IdCardsCtrl'
            }
          }
        })
        .state('tab.idcard_change', {
          url: '/idcardchange/:cardInfo',
          views: {
            'tab-member': {
              templateUrl: 'templates/member/idcard-add.html',
              controller: 'IdCardAddCtrl'
            }
          }
        });
    })

    .controller('SettingCtrl', function ($scope, $state, $stateParams, $ionicActionSheet, SettingApi) {
      $scope.init = function () {
        $scope.item = {};

        SettingApi.getMemberSetting(function (result) {
          $scope.item = result.data;
        });
      };

      $scope.$on('$ionicView.enter', function () {
        $scope.init();
      });

      $scope.goPage = function (url) {
        if (url === 'tab.setting_birthday') {
          $state.go(url, {params: $scope.item.birthday}, {reload: true});
        }
        else if (url === 'tab.setting_gender') {
          $state.go(url, {params: $scope.item.sex}, {reload: true});
        }
      };
    })

    .controller('SettingBirthdayCtrl', function ($scope, $state, $ionicPopup, SettingApi) {
      $scope.birthdayInfo = {};
      $scope.birthdayInfo.years = [];
      for (var i = 1900; i < 2010; i++) {
        $scope.birthdayInfo.years.push(i);
      }

      $scope.birthdayInfo.months = [];
      for (var i = 1; i < 13; i++) {
        $scope.birthdayInfo.months.push(i);
      }

      $scope.birthdayInfo.days = [];
      for (var i = 1; i < 32; i++) {
        $scope.birthdayInfo.days.push(i);
      }

      $scope.changeBirthday = function () {
        var memberInfo = {
          birthday: $scope.birthdayInfo.selectedYear +
          '-' + $scope.birthdayInfo.selectedMonth +
          '-' + $scope.birthdayInfo.selectedDay
        };

        SettingApi.modifyMemberSetting(memberInfo, function (result) {
          if (result.status === 1) {
            var alertPopup = $ionicPopup.alert({
              title: '修改个人信息',
              template: result.msg
            });

            alertPopup.then(function (res) {
              console.log(res);
            });
          }
          else {
            $state.go('tab.settings', {}, {reload: true});
          }
        });
      }
    })

    .controller('SettingGenderCtrl', function ($scope, $state, $stateParams, SettingApi) {
      $scope.genderInfo = {};
      $scope.genderInfo.gentle = $stateParams.params === 'gentle';
      $scope.genderInfo.lady = !$scope.genderInfo.gentle;


      $scope.changeGender = function () {
        var memberInfo = {
          sex: $scope.genderInfo.gentle ? 'gentle' : 'lady'
        };

        SettingApi.modifyMemberSetting(memberInfo, function (result) {
          if (result.status === 1) {
            var alertPopup = $ionicPopup.alert({
              title: '修改个人信息',
              template: result.msg
            });

            alertPopup.then(function (res) {
              console.log(res);
            });
          }
          else {
            $state.go('tab.settings', {}, {reload: true});
          }
        });
      }
    })

    .controller('ChangePwdCtrl', function ($scope, $state, $ionicPopup, SettingApi) {
      $scope.pwdInfo = {};

      $scope.modify = function () {
        if ($scope.pwdInfo.new !== $scope.pwdInfo.confirm) {
          var errorPopup = $ionicPopup.alert({
            title: '修改密码',
            template: '两次输入的密码不一致'
          });

          errorPopup.then(function (res) {
            console.log(res);
          });
        }

        var data = {
          newPassword: $scope.pwdInfo.new,
          oldPassword: $scope.pwdInfo.old,
          confirmPassword: $scope.pwdInfo.confirm
        };

        SettingApi.modifyMemberPassword(data, function (result) {
          var alertPopup = $ionicPopup.alert({
            title: '修改密码',
            template: result.msg
          });

          alertPopup.then(function (res) {
            console.log(res);
          });
        });
      };
    })

    .controller('IdCardsCtrl', function ($scope, $state, SettingApi) {
      $scope.items = [];

      $scope.init = function () {
        if ($scope.items.length === 0) {
          $scope.items = [];
          $scope.page = 0;
          $scope.hasMore = true;
        }
      };

      $scope.loadMore = function () {
        SettingApi.getIdCardList($scope.page + 1, function (result) {
          if (result.status === 1) {
            $scope.hasMore = false;
          }
          else {
            $scope.items = $scope.items.concat(result.data);
            $scope.page += 1;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
        });
      };

      $scope.$on('$ionicView.enter', function () {
        $scope.isActtive = true;
        $scope.init();
      });

      $scope.$on('$ionicView.beforeLeave', function () {
        $scope.isActtive = false;
      });

      $scope.$on('$stateChangeSuccess', function () {
        if ($scope.isActtive)
          $scope.loadMore();
      });

      $scope.setDefault = function (item) {
        $state.go('tab.idcard_change', {cardInfo: JSON.stringify(item)}, {reload: true});
      }
    })

    .controller('IdCardAddCtrl', function ($scope, $stateParams, $ionicPopup, SettingApi) {
      if ($stateParams.cardInfo) {
        $scope.idCardInfo = JSON.parse($stateParams.cardInfo);
      }
      else {
        $scope.idCardInfo = {};
      }


      $scope.add = function () {
        if ($scope.idCardInfo.card_id) {
          SettingApi.setDefaultIdCard($scope.idCardInfo.card_id, function (result) {
            var alertPopup = $ionicPopup.alert({
              title: '设置身份信息',
              template: result.msg ? result.msg : '设置成功'
            });
            alertPopup.then(function (res) {
              console.log(res);
            });
          })
        }
        else {
          var data = {
            full_name: $scope.idCardInfo.full_name,
            number: $scope.idCardInfo.number,
            is_default: $scope.idCardInfo.is_default ? '1' : '0'
          };

          SettingApi.addIdCard(data, function (result) {
            var alertPopup = $ionicPopup.alert({
              title: '添加身份信息',
              template: result.msg ? result.msg : '添加成功'
            });
            alertPopup.then(function (res) {
              console.log(res);
            });
          })
        }
      };
    })

    .factory('SettingApi', function ($http, apiEndpoint, transformRequestAsFormPost) {
      console.log(apiEndpoint);

      var sendRequest = function (url, data, callback) {
        var request = $http({
          method: "post",
          url: url,
          transformRequest: transformRequestAsFormPost,
          data: data,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

        request.success(
          function (result) {
            console.log(result);
            callback(result);
          }
        );
      };

      var getMemberSetting = function (callback) {
        var url = apiEndpoint.url + '/member-setting.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4'
        };

        sendRequest(url, data, callback);
      };

      var modifyMemberSetting = function (memberInfo, callback) {
        var url = apiEndpoint.url + '/member-save_setting.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
          params: memberInfo
        };

        sendRequest(url, data, callback);
      };

      var modifyMemberPassword = function (passwordInfo, callback) {
        var url = apiEndpoint.url + '/member-security.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
          new_passwd: passwordInfo.newPassword,
          old_passwd: passwordInfo.oldPassword,
          re_passwd: passwordInfo.confirmPassword
        };

        sendRequest(url, data, callback);
      };

      var getIdCardList = function (page, callback) {
        var url = apiEndpoint.url + '/member-idcard_list.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4'
        };

        if (page) {
          data.page = page;
        }

        sendRequest(url, data, callback);
      };

      var addIdCard = function (params, callback) {
        var url = apiEndpoint.url + '/member-add_idcart.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
          params: params
        };

        sendRequest(url, data, callback);
      };

      var setDefaultIdCard = function (cardId, callback) {
        var url = apiEndpoint.url + '/member-default_idcard.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
          card_id: cardId
        };

        sendRequest(url, data, callback);
      };

      return {
        getMemberSetting: getMemberSetting,
        modifyMemberSetting: modifyMemberSetting,
        modifyMemberPassword: modifyMemberPassword,
        getIdCardList: getIdCardList,
        addIdCard: addIdCard,
        setDefaultIdCard: setDefaultIdCard
      };
    });
})();
