"use strict";

var scopup = require('./lib/scopup');

function _scopup(ast){
  return scopup(ast);
}

_scopup.resolve = require('./lib/resolve');
_scopup.annotate = require('./lib/annotate');
_scopup.findNode = require('./lib/findNode');

module.exports = _scopup;
