require('dotenv').config({path: '.env.test'});
const request = require('supertest');
const createServer = require('../utils/server');
const {connect, disconnect} = require("../utils/database");
const {generateJwt} = require("../services/auth");
const {createUser} = require("../services/user");
const {createBook} = require("../services/book");
const Book = require("../models/book");
const setup = require("../data/setup");

const app = createServer();
beforeAll(async() => await connect());
afterAll(async() => await disconnect());
beforeEach(async() => await setup());

const bookPayload = {
    isbn: '3008985349911',
    title: 'Engineers Survival Guide: Advice, tactics, and tricks After a decade of working at Facebook, Snapchat, and Microsoft',
    excerpt: 'There are a lot of amazing technical books out there. But what about your life as an engineer? How you interact with others? How happy are you with your career?',
    author: 'Merih Taze'
};

describe('books', () => {

    describe('GET /api/books', () => {

        it('should return 401, unauthorized access.', async() => {
            await request(app).get('/api/books').expect(401);
        });

        describe('Role ADMIN', () => {
            it('should return 200 with admin access token', async () => {
                const adminJwt = await generateJwt('admin');
                await request(app).get('/api/books')
                    .set('authorization', 'bearer ' + adminJwt)
                    .expect(200);
            });
        });
        describe('Role LIBRARIAN', () => {
            it('should return 200 with librarian access token', async () => {
                const readerJwt = await generateJwt('librarian');
                await request(app).get('/api/books')
                    .set('authorization', 'bearer ' + readerJwt)
                    .expect(200);
            });
        });
        describe('Role READER', () => {
            it('should return 200 with reader access token', async () => {
                const readerJwt = await generateJwt('reader');
                await request(app).get('/api/books')
                    .set('authorization', 'bearer ' + readerJwt)
                    .expect(200);
            });
        });
    });

    describe('GET /api/books/:id', () => {
        it('should return 401, unauthorized access.', async() => {
            await request(app).get('/api/books/642a2c9c34089d8ecf70fd40').expect(401);
        });

        describe('Role ADMIN', () => {
            it('should return 422 for invalid object id', async () => {
                const adminJwt = await generateJwt('admin');
                await request(app).get('/api/books/1')
                    .set('authorization', 'bearer ' + adminJwt)
                    .expect(422);
            });
            it('should return 404, user not found.', async () => {
                const adminJwt = await generateJwt('admin');
                await request(app).get('/api/books/642a2c9c34089d8ecf70fd40')
                    .set('authorization', 'bearer ' + adminJwt)
                    .expect(404);
            });
            it('should return 200', async () => {
                const user = await Book.findOne({});
                const adminJwt = await generateJwt('admin');
                await request(app).get('/api/books/' + user._id)
                    .set('authorization', 'bearer ' + adminJwt)
                    .expect(200);
            });
        });

        describe('Role LIBRARIAN', () => {
            it('should return 200 with librarian access', async () => {
                const user = await Book.findOne({});
                const jwt = await generateJwt('librarian');
                await request(app).get('/api/books/' + user._id)
                    .set('authorization', 'bearer ' + jwt)
                    .expect(200);
            });
        });

        describe('Role READER', () => {
            it('should return 200 with reader access', async () => {
                const user = await Book.findOne({});
                const jwt = await generateJwt('reader');
                await request(app).get('/api/books/' + user._id)
                    .set('authorization', 'bearer ' + jwt)
                    .expect(200);
            });
        });
    });


    describe('POST /api/books/:id', () => {
        it('should return 401, unauthorized access.', async() => {
            await request(app).post('/api/books').expect(401);
        });

        describe('Role ADMIN', () => {
            it('should return 201 book created.', async () => {
                const adminJwt = await generateJwt('admin');
                await request(app).post('/api/books')
                    .send(bookPayload)
                    .set('authorization', 'bearer ' + adminJwt)
                    .expect(201);
            });
            it('should return 409, username exists.', async () => {
                const adminJwt = await generateJwt('admin');
                await createBook(bookPayload);
                await request(app).post('/api/books')
                    .send(bookPayload)
                    .set('authorization', 'bearer ' + adminJwt)
                    .expect(409);
            });
        });
        describe('Role LIBRARIAN', () => {
            it('should return 201, with librarian access.', async () => {
                const adminJwt = await generateJwt('librarian');
                await request(app).post('/api/books')
                    .send(bookPayload)
                    .set('authorization', 'bearer ' + adminJwt)
                    .expect(201);
            });
        });
        describe('Role READER', () => {
            it('should return 403 with reader access token', async () => {
                const readerJwt = await generateJwt('reader');
                await request(app).post('/api/books')
                    .send(bookPayload)
                    .set('authorization', 'bearer ' + readerJwt)
                    .expect(403);
            });
        });
    });

    describe('PUT /api/books/:id', () => {
        it('should return 401, unauthorized access.', async() => {
            await request(app).put('/api/books').expect(401);
        });

        describe('Role ADMIN', () => {
            it('should return 200, user updated.', async () => {
                const adminJwt = await generateJwt('admin');
                const book = await Book.findOne({});
                const res = await request(app).put('/api/books/' + book._id)
                    .send(bookPayload)
                    .set('content-type', 'application/json')
                    .set('accept', 'application/json')
                    .set('authorization', 'bearer ' + adminJwt);

                const updatedBook = await Book.findById(book._id);
                expect(res.status).toBe(200);
                expect(updatedBook.isbn).toBe(bookPayload.isbn);
                expect(updatedBook.title).toBe(bookPayload.title);
                expect(updatedBook.excerpt).toBe(bookPayload.excerpt);
                expect(updatedBook.author).toBe(bookPayload.author);
            });
            it('should return 409, username already exists.', async () => {
                const adminJwt = await generateJwt('admin');
                const user = await Book.findOne({});
                await createBook(bookPayload);
                await request(app).put('/api/books/' + user._id)
                    .send(bookPayload)
                    .set('authorization', 'bearer ' + adminJwt)
                    .expect(409);
            });
        });
        describe('Role LIBRARIAN', () => {
            it('should return 201 with librarian access token', async () => {
                const jwt = await generateJwt('librarian');
                await request(app).post('/api/books')
                    .send(bookPayload)
                    .set('authorization', 'bearer ' + jwt)
                    .expect(201);
            });
        });
        describe('Role READER', () => {
            it('should return 403 with reader access token', async () => {
                const readerJwt = await generateJwt('reader');
                await request(app).post('/api/books')
                    .send(bookPayload)
                    .set('authorization', 'bearer ' + readerJwt)
                    .expect(403);
            });
        });
    });

    describe('DELETE /api/books/:id', () => {
        it('should return 401, unauthorized access.', async() => {
            await request(app).delete('/api/books').expect(401);
        });

        describe('Role ADMIN', () => {
            it('should return 204, user deleted.', async () => {
                const adminJwt = await generateJwt('admin');
                const user = await Book.findOne({});
                await request(app).delete('/api/books/' + user._id)
                    .set('authorization', 'bearer ' + adminJwt)
                    .expect(204);
            });
        });
        describe('Role LIBRARIAN', () => {
            it('should return 204, unauthorized access.', async () => {
                const adminJwt = await generateJwt('librarian');
                const user = await Book.findOne({});
                await request(app).delete('/api/books/' + user._id)
                    .set('authorization', 'bearer ' + adminJwt)
                    .expect(204);
            });

        });
        describe('Role READER', () => {
            it('should return 403, unauthorized access.', async () => {
                const jwt = await generateJwt('reader');
                const user = await Book.findOne({});
                await request(app).delete('/api/users/' + user._id)
                    .set('authorization', 'bearer ' + jwt)
                    .expect(403);
            });
        });
    });
});
