"use strict";
var app = angular.module('ionic-generalpicker', ['ionic']);
app.directive('ionicGeneralPicker', ['$ionicPopup', '$timeout', '$ionicScrollDelegate', '$ionicModal', 'GeneralPickerService',
  function ($ionicPopup, $timeout, $ionicScrollDelegate, $ionicModal, GeneralPickerService) {
    return {
      restrict: 'AE',
      template: '<input type="text" style="width: 100%" placeholder={{vm.placeholder}} ng-model="datamodel"  class={{vm.cssClass}} readonly>',
      scope: {
        datamodel: '=',
        datatype: '=',
        backdrop: '@',
        backdropClickToClose: '@',
        buttonClicked: '&'
      },
      link: function (scope, element, attrs) {
        var vm = scope.vm = {}, citypickerModel = null;
        //根据城市数据来 设置Handle。
        vm.handle = "generalHandle" + attrs.datamodel;
        vm.placeholder = attrs.placeholder || "请选择";
        vm.okText = attrs.okText || "确定";
        vm.cssClass = attrs.cssClass;
        vm.barCssClass = attrs.barCssClass || "bar-dark";
        vm.backdrop = scope.$eval(scope.backdrop) || false;
        vm.backdropClickToClose = scope.$eval(scope.backdropClickToClose) || false;
        vm.values = [];
        GeneralPickerService.getData(attrs.datatype, function (result) {
          vm.values = result;
        });

        vm.returnOk = function () {
          citypickerModel && citypickerModel.hide();
          scope.buttonClicked && scope.buttonClicked();
        };

        vm.clickToClose = function () {
          vm.backdropClickToClose && citypickerModel && citypickerModel.hide();
        };

        vm.getData = function (name) {
          $timeout.cancel(vm.scrolling);//取消之前的scrollTo.让位置一次性过渡到最新
          $timeout.cancel(vm.dataing);//取消之前的数据绑定.让数据一次性过渡到最新

          var Handle = vm.handle, length = vm.values.length;

          var top = $ionicScrollDelegate.$getByHandle(Handle).getScrollPosition().top;//当前滚动位置
          var index = Math.round(top / 36);
          if (index < 0) index = 0;//iOS bouncing超出头
          if (index > length - 1) index = length - 1;//iOS bouncing超出尾
          if (top === index * 36) {
            vm.dataing = $timeout(function () {
              //数据同步
              scope.datamodel = vm.values[index];
            }, 150)
          } else {
            vm.scrolling = $timeout(function () {
              $ionicScrollDelegate.$getByHandle(Handle).scrollTo(0, index * 36, true);
            }, 150)
          }
        };

        element.on("click", function () {
          //零时处理 点击过之后直接显示不再创建
          if (!attrs.checked) {
            citypickerModel && citypickerModel.remove();
          } else {
            citypickerModel && citypickerModel.show();
            return
          }
          attrs.checked = true;
          $ionicModal.fromTemplateUrl('lib/ionic-citypicker/src/general-picker-modal.html', {
            scope: scope,
            animation: 'slide-in-up',
            backdropClickToClose: vm.backdropClickToClose
          }).then(function (modal) {
            citypickerModel = modal;
            //初始化 先获取数据后展示
            $timeout(function () {
              vm.getData();
              citypickerModel.show();
            }, 100)
          })
        });

        //销毁模型
        scope.$on('$destroy', function () {
          citypickerModel && citypickerModel.remove();
        });
      }
    }
  }]);
