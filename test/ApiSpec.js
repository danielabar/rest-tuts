'use strict';

// TODO Use chai/expect instead of assert
var request = require('supertest');
var assert = require('assert');
var index = require('../index');

var fs = require('fs');
var path = require('path');
var Datastore = require('nedb');
var config = require('../lib/config');
var dbFile = config.get('db:filename');
var db = {};

describe('Root', function() {

  // TODO Refactor to separate module - delete and load database
  beforeEach(function(done) {
    fs.unlink(dbFile, function(err) {
      if (err) {
        throw err;
      } else {
        db.movies = new Datastore({filename: dbFile, autoload: true });
        db.movies.insert({title: "foo", rating: 3}, function(err, newDoc) {
          if (err) {
            throw err;
          } else {
            done();
          }
        });
      }
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
      .expect(200)
      .end(function(err, res) {
        var result = JSON.parse(res.text);
        console.log(result);
        assert.equal(1, result.length); // because we only seed db with one movie
        assert.equal("foo", result[0].title);
        assert.equal(3, result[0].rating);
        done();
      });
    });

  });

});