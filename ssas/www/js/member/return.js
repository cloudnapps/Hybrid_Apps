(function () {
  angular.module('return', ['starter.services'])
    .config(function ($stateProvider) {

      // Ionic uses AngularUI Router which uses the concept of states
      // Learn more here: https://github.com/angular-ui/ui-router
      // Set up the various states which the app can be in.
      // Each state's controller can be found in controllers.js
      $stateProvider

        .state('tab.return_request', {
          url: '/returnrequest/:orderId',
          views: {
            'tab-member': {
              templateUrl: 'templates/member/return-request.html',
              controller: 'ReturnRequestCtrl'
            }
          }
        })
        .state('tab.returns', {
          url: '/returns',
          views: {
            'tab-member': {
              templateUrl: 'templates/member/return-list.html',
              controller: 'ReturnListCtrl'
            }
          }
        })
        .state('tab.return_detail', {
          url: '/return/:returnId',
          views: {
            'tab-member': {
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
              $state.go("return_list", {}, {reload: true});
            }
          });
      }
    })

    .controller('ReturnListCtrl', function ($scope, ReturnApi) {
      $scope.items = [];

      ReturnApi.getReturnList(null, null, function (result) {
        $scope.items = result.data;
      });
    })

    .controller('ReturnDetailCtrl', function ($scope, $stateParams, ReturnApi) {
      ReturnApi.getReturnDetail($stateParams.returnId, function (result) {
        if (result.status === 0) {
          $scope.item = result.data;
        }
      });
    })

    .factory('ReturnApi', function ($http, apiEndpoint, transformRequestAsFormPost) {
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

      var addReturnRequest = function (orderId, type, title, content, products, callback) {
        var url = apiEndpoint.url + '/member-return_save.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
          order_id: orderId,
          return_type: type,
          title: title,
          content: content,
          product_bn: products
        };

        sendRequest(url, data, callback);
      };

      var getReturnDetail = function (returnId, callback) {
        var url = apiEndpoint.url + '/member-return_info.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
          return_id: returnId
        };

        sendRequest(url, data, callback);
      };

      var getReturnIndex = function (orderId, callback) {
        var url = apiEndpoint.url + '/member-return_index.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
          order_id: orderId
        };

        sendRequest(url, data, callback);
      };

      var getReturnList = function (page, filter, callback) {
        var url = apiEndpoint.url + '/member-return_list.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4'
        };

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
