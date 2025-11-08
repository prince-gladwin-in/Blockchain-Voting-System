import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server.js';
const expect = chai.expect;

chai.use(chaiHttp);

describe('Authentication API', () => {
    let authToken;
    const testUser = {
        username: 'testuser123',
        email: 'test@example.com',
        password: 'TestPass123',
        firstName: 'Test',
        lastName: 'User',
        walletAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
    };

    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const res = await chai
                .request(app)
                .post('/api/auth/register')
                .send(testUser);

            expect(res).to.have.status(201);
            expect(res.body).to.have.property('success', true);
            expect(res.body).to.have.property('token');
            expect(res.body.user).to.have.property('username', testUser.username);
        });

        it('should not allow duplicate registration', async () => {
            const res = await chai
                .request(app)
                .post('/api/auth/register')
                .send(testUser);

            expect(res).to.have.status(400);
            expect(res.body).to.have.property('success', false);
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login with username', async () => {
            const res = await chai
                .request(app)
                .post('/api/auth/login')
                .send({
                    identifier: testUser.username,
                    password: testUser.password
                });

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('success', true);
            expect(res.body).to.have.property('token');
            authToken = res.body.token;
        });

        it('should login with email', async () => {
            const res = await chai
                .request(app)
                .post('/api/auth/login')
                .send({
                    identifier: testUser.email,
                    password: testUser.password
                });

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('success', true);
            expect(res.body).to.have.property('token');
        });

        it('should not login with wrong password', async () => {
            const res = await chai
                .request(app)
                .post('/api/auth/login')
                .send({
                    identifier: testUser.username,
                    password: 'wrongpassword'
                });

            expect(res).to.have.status(401);
            expect(res.body).to.have.property('success', false);
        });
    });

    describe('GET /api/auth/me', () => {
        it('should get user profile with valid token', async () => {
            const res = await chai
                .request(app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('success', true);
            expect(res.body.user).to.have.property('username', testUser.username);
        });

        it('should not get profile without token', async () => {
            const res = await chai
                .request(app)
                .get('/api/auth/me');

            expect(res).to.have.status(401);
            expect(res.body).to.have.property('success', false);
        });
    });
});