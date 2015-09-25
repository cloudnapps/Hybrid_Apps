(function () {
  angular.module('receiver', ['starter.services'])
    .config(function ($stateProvider) {

      // Ionic uses AngularUI Router which uses the concept of states
      // Learn more here: https://github.com/angular-ui/ui-router
      // Set up the various states which the app can be in.
      // Each state's controller can be found in controllers.js
      $stateProvider

        .state('tab.receivers', {
          url: '/member/receivers',
          views: {
            'tab-member': {
              templateUrl: 'templates/member/list-receivers.html',
              controller: 'ReceiversCtrl'
            }
          }
        })
        .state('tab.receiver-add', {
          url: '/member/receivers/add',
          views: {
            'tab-member': {
              templateUrl: 'templates/member/add-receiver.html',
              controller: 'ReceiverAddCtrl'
            }
          }
        });
    })

    .controller('ReceiversCtrl', function ($scope, $ionicPopup, $state, ReceiverApi) {
      $scope.items = [];

      ReceiverApi.getReceiverList(null, function (result) {
        $scope.items = result.data.addrlist;
      });

      $scope.remove = function (item) {
        var confirmPopup = $ionicPopup.confirm({
          title: '删除收货地址',
          template: '是否真的需要删除收货地址?'
        });

        confirmPopup.then(function (res) {
          if (res) {
            ReceiverApi.deleteReceiver(item.addr_id, function (result) {
              var alertPopup = $ionicPopup.alert({
                title: '删除收货地址',
                template: result.msg
              });
              alertPopup.then(function(res) {
                console.log(res);
              })
            })
          }
        });
      }
    })

    .controller('ReceiverAddCtrl', function ($scope, ReceiverApi) {
      $scope.addrInfo = {};
      $scope.add = function() {
        var addrInfo = {
          "region_id": "最下级地区的标识",
          "addr": $scope.addrInfo.addr,
          "name": $scope.addrInfo.name,
          "mobile": $scope.addrInfo.mobile,
          "tel": "",
          "default": $scope.addrInfo.default ? 1 : 0,
          "zipcode": "1234566",
        }

        console.log(addrInfo);

        ReceiverApi.addReceiver(addrInfo, function (result) {
          $scope.message = result.msg;
        });
      }
    })

    .factory('ReceiverApi', function ($http, apiEndpoint, transformRequestAsFormPost) {
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

      var getReceiverList = function (page, callback) {
        var url = apiEndpoint.url + '/member-receiver.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4'
        };

        if (page) {
          data.page = page;
        }

        sendRequest(url, data, callback);
      };

      var addReceiver = function (addrInfo, callback) {
        var url = apiEndpoint.url + '/member-save_rec.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
          addrInfo: addrInfo
        };

        sendRequest(url, data, callback);
      };

      var deleteReceiver = function (addrId, callback) {
        var url = apiEndpoint.url + '/member-del_receiver.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
          addr_id: addrId
        };

        sendRequest(url, data, callback);
      };

      var setDefaultReceiver = function (defa, addrId, callback) {
        var url = apiEndpoint.url + '/member-del_receiver.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
          addr_id: addrId,
          "default": defa
        };

        sendRequest(url, data, callback);
      };

      return {
        getReceiverList: getReceiverList,
        addReceiver: addReceiver,
        deleteReceiver: deleteReceiver,
        setDefaultReceiver: setDefaultReceiver
      };
    });
})
();
