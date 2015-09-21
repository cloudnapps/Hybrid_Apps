(function(){
  var home = angular.module('home', [])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider          
      .state('tab.home', {
        url: '/home',
        views: {
          'tab-home': {
            templateUrl: 'templates/home/home-index.html',
            controller: 'HomeController'
          }
        }
      })    
	}) // end of config

  .controller('HomeController', function ($scope) {
  
  }); // end of HomeController
})();