
const mongoId = /^[a-f\d]{24}$/i;

const matchMongoId = {
  _id: expect.stringMatching(mongoId),
};

module.exports = {
  mongoId,
  matchMongoId
};