(function(){
  angular.module('components', ['starter.services'])
    // .constant('apiEndpoint', {url: '/m'})
    .constant('apiEndpoint', {url:'http://www.ctfhoko.com/index.php/m'})
    .constant('tabIndex', {
    	home: 0,
    	shop: 1,
    	cart: 2,
    	member: 3
    });
})();
