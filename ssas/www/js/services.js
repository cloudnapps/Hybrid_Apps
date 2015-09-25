angular.module('starter.services', [])
  .factory("transformRequestAsFormPost", function () {
    function transformRequest(data, getHeaders) {
      var headers = getHeaders();
      headers["Content-type"] = "application/x-www-form-urlencoded; charset=utf-8";

      return ( serializeData(data) );
    }

    return ( transformRequest );

    function serializeData(data) {
      var source = "";
      if (!angular.isObject(data)) {
        source = ( data == null ) ? "" : data.toString();
      }
      else {
        var buffer = [];

        for (var name in data) {
          if (!data.hasOwnProperty(name)) {
            continue;
          }

          var value = data[name];

          if (angular.isObject(value)) {
            value = angular.toJson(value);

            buffer.push(
              encodeURIComponent(name) +
              "=" +
              value);
          }
          else {
            buffer.push(
              encodeURIComponent(name) +
              "=" +
              encodeURIComponent(( value == null ) ? "" : value)
            );
          }
        }

        source = buffer.join("&").replace(/%20/g, "+");
      }

      var result = ((source === "") ? "sign=" : "&sign=") + md5(source).substring(0, 16);

      return ( source + result );
    }
  });
