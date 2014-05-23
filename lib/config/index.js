'use strict';

var nconf = require('nconf');

function Config() {
  var environment = process.env.NODE_ENV || 'development';
  console.log("Starting environment: " + environment);
  nconf.file(environment, 'config/' + environment + '.json');
  nconf.file('default', 'config/default.json');
}

Config.prototype.get = function(key) {
  return nconf.get(key);
};

module.exports = new Config();