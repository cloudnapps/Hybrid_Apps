angular.module('components')
  .directive('addressSelect', function($rootScope, $ionicModal) {
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

        scope.pick = function (){
          var items = scope.$parent.$eval(attrs.addressSelect);
          var ngModel = ctrl.$viewValue;
          angular.forEach(items, function (item) {
            if(item.addr_id === ngModel.addr_id) {
              ngModel = item;
            }
          });

          $ionicModal.fromTemplateUrl('templates/components/address-select-modal.tpl.html', {
            scope: angular.extend(scope.$new(true), {model: {selected: ngModel}, items: items})
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

        element.on('click', scope.pick);

      }
    };
  });