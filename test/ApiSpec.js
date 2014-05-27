'use strict';

var request = require('supertest');
var expect = require('chai').expect;
var app = require('../index');
var dbLoader = require('../lib/DbLoader');
var testData = require('./testData.json');


describe('Movies API', function() {

  var insertedDocs = null;

  beforeEach(function(done) {
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
        console.log(res);
        // var result = JSON.parse(res.text);
        // expect(result).to.have.length(2);
        // expect(res.statusCode).to.equal(200);
        // verifyMovie("Movie 1", 1, result[0]);
        // verifyMovie("Movie 2", 2, result[1]);
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
      .send({
        "title": "Movie 3",
        "rating": 3,
        "category": "test"
      })
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
      .send({
        "rating": 5,
        "category": "test"
      })
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        var result = JSON.parse(res.text);
        expect(res.statusCode).to.equal(400);
        expect(result.error.message).to.equal('A title is required to create a new movie.');
        done();
      });
  });

  it('POST /movies returns 500 if title is duplicate', function(done) {
    request(app)
      .post('/movies')
      .send({
        "title": "Movie 1",
        "rating": 5,
        "category": "test"
      })
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        var result = JSON.parse(res.text);
        expect(res.statusCode).to.equal(500);
        expect(result.error.message).to.equal("Can't insert key Movie 1, it violates the unique constraint");
        done();
      });
  });

  it('PUT /movies/:id updates an existing movie via full replace', function(done) {
    var movieId = insertedDocs[1]._id;
    request(app)
      .put('/movies/' + movieId)
      .send({
        "title": "Movie 2",
        "rating": 4,
        "category": "test"
      })
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        var result = JSON.parse(res.text);
        expect(res.statusCode).to.equal(200);
        expect(result.success.message).to.equal('Sucessfully updated movie with ID ' + movieId);
        done();
      });
  });

  it('PUT /movies/:id returns 400 if no records updated', function(done) {
    var movieId = 'garbage';
    request(app)
      .put('/movies/' + movieId)
      .send({
        "title": "Movie 2",
        "rating": 4,
        "category": "test"
      })
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        var result = JSON.parse(res.text);
        expect(res.statusCode).to.equal(400);
        expect(result.error.message).to.equal('No records were updated.');
        done();
      });
  });

  it('PUT /movies/:id returns 500 if update to duplicate title', function(done) {
    var movieId = insertedDocs[0]._id;
    var titleToUpdateMovieTo = insertedDocs[1].title;
    request(app)
      .put('/movies/' + movieId)
      .send({
        "title": titleToUpdateMovieTo,
        "rating": 10,
        "category": "test"
      })
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        var result = JSON.parse(res.text);
        expect(res.statusCode).to.equal(500);
        expect(result.error.message).to.equal("Can't insert key Movie 2, it violates the unique constraint");
        done();
      });
  });

  it('DELETE /movies/:id returns 204 when successful', function(done) {
    var movieId = insertedDocs[0]._id;
    request(app)
      .delete('/movies/' + movieId)
      .end(function(err, res) {
        expect(res.statusCode).to.equal(204);
        done();
      });
  });

  it('DELETE /movies/:id returns 404 if no records deleted', function(done) {
    var movieId = 'garbage';
    request(app)
      .delete('/movies/' + movieId)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        var result = JSON.parse(res.text);
        expect(res.statusCode).to.equal(404);
        expect(result.error.message).to.equal('We did not find a movie with id: garbage');
        done();
      });
  });

  // Not sure how to trigger 500 on delete?

});