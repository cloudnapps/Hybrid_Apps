(function () {
  angular.module('complaint', ['starter.services'])
    .config(function ($stateProvider) {

      // Ionic uses AngularUI Router which uses the concept of states
      // Learn more here: https://github.com/angular-ui/ui-router
      // Set up the various states which the app can be in.
      // Each state's controller can be found in controllers.js
      $stateProvider

        .state('tab.complaint_request', {
          url: '/complaintrequest/:orderId',
          views: {
            'tab-member': {
              templateUrl: 'templates/member/complaint-request.html',
              controller: 'ComplaintRequestCtrl'
            }
          }
        })
        .state('tab.feedbacks.complaints', {
          url: '/complaints',
          views: {
            'tab-feedbacks': {
              templateUrl: 'templates/member/complaint-list.html',
              controller: 'ComplaintListCtrl'
            }
          }
        })
        .state('tab.feedbacks.complaint_detail', {
          url: '/complaint/:oId',
          views: {
            'tab-feedbacks': {
              templateUrl: 'templates/member/complaint-detail.html',
              controller: 'ComplaintDetailCtrl'
            }
          }
        });
    })

    .controller('ComplaintRequestCtrl', function ($scope, $stateParams, $state, ComplaintApi) {
      $scope.complaintInfo = {};

      ReturnApi.getReturnIndex($stateParams.orderId, function (result) {
        if (result.status === 0) {
          $scope.orderInfo = result.data;
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

    .controller('ComplaintListCtrl', function ($scope, $state, ComplaintApi) {
      $scope.items = [];

      ComplaintApi.getComplaintList(null, null, function (result) {
        $scope.items = result.data;
      });

      $scope.goDetail = function (item) {
        $state.go('tab.feedbacks.complaint_detail', {oId: item.oid}, {reload: true})
      };

      $scope.request = function () {
        $state.go('tab.complaint_orders', {}, {reload: true})
      }
    })

    .controller('ComplaintDetailCtrl', function ($scope, $stateParams, ComplaintApi) {
      ComplaintApi.getComplaintDetail($stateParams.oId, function (result) {
        if (result.status === 0) {
          $scope.item = result.data;
        }
      });
    })

    .factory('ComplaintApi', function ($http, apiEndpoint, userService, transformRequestAsFormPost) {
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

      var addComplaintRequest = function (oId, type, tel, content, callback) {
        var url = apiEndpoint.url + '/member-complaints.html';
        var data = userService.getMember();

        data.oid = oId;
        data.tel = tel;
        data.complaints_type = type;
        data.content = content;

        sendRequest(url, data, callback);
      };

      var getComplaintDetail = function (oId, callback) {
        var url = apiEndpoint.url + '/member-complaints_index.html';
        var data = userService.getMember();

        data.oid = oId;

        sendRequest(url, data, callback);
      };

      var getComplaintList = function (page, filter, callback) {
        var url = apiEndpoint.url + '/member-complaints_list.html  ';
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
        addComplaintRequest: addComplaintRequest,
        getComplaintDetail: getComplaintDetail,
        getComplaintList: getComplaintList
      };
    });
})
();
