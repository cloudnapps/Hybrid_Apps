(function () {
  angular.module('login', ['starter.services'])
    .config(function ($stateProvider) {

      // Ionic uses AngularUI Router which uses the concept of states
      // Learn more here: https://github.com/angular-ui/ui-router
      // Set up the various states which the app can be in.
      // Each state's controller can be found in controllers.js
      $stateProvider

        .state('tab.login', {
          url: '/login',
          views: {
            'tab-member': {
              templateUrl: 'templates/login/user-login.html',
              controller: 'LoginCtrl'
            }
          }
        })
        .state('tab.register', {
          url: '/register',
          views: {
            'tab-member': {
              templateUrl: 'templates/login/user-register.html',
              controller: 'LoginCtrl'
            }
          }
        }) // 找回密码
        .state('tab.retrieve', {
          url: '/retrieve',
          cache: false,
          views: {
            'tab-member': {
              templateUrl: 'templates/login/user-retrieve-password.html',
              controller: 'RetrieveCtrl'
            }
          }
        });
    })

    .controller('LoginCtrl', function ($scope, $state, $ionicPopup, $ionicHistory, userService, LoginApi) {
      $scope.userInfo = {};

      $scope.$on('$ionicView.beforeEnter', function () {
        if (userService.isLogin()) {
          $scope.tabStateGo($scope.tabIndex.member, 'tab.member');
        }
      });

      $scope.goBack = function () {
        console.log('userService.backIndex', userService.backIndex);
        if ([undefined, -1, $scope.tabIndex.cart, $scope.tabIndex.member].indexOf(userService.backIndex) !== -1) {
          $scope.tabStateGo($scope.tabIndex.home);
          userService.backIndex = -1;
        }
        else {
          $scope.tabStateGo(userService.backIndex);
          userService.backIndex = -1;
        }
      };

      $scope.saveInfo = function (result) {
        var currentUser = {};
        currentUser.memberId = result.data.member_id;
        currentUser.name = result.data.login_name;
        currentUser.token = result.data.token;
        currentUser.isRemembered = $scope.userInfo.remembered;

        userService.set(currentUser);
        if (userService.backIndex === -1) {
          $ionicHistory.goBack();
          $scope.tabStateGo($scope.tabIndex.member, 'tab.member');
          userService.backIndex = -1;
        }
        else {
          $ionicHistory.goBack();
          $scope.tabStateGo(userService.backIndex);
          userService.backIndex = -1;
        }
      };

      $scope.login = function () {
        LoginApi.loginUser($scope.userInfo.name, $scope.userInfo.password, function (result) {
          if (result.status === 1) {
            var alertPopup = $ionicPopup.alert({
              title: '登录失败',
              template: '账户名或者密码不正确'
            });
            alertPopup.then(function (res) {
              console.log(res);
            });
          }
          else {
            $scope.saveInfo(result);
          }
        });
      };

      $scope.getSignCode = function () {
        LoginApi.sendCode($scope.userInfo.mobile, 'signup', function (result) {
          var alertPopup = $ionicPopup.alert({
            title: '获取验证码',
            template: result.msg
          });
          alertPopup.then(function (res) {
            console.log(res);
          });
        });
      };

      $scope.checkUser = function () {
        LoginApi.validateUser($scope.userInfo.mobile, function (result) {
          var alertPopup = $ionicPopup.alert({
            title: '用户名检查',
            template: result.msg
          });
          alertPopup.then(function (res) {
            console.log(res);
          });
        });
      };

      $scope.submitUser = function () {
        if ($scope.userInfo.password !== $scope.userInfo.confirmPwd) {
          var alertPopup = $ionicPopup.alert({
            title: '注册失败',
            template: '密码不匹配'
          });
          alertPopup.then(function (res) {
            console.log(res);
          });
        }

        LoginApi.submitUser($scope.userInfo.mobile, $scope.userInfo.password,
          $scope.userInfo.mobile, $scope.userInfo.signCode, function (result) {
            if (result.status === 1) {
              var alertPopup = $ionicPopup.alert({
                title: '用户注册',
                template: result.msg
              });
              alertPopup.then(function (res) {
                console.log(res);
              });
            }
            else {
              $scope.saveInfo(result);
            }
          });
      };

      $scope.logonByWechat = function () {
        var scope = 'snsapi_userinfo';
        wechat.auth(scope, function (cb_success) {
            LoginApi.getOpenId(cb_success.code, function (result) {
              LoginApi.loginByWechatId(result.openid, function (result) {
                if (result.status === 1) {
                  var alertPopup = $ionicPopup.alert({
                    title: '登录失败',
                    template: '账户名或者密码不正确'
                  });
                  alertPopup.then(function (res) {
                    console.log(res);
                  });
                }
                else {
                  $scope.saveInfo(result);
                }
              });
            });
          },
          function (cb_failure) {
            alert(cb_failure);
          });
      };
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
          toastService.setToast('请填写手机号~');
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
            if (data && data.status === 0) {
              toastService.setToast(data && data.msg || '修改成功');
              $scope.tabStateGo($scope.tabIndex.member, null, null, {isForce: true});
            }
            else {
              toastService.setToast(data && data.msg || '修改失败');
              $scope.verified = false;
            }
          });
      }
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

      var loginByWechatId = function (openId, callback) {
        var url = apiEndpoint.url + '/passport-wx_login.html';
        var data = {
          wx_id: openId
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
