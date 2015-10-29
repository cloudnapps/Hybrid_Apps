angular.module('starter')	
	.directive('backButton', function(){
	return {
		restrict: 'EA',		
		transclude: true,
		templateUrl: 'templates/components/back-button.html'		
	}
});