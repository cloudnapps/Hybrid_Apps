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
              (( value == null ) ? "" : value)
            );
          }
        }

        source = buffer.join("&").replace(/%20/g, "+");
      }

      var result = ((source === "") ? "sign=" : "&sign=") + md5(source).substring(0, 16);

      return ( source + result );
    }
  })
  .service('userService', function(){
    var currentUser = {};
    // 存在 key 获取此属性值, 不存在key返回 currentUser对象
    this.get = function(key){
      if (key) {
        return currentUser[key];
      }
      return currentUser;
    };
    // 保存整个 currentUser对象
    this.saveUser = function(userObj){
      if (typeof userObj !== 'object') {
        return;
      }

      currentUser = userObj;
      localStargeSave();
    };
    // 保存 属性值
    this.saveItem = function(key, value){
      currentUser[key] = value;
      localStargeSave();
    };
    // 从localStorage获取 currentUser对象, 用于app退出重新进入时
    this.localStorageGet = function(){
      try{
        currentUser = JSON.parse(localStorage.getItem('currentUser'));
      }
      catch(e) {
        console.log(e);
        currentUser = {};
        localStargeSave();
      }
    }

    function localStargeSave(){
      localStorage.setItem('currentUser', currentUser);
    }
  });
