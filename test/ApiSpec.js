'use strict';

// TODO Use chai/expect instead of assert
var request = require('supertest');
var assert = require('assert');
var index = require('../index');

var fs = require('fs');
var Datastore = require('nedb');
var config = require('../lib/config');
var dbFile = config.get('db:filename');
var db = {};

describe('Root', function() {

  // TODO Refactor to separate module - delete and load database
  beforeEach(function(done) {
    fs.unlink(dbFile, function(err) {
      if (err) {
        console.log('Unable to delete: ' + dbFile);
        throw err;
      } else {
        db.movies = new Datastore({filename: dbFile, autoload: true });
        var movie1 = {title: "Movie 1", rating: 1};
        var movie2 = {title: "Movie 2", rating: 2};
        db.movies.insert([movie1, movie2], function(err, newDocs) {
          if (err) {
            console.log('Unable to load test db: ' + dbFile);
            throw err;
          } else {
            console.log('Loaded newDocs in test db: ' + newDocs.length);
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

    var verifyMovie = function(expectedTitle, expectedRating, actualMovie) {
      assert.equal(expectedTitle, actualMovie.title);
      assert.equal(expectedRating, actualMovie.rating);
    };

    it('Lists movies', function(done) {
      request(index)
      .get('/movies')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        var result = JSON.parse(res.text);
        assert.equal(2, result.length);
        verifyMovie("Movie 1", 1, result[0]);
        verifyMovie("Movie 2", 2, result[1]);
        done();
      });
    });

  });

});