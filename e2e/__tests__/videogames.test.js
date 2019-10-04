const request = require('../request');
const db = require('../db');
const { signupUser } = require('../data-helpers');
const { matchIdAndOwner } = require('../match-helpers');

describe('Video Games API', () => {
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

  it('post a videogame for this user', () => {
    return request
      .post('/api/videogames')
      .set('Authorization', user.token)
      .send(videogame)
      .expect(200)
      .then(({ body }) => {
        expect(body.owner).toBe(user._id);
        expect(body).toMatchInlineSnapshot(
          {
            _id: expect.any(String),
            owner: expect.any(String)
          },
          `
          Object {
            "__v": 0,
            "_id": Any<String>,
            "console": Object {
              "exclusive": false,
              "firstConsoleRelease": "X-box",
            },
            "genre": Array [
              "action",
              "rpg",
            ],
            "name": "Fable",
            "owner": Any<String>,
            "yearPublished": 2004,
          }
        `
        );
      });
  });

  it('updates a videogame', () => {
    return postVideogame(videogame).then(savedGame => {
      return request
        .put(`/api/videogames/${savedGame._id}`)
        .set('Authorization', user.token)
        .send({ yearPublished: 2002 })
        .expect(200)
        .then(({ body }) => {
          expect(body.yearPublished).toBe(2002),
          expect(body).toMatchInlineSnapshot(
            matchIdAndOwner,

            `
              Object {
                "__v": 0,
                "_id": StringMatching /\\^\\[a-f\\\\d\\]\\{24\\}\\$/i,
                "console": Object {
                  "exclusive": false,
                  "firstConsoleRelease": "X-box",
                },
                "genre": Array [
                  "action",
                  "rpg",
                ],
                "name": "Fable",
                "owner": StringMatching /\\^\\[a-f\\\\d\\]\\{24\\}\\$/i,
                "yearPublished": 2002,
              }
            `
          );
        });
    });
  });

  it('deletes a videogame', () => {
    return postVideogame(videogame).then(savedGame => {
      return request
        .delete(`/api/videogames/${savedGame._id}`)
        .set('Authorization', user.token)
        .expect(200)
        .then(({ body }) => {
          expect(body._id).toMatch(savedGame._id);
        });
    });
  });
});
