'use strict';

var path = require('path');
var Datastore = require('nedb');
var config = require('../lib/config');
var dbFile = config.get('db:filename');
var db = {};

db.movies = new Datastore({filename: '..' + path.sep + dbFile, autoload: true });

module.exports = {

  load: function(cb) {
    var movie1 = { "title" : "Raiders of the Lost Ark", "rating" : 5};
    var movie2 = {title: "Batman Returns", rating: 4};
    db.movies.insert({title: "Raiders of the Lost Ark", rating: 5}, function (err, newDocs) {
      if (err) {
        cb(err);
      } else {
        // TODO Investigate why insert reports success, but is not really working
        cb(null, newDocs);
      }
    });
  }

};