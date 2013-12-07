Scopup
======

[![Build Status](https://travis-ci.org/arian/scopup.png)](https://travis-ci.org/arian/scopup)

Scope analysis for JavaScript, using Mozilla Parser AST (used by esprima and acorn).

Install
-------

  npm install scopup

Example
-------

```js
var esprima = require('esprima');
var scopup = require('scopup');

var ast = esprima.parse('var a, b; function x(y){}; try{} catch(e) {}');
var scopes = scopup(ast);
var resolved = scopup.resolve(scopes);

for (var path in resolved) {
  var node = scopup.findNode(ast, path);
  console.log('>', node.type, '\nscopes', resolved[path]);
}
```

would output

```
> Program
scopes { a: 'body.0.declarations.0',
  b: 'body.0.declarations.1',
  x: 'body.1' }
> FunctionDeclaration
scopes { a: 'body.0.declarations.0',
  b: 'body.0.declarations.1',
  x: 'body.1',
  y: 'body.1.params.0' }
> CatchClause
scopes { a: 'body.0.declarations.0',
  b: 'body.0.declarations.1',
  x: 'body.1',
  e: 'body.3.handlers.0' }
```

As you can see, the variables refer to a path in the AST.  Using
`scopup.findNode` the definition site of the variable or parameter can be
looked up.


`scopup`
------

The `scopup` function returns an object with as keys the containing scope. The
values are objects with `vars` and `parents` properties. The vars is an object
with variables defined in this scope, and the parents property is an array of
parent scopes.

The structure looks something like this:

```js
var scopes = {
  '_': {vars: {'x': 'body.0.definitions.0'}, parents: [] },
  'body.0': {vars: {}, parents: ['_']}
};
```

`scopup.resolve`
----------------

Resolves the variables in parent scopes. For example the variables outside a
function are visible inside the function as well, if they are not overwritten
by local variables.

`scopup.annotate`
-----------------

Annotates the AST with a `scopeVars` property. It's an object of variables
visible inside this scope, with paths to the definition site.

`scopup.findNode`
-----------------

Scopup uses paths in the AST object to refer to definition sites of variables
and containing scopes.  Using `scopup.findNode` the specific node is fetched
from the AST object.
