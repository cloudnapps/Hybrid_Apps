(function () {
  angular.module('member', ['starter.services'])
    .config(function ($stateProvider) {

      // Ionic uses AngularUI Router which uses the concept of states
      // Learn more here: https://github.com/angular-ui/ui-router
      // Set up the various states which the app can be in.
      // Each state's controller can be found in controllers.js
      $stateProvider

        .state('tab.member', {
          url: '/member',
          views: {
            'tab-member': {
              templateUrl: 'templates/member/member-index.html',
              controller: 'MemberCtrl'
            }
          }
        });
    })

    .controller('MemberCtrl', function ($scope) {
    })

    .factory('MemberApi', function ($http, apiEndpoint, transformRequestAsFormPost) {
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
      }

      var getCouponList = function (page, callback) {
        var url = apiEndpoint.url + '/member-coupon_list.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
        };

        if (page) {
          data.page = page;
        }

        sendRequest(url, data, callback);
      };

      var getMemberRate = function (orderId, callback) {
        var url = apiEndpoint.url + '/member-member_rate.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
          order_id: orderId
        };

        sendRequest(url, data, callback);
      };

      var addMemberRate = function (orderId, rateInfo, callback) {
        var url = apiEndpoint.url + '/member-member_rate.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
          order_id: orderId,
          seller_id: rateInfo.sellerId,
          comment: rateInfo.comment,
          seller_point: rateInfo.seller_point
        };

        sendRequest(url, data, callback);
      };

      var getMemberSetting = function (callback) {
        var url = apiEndpoint.url + '/member-setting.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
        };

        sendRequest(url, data, callback);
      };

      var modifyMemberSetting = function (memeberInfo, callback) {
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
          re_passwd: passwordInfo.confirmPassword,
        };

        sendRequest(url, data, callback);
      };

      return {
      };
    });
})();
