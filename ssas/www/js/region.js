(function(){
  angular.module('region', [])

    .factory('RegionApi', function ($http, apiEndpoint, transformRequestAsFormPost) {
      console.log(apiEndpoint);

      var sendRequest = function (url, data, callback) {
        var request = $http({
          method: "post",
          url: url,
          transformRequest: transformRequestAsFormPost,
          data: data,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

        request.success(
          function (result) {
            console.log(result);
            callback(result);
          }
        );
      }

      var initRegion = function (code, callback) {
        var url = apiEndpoint.url + '/init-region.html';
        var data = {
          code: code
        };

        sendRequest(url, data, callback);
      };

      return {
        initRegion: initRegion
      };
    });
})();
