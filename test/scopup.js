"use strict";

var expect = require('expect.js');
var testScopes = require('./util/testScopes');
var scopup = require('../lib/scopup');

describe('scopup', function() {

  describe('scoping', function() {

    it('should find variables in the global scope', testScopes('a', function(scopes){
      expect(scopes._.vars).to.eql({
        a: 'body.0.declarations.0',
        b: 'body.1.declarations.0'
      });
    }));

    it('should find variables in a function', testScopes('b', function(scopes){
      expect(scopes['body.0'].vars).to.eql({
        a: 'body.0.body.body.0.declarations.0',
        b: 'body.0.body.body.0.declarations.1'
      });
      expect(scopes['body.0'].parents).to.eql(['_']);
    }));

    it('should find variables in a function arguments', testScopes('c', function(scopes){
      expect(scopes['body.0'].vars).to.eql({
        a: 'body.0.params.0',
        b: 'body.0.params.1',
        c: 'body.0.body.body.0.declarations.0',
        d: 'body.0.body.body.0.declarations.1'
      });
    }));

    it('should find variables the catch case', testScopes('d', function(scopes){
      expect(scopes._.vars).to.eql({
          'x': 'body.0.declarations.0'
      });
      expect(scopes['body.1.handlers.0'].vars).to.eql({
        'e': 'body.1.handlers.0'
      });
    }));

    it('should find names of function declarations', testScopes('e', function(scopes){
      expect(scopes._.vars).to.eql({
        'x': 'body.0',
        'y': 'body.1',
        'z': 'body.2'
      });
      expect(scopes['body.1'].vars).to.eql({
        a: 'body.1.params.0',
        b: 'body.1.params.1',
        c: 'body.1.params.2'
      });
    }));

    it('should find nested scoped function expressions', testScopes('f', function(scopes){
      expect(scopes._.vars).to.eql({
        x: 'body.0.declarations.0',
        y: 'body.1.declarations.0'
      });
      expect(scopes['body.0.declarations.0.init'].vars).to.eql({
        x: 'body.0.declarations.0.init.body.body.0.declarations.0'
      });
      expect(scopes['body.0.declarations.0.init.body.body.0.declarations.0.init'].parents).to.eql([
        '_',
        'body.0.declarations.0.init'
      ]);
      expect(scopes['body.0.declarations.0.init.body.body.0.declarations.0.init'].vars).to.eql({
        z: 'body.0.declarations.0.init.body.body.0.declarations.0.init.params.0',
        x: 'body.0.declarations.0.init.body.body.0.declarations.0.init.body.body.0.declarations.0'
      });
      expect(scopes['body.1.declarations.0.init'].vars).to.eql({
        y: 'body.1.declarations.0.init.body.body.0.declarations.0'
      });
      expect(scopes['body.1.declarations.0.init.body.body.0.declarations.0.init'].vars).to.eql({
        z: 'body.1.declarations.0.init.body.body.0.declarations.0.init.params.0',
        y: 'body.1.declarations.0.init.body.body.0.declarations.0.init.body.body.0.declarations.0'
      });
    }));

  });

});
