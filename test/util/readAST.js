"use strict";

var fs = require('fs');
var esprima = require('esprima');

module.exports = function(filename, cb) {
  fs.readFile(filename, function(err, data) {
    if (err) cb(err);
    else cb(null, esprima.parse(data));
  });
};
