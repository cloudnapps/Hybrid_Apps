(function () {
  angular.module('login', ['starter.services'])
    .config(function ($stateProvider) {

      // Ionic uses AngularUI Router which uses the concept of states
      // Learn more here: https://github.com/angular-ui/ui-router
      // Set up the various states which the app can be in.
      // Each state's controller can be found in controllers.js
      $stateProvider

        .state('login', {
          url: '/login',
          views: {
            'main-view': {
              templateUrl: 'templates/login/user-login.html',
              controller: 'LoginCtrl'
            }
          }
        })
        .state('register', {
          url: '/register',
          views: {
            'main-view': {
              templateUrl: 'templates/login/user-register.html',
              controller: 'LoginCtrl'
            }
          }
        })
        .state('retrieve', {
          url: '/retrieve',
          views: {
            'main-view': {
              templateUrl: 'templates/login/user-retrieve-password.html',
              controller: 'RetrieveCtrl'
            }
          }
        });
    })

    .controller('LoginCtrl', function ($scope, $state, $ionicPopup, userService, LoginApi) {
      $scope.userInfo = {};

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
            var currentUser = {};
            currentUser.memberId = result.data.member_id;
            currentUser.name = result.data.login_name;
            currentUser.token = result.data.token;

            userService.saveUser(currentUser);
            $state.go('tab.home', {}, {location: "replace"});
          }
        });
      };

      $scope.getSignCode = function () {
        LoginApi.sendCode($scope.userInfo.mobile, function (result) {
          var alertPopup = $ionicPopup.alert({
            title: '获取验证码',
            template: result.msg
          });
          alertPopup.then(function (res) {
            console.log(res);
          });
        })
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
        })
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
            var alertPopup = $ionicPopup.alert({
              title: '用户注册',
              template: result.msg
            });
            alertPopup.then(function (res) {
              console.log(res);
            });
          })
      };
    })
    .controller('RetrieveCtrl', function($scope, $state, LoginApi, toastService){
      $scope.userInfo = {};
      $scope.verified = false;
      $scope.sendCode = sendCode;
      $scope.mobileValide = mobileValide;
      $scope.lostPasswd = lostPasswd;

      function sendCode(){
        if (!$scope.userInfo.mobile) {
          toastService.setToast('手机号~');
          return;
        }
        LoginApi
          .sendCode($scope.userInfo.mobile, function(data){
            toastService.setToast(data.msg);
          }, {
            type: 'lost'
          });
      }

      function mobileValide(){
        LoginApi
          .mobileValide($scope.userInfo.mobile, $scope.userInfo.mobile, $scope.userInfo.signCode, function(data){
            if (data && data.status === 0) {
              $scope.verified = true;
            }
            else {
              toastService.setToast(data && data.msg || '验证失败');
            }
          });
      }
 
      function lostPasswd(){
        LoginApi
          .lostPasswd($scope.userInfo.mobile, $scope.userInfo.password, $scope.userInfo.confirmPwd, function(data){
             if (data && data.status === 0) {
                toastService.setToast(data && data.msg || '修改成功');
                return $state.go('login');
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

      var sendCode = function (mobile, callback) {
        var url = apiEndpoint.url + '/passport-send_code.html';        
        var data = {
          mobile: mobile
        };
        var extra = arguments[2];
        if (extra) {
          for(var f in extra) {
            if (extra.hasOwnProperty(f)) {
              data[f] = extra[f];
            }
          }
        }

        sendRequest(url, data, callback);
      };

      var lostPasswd = function(login_name, password, psw_confirm, callback){
        var url = apiEndpoint.url + '/passport-lost_passwd.html';        
        var data = {
          login_name: login_name,
          password: btoa(password),
          psw_confirm: btoa(psw_confirm)
        };
        sendRequest(url, data, callback);
      }

      return {
        lostPasswd: lostPasswd,
        mobileValide: mobileValide,
        validateUser: validateUser,
        submitUser: submitUser,
        loginUser: loginUser,
        sendCode: sendCode
      };
    })
})();
