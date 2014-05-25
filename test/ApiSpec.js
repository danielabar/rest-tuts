'use strict';

var request = require('supertest');
var expect = require('chai').expect;
var app = require('../index');
var dbLoader = require('../lib/DbLoader');

describe('Movies API', function() {

  beforeEach(function(done) {
    var testData = [{title: "Movie 1", rating: 1, category: "test"}, {title: "Movie 2", rating: 2, category : "test"}];
    dbLoader.load(testData, function(err) {
      if (err) {
        console.log('=== ApiSpec: Unable to load test db');
        throw err;
      } else {
        done();
      }
    });
  });

  it('Get /', function(done) {
    request(app)
    .get('/')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      var result = JSON.parse(res.text);
      expect(result.message).to.equal("The API is working.");
      done();
    });
  });

  var verifyMovie = function(expectedTitle, expectedRating, actualMovie) {
    expect(actualMovie.title).to.equal(expectedTitle);
    expect(actualMovie.rating).to.equal(expectedRating);
  };

  it('Lists movies', function(done) {
    request(app)
    .get('/movies')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      var result = JSON.parse(res.text);
      expect(result).to.have.length(2);
      verifyMovie("Movie 1", 1, result[0]);
      verifyMovie("Movie 2", 2, result[1]);
      done();
    });
  });

});