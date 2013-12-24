"use strict";

var expect = require('expect.js');
var resolve = require('../lib/resolve');
var testScopes = require('./util/testScopes');

describe('resolve', function() {

  it('should resolve variables in a certain scope', testScopes('f', function(scopes){
    var resolved = resolve(scopes);
    expect(resolved['body.1.declarations.0.init.body.body.0.declarations.0.init']).to.eql({
      x: 'body.0.declarations.0',
      z: 'body.1.declarations.0.init.body.body.0.declarations.0.init.params.0',
      y: 'body.1.declarations.0.init.body.body.0.declarations.0.init.body.body.0.declarations.0'
    });
  }));

});
