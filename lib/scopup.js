"use strict";

function appendWalkerPath(path, key) {
  return (path ? path + '.' : '') + key;
}

function traverse(ast, before, after) {

  var walker = function(ast, parent, key, path) {
    if (before(ast, parent, key, path)) {
    } else if (Array.isArray(ast)) {
      for (var i = 0; i < ast.length; i++) walker(ast[i], ast, i, appendWalkerPath(path, i));
    } else if (typeof ast == 'object'){
      for (var j in ast) walker(ast[j], ast, j, appendWalkerPath(path, j));
    }
    if (after) after(ast, parent, key, path);
  };

  walker(ast);
}

function getFromPath(object, parts){
  if (typeof parts == 'string') parts = parts.split('.');
  for (var i = 0, l = parts.length; i < l; i++){
    if (object[parts[i]]) object = object[parts[i]];
    else return null;
  }
  return object;
}

var actions = [];

function defineAction(test, before, after){
  actions.push({test: test, before: before, after: after});
}

// top level program scope
defineAction(function(t) {
  return t.node.type == 'Program';
}, function(t) {
  t.push('_');
});

// function declaration
defineAction(function(t) {
  return t.node.type == 'FunctionDeclaration';
}, function(t) {
  // put the function declaration in the outer scope
  t.scope[t.node.id.name] = t.path;
  // create new scope for the function
  var scope = t.push(t.path);
  // and add the parameters to this new scope
  t.node.params.forEach(function(param, i) {
    scope[param.name] = t.path + '.params.' + i;
  });
}, function(t) {
  t.pop();
});

// function declaration
defineAction(function(t) {
  return t.node.type == 'FunctionExpression';
}, function(t) {
  // create new scope for the function
  var scope = t.push(t.path);
  // and add the parameters to this new scope
  t.node.params.forEach(function(param, i) {
    scope[param.name] = t.path + '.params.' + i;
  });
}, function(t) {
  t.pop();
});

// variable declaration
defineAction(function(t) {
  return t.node.type == 'VariableDeclarator';
}, function(t) {
  t.scope[t.node.id.name] = t.path;
});

// try catch scopes the error in  catch(error)
defineAction(function(t) {
  return t.node.type == 'CatchClause';
}, function(t) {
  var scope = t.push(t.path);
  scope[t.node.param.name] = t.path;
}, function(t) {
  t.pop();
});

function scopup(ast) {

  var scopes = {};
  var scopeStack = [];
  var scope;

  function pushScope(path) {
    var parents = scopeStack.slice();
    scopeStack.push(path);
    scope = scopes[path] = {
      vars: {},
      parents: parents
    };
    return scope.vars;
  }

  function popScope() {
    var path = scopeStack.pop();
    scope = scopes[scopeStack[scopeStack.length - 1]];
    return scope.vars;
  }

  traverse(ast, function(node, parent, key, path) {
    if (!node) return;

    var t = {
      node: node,
      parent: parent,
      key: key,
      path: path,
      push: pushScope,
      pop: popScope,
      stack: scopeStack,
      scope: scope && scope.vars,
    };

    actions.forEach(function(action) {
      if (action.test(t)) {
        action.before(t);
      }
    });

  }, function(node, parent, key, path) {
    if (!node) return;

    var t = {
      node: node,
      parent: parent,
      key: key,
      path: path,
      push: pushScope,
      pop: popScope,
      stack: scopeStack,
      scope: scope && scope.vars
    };

    actions.forEach(function(action) {
      if (action.after && action.test(t)) {
        action.after(t);
      }
    });

  });

  return scopes;
}

scopup.resolve = function(scopes) {
  /*jshint -W083 */
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
};

scopup.annotate = function(ast, resolved) {
  if (!resolved) resolved = scopup.resolve(scopup(ast));
  for (var path in resolved) {
    var node = scopup.findNode(ast, path);
    node.scopeVars = resolved[path];
  }
};

scopup.findNode = function(ast, path) {
  if (path == '_') return ast;
  return getFromPath(ast, path);
};

module.exports = scopup;
