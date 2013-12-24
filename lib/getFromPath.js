"use strict";

function getFromPath(object, parts){
  if (typeof parts == 'string') parts = parts.split('.');
  for (var i = 0, l = parts.length; i < l; i++){
    if (object[parts[i]]) object = object[parts[i]];
    else return null;
  }
  return object;
}

module.exports = getFromPath;
