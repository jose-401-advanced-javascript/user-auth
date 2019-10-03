const request = require('../request');
const db = require('../db');
const { signupUser } = require('../data-helpers');

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
});
