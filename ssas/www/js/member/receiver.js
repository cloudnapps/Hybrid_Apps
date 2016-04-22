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
           console.log('member-receiver.html******' + angular.toJson(result));
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
          template: '您是否真的要删除该收货地址?',
          cancelText: '取消', // String (默认: 'Cancel')。一个取消按钮的文字。
          okText: '确定' // String (默认: 'OK')。OK按钮的文字。
        });

        confirmPopup.then(function (res) {
          if (res) {
            ReceiverApi.deleteReceiver(item.addr_id, function (result) {
               console.log('member-del_receiver.html******' + angular.toJson(result));
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

    .controller('ReceiverAddCtrl', function ($scope, $state, $stateParams, toastService, $ionicPopup,
                                             $ionicModal, ReceiverApi) {
      if ($stateParams.addrInfo) {
        $scope.addrInfo = JSON.parse($stateParams.addrInfo);
        $scope.addrInfo.mobile = parseInt($scope.addrInfo.mobile);
        $scope.title = '更新收货地址';
      }
      else {
        $scope.addrInfo = {};
        $scope.addrInfo.checked = true;
        $scope.title = '新建收货地址';
      }

      $scope.showIntroduction = false;

      $scope.loadCardList = function () {
        ReceiverApi.getReceiverList(1, function (result) {
           console.log('member-receiver.html******' + angular.toJson(result));
          if (result.data && result.data.cardlist) {
            $scope.cardList = result.data.cardlist;
          }
        });
      };

      $scope.showIntroduction2 = false;

      $scope.loadCardList();

      $scope.showSpecModal = function () {
        $ionicModal.fromTemplateUrl('templates/member/receiver-idcard-list.html', {
          scope: $scope
        }).then(function (modal) {
          $scope.modal = modal;
          $scope.modal.show();
          $scope.hideModal = function () {
            $scope.modal.hide();
            $scope.modal.remove();
          };
        });
      };

      $scope.showHelp = function () {
        $ionicPopup.alert({
          title: '为什么需要实名认证',
          template: '<p>① 因各保税区政策不同，购买部分保税区商品需要对收货人身份证信息进行认证，错误信息可能导致无法正常清关</p> ' +
          '<p>② 您的身份证信息将做加密保管，我们保证信息安全，绝不对外泄露</p> ',
          okText: '确定' // String (默认: 'OK')。OK按钮的文字。
        });
      };

      $scope.selectIdCard = function () {
        angular.forEach($scope.cardList, function (item) {
          if (item.number === $scope.addrInfo.number) {
            $scope.addrInfo.name = item.full_name;
          }
        })
      };

      $scope.clicked = false;
      $scope.add = function () {
        $scope.clicked = true;

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
           console.log('member-save_rec.html******' + angular.toJson(result));
          $scope.clicked = false;

          toastService.setToast(result.msg);

          if (result.status === 0) {
            $scope.back();
          }
        });
      };
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
           console.log('init-region.html******' + angular.toJson(result));
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
