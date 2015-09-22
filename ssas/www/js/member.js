(function () {
  angular.module('member', ['starter.services'])
    .config(function ($stateProvider) {

      // Ionic uses AngularUI Router which uses the concept of states
      // Learn more here: https://github.com/angular-ui/ui-router
      // Set up the various states which the app can be in.
      // Each state's controller can be found in controllers.js
      $stateProvider

        .state('tab.member', {
          url: '/member',
          views: {
            'tab-member': {
              templateUrl: 'templates/member/tab-member.html',
              controller: 'MemberCtrl'
            }
          }
        })
        .state('tab.orders', {
          url: '/member/orders',
          views: {
            'tab-member': {
              templateUrl: 'templates/member/list-orders.html',
              controller: 'OrdersCtrl'
            }
          }
        })
        .state('tab.order-detail', {
          url: '/member/orders/:orderId',
          views: {
            'tab-member': {
              templateUrl: 'templates/member/detail-order.html',
              controller: 'OrderDetailCtrl'
            }
          }
        });
    })

    .controller('MemberCtrl', function ($scope) {
      $scope.navTo = function (name) {
        $state.go(name)
      }
    })

    .controller('OrdersCtrl', function ($scope, MemberApi) {
      $scope.items = [];

      MemberApi.getOrderList(null, null, function (result) {
        $scope.items = result.data;
      })
    })

    .controller('OrderDetailCtrl', function ($scope, $stateParams, MemberApi) {
      MemberApi.getOrderDetail($stateParams.orderId, function (result) {
        $scope.item = result.data;
      });
    })

    .factory('MemberApi', function ($http, apiEndpoint, transformRequestAsFormPost) {
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
      }

      var getOrderList = function (page, filter, callback) {
        var url = apiEndpoint.url + '/member-orders.html';
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

      var getOrderDetail = function (orderId, callback) {
        var url = apiEndpoint.url + '/member-orderdetail.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
          order_id: orderId
        };

        sendRequest(url, data, callback);
      };

      var deleteOrder = function (orderId, callback) {
        var url = apiEndpoint.url + '/member-cancelorder.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
          order_id: orderId
        };

        sendRequest(url, data, callback);
      };

      var receiveOrder = function (orderId, callback) {
        var url = apiEndpoint.url + '/member-orderReceives.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
          order_id: orderId
        };

        sendRequest(url, data, callback);
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
          token: '11b4f4bd44ee8814d41680dc753a75e4'
        };

        if (addrInfo) {
          data.addrInfo = addrInfo;
        }

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

      var getFavoriteList = function (page, type, callback) {
        var url = apiEndpoint.url + '/member-favorite.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4'
        };

        if (page) {
          data.page = page;
        }

        if (type) {
          data.type = type;
        }

        sendRequest(url, data, callback);
      };

      var addGoodsFavorite = function (goodsId, callback) {
        var url = apiEndpoint.url + '/member-add_favorite.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
          goods_id: goodsId
        };

        sendRequest(url, data, callback);
      };

      var deleteGoodsFavorite = function (goodsId, callback) {
        var url = apiEndpoint.url + '/member-ajax_del_fav.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
          goods_id: goodsId
        };

        sendRequest(url, data, callback);
      };

      var addSellerFavorite = function (sellerId, callback) {
        var url = apiEndpoint.url + '/member-seller_fav.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
          seller_id: goodsId
        };

        sendRequest(url, data, callback);
      };

      var deleteSellerFavorite = function (sellerId, callback) {
        var url = apiEndpoint.url + '/member-del_seller_fav.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
          seller_id: goodsId
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

      var addReturnRequest = function (orderId, returnInfo, callback) {
        var url = apiEndpoint.url + '/member-return_save.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
          order_id: orderId,
          return_type: returnInfo.type,
          title: returnInfo.title,
          content: returnInfo.content,
          product_bn: returnInfo.product
        };

        sendRequest(url, data, callback);
      };

      var getReturnDetail = function (returnId, callback) {
        var url = apiEndpoint.url + '/member-return_info.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
          return_id: orderId
        };

        sendRequest(url, data, callback);
      };

      var getReturnList = function (page, filter, callback) {
        var url = apiEndpoint.url + '/member-return_list.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
        };

        if (page) {
          data.page = page;
        }

        if (filter) {
          data.filter = filter;
        }

        sendRequest(url, data, callback);
      };

      var getCouponList = function (page, callback) {
        var url = apiEndpoint.url + '/member-coupon_list.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
        };

        if (page) {
          data.page = page;
        }

        sendRequest(url, data, callback);
      };

      var getMemberRate = function (orderId, callback) {
        var url = apiEndpoint.url + '/member-member_rate.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
          order_id: orderId
        };

        sendRequest(url, data, callback);
      };

      var addMemberRate = function (orderId, rateInfo, callback) {
        var url = apiEndpoint.url + '/member-member_rate.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
          order_id: orderId,
          seller_id: rateInfo.sellerId,
          comment: rateInfo.comment,
          seller_point: rateInfo.seller_point
        };

        sendRequest(url, data, callback);
      };

      var getMemberSetting = function (callback) {
        var url = apiEndpoint.url + '/member-setting.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
        };

        sendRequest(url, data, callback);
      };

      var modifyMemberSetting = function (memeberInfo, callback) {
        var url = apiEndpoint.url + '/member-save_setting.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
          params: memberInfo
        };

        sendRequest(url, data, callback);
      };

      var modifyMemberPassword = function (passwordInfo, callback) {
        var url = apiEndpoint.url + '/member-security.html';
        var data = {
          member_id: 13,
          token: '11b4f4bd44ee8814d41680dc753a75e4',
          new_passwd: passwordInfo.newPassword,
          old_passwd: passwordInfo.oldPassword,
          re_passwd: passwordInfo.confirmPassword,
        };

        sendRequest(url, data, callback);
      };

      return {
        getOrderList: getOrderList,
        getOrderDetail: getOrderDetail,
        deleteOrder: deleteOrder,
        receiveOrder: receiveOrder,
        getReceiverList: getReceiverList,
        addReceiver: addReceiver,
        deleteReceiver: deleteReceiver,
        setDefaultReceiver: setDefaultReceiver,
        getFavoriteList: getFavoriteList,
        addGoodsFavorite: addGoodsFavorite
      };
    });
})();
