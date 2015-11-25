(function () {
  angular.module('login', ['starter.services'])
    .controller('LoginCtrl', function ($scope, $state, $stateParams, $ionicPopup, $ionicHistory,
                                       $interval, userService, LoginApi, toastService, SettingApi) {
      $scope.userInfo = {};
      $scope.userInfo.isWechat = false;
      $scope.userInfo.remembered = true;

      if (userService.isLogin()) {
        $scope.back();
      }

      // 会员登录成功
      $scope.saveInfo = function (result) {
        var currentUser = {};
        currentUser.memberId = result.data.member_id;
        currentUser.name = result.data.login_name;
        currentUser.token = result.data.token;
        currentUser.mobile = result.data.mobile;
        currentUser.isRemembered = $scope.userInfo.remembered;
        currentUser.isWechat = $scope.userInfo.isWechat;

        userService.set(currentUser);
        if ($state.current.name === 'register'
          || $state.current.name === 'wxmobile') {
          $scope.back();
        }
        $scope.back();
        userService.goNext();
      };

      $scope.clicked = false;
      $scope.login = function () {
        $scope.clicked = true;
        LoginApi.loginUser($scope.userInfo.name, $scope.userInfo.password, function (result) {
          $scope.clicked = false;
          if (result.status === 1) {
            toastService.setToast(result.msg);
          }
          else {
            $scope.saveInfo(result);
          }
        });
      };

      $scope.reSendCodeTime = 0;
      $scope.getSignCode = function () {
        if (!$scope.userInfo.mobile) {
          toastService.setToast('手机号码不正确');
          return;
        }

        $scope.reSendCodeTime = 30;
        timer = $interval(function () {
          $scope.reSendCodeTime--;
          if ($scope.reSendCodeTime <= 0) {
            $interval.cancel(timer);
          }
        }, 1000);
        LoginApi.sendCode($scope.userInfo.mobile, 'signup', function (result) {
          if (result.status === 1 && result.msg === '请填写正确的手机号码') {
            $scope.reSendCodeTime = 0;
          }

          toastService.setToast(data.msg);
        });
      };

      $scope.checkUser = function () {
        LoginApi.validateUser($scope.userInfo.mobile, function (result) {
          var alertPopup = $ionicPopup.alert({
            title: '用户名检查',
            template: result.msg,
            okText: '确定' // String (默认: 'OK')。OK按钮的文字。
          });
          alertPopup.then(function (res) {
            console.log(res);
          });
        });
      };

      $scope.submitUser = function () {
        if ($scope.userInfo.password !== $scope.userInfo.confirmPwd) {
          toastService.setToast('密码不匹配');
        }
        $scope.clicked = true;
        LoginApi.submitUser($scope.userInfo.mobile, $scope.userInfo.password,
          $scope.userInfo.mobile, $scope.userInfo.signCode, function (result) {
            $scope.clicked = false;
            if (result.status === 1) {
              toastService.setToast(result.msg);
            }
            else {
              toastService.setToast('注册成功');
              $scope.saveInfo(result);
            }
          });
      };

      $scope.logonByWechat = function () {
        $scope.clicked = true;
        var scope = 'snsapi_userinfo';
        wechat.auth(scope, function (cb_success) {
            $scope.clicked = false;
            LoginApi.getOpenId(cb_success.code, function (result) {
              LoginApi.loginByWechatId(result.openid, result.access_token, result.unionid, function (result) {
                if (result.status === 1) {
                  toastService.setToast(result.msg);
                }
                else {
                  if (!result.data.mobile) {
                    $state.go('wxmobile', {data: JSON.stringify(result.data)}, {reload: true});
                  }
                  else {
                    $scope.userInfo.isWechat = true;
                    $scope.userInfo.remembered = true;
                    $scope.saveInfo(result);
                  }
                }
              });
            });
          },
          function (cb_failure) {
            $scope.clicked = false;
          });
      };

      $scope.modifyMobile = function () {
        if ($stateParams.data) {
          var wxUser = {};
          wxUser.data = JSON.parse($stateParams.data);
          SettingApi.modifyMobileSetting(wxUser.data.member_id, wxUser.data.token,
            $scope.userInfo.mobile, $scope.userInfo.signCode, function (result) {
              if (result.status === 0) {
                $scope.userInfo.isWechat = true;
                $scope.userInfo.remembered = true;
                $scope.saveInfo(wxUser);
              }
              else {
                toastService.setToast(result.msg);
              }
            });
        }
      };

      $scope.register = function () {
        $state.go('register');
      }
    })

    .controller('RetrieveCtrl', function ($scope, $state, $interval, LoginApi, toastService) {
      $scope.userInfo = {};
      $scope.verified = false;
      $scope.sendCode = sendCode;
      $scope.mobileValide = mobileValide;
      $scope.lostPasswd = lostPasswd;
      $scope.reSendCodeTime = 0;

      var timer = null;

      function sendCode() {
        if (!$scope.userInfo.mobile) {
          toastService.setToast('请填写手机号');
          return;
        }
        $scope.reSendCodeTime = 30;
        timer = $interval(function () {
          $scope.reSendCodeTime--;
          if ($scope.reSendCodeTime === 0) {
            $interval.cancel(timer);
          }
        }, 1000);
        LoginApi
          .sendCode($scope.userInfo.mobile, 'lost', function (data) {
            if (data.status === 1 && data.msg === '请填写正确的手机号码') {
              $scope.reSendCodeTime = 0;
            }
            toastService.setToast(data.msg);
          }, {
            type: 'lost'
          });
      }

      function mobileValide() {
        if (!$scope.userInfo.mobile) {
          toastService.setToast('请填写手机号~');
          return;
        }
        LoginApi
          .mobileValide($scope.userInfo.mobile, $scope.userInfo.mobile, $scope.userInfo.signCode, function (data) {
            if (data && data.status === 0) {
              $scope.verified = true;
            }
            else {
              toastService.setToast(data && data.msg || '验证失败');
            }
          });
      }

      function lostPasswd() {
        LoginApi
          .lostPasswd($scope.userInfo.mobile, $scope.userInfo.password, $scope.userInfo.confirmPwd, function (data) {
            // 密码修改成功
            if (data && data.status === 0) {
              toastService.setToast(data && data.msg || '修改成功');
              $scope.back();
            } else {
              toastService.setToast(data && data.msg || '修改失败');
            }
          });
      }
    })

    .controller('RegisterController', function ($scope) {

    })

    .factory('LoginApi', function ($http, apiEndpoint, transformRequestAsFormPost) {
      console.log(apiEndpoint);

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

      var validateUser = function (name, callback) {
        var url = apiEndpoint.url + '/passport-register_valide.html';
        var data = {
          login_name: name
        };

        sendRequest(url, data, callback);
      };

      var submitUser = function (name, password, mobile, signCode, callback) {
        var url = apiEndpoint.url + '/passport-create.html';
        var data = {
          login_name: name,
          password: btoa(password),
          mobile: mobile,
          sign_code: signCode
        };

        sendRequest(url, data, callback);
      };

      var loginUser = function (name, password, callback) {
        var url = apiEndpoint.url + '/passport-login.html';
        var data = {
          login_name: name,
          password: btoa(password)
        };

        sendRequest(url, data, callback);
      };

      var mobileValide = function (mobile, login_name, sign_code, callback) {
        var url = apiEndpoint.url + '/passport-mobile_valide.html';
        var data = {
          mobile: mobile,
          sign_code: sign_code,
          login_name: login_name || mobile
        };

        sendRequest(url, data, callback);
      };

      var sendCode = function (mobile, type, callback) {
        var url = apiEndpoint.url + '/passport-send_code.html';
        var data = {
          mobile: mobile,
          type: type
        };
        var extra = arguments[2];
        if (extra) {
          for (var f in extra) {
            if (extra.hasOwnProperty(f)) {
              data[f] = extra[f];
            }
          }
        }

        sendRequest(url, data, callback);
      };

      var lostPasswd = function (login_name, password, psw_confirm, callback) {
        var url = apiEndpoint.url + '/passport-lost_passwd.html';
        var data = {
          login_name: login_name,
          password: btoa(password),
          psw_confirm: btoa(psw_confirm)
        };
        sendRequest(url, data, callback);
      };

      var getOpenId = function (code, callback) {
        var url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx169f5e5b9d07599c&secret=4045e23690ff1d4f4d2c950328326e71&grant_type=authorization_code';
        url = url + '&code=' + code;

        var request = $http({
          method: 'get',
          url: url
        });

        request.success(
          function (result) {
            console.log(result);
            callback(result);
          }
        );
      };

      var loginByWechatId = function (openId, accessToken, unionId, callback) {
        var url = apiEndpoint.url + '/passport-wx_login.html';
        var data = {
          wx_id: openId,
          access_token: accessToken,
          unionid: unionId
        };
        sendRequest(url, data, callback);
      };

      return {
        lostPasswd: lostPasswd,
        mobileValide: mobileValide,
        validateUser: validateUser,
        submitUser: submitUser,
        loginUser: loginUser,
        sendCode: sendCode,
        getOpenId: getOpenId,
        loginByWechatId: loginByWechatId
      };
    });
})();
