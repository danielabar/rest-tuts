'use strict';

var Datastore = require('nedb');
var db = {};

module.exports = {

  init: function(dbFile) {
    console.log('=== DbLoader: init is called: ' + dbFile);
    db.movies = new Datastore({filename: dbFile, autoload: true });
    db.movies.ensureIndex({fieldName: 'title', unique: true });
    return db.movies;
  },

  // TODO: Accept array of data to insert
  // For now, assume initDb has been called
  load: function(cb) {
    var movie1 = {title: "Movie 1", rating: 1, category: "test"};
    var movie2 = {title: "Movie 2", rating: 2, category: "test"};

    db.movies.remove( { category : "test" }, { multi : true }, function(err, numRemoved) {
      if (err) {
        cb(err);
      } else {
        db.movies.insert([movie1, movie2], function(err, newDocs) {
          if (err) {
            console.log('Unable to load db');
            cb(err);
          } else {
            console.log('Loaded newDocs in db: ' + newDocs.length);
            cb(null, newDocs);
          }
        });
      }
    });

  }

};