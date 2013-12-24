"use strict";

var getFromPath = require('./getFromPath');

function findNode(ast, path) {
  if (path == '_') return ast;
  return getFromPath(ast, path);
}

module.exports = findNode;
