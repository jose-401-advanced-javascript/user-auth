// eslint-disable-next-line new-cap
const router = require('express').Router();
const Console = require('../models/console');
const ensureAuth = require('../middleware/ensure-auth');
const ensureRole = require('../middleware/ensure-role');

router
  .get('/', (req, res, next) => {
    Console.find()
      .lean()
      .then(consoles => res.json(consoles))
      .catch(next);
  })

  .post('/', ensureAuth(), ensureRole('admin'), (req, res, next) => {
    Console.create(req.body)
      .then(gameConsole => res.json(gameConsole))
      .catch(next);
  })

  .put('/:id', ensureAuth(), ensureRole('admin'), ({ params, body }, res, next) => {
    Console.updateOne({
      _id: params.id,
    }, body)
      .then(gameConsole => res.json(gameConsole))
      .catch(next);
  })

  .delete('/:id', ensureAuth(), ensureRole('admin'), ({ params }, res, next) => {
    Console.findByIdAndRemove({
      _id: params.id
    })
      .then(gameConsole => res.json(gameConsole))
      .catch(next);
  });

module.exports = router;