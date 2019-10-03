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
  })

  .get('/', ({ query }, res, next) => {
    const findQuery = {};
    if(query.name) findQuery.name = query.name;
    if(query.genre) findQuery.genre = { $gte: query.genre };

    VideoGame.find(findQuery)
      .select('name yearPublished genre')
      .lean()
      .then(videogame => {
        res.json(videogame);
      })
      .catch(next);
  });

module.exports = router;