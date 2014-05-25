'use strict';

var request = require('supertest');
var expect = require('chai').expect;
var app = require('../index');
var dbLoader = require('../lib/DbLoader');


describe('Movies API', function() {

  var insertedDocs = null;

  beforeEach(function(done) {
    // TODO Read testData from test.json file
    var testData = [{title: "Movie 1", rating: 1, category: "test"}, {title: "Movie 2", rating: 2, category : "test"}];
    dbLoader.load(testData, function(err, newDocs) {
      if (err) {
        console.log('=== ApiSpec: Unable to load test db');
        throw err;
      } else {
        insertedDocs = newDocs;
        done();
      }
    });
  });

  var verifyMovie = function(expectedTitle, expectedRating, actualMovie) {
    expect(actualMovie._id).not.to.be.null;
    expect(actualMovie.title).to.equal(expectedTitle);
    expect(actualMovie.rating).to.equal(expectedRating);
  };

  it('GET /', function(done) {
    request(app)
    .get('/')
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      var result = JSON.parse(res.text);
      expect(res.statusCode).to.equal(200);
      expect(result.message).to.equal("The API is working.");
      done();
    });
  });

  it('GET /movies lists all movies', function(done) {
    request(app)
    .get('/movies')
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      var result = JSON.parse(res.text);
      expect(result).to.have.length(2);
      expect(res.statusCode).to.equal(200);
      verifyMovie("Movie 1", 1, result[0]);
      verifyMovie("Movie 2", 2, result[1]);
      done();
    });
  });

  it('GET /movies/:id finds a movie by id', function(done) {
    var movieId = insertedDocs[0]._id;
    request(app)
    .get('/movies/' + movieId)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      var result = JSON.parse(res.text);
      expect(res.statusCode).to.equal(200);
      expect(result._id).to.equal(movieId);
      expect(result.title).to.equal('Movie 1');
      expect(result.rating).to.equal(1);
      done();
    });
  });

  it('GET /movies/:id returns 404 if movie not found', function(done) {
    var movieId = 'does-not-exist';
    request(app)
    .get('/movies/' + movieId)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      var result = JSON.parse(res.text);
      expect(res.statusCode).to.equal(404);
      expect(result.error.message).to.equal('We did not find a movie with id: does-not-exist');
      done();
    });
  });

  it('POST /movies inserts a new movie', function(done) {
    request(app)
    .post('/movies')
    .send({ "title" : "Movie 3", "rating" : 3, "category" : "test" })
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      var result = JSON.parse(res.text);
      expect(res.statusCode).to.equal(201);
      verifyMovie("Movie 3", 3, result);
      done();
    });
  });

  it('POST /movies returns 400 if title is not provided', function(done) {
    request(app)
    .post('/movies')
    .send({ "rating" : 5, "category" : "test" })
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      var result = JSON.parse(res.text);
      expect(res.statusCode).to.equal(400);
      expect(result.error.message).to.equal('A title is required to create a new movie.');
      done();
    });
  });

});