import request from 'supertest';
import { getTestApp } from './test-utils';
import { App } from '../src/app';
import { PrismaService } from '../src/database/prisma.service';

let app: App;
let prisma: PrismaService;

beforeAll(async () => {
	const testApp = await getTestApp();
	app = testApp.app;
	prisma = testApp.prisma;
	await app.init();
});

afterAll(async () => {
	// Clean up and close connections
	await prisma.client.userModel.deleteMany();
	await prisma.disconnect();
	app.server.close();
});

describe('User Integration Tests', () => {
	const testUser = {
		email: 'test@example.com',
		password: 'password123',
		name: 'Test User',
	};

	it('should register a new user', async () => {
		const res = await request(app.app)
			.post('/users/register')
			.send(testUser);

		expect(res.statusCode).toBe(201);
		expect(res.body).toHaveProperty('email', testUser.email);
		expect(res.body).toHaveProperty('id');
		expect(res.body).not.toHaveProperty('password');
	});

	it('should login an existing user and return JWT', async () => {
		const res = await request(app.app)
			.post('/users/login')
			.send({
				email: testUser.email,
				password: testUser.password,
			});

		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty('jwt');
		expect(res.body.user).toHaveProperty('email', testUser.email);
	});

	it('should return 422 if user already exists', async () => {
		const res = await request(app.app)
			.post('/users/register')
			.send(testUser);

		expect(res.statusCode).toBe(422);
	});

	it('should return 401 for invalid login', async () => {
		const res = await request(app.app)
			.post('/users/login')
			.send({
				email: testUser.email,
				password: 'wrongpassword',
			});

		expect(res.statusCode).toBe(401);
	});
});
