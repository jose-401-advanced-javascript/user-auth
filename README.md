# LAB - 13

## User Management and Auth

### Author: Jose

### Links and Resources
* [submission PR](https://github.com/jose-401-advanced-javascript/user-auth/pull/1)
* [travis](https://travis-ci.com/jose-401-advanced-javascript/user-auth)
* [back-end](https://agile-tor-65989.herokuapp.com/)


### Setup
#### `.env` requirements
* `PORT` - 3000
* `MONGODB_URI` - mongodb://localhost:27017/user-auth-lab


#### Running the app

Lifecycle scripts included in express-reference-server:
  pretest
    npm run lint
  test
    npm run jest
  start
    node server.js

available via `npm run-script`:
  lint
    eslint .
  jest
    jest --runInBand --verbose
  test:coverage
    npm run test -- --coverage
  test:watch
    npm run jest -- --watchAll
  test:verbose
    npm run test -- --verbose
  start:watch
    nodemon server.js
  

