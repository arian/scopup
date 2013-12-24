/*jshint -W083 */
"use strict";

function resolve(scopes) {
  var result = {};
  for (var path in scopes) {
    var places = (scopes[path].parents).slice();
    places.push(path);
    var resolved = result[path] = {};
    places.forEach(function(place) {
      var scope = scopes[place];
      for (var v in scope.vars) resolved[v] = scope.vars[v];
    });
  }
  return result;
}

module.exports = resolve;
