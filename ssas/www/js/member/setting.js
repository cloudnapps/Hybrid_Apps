(function () {
  angular.module('setting', ['starter.services'])
    .controller('SettingCtrl', function ($scope, $state, $stateParams, $cordovaImagePicker, $ionicActionSheet, SettingApi) {
      function setDays() {
        $scope.birthdayInfo.years = [];
        for (var i = 1900; i < 2020; i++) {
          $scope.birthdayInfo.years.push(i);
        }

        $scope.birthdayInfo.months = [];
        for (var j = 1; j < 13; j++) {
          $scope.birthdayInfo.months.push(j);
        }

        $scope.birthdayInfo.days = [];
        for (var k = 1; k < 32; k++) {
          $scope.birthdayInfo.days.push(k);
        }
      }

      $scope.init = function () {
        $scope.item = {};
        $scope.isChanged = false;

        $scope.showGender = false;
        $scope.showBirthday = false;

        $scope.birthdayInfo = {};
        setDays();

        SettingApi.getMemberSetting(function (result) {
          $scope.item = result.data;

          var userBirthday = ($scope.birthday || '1980-1-1').split('-');
          $scope.birthdayInfo.selectedYear = userBirthday[0];
          $scope.birthdayInfo.selectedMonth = userBirthday[1];
          $scope.birthdayInfo.selectedDay = userBirthday[2];
        });
      };

      $scope.setGender = function (gender) {
        $scope.item.sex = gender;
        $scope.isChanged = true;
      };

      $scope.setBirthday = function () {
        $scope.item.birthday = $scope.birthdayInfo.selectedYear +
          '-' + $scope.birthdayInfo.selectedMonth +
          '-' + $scope.birthdayInfo.selectedDay;
        $scope.isChanged = true;
      };

      $scope.images_list = [];

      // "添加附件"事件
      $scope.addAttachment = function () {
        $ionicActionSheet.show({
          buttons: [
            {text: '相机'},
            {text: '图库'}
          ],
          cancelText: '关闭',
          cancel: function () {
            return true;
          },
          buttonClicked: function (index) {
            switch (index) {
              case 0:
                appendByCamera();
                break;
              case 1:
                pickImage();
                break;
              default:
                break;
            }
            return true;
          }
        });
      };

      //image picker
      var pickImage = function () {
        var options = {
          maximumImagesCount: 1,
          width: 800,
          height: 800,
          quality: 80
        };

        $cordovaImagePicker.getPictures(options)
          .then(function (results) {
            $scope.images_list.push(results[0]);
          }, function () {
          });
      };

      $scope.$on('$ionicView.enter', function () {
        $scope.init();
      });

      $scope.save = function () {
        SettingApi.modifyMemberSetting($scope.item, function (result) {
          console.log(result);
        });
      };

      $scope.$on('$ionicView.beforeLeave', function () {
        $scope.save();
      });
    })

    .controller('ChangePwdCtrl', function ($scope, $state, $ionicPopup, SettingApi, userService) {
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

            if (result.status === 0) {
              $scope.back();
            }
          });
        });
      };
    })

    .controller('IdCardsCtrl', function ($scope, $state, SettingApi) {
      $scope.init = function () {
        $scope.items = [];
        $scope.page = 1;
        $scope.hasMore = false;
        $scope.filter = '';
      };

      $scope.getIdCards = function () {
        SettingApi.getIdCardList($scope.page, function (result) {
          if (result.status === 1) {
            $scope.hasMore = false;
          }
          else {
            $scope.hasMore = true;
            $scope.items = $scope.items.concat(result.data);
          }

          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      };

      $scope.$on('$ionicView.beforeEnter', function () {
        $scope.init();
        $scope.getIdCards();
      });

      $scope.loadMore = function () {
        $scope.page++;
        $scope.getIdCards();
      };

      $scope.setDefault = function (item) {
        $state.go('idcard-change', {cardInfo: JSON.stringify(item)}, {reload: true});
      };
    })

    .controller('IdCardAddCtrl', function ($scope, $state, $stateParams, $ionicHistory, $ionicPopup, SettingApi) {
      if ($stateParams.cardInfo) {
        $scope.idCardInfo = JSON.parse($stateParams.cardInfo);
        $scope.title = '设置身份证';
      }
      else {
        $scope.idCardInfo = {};
        $scope.title = '新建身份证';
      }


      $scope.add = function () {
        if ($scope.idCardInfo.card_id) {
          SettingApi.setDefaultIdCard($scope.idCardInfo.card_id, function (result) {
            if (result.status === 0) {
              $scope.back();
            }
            else {
              var alertPopup = $ionicPopup.alert({
                title: '设置身份证',
                template: result.msg
              });
              alertPopup.then(function (res) {
                console.log(res);
              })
            }
          });
        }
        else {
          var data = {
            full_name: $scope.idCardInfo.full_name,
            number: $scope.idCardInfo.number,
            is_default: $scope.idCardInfo.is_default ? '1' : '0'
          };

          SettingApi.addIdCard(data, function (result) {
            if (result.status === 0) {
              $scope.back();
            }
            else {
              var alertPopup = $ionicPopup.alert({
                title: '添加身份信息',
                template: result.msg
              });

              alertPopup.then(function (res) {
                console.log(res);
              });
            }
          });
        }
      };
    })

    .factory('SettingApi', function ($http, apiEndpoint, userService, transformRequestAsFormPost) {
      var sendRequest = function (url, data, callback) {
        var request = $http({
          method: 'post',
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
        var data = userService.getMember();

        sendRequest(url, data, callback);
      };

      var modifyMemberSetting = function (memberInfo, callback) {
        var url = apiEndpoint.url + '/member-save_setting.html';
        var data = userService.getMember();

        data.params = memberInfo;

        sendRequest(url, data, callback);
      };

      var modifyMemberPassword = function (passwordInfo, callback) {
        var url = apiEndpoint.url + '/member-security.html';
        var data = userService.getMember();

        data.new_passwd = btoa(passwordInfo.newPassword);
        data.old_passwd = btoa(passwordInfo.oldPassword);
        data.re_passwd = btoa(passwordInfo.confirmPassword);

        sendRequest(url, data, callback);
      };

      var getIdCardList = function (page, callback) {
        var url = apiEndpoint.url + '/member-idcard_list.html';
        var data = userService.getMember();

        if (page) {
          data.page = page;
        }

        sendRequest(url, data, callback);
      };

      var addIdCard = function (params, callback) {
        var url = apiEndpoint.url + '/member-add_idcart.html';
        var data = userService.getMember();

        data.params = params;

        sendRequest(url, data, callback);
      };

      var setDefaultIdCard = function (cardId, callback) {
        var url = apiEndpoint.url + '/member-default_idcard.html';
        var data = userService.getMember();

        data.card_id = cardId;

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
