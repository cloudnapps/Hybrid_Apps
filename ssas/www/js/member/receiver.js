(function () {
  angular.module('receiver', ['starter.services', 'region'])
    .config(function ($stateProvider) {

      // Ionic uses AngularUI Router which uses the concept of states
      // Learn more here: https://github.com/angular-ui/ui-router
      // Set up the various states which the app can be in.
      // Each state's controller can be found in controllers.js
      $stateProvider

        .state('viewreceiver', {
          url: '/member/receivers',
          views: {
            'main-view': {
              templateUrl: 'templates/member/receiver-index.html',
              controller: 'ReceiversCtrl'
            }
          }
        })
        .state('addreceiver', {
          url: '/member/receivers/add',
          views: {
            'main-view': {
              templateUrl: 'templates/member/receiver-add.html',
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
              alertPopup.then(function (res) {
                console.log(res);
              })
            })
          }
        });
      }
    })

    .controller('ReceiverAddCtrl', function ($scope, $state, $http, ReceiverApi) {
      $scope.addrInfo = {};
      $scope.addrInfo.showChoose = false;
      $scope.addrInfo.address = {};

      $scope.add = function () {
        var addrInfo = {
          "region_id": $scope.addrInfo.address.regionId,
          "addr": $scope.addrInfo.address.detail,
          "name": $scope.addrInfo.name,
          "mobile": $scope.addrInfo.mobile,
          "tel": "",
          "default": $scope.addrInfo.default ? 1 : 0,
          "zipcode": $scope.addrInfo.zipcode
        }

        console.log(addrInfo);

        ReceiverApi.addReceiver(addrInfo, function (result) {
          $scope.message = result.msg;
        });
      }

      ReceiverApi.getRegionInfo(function (result) {
        $scope.provinces = result;
      });

      $scope.onProvinceChanged = function () {
        $scope.addrInfo.address.city = "";
        $scope.addrInfo.address.area = "";
      };

      $scope.onCityChanged = function () {
        $scope.addrInfo.address.area = "";
      }

      $scope.saveAddress = function () {
        $scope.addrInfo.address.region = $scope.addrInfo.address.province.value + $scope.addrInfo.address.city.value;
        $scope.addrInfo.address.regionId = $scope.addrInfo.address.province.id + ',' + $scope.addrInfo.address.city.id;

        if ($scope.addrInfo.address.area !== "") {
          $scope.addrInfo.address.regionId = $scope.addrInfo.address.regionId + ',' + $scope.addrInfo.address.area.id;
          $scope.addrInfo.address.region = $scope.addrInfo.address.region + $scope.addrInfo.address.area.value;
        }

        $scope.addrInfo.showChoose = false;
        $state.reload();
      }
    })

    .factory('ReceiverApi', function ($http, apiEndpoint, jsonEndpoint, RegionApi, transformRequestAsFormPost) {
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

      var getRegionInfo = function (callback) {
        RegionApi.initRegion('02f09323e533c375e2270e0dbf5736ae', function (result) {
          $http.get(jsonEndpoint.url + '/misc/region.json')
            .success(function (data) {
              callback(data);
            }).error(function (data) {
              callback(data);
            })
        });
      };

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
        getRegionInfo: getRegionInfo,
        getReceiverList: getReceiverList,
        addReceiver: addReceiver,
        deleteReceiver: deleteReceiver,
        setDefaultReceiver: setDefaultReceiver
      };
    });
})
();
