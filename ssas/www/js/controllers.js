angular.module('starter.controllers', ['shop', 'starter.member'])

  .controller('MemberCtrl', function ($scope) {
    $scope.navTo = function (name) {
      $state.go(name)
    }
  })

  .controller('OrdersCtrl', function ($scope, MemberApi) {
    $scope.items = [];

    MemberApi.getOrderList(function (result) {
      $scope.items = result.data;
    })
  })

  .controller('OrderDetailCtrl', function ($scope, $stateParams, MemberApi) {
    MemberApi.getOrderDetail($stateParams.orderId, function (result) {
      $scope.item = result.data;
    });
  });

