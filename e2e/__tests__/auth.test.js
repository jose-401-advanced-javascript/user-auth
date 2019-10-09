const request = require('../request');
const { dropCollection } = require('../db');
const jwt = require('jsonwebtoken');
const { signupUser, signupAdmin } = require('../data-helpers');

describe('Auth API', () => {
  beforeEach(() => dropCollection('users'));

  const testUser = {
    email: 'me@me.com',
    password: 'abc'
  };

  let user = null;

  beforeEach(() => {
    return signupUser(testUser).then(newUser => (user = newUser));
  });

  it('signs up a user', () => {
    expect(user.token).toBeDefined();
  });

  it('cannot sign up with same email', () => {
    return request
      .post('/api/auth/signup')
      .send(testUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.error).toBe('Email me@me.com already in use');
      });
  });

  function testEmailAndPasswordRequired(route, testProperty, user) {
    it(`${route} requires ${testProperty}`, () => {
      return request
        .post(`/api/auth/${route}`)
        .send(user)
        .expect(400)
        .then(({ body }) => {
          expect(body.error).toBe('Email and password required');
        });
    });
  }

  testEmailAndPasswordRequired('signup', 'email', {
    password: 'I no like emails'
  });
  testEmailAndPasswordRequired('signup', 'password', {
    email: 'no@password.com'
  });
  testEmailAndPasswordRequired('signin', 'email', {
    password: 'I no like emails'
  });
  testEmailAndPasswordRequired('signin', 'password', {
    email: 'no@password.com'
  });

  it('signs in a user', () => {
    return request
      .post('/api/auth/signin')
      .send(testUser)
      .expect(200)
      .then(({ body }) => {
        expect(body.token).toBeDefined();
      });
  });

  function testBadSignup(testName, user) {
    it(testName, () => {
      return request
        .post('/api/auth/signin')
        .send(user)
        .expect(401)
        .then(({ body }) => {
          expect(body.error).toBe('Invalid email or password');
        });
    });
  }

  testBadSignup('rejects bad password', {
    email: testUser.email,
    password: 'bad password'
  });

  testBadSignup('rejects invalid email', {
    email: 'bad@email.com',
    password: testUser.password
  });

  it('verifies a good token', () => {
    return request
      .get('/api/auth/verify')
      .set('Authorization', user.token)
      .expect(200);
  });

  it('verifies a bad token', () => {
    return request
      .get('/api/auth/verify')
      .set('Authorization', jwt.sign({ foo: 'bar' }, 'shhhhh'))
      .expect(401);
  });
});

describe('Admin routes', () => {
  beforeEach(() => dropCollection('users'));

  const testUser = {
    email: 'me@me.com',
    password: 'abc'
  };

  const testUser2 = {
    email: 'me2@me.com',
    password: 'abc'
  };

  const testUser3 = {
    email: 'me3@me.com',
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

  it('allows admin to update user roles', () => {
    return request
      .put(`/api/auth/users/${user._id}/roles/admin`)
      .set('Authorization', admin.token)
      .expect(200)
      .then(({ body }) => {
        expect(body.roles[0]).toBe('admin');
      });
  });

  it('admin can remove roles', () => {
    return request
      .put(`/api/auth/users/${user._id}/roles/admin`)
      .set('Authorization', admin.token)
      .expect(200)
      .then(({ body }) => {
        return request
          .delete(`/api/auth/users/${body._id}/roles/admin`)
          .set('Authorization', admin.token)
          .expect(200)
          .then(({ body }) => {
            expect(body.roles[0]).toBeUndefined;
          });
      });
  });

  it('gets a list of users', () => {
    return Promise.all([signupUser(testUser2), signupUser(testUser3)]).then(
      () => {
        return request
          .get('/api/auth/users')
          .set('Authorization', admin.token)
          .expect(200)
          .then(({ body }) => {
            expect(body.length).toBe(4);
            expect(body[0]).toMatchInlineSnapshot(
              {
                _id: expect.any(String)
              },
              `
              Object {
                "_id": Any<String>,
                "email": "me@me.com",
                "roles": Array [],
              }
            `
            );
          });
      }
    );
  });
});
