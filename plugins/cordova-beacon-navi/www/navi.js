var exec = require('cordova/exec');

var navi = {
  showMapNavigator: function(poiID, floor, success, failure) {
    exec(success, failure, 'Navi', 'showMapNavigator', [poiID, floor]);
  },
  showShopMap: function(poiID, floor, success, failure) {
  	exec(success, failure, 'Navi', 'showShopMap', [poiID, floor]);
  }
}

module.exports = navi;