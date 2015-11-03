(function () {
  angular.module('setting', ['starter.services'])
    .controller('SettingCtrl', function ($scope, $state, $stateParams, $cordovaCamera, $ionicActionSheet, SettingApi) {
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

      var appendByCamera = function () {
        var options = {
          maximumImagesCount: 1,
          width: 200,
          height: 200,
          quality: 80,
          allowEdit: true,
          destinationType: Camera.DestinationType.FILE_URL,
          sourceType: Camera.PictureSourceType.CAMERA
        };
        $cordovaCamera.getPicture(options)
          .then(function (results) {
            alert(results);
            $scope.images_list.push(results);
            $scope.item.image = results;
          }, function () {
          });
      };

      //image picker
      var pickImage = function () {
        var options = {
          maximumImagesCount: 1,
          width: 200,
          height: 200,
          quality: 80,
          allowEdit: true,
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: Camera.PictureSourceType.PHOTOLIBRARY
        };
        $cordovaCamera.getPicture(options)
          .then(function (results) {
            alert(results);
            window.resolveLocalFileSystemURL(results, function (fileEntry) {
              $scope.images_list.push(fileEntry.nativeURL);
              $scope.item.image = fileEntry.nativeURL;
            });
          }, function () {
          });
      };

      $scope.$on('$ionicView.enter', function () {
        $scope.init();
      });
      
      function convertImgToBase64URL(url, callback, outputFormat) {
        var img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
          var canvas = document.createElement('CANVAS');
          var ctx = canvas.getContext('2d');
          canvas.height = this.height;
          canvas.width = this.width;
          ctx.drawImage(this, 0, 0);
          var dataURL = canvas.toDataURL(outputFormat || 'image/jpg');
          callback(dataURL);
          canvas = null;
        };
        img.src = url;
      }

      $scope.save = function () {
        //$scope.images_list.push('/Users/xianlong/Downloads/aaa.png');
        if ($scope.images_list.length > 0) {

          convertImgToBase64URL($scope.images_list[0], function (base64Img) {
            //remove header: data:image/jpeg;base64,
            var base64result = base64Img.result.substr(base64Img.result.indexOf(',') + 1);
            console.log('converted', base64result);
            // $scope.item.logo = base64result;
          });
          // window.requestFileSystem(1, 0, function (fs) {
          //   fs.root.getFile($scope.images_list.length[0], {create: false}, function (fileEntry) {
          //     fileEntry.file(function (fl) {
          //       alert(JSON.stringify(fl));
          //       var fileReader = new FileReader();
          //       fileReader.onloadend = function () {
          //         // 这个事件在读取结束后，无论成功或者失败都会触发
          //         if (fileReader.error) {
          //           alert('FileReader' + JSON.stringify(fileReader.error));
          //         } else {
          //           alert(JSON.stringify(fileReader.result));
          //           $scope.item.logo = fileReader.result;

          //           SettingApi.modifyMemberSetting($scope.item, function (result) {
          //             console.log(result);
          //           });
          //         }
          //       };

          //       fileReader.readAsBinaryString(file);
          //     }, function(err) {
          //       alert('FileEntry' + JSON.stringify(err));
          //     });
          //   }, function(err) {
          //     alert('GetFile' + JSON.stringify(err));
          //   });
          // }, function(err) {
          //   alert('RequestFileSystem' + JSON.stringify(err));
          // });
          /*          fileSystem.root.getFile($scope.images_list[0], {
           create: false
           }, function (entry) {
           entry.file(function (file) {
           alert(JSON.stringify(file));
           var fileReader = new FileReader();
           fileReader.onloadend = function () {
           // 这个事件在读取结束后，无论成功或者失败都会触发
           if (fileReader.error) {
           alert('FileReader' + JSON.stringify(fileReader.error));
           } else {
           alert(JSON.stringify(fileReader.result));
           $scope.item.logo = fileReader.result;

           SettingApi.modifyMemberSetting($scope.item, function (result) {
           console.log(result);
           });
           }
           };

           fileReader.readAsBinaryString(file);
           }, function (err) {
           alert('Entry' + JSON.stringify(err));
           });
           }, function (err) {
           alert('FileSystem' + JSON.stringify(err));
           });*/
        }
        else {
          SettingApi.modifyMemberSetting($scope.item, function (result) {
            console.log(result);
          });
        }
      };

      $scope.$on('$ionicView.beforeLeave', function () {
        $scope.save();
      });
    }
  )

    .
    controller('ChangePwdCtrl', function ($scope, $state, $ionicPopup, SettingApi, userService) {
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
