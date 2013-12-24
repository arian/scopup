"use strict";

var read = require('./readAST');
var scopup = require('../../lib/scopup');

function testScopes(file, test) {
  return function(done) {
    read(__dirname + '/../fixtures/' + file + '.js', function(err, ast){
      if (err) return done(err);
      var scopes = scopup(ast);
      test(scopes);
      done();
    });

  };
}

module.exports = testScopes;
