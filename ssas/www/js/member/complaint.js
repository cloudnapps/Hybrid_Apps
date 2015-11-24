(function () {
  angular.module('complaint', ['starter.services'])
    .controller('ComplaintRequestCtrl', function ($scope, $stateParams, toastService, OrderApi, ComplaintApi) {
      $scope.complaintInfo = {};

      OrderApi.getOrderDetail($stateParams.orderId, function (result) {
        $scope.orderInfo = result.data;
      });

      $scope.clicked = false;
      $scope.submitRequest = function () {
        $scope.clicked = true;

        var oId;
        for (i in $scope.orderInfo.products) {
          if ($scope.orderInfo.products[i].selected) {
            oId = $scope.orderInfo.products[i].oid;
          }
        }

        ComplaintApi.addComplaintRequest(oId, $scope.complaintInfo.title,
          $scope.complaintInfo.contact, $scope.complaintInfo.content,
          function (result) {
            $scope.clicked = false;
            toastService.setToast(result.msg);

            if (result.status === 0) {
              $scope.back(-2);
            }
          });
      };
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
