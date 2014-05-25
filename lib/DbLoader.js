'use strict';

var Datastore = require('nedb');
var db = {};

module.exports = {

  init: function(dbFile) {
    db.movies = new Datastore({filename: dbFile, autoload: true });
    db.movies.ensureIndex({fieldName: 'title', unique: true });
    return db.movies;
  },

  load: function(data, cb) {
    db.movies.remove( { category : "test" }, { multi : true }, function(err, numRemoved) {
      if (err) {
        cb(err);
      } else {
        db.movies.insert(data, function(err, newDocs) {
          if (err) {
            cb(err);
          } else {
            cb(null, newDocs);
          }
        });
      }
    });

  }

};