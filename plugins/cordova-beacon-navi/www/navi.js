var exec = require('cordova/exec');

var navi = {
  showMapNavigator: function(poiID, floor) {
    exec(null, null, 'Navi', 'showMapNavigator', [poiID, floor]);
  },
  showShopMap: function(poiID, floor) {
  	exec(null, null, 'Navi', 'showShopMap', [poiID, floor]);
  }
}

module.exports = navi;