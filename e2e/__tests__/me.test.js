const request = require('../request');
const db = require('../db');
const { signupUser } = require('../data-helpers');
const { matchMongoId } = require('../match-helpers');

describe('Me API', () => {
  beforeEach(() => db.dropCollection('users'));
  beforeEach(() => db.dropCollection('videogames'));

  let user = null;
  beforeEach(() => {
    return signupUser().then(newUser => (user = newUser));
  });

  const videogame = {
    name: 'Fable',
    yearPublished: 2004,
    console: {
      exclusive: false,
      firstConsoleRelease: 'X-box'
    },
    genre: ['action', 'rpg']
  };

  function postVideogame(videogame) {
    return request
      .post('/api/videogames')
      .set('Authorization', user.token)
      .send(videogame)
      .expect(200)
      .then(({ body }) => body);
  }

  function postGameAndSavetoFav(videogame) {
    return postVideogame(videogame).then(savedGave => {
      return request
        .put(`/api/me/favorites/${savedGave._id}`)
        .set('Authorization', user.token)
        .send({ _id: savedGave._id })
        .expect(200)
        .then(({ body }) => body);
    });
  }

  it('adds game to favorites', () => {
    return postVideogame(videogame).then(savedGame => {
      return request
        .put(`/api/me/favorites/${savedGame._id}`)
        .set('Authorization', user.token)
        .send({ _id: savedGame._id })
        .expect(200)
        .then(({ body }) => {
          expect(body[0]).toMatch(savedGame._id);
        });
    });
  });

  it('gets a list of favorites', () => {
    return Promise.all([
      postGameAndSavetoFav(videogame),
      postGameAndSavetoFav({
        name: 'Fable 2',
        yearPublished: 2008,
        console: {
          exclusive: false,
          firstConsoleRelease: 'X-box'
        },
        genre: ['action', 'rpg']
      }),
      postGameAndSavetoFav({
        name: 'Fable 3',
        yearPublished: 2010,
        console: {
          exclusive: false,
          firstConsoleRelease: 'X-box'
        },
        genre: ['action', 'rpg']
      })
        .then(() => {
          return request
            .get('/api/videogames')
            .set('Authorization', user.token)
            .expect(200);
        })
        .then(({ body }) => {
          expect(body.length).toBe(3);
          expect(body[0]).toMatchInlineSnapshot(
            matchMongoId,

            `
            Object {
              "_id": StringMatching /\\^\\[a-f\\\\d\\]\\{24\\}\\$/i,
              "genre": Array [
                "action",
                "rpg",
              ],
              "name": "Fable",
              "yearPublished": 2004,
            }
          `
          );
        })
    ]);
  });

  it('deletes a favored game', () => {
    return postGameAndSavetoFav(videogame).then(favorites => {
      return request
        .delete(`/api/me/favorites/${favorites[0]}`)
        .set('Authorization', user.token)
        .expect(200)
        .then(({ body }) => {
          expect(body.length).toBe(0);
        });
    });
  });
});
