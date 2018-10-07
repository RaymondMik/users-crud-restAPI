const request = require('supertest');
//const {ObjectID} = require('mongodb');
const mongoose = require('mongoose');
const {app} = require('../../app.js');
const {User} = require('../../database/models/user.js');
const {populateUsers, clearUsers, users} = require('../databaseHandler.js');

const URL_FRAGMENT = '/users';

beforeEach(populateUsers);
beforeAll(() => {
    mongoose.connect(process.env.MONGODB_URI);
});
afterAll((done) => {
    mongoose.disconnect();
    done();
});

// GET all users
describe('GET users', () => {
    test('should return full list of users if authenticated', (done) => {
        request(app)
            .get(`${URL_FRAGMENT}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.length).toBe(3);
            })
            .end(done);
    });

    test('should get 401 error if user is not authenticated', (done) => {
        request(app)
            .get(`${URL_FRAGMENT}`)
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });

    test('should get 401 error if user has note admin role', (done) => {
        request(app)
            .get(`${URL_FRAGMENT}`)
            .set('x-auth', users[2].tokens[0].token)
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

// GET single user
describe('GET users/:id', () => {
    test('should return user if authenticated', (done) => {
        request(app)
            .get(`${URL_FRAGMENT}/${users[0]._id}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    test('should get 401 error if user is not authenticated', (done) => {
        request(app)
            .get(`${URL_FRAGMENT}/${users[0]._id}`)
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });

    // TODO add tests with different user roles.
});

// POST sign up (create user)
describe('POST /users/sign-up', () => {
    test('should create a new user', (done) => {
        const body = {
            userName: 'HelloTestUser',
            email: 'hello12@example.com',
            password: 'hello123_09',
            role: 'user'
        };
    
        request(app)
            .post(`${URL_FRAGMENT}/sign-up`)
            .send(body)
            .expect(200)
            .expect((res) => {
                expect(res.body).toEqual({message: 'User created successfully'});
            })
            .end( async(err) => {
                if (err) return done(err);
                
                try {
                    const user = await User.findOne({email: body.email});
                    // check if user has been added
                    expect(user).toBeTruthy();
                    // check if password has been hashed!
                    expect(user.password).not.toBe(body.password);
                    done();
                } catch(e) {
                    done(e)
                }
            });
    });

    test('should return a validation error if req is invalid', (done) => {
        const body = {
            userName: 'HelloTestUser22',
            email: 'hello12@example',
            password: 9898,
            role: 'user'
        };

        request(app)
            .post(`${URL_FRAGMENT}/sign-up`)
            .send(body)
            .expect(400)
            .end(done);
    });

    // TODO add test to check attempt with userName or email already in DB
});

// POST sign in
describe('POST /users/sign-in', () => {
    test('should login an existing user', (done) => {          
        request(app)
            .post(`${URL_FRAGMENT}/sign-in`)
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
            })
            .end(async (err, res) => {
                if (err) return done(err);

                try {
                    const user = await User.findById(users[1]._id);
                    expect(user.tokens[user.tokens.length - 1].access).toEqual('auth');
                    expect(user.tokens[user.tokens.length - 1].token).toEqual(res.headers['x-auth']);
                    done();
                } catch(e) {
                    done(e);
                }
            });
    });
    
    test('should reject invalid login', (done) => {
        request(app)
            .post(`${URL_FRAGMENT}/sign-in`)
            .send({
                email: users[1].email,
                password: 'blablbla'
            })
            .expect(401)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeFalsy();
            })
            .end(async(err) => {
                if (err) return done(err);

                try {
                    const user = await User.findById(users[1]._id);
                    expect(user.tokens.length).toBe(0);
                    done();
                } catch(e) {
                    done(e); 
                }
            });
    });
});

// POST sign user out
describe('POST users/sign-out/:id', () => {
    test('should remove auth token on logout', (done) => {
        request(app)
            .post(`${URL_FRAGMENT}/sign-out/${users[0]._id}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err) => {
                if (err) return done(err);

                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((err) => done(err));
            })

    });
});

// PATCH update user
describe('PATCH users/update/:id', () => {
    test('should update value correctly', (done) => {
        const newUserName = 'NewTestUserName898';
        request(app)
            .patch(`${URL_FRAGMENT}/update/${users[1]._id}`)
            .send({
                userName: newUserName
            })
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err) => {
                if (err) return done(err);

                User.findById(users[1]._id).then((user) => {
                    expect(user.userName).toBe(newUserName);
                    done();
                }).catch((err) => done(err));
            });
    });

    test('admin should be capable to update everyones data', (done) => {
        const newUserName = 'NewTestUserName898';
        request(app)
            .patch(`${URL_FRAGMENT}/update/${users[1]._id}`)
            .send({
                userName: newUserName
            })
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end(done);
    });

    test('user should be capable to update only their own data', (done) => {
        const newUserName = 'NewTestUserName898';
        request(app)
            .patch(`${URL_FRAGMENT}/update/${users[1]._id}`)
            .send({
                userName: newUserName
            })
            .set('x-auth', users[2].tokens[0].token)
            .expect(401)
            .end(done);
    });
});

// DELETE user
describe('DELETE users/delete/:id', () => {
    test('if logged in as admin should remove user', (done) => {
        request(app)
            .delete(`${URL_FRAGMENT}/delete/${users[1]._id}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err) => {
                if (err) return done(err);

                User.findById(users[1]._id).then((user) => {
                    expect(user).toBeFalsy();
                    done();
                }).catch((err) => done(err));
            })
    });

    test('if logged in as user should NOT remove user', (done) => {
        request(app)
            .delete(`${URL_FRAGMENT}/delete/${users[1]._id}`)
            .set('x-auth', users[2].tokens[0].token)
            .expect(401)
            .end(() => {done()});
    });
});