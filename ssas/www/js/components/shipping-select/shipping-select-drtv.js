angular.module('components')
  .directive('shippingSelect', function($rootScope, $ionicModal) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link : function(scope, element, attrs, ctrl){

        ctrl.$viewChangeListeners.push(function() {
          scope.$eval(attrs.ngChange);
        });
        ctrl.$render = function () {
          scope.ngModel = ctrl.$viewValue;
        };

        scope.showShippingListModal = function (){
          var shippingList = scope.$parent.$eval(attrs.shippingSelect);
          var ngModel = ctrl.$viewValue;
          angular.forEach(shippingList, function (shipping) {
            if(shipping.id === ngModel.id) {
              ngModel = shipping;
            }
          });

          $ionicModal.fromTemplateUrl('templates/components/shipping-select-modal.tpl.html', {
            scope: angular.extend(scope.$new(true), {model: {selected: ngModel}, shippingList: shippingList})
          }).then(function (modal) {
            modal.show();
            modal.scope.hideModal = function (){
              modal.hide();
              modal.remove();
            };

            modal.scope.updateModel = function () {
              ctrl.$setViewValue(modal.scope.model.selected);
            };

          });
        };

        element.on('click', scope.showShippingListModal);

      }
    };
  });
