require('dotenv').config({path: '.env.test'});
const request = require('supertest');
const createServer = require('../utils/server');
const {connect, disconnect} = require("../utils/database");
const setup = require('../data/setup');
const app = createServer();


beforeAll(async () => {
    await connect();
    await setup();
});
afterAll(() => disconnect());



describe('POST /api/authorize', () => {
    it('should return 401 when username and password is invalid', async () => {
        await request(app).post('/api/authorize').send({
            username: 'hacker',
            password: 'hacker',
        }).set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(401);
    });

    it('should return 200 when username and password is invalid', async () => {
        await request(app).post('/api/authorize').send({
            username: 'admin',
            password: 'admin',
        }).set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200);

    });
});

