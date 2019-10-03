// eslint-disable-next-line new-cap
const router = require('express').Router();
const User = require('../models/user');

router
  .get('/favorites', ({ user }, res, next) => {
    User.findById(user.id)
      .populate('favorites', 'name')
      .lean()
      .then(({ favorites }) => res.json(favorites))
      .catch(next);
  })

  .put('/favorites/:videogameId', ({ user, params }, res, next) => {
    User.updateById(user.id, {
      $addToSet: {
        favorites: params.videogameId
      }
    })
      .then(({ favorites }) => res.json(favorites))
      .catch(next);
  });

module.exports = router;