'use strict';

var request = require('supertest');
var assert = require('assert');
var index = require('../index');

describe('Root', function() {

  describe('GET /', function() {

    it('API is available', function(done) {
      request(index)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        var result = JSON.parse(res.text);
        assert.equal("The API is working.", result.message);
        done();
      });
    });

  });

});