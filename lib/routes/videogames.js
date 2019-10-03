// eslint-disable-next-line new-cap
const router = require('express').Router();
const VideoGame = require('../models/videogame');

router
  .post('/', (req, res, next) => {
    req.body.owner = req.user.id;

    VideoGame.create(req.body)
      .then(videogame => res.json(videogame))
      .catch(next);
  })

  .put('/:id', ({ params, body, user }, res, next) => {
    VideoGame.updateOne({
      _id: params.id,
      owner: user.id
    }, body)
      .then(videogame => res.json(videogame))
      .catch(next);
  })

  .delete('/:id', ({ params, user }, res, next) => {
    VideoGame.findOneAndRemove({
      _id: params.id,
      owner: user.id
    })
      .then(videogame => res.json(videogame))
      .catch(next);
  });

module.exports = router;