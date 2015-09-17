angular.module('starter.shop', [])

.factory('ShopApi', function($http, shopApiEndpoint) {
  console.log(shopApiEndpoint);

  var getGallery = function(){
    return $http.get(shopApiEndpoint.url + "/gallery.html")
      .then(function(result){
        console.log('got data:' + result);
        return result;
      })
  }

  return {
    getGallery: getGallery  
  };
});