var fs = require('fs');
var path = require('path');
var _ = require('underscore');

var api = {};
module.exports = api;

var LIB_DIR = __dirname+'/lib/';

// Get all functions in lib directory
var files = fs.readdirSync(LIB_DIR);
_.each(files, function(f) {
  var base = path.basename(f, '.js');
  var file = LIB_DIR+f;
  api[base] = require(file);
});
/*
api.error = require('./lib/error.js');
api.tools = require('./lib/tools.js');
*/