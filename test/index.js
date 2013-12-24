"use strict";

var scopup = require('../index');
var expect = require('expect.js');

describe('public api', function(){

  it('should export the scopup function', function(){
    expect(scopup).to.be.a('function');
  });

  it('should return some object if the scopup function is called', function(){
    expect(scopup()).to.be.an('object');
  });

  it('should put resolve on the scopup object', function(){
    expect(scopup.resolve).to.be.a('function');
  });

  it('should put annotate on the scopup object', function(){
    expect(scopup.annotate).to.be.a('function');
  });

  it('should put findNode on the scopup object', function(){
    expect(scopup.findNode).to.be.a('function');
  });

});
