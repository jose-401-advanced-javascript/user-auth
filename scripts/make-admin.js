// file: make-admin.js
require('dotenv').config();
const connect = require('../lib/connect');
require('../lib/models/register-plugins');
const User = require('../lib/models/user');
const mongoose = require('mongoose');

connect(process.env.MONGODB_URI);
const userId = process.argv[2];

console.log('Making user', userId, 'admin');

User.addRole(userId, 'admin')
  .then(console.log)
  .catch(console.log)
  .finally(() => mongoose.connection.close());