rest-tuts
===================

This project is from [How to Build a Hypermedia-Driven REST API](https://courses.tutsplus.com/courses/how-to-build-a-hypermedia-driven-rest-api) from [TutsPlus](https://tutsplus.com/).

I have also added automated API testing using [supertest](https://github.com/visionmedia/supertest).

The API uses [nedb](https://github.com/louischatriot/nedb) database for persistence.
This presents a challenge for automated testing because we need predictable results to assert on.

To solve the issue, this project uses [nconf](https://github.com/flatiron/nconf) to configure separate databases for [development](config/development.json) and [test](config/test.json).
The tests are started with `NODE_ENV=test` to point the config in the right direction.

Further, before each test run, a [database loader](lib/DbLoader.js) is used to clean the database, and load a known dataset. That way, each test run can be assured of a clean starting state.

### Setup
Clone this repo, then:

  ```bash
  cd rest-tuts
  npm install
  ```

### Development
Start the server:

  ```bash
  node index.js
  ```

Or if you have nodemon installed:

  ```bash
  nodemon index.js
  ```

Then in another console tab, start the watcher to lint and run tests:

  ```bash
  npm run watch
  ```

In another console tab, run the test coverage report:

  ```bash
  npm run coverage
  ```

The test report will be generated in `coverage/lc0v-report/index.html`

### Usage
To manually test the API, use [curl](http://curl.haxx.se/docs/manpage.html) or [Postman Chrome Extension](https://chrome.google.com/webstore/detail/postman-rest-client/fdmmgilgnpjigdojojpjoooidkmcomcm?hl=en).

If using Postman, import this [collection](test/chrome-postman.json).