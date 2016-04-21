(function () {
  angular.module('invitation', ['starter.services'])

    .controller('InvitationCtrl', function ($scope, $state, $ionicLoading, CouponApi) {
      $scope.init = function () {
        $scope.items = [];
        $scope.page = 1;
        $scope.hasMore = false;
      };

      $scope.getInvitation = function () {
        $ionicLoading.show();
        $ionicLoading.hide();
      };

      $scope.shareToTimeline = function () {
        console.log('shareToTimeline >>');
        wechat.share({
          message: {
            title: "Message Title",
            description: "Message Description(optional)",
            mediaTagName: "Media Tag Name(optional)",
            thumb: "www/img/ctf.png",
            media: {
              type: wechat.Type.WEBPAGE,   // webpage
              webpageUrl: "http://m.kaola.com/one_invite_one/gift/obtain1460362352925.html?inviter=afrpMmt5RRMRMq1SKecLvIQNxAeCsTTg5cx8S9Se%2FZc%3D&from=timeline&isappinstalled=1"    // webpage
            }
          },
          scene: wechat.Scene.TIMELINE   // share to Timeline
        }, function () {
          alert("Success");
        }, function (reason) {
          alert("Failed: " + reason);
        });
      }

      $scope.shareToFriend = function () {
        console.log('shareToFriend >>');
        wechat.share({
          message: {
            title: "Message Title",
            description: "Message Description(optional)",
            mediaTagName: "Media Tag Name(optional)",
            thumb: "www/img/ctf.png",
            media: {
              type: wechat.Type.WEBPAGE,   // webpage
              webpageUrl: "http://m.kaola.com/one_invite_one/gift/obtain1460362352925.html?inviter=afrpMmt5RRMRMq1SKecLvIQNxAeCsTTg5cx8S9Se%2FZc%3D&from=timeline&isappinstalled=1"    // webpage
            }
          },
          scene: wechat.Scene.SESSION   // share to Friend
        }, function () {
          alert("Success");
        }, function (reason) {
          alert("Failed: " + reason);
        });
      }

      $scope.loadMore = function () {
        $scope.page++;
        $scope.getInvitation();
      };

      $scope.$on('$ionicView.beforeEnter', function () {
        $scope.init();
        $scope.getInvitation();
      });
    })

})
();
