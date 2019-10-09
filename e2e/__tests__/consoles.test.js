const request = require('../request');
const { dropCollection } = require('../db');
const { signupUser, signupAdmin } = require('../data-helpers');

describe('Console API', () => {
  beforeEach(() => {
    return Promise.all([
      dropCollection('users'),
      dropCollection('consoles')
    ]);
  });

  const testUser = {
    email: 'me@me.com',
    password: 'abc'
  };

  const adminUser = {
    email: 'admin@me.com',
    password: 'abc'
  };

  let user = null;
  let admin = null;

  beforeEach(() => {
    return Promise.all([
      signupUser(testUser).then(newUser => (user = newUser)),
      signupAdmin(adminUser).then(newAdmin => (admin = newAdmin))
    ]);
  });

  it('allows users with admin to post consoles', () => {
    return request
      .put(`/api/auth/users/${user._id}/roles/admin`)
      .set('Authorization', admin.token)
      .expect(200)
      .then(() => {
        return request
          .post('/api/consoles/')
          .set('Authorization', user.token)
          .expect(200)
          .then(({ body }) => {
            expect(body.owner).toBe(user._id);
            expect(body).toMatchInLineSnapshot(
              {
                _id: expect.any(String),
                owner: expect.any(String)
              },
            );
          });
      });
  });
});