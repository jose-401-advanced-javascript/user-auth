const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString, RequiredNumber } = require('./required-types');

const schema = new Schema ({
  name: RequiredString,
  yearReleased: RequiredNumber
});

module.exports = mongoose.model('Console', schema);