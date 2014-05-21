var express = require('express');
var app = express();
var Datastore = require('nedb');
var db = {};

// Connect to an NeDB database
db.movies = new Datastore({ filename: 'db/movies', autoload: true });

// Log every request
app.use(express.logger('dev'));

// Necessary for accessing POST data via req.body object
app.use(express.bodyParser());

// Routes
app.get('/', function (req, res) {
    res.json(200, {message: 'The API is working.'});
});

app.listen(process.argv[2] || 3050);

module.exports = app;