var exec = require('cordova/exec');

var beaconMonitor = {
  monitorByBeacon: function() {
    exec(null, null, 'Monitor',  'monitorByBeacon', []);
  }
}

module.exports = beaconMonitor;
