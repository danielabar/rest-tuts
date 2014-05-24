'use strict';

var request = require('supertest');
var assert = require('assert');
var index = require('../index');
var testDb = require('../load/TestDb');

describe('Root', function() {

  beforeEach(function(done) {
    testDb.load(function(err, newDocs) {
      if (err) {
        console.log(err.stack);
      } else {
        console.log("Inserted " + newDocs.length + " records into test db");
      }
      done();
    });
  });

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

  describe('GET /movies', function() {

    it('Lists movies', function(done) {
      request(index)
      .get('/movies')
      .expect('Content-Type', /json/)
      .expect(200);
      done();
    });

  });

});