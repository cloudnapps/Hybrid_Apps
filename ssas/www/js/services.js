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
        return getItem(key);
      }
      return currentUser;
    };
    // 保存整个 currentUser对象 或 保存 属性值
    this.set = function(key, value){
      if (angular.isObject(key)) {
        return setObj(key);
      }
      setItem(key, value);
    };

    this.isLogin = function(){
      return !!currentUser.token;
    }

    // 从localStorage获取 currentUser对象, 用于app退出重新进入时
    this.initFromLocal = function(){
      try{
        currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
      }
      catch(e) {
        console.log(e);
        currentUser = {};
        saveToLocal();
      }
      return currentUser;
    }

    function getItem(key){
      return currentUser[key];
    }

    function setItem(key, value){
      currentUser[key] = value;
      saveToLocal();
    }

    function setObj(obj){
      currentUser = obj;
      saveToLocal();
    }

    function saveToLocal(){
      try {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
      }
      catch(e) {
        console.log(e);
        currentUser = {};
        localStorage.setItem('currentUser', '');
      }
    }
  })
  .service('tabStateService', function($timeout, $ionicTabsDelegate, $state){
    this.go = function(selectIndex, stateName, params, options){

      if ($ionicTabsDelegate.selectedIndex() !== selectIndex) {
        $ionicTabsDelegate.select(selectIndex);
      }

      if (!stateName) {
        return $ionicTabsDelegate.select(selectIndex);
      }
      
      $timeout(function(){
        $state.go(stateName, params || {}, options || {});
      }, 0);
    };

    this.tabIndex = {
      home: 0,
      shop: 1,
      cart: 2,
      member: 3
    };
    this.backIndex = -1;
  });
