(function () {
  angular.module('return', ['starter.services'])
    .config(function ($stateProvider) {

      // Ionic uses AngularUI Router which uses the concept of states
      // Learn more here: https://github.com/angular-ui/ui-router
      // Set up the various states which the app can be in.
      // Each state's controller can be found in controllers.js
      $stateProvider

        .state('tab.feedbacks', {
          url: '/feedbacks',
          views: {
            'tab-member': {
              templateUrl: 'templates/member/feedback-index.html'
            }
          }
        })
        .state('tab.return_request', {
          url: '/returnrequest/:orderId',
          views: {
            'tab-member': {
              templateUrl: 'templates/member/return-request.html',
              controller: 'ReturnRequestCtrl'
            }
          }
        })
        .state('tab.feedbacks.returns', {
          url: '/returns',
          views: {
            'tab-feedbacks': {
              templateUrl: 'templates/member/return-list.html',
              controller: 'ReturnListCtrl'
            }
          }
        })
        .state('tab.feedbacks.return_detail', {
          url: '/return/:returnId',
          views: {
            'tab-feedbacks': {
              templateUrl: 'templates/member/return-detail.html',
              controller: 'ReturnDetailCtrl'
            }
          }
        });
    })

    .controller('ReturnRequestCtrl', function ($scope, $stateParams, $ionicPopup, $state, ReturnApi) {
      $scope.returnInfo = {};
      $scope.returnInfo.product = {};

      ReturnApi.getReturnIndex($stateParams.orderId, function (result) {
        if (result.status === 0) {
          $scope.orderInfo = result.data;
        }
        else {
          var alertPopup = $ionicPopup.alert({
            title: '申请售后',
            template: result.msg
          });
          alertPopup.then(function (res) {
            console.log(res);
          });
        }
      });

      $scope.select = function (item) {
        item.selected = true;
      };

      $scope.submitRequest = function () {
        if ($scope.returnInfo.isShip) {
          $scope.returnInfo.returnType = 'reship';
        }
        else {
          $scope.returnInfo.returnType = 'refund';
        }

        var i;
        for (i in $scope.orderInfo.product) {
          if ($scope.orderInfo.product[i].selected) {
            $scope.returnInfo.product.id = $scope.orderInfo.products[i].product_id;
            $scope.returnInfo.product.num = $scope.orderInfo.products[i].num;
          }
        }

        $scope.returnInfo.products = [
          {
            product_id: '542',
            num: '1'
          }
        ];

        ReturnApi.addReturnRequest($scope.orderInfo.order_id, $scope.returnInfo.returnType,
          $scope.returnInfo.title, $scope.returnInfo.content, $scope.returnInfo.products,
          function (result) {
            if (result.status === 0) {
              $state.go('return_list', {}, {reload: true});
            }
          });
      };
    })

    .controller('ReturnListCtrl', function ($scope, $state, ReturnApi) {
      $scope.items = [];

      ReturnApi.getReturnList(null, null, function (result) {
        $scope.items = result.data;
      });

      $scope.goDetail = function (item) {
        $state.go('tab.feedbacks.return_detail', {returnId: item.return_id}, {reload: true});
      };

      $scope.request = function () {
        $state.go('tab.return_orders', {}, {reload: true});
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
