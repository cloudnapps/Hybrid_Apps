angular.module('starter.services', [])
  .factory("transformRequestAsFormPost", function () {
    function transformRequest(data, getHeaders) {
      var headers = getHeaders();
      headers["Content-type"] = "application/x-www-form-urlencoded; charset=utf-8";

      return ( serializeData(data) );
    }

    return ( transformRequest );

    function serializeData(data) {
      if (!angular.isObject(data)) {
        return ( ( data == null ) ? "" : data.toString() );
      }

      var buffer = [];

      for (var name in data) {
        if (!data.hasOwnProperty(name)) {
          continue;
        }

        var value = data[name];

        buffer.push(
          encodeURIComponent(name) +
          "=" +
          encodeURIComponent(( value == null ) ? "" : value)
        );
      }

      var source = buffer.join("&").replace(/%20/g, "+");
      var result = "&sign=" + md5(source).substring(0,16);

      return ( source + result );
    }
  });
