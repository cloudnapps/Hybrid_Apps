(function () {
  angular.module('receiver', ['starter.services', 'region'])

    .controller('ReceiversCtrl', function ($scope, $state, toastService, $ionicPopup, $ionicLoading, ReceiverApi) {
      $scope.init = function () {
        $scope.items = [];
        $scope.page = 1;
      };

      $scope.getReceivers = function () {
        $ionicLoading.show();
        ReceiverApi.getReceiverList($scope.page, function (result) {
          if (result.data && result.data.addrlist) {
            $scope.items = $scope.items.concat(result.data.addrlist);
          }
          $ionicLoading.hide();
        });
      };

      $scope.$on('$ionicView.beforeEnter', function () {
        $scope.init();
        $scope.getReceivers();
      });

      $scope.edit = function (item) {
        $state.go('receiver-change', {addrInfo: JSON.stringify(item)}, {reload: true});
      };

      $scope.remove = function (item) {
        var confirmPopup = $ionicPopup.confirm({
          title: '删除收货地址',
          template: '是否真的需要删除收货地址?'
        });

        confirmPopup.then(function (res) {
          if (res) {
            ReceiverApi.deleteReceiver(item.addr_id, function (result) {
              if (result.status === 1) {
                toastService.setToast(result.msg);
              }
              else {
                toastService.setToast(result.msg);
                $state.go('.', {}, {reload: true});
              }
            });
          }
        });
      };
    })

    .controller('ReceiverAddCtrl', function ($scope, $state, $stateParams, $ionicPopup, $ionicHistory,
                                             ReceiverApi) {
      if ($stateParams.addrInfo) {
        $scope.addrInfo = JSON.parse($stateParams.addrInfo);
        $scope.title = '更新收货地址';
      }
      else {
        $scope.addrInfo = {};
        $scope.addrInfo.checked = true;
        $scope.title = '新建收货地址';
      }

      $scope.loadCardList = function () {
        ReceiverApi.getReceiverList(1, function (result) {
          if (result.data && result.data.cardlist) {
            $scope.cardList = result.data.cardlist;
          }
        });
      };

      $scope.$on('$ionicView.beforeEnter', function () {
        $scope.loadCardList();
      });

      $scope.addrInfo.showChoose = false;
      $scope.addrInfo.focusChoose = false;
      if (!$scope.addrInfo.address) {
        $scope.addrInfo.address = {};
      }

      $scope.add = function () {
        var addrInfo = {
          'addr_id': $scope.addrInfo.addr_id,
          'region_id': $scope.addrInfo.region_id,
          'addr': $scope.addrInfo.addr,
          'name': $scope.addrInfo.name,
          'mobile': $scope.addrInfo.mobile,
          'member_idnumber': $scope.addrInfo.number,
          'tel': '',
          'default': $scope.addrInfo.checked ? '1' : '0',
          'zipcode': $scope.addrInfo.zipcode
        };

        ReceiverApi.addReceiver(addrInfo, function (result) {
          if (result.status === 0) {
            $ionicHistory.goBack();
          }
          else {
            var alertPopup = $ionicPopup.alert({
              title: '添加收货地址',
              template: result.msg
            });
            alertPopup.then(function (res) {
              console.log(res);
            });
          }
        });
      };

      ReceiverApi.getRegionInfo(function (result) {
        $scope.provinces = result;
      });

      $scope.onProvinceChanged = function () {
        $scope.addrInfo.address.city = '';
        $scope.addrInfo.address.district = '';
      };

      $scope.onCityChanged = function () {
        $scope.addrInfo.address.district = '';
      };

      $scope.isFinishedAddress = function () {
        if (!$scope.addrInfo.address.province || !$scope.addrInfo.address.city ||
          ($scope.addrInfo.address.city.children && $scope.addrInfo.address.city.children.length && !$scope.addrInfo.address.district)) {
          return false;
        }
        else {
          return true;
        }
      };

      $scope.saveAddress = function () {
        if (!$scope.isFinishedAddress()) {
          return;
        }

        $scope.addrInfo.area = $scope.addrInfo.address.province.value + $scope.addrInfo.address.city.value;
        $scope.addrInfo.region_id = $scope.addrInfo.address.province.id + ',' + $scope.addrInfo.address.city.id;

        if ($scope.addrInfo.address.district) {
          $scope.addrInfo.region_id = $scope.addrInfo.region_id + ',' + $scope.addrInfo.address.district.id;
          $scope.addrInfo.area = $scope.addrInfo.area + $scope.addrInfo.address.district.value;
        }

        $scope.addrInfo.showChoose = false;
        $scope.addrInfo.focusChoose = false;
      };

      $scope.addrInfo.showIdCard = false;
      $scope.addrInfo.focusIdCard = false;
      $scope.saveIdCard = function () {
        $scope.addrInfo.showIdCard = false;
        $scope.addrInfo.focusIdCard = false;
      }
    })

    .factory('ReceiverApi', function ($http, apiEndpoint, userService, RegionApi, transformRequestAsFormPost) {
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

      var getRegionInfo = function (callback) {
        RegionApi.initRegion('02f09323e533c375e2270e0dbf5736ae', function (result) {
          $http.get(result.data.link)
            .success(function (data) {
              callback(data);
            }).error(function (data) {
              callback(data);
            });
        });
      };

      var getReceiverList = function (page, callback) {
        var url = apiEndpoint.url + '/member-receiver.html';
        var data = userService.getMember();

        if (page) {
          data.page = page;
        }

        sendRequest(url, data, callback);
      };

      var addReceiver = function (addrInfo, callback) {
        var url = apiEndpoint.url + '/member-save_rec.html';
        var data = userService.getMember();

        data.addrInfo = addrInfo;

        sendRequest(url, data, callback);
      };

      var deleteReceiver = function (addrId, callback) {
        var url = apiEndpoint.url + '/member-del_receiver.html';
        var data = userService.getMember();

        data.addr_id = addrId;

        sendRequest(url, data, callback);
      };

      var setDefaultReceiver = function (defa, addrId, callback) {
        var url = apiEndpoint.url + '/member-del_receiver.html';
        var data = userService.getMember();

        data.addr_id = addrId;
        data.default = defa;

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
