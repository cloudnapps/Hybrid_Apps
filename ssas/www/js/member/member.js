(function () {
  angular.module('member', ['starter.services', 'login'])
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
              templateUrl: 'templates/member/member-index.html',
              controller: 'MemberCtrl'
            }
          }
        });
    })
    .controller('MemberCtrl', function ($scope, $ionicPopup, $state) {
      if(true) {
        $state.go('login');
      }
    });
})();
