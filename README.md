rest-tuts
===================

This project is from [How to Build a Hypermedia-Driven REST API](https://courses.tutsplus.com/courses/how-to-build-a-hypermedia-driven-rest-api) from [TutsPlus](https://tutsplus.com/).

I have also added automated API testing using [supertest](https://github.com/visionmedia/supertest).

The API uses [nedb](https://github.com/louischatriot/nedb) database for persistence.

This presents a challenge for automated testing because we need predictable results to assert on.

To solve the issue, this project uses [nconf](https://github.com/flatiron/nconf) to configure separate databases for [development](config/development.json) and [test](config/test.json).

Further, before each test run, a database loader is used to clean the database, and load a known dataset. That way, each test run can be assured of a clean starting state.

### Setup
Clone this repo, then:

  ```bash
  cd rest-tuts
  npm install
  ```

### Development
Start the server in one console:

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