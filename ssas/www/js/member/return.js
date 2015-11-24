(function () {
  angular.module('return', ['starter.services'])

    .controller('ReturnRequestCtrl', function ($scope, $stateParams, $ionicPopup, ReturnApi, toastService) {
      $scope.returnInfo = {};
      $scope.returnInfo.product = {};

      ReturnApi.getReturnIndex($stateParams.orderId, function (result) {
        if (result.status === 0) {
          $scope.orderInfo = result.data;

          if ($scope.orderInfo.return_type === 'reship') {
            $scope.returnInfo.typeDesc = '退货退款';
          }
          else if ($scope.orderInfo.return_type === 'refund') {
            $scope.returnInfo.typeDesc = '仅退款';
          }
        }
        else {
          var alertPopup = $ionicPopup.alert({
            title: '申请售后',
            template: result.msg,
            okText: '确定' // String (默认: 'OK')。OK按钮的文字。
          });
          alertPopup.then(function (res) {
            console.log(res);
          });
        }
      });

      $scope.clicked = false;
      $scope.submitRequest = function () {
        $scope.clicked = true;

        $scope.returnInfo.type = $scope.orderInfo.return_type;

        var i;
        for (i in $scope.orderInfo.product) {
          if ($scope.orderInfo.product[i].selected) {
            $scope.returnInfo.product.id = $scope.orderInfo.product[i].product_id;
            $scope.returnInfo.product.num = $scope.orderInfo.product[i].num;
          }
        }

        ReturnApi.addReturnRequest($scope.orderInfo.order_id, $scope.returnInfo.type,
          $scope.returnInfo.title, $scope.returnInfo.content, $scope.returnInfo.product,
          function (result) {
            $scope.clicked = false;
            toastService.setToast(result.msg);

            if (result.status === 0) {
              $scope.back(-2);
            }
          });
      };
    })

    .controller('ReturnListCtrl', function ($scope, ReturnApi) {
      $scope.init = function () {
        $scope.items = [];
        $scope.page = 1;
        $scope.hasMore = false;
        $scope.filter = '';
      };

      $scope.getReturnList = function () {
        ReturnApi.getReturnList($scope.page, $scope.filter, function (result) {
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
        $scope.getReturnList();
      });

      $scope.loadMore = function () {
        $scope.page++;
        $scope.getReturnList();
      };
    })

    .controller('ReturnDetailCtrl', function ($scope, $stateParams, ReturnApi) {
      ReturnApi.getReturnDetail($stateParams.returnId, function (result) {
        if (result.status === 0) {
          $scope.item = result.data;
        }
      });
    })

    .factory('ReturnApi', function ($http, apiEndpoint, userService, transformRequestAsFormPost) {
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

      var addReturnRequest = function (orderId, type, title, content, products, callback) {
        var url = apiEndpoint.url + '/member-return_save.html';
        var data = userService.getMember();

        data.order_id = orderId;
        data.return_type = type;
        data.title = title;
        data.content = content;
        data.product_bn = products;

        sendRequest(url, data, callback);
      };

      var getReturnDetail = function (returnId, callback) {
        var url = apiEndpoint.url + '/member-return_info.html';
        var data = userService.getMember();

        data.return_id = returnId;

        sendRequest(url, data, callback);
      };

      var getReturnIndex = function (orderId, callback) {
        var url = apiEndpoint.url + '/member-return_index.html';
        var data = userService.getMember();

        data.order_id = orderId;

        sendRequest(url, data, callback);
      };

      var getReturnList = function (page, filter, callback) {
        var url = apiEndpoint.url + '/member-return_list.html';
        var data = userService.getMember();

        if (page) {
          data.page = page;
        }

        if (filter) {
          data.filter = filter;
        }

        sendRequest(url, data, callback);
      };

      return {
        getReturnIndex: getReturnIndex,
        addReturnRequest: addReturnRequest,
        getReturnDetail: getReturnDetail,
        getReturnList: getReturnList
      };
    });
})();
