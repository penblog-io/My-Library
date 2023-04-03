require('dotenv').config({path: '.env.test'});
const request = require('supertest');
const createServer = require('../utils/server');
const {connect, disconnect} = require("../utils/database");
const {generateJwt} = require("../services/auth");
const setup = require("../data/setup");
const User = require("../models/user");
const {createUser} = require("../services/user");


const app = createServer();
beforeAll(async() => await connect());
afterAll(async() => await disconnect());
beforeEach(async() => await setup());


const userPayload = {
    username: 'reader100',
    password: 'reader100',
    firstName: 'Reader100',
    lastName: 'Reader100',
    role: 'READER'
};


describe('users', () => {

    describe('GET /api/users', () => {

        it('should return 401, unauthorized access.', async() => {
            await request(app).get('/api/users').expect(401);
        });

        describe('Role ADMIN', () => {
            it('should return 200 with admin access token', async () => {
                const adminJwt = await generateJwt('admin');
                await request(app).get('/api/users')
                    .set('authorization', 'bearer ' + adminJwt)
                    .expect(200);
            });
        });

        describe('Role READER', () => {
            it('should return 403 with reader access token', async () => {
                const readerJwt = await generateJwt('reader');
                await request(app).get('/api/users')
                    .set('authorization', 'bearer ' + readerJwt)
                    .expect(403);
            });
        });
    });

    describe('GET /api/users/:id', () => {
        it('should return 401, unauthorized access.', async() => {
            await request(app).get('/api/users/642a2c9c34089d8ecf70fd40').expect(401);
        });

        describe('Role ADMIN', () => {
            it('should return 422 for invalid object id', async () => {
                const adminJwt = await generateJwt('admin');
                await request(app).get('/api/users/1')
                    .set('authorization', 'bearer ' + adminJwt)
                    .expect(422);
            });
            it('should return 404, user not found.', async () => {
                const adminJwt = await generateJwt('admin');
                await request(app).get('/api/users/642a2c9c34089d8ecf70fd40')
                    .set('authorization', 'bearer ' + adminJwt)
                    .expect(404);
            });
            it('should return 200', async () => {
                const user = await User.findOne({});
                const adminJwt = await generateJwt('admin');
                await request(app).get('/api/users/' + user._id)
                    .set('authorization', 'bearer ' + adminJwt)
                    .expect(200);
            });
        });

        describe('Role LIBRARIAN', () => {
            it('should return 403 with librarian access token', async () => {
                const librarianJwt = await generateJwt('reader');
                await request(app).get('/api/users/642a2c9c34089d8ecf70fd40')
                    .set('authorization', 'bearer ' + librarianJwt)
                    .expect(403);
            });
        });

        describe('Role READER', () => {
            it('should return 403 with reader access token', async () => {
                const readerJwt = await generateJwt('reader');
                await request(app).get('/api/users/642a2c9c34089d8ecf70fd40')
                    .set('authorization', 'bearer ' + readerJwt)
                    .expect(403);
            });
        });
    });


    describe('POST /api/users/:id', () => {
        it('should return 401, unauthorized access.', async() => {
            await request(app).post('/api/users').expect(401);
        });

        describe('Role ADMIN', () => {
            it('should return 201 user created.', async () => {
                const adminJwt = await generateJwt('admin');
                await request(app).post('/api/users')
                    .send(userPayload)
                    .set('authorization', 'bearer ' + adminJwt)
                    .expect(201);
            });
            it('should return 409, username exists.', async () => {
                const adminJwt = await generateJwt('admin');
                await createUser(userPayload);
                await request(app).post('/api/users')
                    .send(userPayload)
                    .set('authorization', 'bearer ' + adminJwt)
                    .expect(409);
            });
        });
        describe('Role LIBRARIAN', () => {
            it('should return 403 with librarian access token', async () => {
                const jwt = await generateJwt('librarian');
                await request(app).post('/api/users')
                    .send(userPayload)
                    .set('authorization', 'bearer ' + jwt)
                    .expect(403);
            });
        });
        describe('Role READER', () => {
            it('should return 403 with reader access token', async () => {
                const readerJwt = await generateJwt('reader');
                await request(app).post('/api/users')
                    .send(userPayload)
                    .set('authorization', 'bearer ' + readerJwt)
                    .expect(403);
            });
        });
    });

    describe('PUT /api/users/:id', () => {
        it('should return 401, unauthorized access.', async() => {
            await request(app).put('/api/users').expect(401);
        });

        describe('Role ADMIN', () => {
            it('should return 200, user updated.', async () => {
                const adminJwt = await generateJwt('admin');
                const user = await User.findOne({});
                const res = await request(app).put('/api/users/' + user._id)
                    .send(userPayload)
                    .set('content-type', 'application/json')
                    .set('accept', 'application/json')
                    .set('authorization', 'bearer ' + adminJwt);

                const updatedUser = await User.findById(user._id);
                expect(res.status).toBe(200);
                expect(updatedUser.username).toBe(userPayload.username);
                expect(updatedUser.firstName).toBe(userPayload.firstName);
                expect(updatedUser.lastName).toBe(userPayload.lastName);
                expect(updatedUser.role).toBe(userPayload.role);
            });
            it('should return 409, username already exists.', async () => {
                const adminJwt = await generateJwt('admin');
                const user = await User.findOne({});
                await createUser(userPayload);
                await request(app).put('/api/users/' + user._id)
                    .send(userPayload)
                    .set('authorization', 'bearer ' + adminJwt)
                    .expect(409);
            });
        });
        describe('Role LIBRARIAN', () => {
            it('should return 403 with librarian access token', async () => {
                const jwt = await generateJwt('librarian');
                await request(app).post('/api/users')
                    .send(userPayload)
                    .set('authorization', 'bearer ' + jwt)
                    .expect(403);
            });
        });
        describe('Role READER', () => {
            it('should return 403 with reader access token', async () => {
                const readerJwt = await generateJwt('reader');
                await request(app).post('/api/users')
                    .send(userPayload)
                    .set('authorization', 'bearer ' + readerJwt)
                    .expect(403);
            });
        });
    });

    describe('PATCH /api/users/:id', () => {
        it('should return 401, unauthorized access.', async() => {
            await request(app).patch('/api/users').expect(401);
        });

        describe('Role ADMIN', () => {
            it('should return 200, user first name updated.', async () => {
                const adminJwt = await generateJwt('admin');
                const user = await User.findOne({});
                const res = await request(app).patch('/api/users/' + user._id)
                    .send({firstName: userPayload.firstName})
                    .set('content-type', 'application/json')
                    .set('accept', 'application/json')
                    .set('authorization', 'bearer ' + adminJwt);

                const updatedUser = await User.findById(user._id);
                expect(res.status).toBe(200);
                expect(updatedUser.firstName).toBe(userPayload.firstName);
            });
        });
        describe('Role LIBRARIAN', () => {
            it('should return 200, librarian can help user update their profile', async () => {
                const jwt = await generateJwt('librarian');
                const user = await User.findOne({username: 'reader'});
                await request(app).patch('/api/users/' + user._id)
                    .send({firstName: userPayload.firstName})
                    .set('authorization', 'bearer ' + jwt)
                    .expect(200);
            });
            it('should return 200, librarian can update self information', async () => {
                const jwt = await generateJwt('librarian');
                const user = await User.findOne({username: 'librarian'});
                const res = await request(app).patch('/api/users/' + user._id)
                    .send({firstName: userPayload.firstName})
                    .set('authorization', 'bearer ' + jwt);

                const updatedUser = await User.findById(user._id);
                expect(res.status).toBe(200);
                expect(updatedUser.firstName).toBe(userPayload.firstName);
            });
        });
        describe('Role READER', () => {
            it('should return 403 with reader access token', async () => {
                const jwt = await generateJwt('reader');
                const user = await User.findOne({username: 'admin'});
                await request(app).patch('/api/users/' + user._id)
                    .send({firstName: userPayload.firstName})
                    .set('authorization', 'bearer ' + jwt)
                    .expect(403);
            });
            it('should return 200, reader can update self information', async () => {
                const jwt = await generateJwt('reader');
                const user = await User.findOne({username: 'reader'});
                const res = await request(app).patch('/api/users/' + user._id)
                    .send({firstName: userPayload.firstName})
                    .set('authorization', 'bearer ' + jwt);

                const updatedUser = await User.findById(user._id);
                expect(res.status).toBe(200);
                expect(updatedUser.firstName).toBe(userPayload.firstName);
            });
        });
    });

    describe('DELETE /api/users/:id', () => {
        it('should return 401, unauthorized access.', async() => {
            await request(app).delete('/api/users').expect(401);
        });

        describe('Role ADMIN', () => {
            it('should return 204, user deleted.', async () => {
                const adminJwt = await generateJwt('admin');
                const user = await User.findOne({});
                await request(app).delete('/api/users/' + user._id)
                    .set('authorization', 'bearer ' + adminJwt)
                    .expect(204);
            });
        });
        describe('Role LIBRARIAN', () => {
            it('should return 403, unauthorized access.', async () => {
                const adminJwt = await generateJwt('librarian');
                const user = await User.findOne({});
                await request(app).delete('/api/users/' + user._id)
                    .set('authorization', 'bearer ' + adminJwt)
                    .expect(403);
            });

        });
        describe('Role READER', () => {
            it('should return 403, unauthorized access.', async () => {
                const jwt = await generateJwt('reader');
                const user = await User.findOne({});
                await request(app).delete('/api/users/' + user._id)
                    .set('authorization', 'bearer ' + jwt)
                    .expect(403);
            });
        });
    });
});

