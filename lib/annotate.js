"use strict";

var scopup = require('./scopup');
var resolve = require('./resolve');
var findNode = require('./findNode');

function annotate(ast, resolved) {
  if (!resolved) resolved = resolve(scopup(ast));
  for (var path in resolved) {
    var node = findNode(ast, path);
    node.scopeVars = resolved[path];
  }
}

module.exports = annotate;
