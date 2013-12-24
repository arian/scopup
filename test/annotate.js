"use strict";

var expect = require('expect.js');
var annotate = require('../lib/annotate');
var read = require('./util/readAST');

describe('annotate', function() {

  it('should annotate the original AST with "scopeVars" objects', function(done) {
    read(__dirname + '/fixtures/f.js', function(err, ast) {
      if (err) return done(err);
      annotate(ast);
      expect(ast.scopeVars).to.eql({
        x: 'body.0.declarations.0',
        y: 'body.1.declarations.0'
      });
      var node = ast.body[1].declarations[0].init.body.body[0].declarations[0].init;
      expect(node.scopeVars).to.eql({
        x: 'body.0.declarations.0',
        z: 'body.1.declarations.0.init.body.body.0.declarations.0.init.params.0',
        y: 'body.1.declarations.0.init.body.body.0.declarations.0.init.body.body.0.declarations.0'
      });
      done();
    });
  });

});
