(function(){
  angular.module('components', ['starter.services'])
    //.constant("apiEndpoint", {url: "/m"})
    .constant("tabIndex", {
    	home: 0,
    	shop: 1,
    	cart: 2,
    	member: 3
    })
    .constant("apiEndpoint", {url:"http://bbc.jooau.com/zhongshihua/index.php/m"})
})();