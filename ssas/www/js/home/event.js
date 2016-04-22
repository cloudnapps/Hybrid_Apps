(function () {
  var app = angular.module('event', []);

  app.factory('EventApi', ['$http', 'apiEndpoint', 'transformRequestAsFormPost',
    function ($http, apiEndpoint, transformRequestAsFormPost) {

      var getEventContent = function (data) {
        var request = $http({
          method: 'post',
          url: apiEndpoint.url + '/activity.html',
          transformRequest: transformRequestAsFormPost,
          data: data,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

        return request.success(function (result) {
          console.log('got data:' + result);
          console.log(result);
          return result;
        });
      };

      return {
        getEventContent: getEventContent
      };
    } // end of anonymous function
  ])

  app.controller('EventController', function ($scope, $stateParams,$location,$ionicScrollDelegate,EventApi) {
      $scope.actId = $stateParams.actId;
      $scope.page = 1;
      $scope.hasMore = false;

      $scope.title = "";
      $scope.activityInfos = []; //传给html页面的商品list

      $scope.anchorLastTop = 0;

      $scope.getProducts = function () {
        var query = {
          page: $scope.page,
          event_id:$scope.eventId
        };

        if ($scope.orderBy) {
          query.orderBy = $scope.orderBy;
        }

        EventApi.getEventContent(query).then(function (result) {
          if (result.data !== undefined &&
              result.data.data !== undefined &&
              result.data.data.girls_day !== undefined &&
              result.data.data.girls_day.activity_info !== undefined &&
              result.data.data.girls_day.activity_info.length > 0) {
            for (var i = 0; i < result.data.data.girls_day.activity_info.length; i++) {
              $scope.activityInfos.push(result.data.data.girls_day.activity_info[i]);
            }
            $scope.hasMore = true;
          } else {
            $scope.hasMore = false;
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      }

      //加载更多
      $scope.loadMore = function () {
        $scope.page++;
        $scope.getProducts();
      };

      //刷新
      $scope.doRefresh = function () {
        $scope.activityInfos = [];
        $scope.page = 1;
        $scope.hasMore = false;
        $scope.getProducts();
        $scope.$broadcast('scroll.refreshComplete');
      };

      //跳转锚点
      $scope.doJump = function (id) {
        if($scope.showBtns2){
          $scope.showBtns2 = false; //隐藏类别tab
        }

        if($location.hash() !== id){
          $location.hash(id);
        }

        $ionicScrollDelegate.anchorScroll(true);
      }

      //跳转至顶端
      $scope.doJumpToTop = function() {
        $scope.doJump('anchor-1');
        $scope.changeTypeUlColor(-1);
      };

      //顶部导航按钮
      $scope.openBtns1 = function () {
        $scope.showBtns1 = !$scope.showBtns1;
      };

      //展开后的类别UL
      $scope.openBtns2 = function () {
        $scope.showBtns2 = !$scope.showBtns2;
      };

      //页面滚动事件
      $scope.onScroll = function () {
        var arrAnchor = document.querySelectorAll(".anchor");
        var contentTop = document.querySelector('#anchor-1').getBoundingClientRect().top;

        for(var i = 0;i < arrAnchor.length;i ++){
          var anchor = arrAnchor[i];
          var anchorAfter = arrAnchor[i + 1];

          if(parseInt(anchor.getBoundingClientRect().top) <= parseInt(contentTop)){
              if(!anchorAfter || anchorAfter.getBoundingClientRect().top > contentTop){
                $scope.changeTypeUlColor(i);
                return;
              }
          } else{
            if(i == 0){
              $scope.changeTypeUlColor(-1);
              return;
            }
          }
        }
      };

      //改变类别UL的背景色
      $scope.changeTypeUlColor = function(i) {
        var arrTypeLiSpan = document.querySelectorAll('.typeLiSpan');
        var arrTypeLi2Span = document.querySelectorAll('.typeLi2Span');

        for (var j = 0; j < arrTypeLiSpan.length; j++) {
          arrTypeLiSpan[j].style.backgroundColor = '#F05C5C';
          arrTypeLi2Span[j].style.backgroundColor = '#F05C5C';
        }

        document.querySelector('#typeLiSpan' + i).style.backgroundColor = '#FFFFFF';
        document.querySelector('#typeLi2Span' + i).style.backgroundColor = '#FFFFFF';

        //判断scroll方向
        var isScrollUp = false;
        var scrollDirectionFlg = -1;
        var anchorLastTopNew = document.querySelectorAll('.anchor')[arrTypeLiSpan.length - 2].getBoundingClientRect().top;

        if($scope.anchorLastTop > anchorLastTopNew){
          isScrollUp = true;
          scrollDirectionFlg = -1;
        } else{
          isScrollUp = false;
          scrollDirectionFlg = 1;
        }

        $scope.anchorLastTop = anchorLastTopNew;

        if(i < 0){
          i = 0;
        }

        //document.querySelector('.typeSpan').style.transform = "translateX(" + (i * 60 * scrollDirectionFlg) + "px) translateZ(0px)";
      };

      //$scope.doRefresh = function () {
      //  $scope.products = [];
      //  $scope.page = 1;
      //  $scope.hasMore = false;
      //  $scope.getProducts();
      //  $scope.$broadcast('scroll.refreshComplete');
      //};

      $scope.getProducts();
    });
    // end of EventController
})();
