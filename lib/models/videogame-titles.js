const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString, RequiredNumber } = require('./required-types');

const schema = new Schema ({
  name: RequiredString,
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  yearPublished: RequiredNumber,
  console: {
    exclusive: Boolean,
    firstConsoleRelease: {
      type: String,
      required: true,
    }
  },
  genre: [{
    type: String,
    enum: ['action', 'rpg', 'shooter', 'strategy']
  }]
});

module.exports = mongoose.model('VideoGame', schema);