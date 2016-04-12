angular.module('starter')

  .directive('compileBindHtml', function ($compile){
     var directive = {
         restrict: 'AE',
         link:linkFunc
     };
     return directive;

     function linkFunc(scope, elements, attrs){
         var func = function(){
             return scope.$eval(attrs.compileBindHtml);
         };
         scope.$watch(func, function(newValue){
             elements.html(newValue);
             $compile(elements.contents())(scope);
         })
     }
   })
