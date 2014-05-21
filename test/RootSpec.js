var request = require('supertest')
var assert = require('assert')
var index = require('../index');

describe('Root', function() {

  describe('GET /', function() {

    it('API is available', function(done) {
      request(index)
      .get('/')
      .expect(200, done);
    });

  });

});