angular.module('starter.shop', [])

.factory('ShopApi', function($http, apiEndpoint) {
  console.log(apiEndpoint);

  var getGallery = function(){
    return $http.get(apiEndpoint.url + "/gallery.html")
      .then(function(result){
        console.log('got data:' + result);
        return result;
      })
  }

  return {
    getGallery: getGallery
  };
});
