angular.module('starter.controllers', ['starter.shop', 'starter.member'])

  .controller('DashCtrl', function ($scope) {
  })

  .controller('ChatsCtrl', function ($scope, ShopApi) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    $scope.items = [];

    ShopApi.getGallery().then(function (result) {
      $scope.items = result.data.data.goodslist;
    })


    // $scope.chats = Chats.all();
    // $scope.remove = function(chat) {
    //   Chats.remove(chat);
    // };
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

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

