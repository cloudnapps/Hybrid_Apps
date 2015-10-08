//run node install-plugin.js to install all ionic plugins

var _package = require('./package.json');
var plugins = _package.cordovaPlugins;

var fs = require('fs');
var path = require('path');
var sys = require('sys')
var exec = require('child_process').exec;
 
function puts(error, stdout, stderr) {
  sys.puts(stdout);
}
 
plugins.forEach(function(plugin) {
  console.log('installing ionic plugin', plugin);
  if(typeof(plugin) === "string") {
    exec("ionic plugin add " + plugin, puts);
  } else if(typeof(plugin) === "object" && plugin.locator !== undefined) {
    exec("ionic plugin add " + plugin.locator, puts);
  }
});