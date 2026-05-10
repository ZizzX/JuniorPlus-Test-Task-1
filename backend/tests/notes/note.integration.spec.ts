import request from 'supertest';
import { getTestApp } from '../test-utils';
import { App } from '../../src/app';
import { PrismaService } from '../../src/database/prisma.service';

describe('Notes Integration Tests', () => {
	let app: App;
	let prisma: PrismaService;
	let token: string;
	let userId: string;

	const testUser = {
		email: 'notes-test@example.com',
		password: 'password123',
		name: 'Notes Tester',
	};

	beforeAll(async () => {
		const testApp = await getTestApp();
		app = testApp.app;
		prisma = testApp.prisma;
		await app.init();

		// Cleanup before tests to ensure clean state
		await prisma.client.noteModel.deleteMany({
			where: { user: { email: testUser.email } },
		});
		await prisma.client.userModel.deleteMany({
			where: { email: testUser.email },
		});

		// Register and login to get token
		await request(app.app).post('/users/register').send(testUser);
		const loginRes = await request(app.app).post('/users/login').send({
			email: testUser.email,
			password: testUser.password,
		});
		token = loginRes.body.jwt;
		userId = loginRes.body.user.id;
	});

	afterAll(async () => {
		// Delete notes first to avoid foreign key constraints (until migrations are fully applied)
		await prisma.client.noteModel.deleteMany({ where: { userId } });
		await prisma.client.userModel.deleteMany({ where: { id: userId } });
		await prisma.disconnect();
		if (app.server) {
			app.server.close();
		}
	});

	let noteId: string;

	it('POST /notes - should create a note', async () => {
		const res = await request(app.app)
			.post('/notes')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Integration Test Note',
				content: 'This is a test note content',
			});

		expect(res.statusCode).toBe(201);
		expect(res.body).toHaveProperty('id');
		expect(res.body.title).toBe('Integration Test Note');
		noteId = res.body.id;
	});

	it('GET /notes - should return list of notes', async () => {
		const res = await request(app.app)
			.get('/notes')
			.set('Authorization', `Bearer ${token}`);

		expect(res.statusCode).toBe(200);
		expect(res.body.notes).toBeDefined();
		expect(res.body.notes.length).toBeGreaterThan(0);
		expect(res.body.total).toBeGreaterThan(0);
	});

	it('GET /notes - should not return other users notes', async () => {
		// Create another user and a note for them
		const otherUser = {
			email: 'isolation-test@example.com',
			password: 'password123',
			name: 'Isolation Tester',
		};
		await request(app.app).post('/users/register').send(otherUser);
		const otherLoginRes = await request(app.app).post('/users/login').send({
			email: otherUser.email,
			password: otherUser.password,
		});
		const otherToken = otherLoginRes.body.jwt;

		await request(app.app)
			.post('/notes')
			.set('Authorization', `Bearer ${otherToken}`)
			.send({ title: 'Other Note', content: 'Secret' });

		// Fetch notes with original user token
		const res = await request(app.app)
			.get('/notes')
			.set('Authorization', `Bearer ${token}`);

		expect(res.statusCode).toBe(200);
		// Should not contain "Other Note"
		const otherNote = res.body.notes.find((n: any) => n.title === 'Other Note');
		expect(otherNote).toBeUndefined();

		// Cleanup
		await prisma.client.noteModel.deleteMany({
			where: { user: { email: otherUser.email } },
		});
		await prisma.client.userModel.deleteMany({
			where: { email: otherUser.email },
		});
	});

	it('GET /notes/:id - should return a single note', async () => {
		const res = await request(app.app)
			.get(`/notes/${noteId}`)
			.set('Authorization', `Bearer ${token}`);

		expect(res.statusCode).toBe(200);
		expect(res.body.id).toBe(noteId);
		expect(res.body.title).toBe('Integration Test Note');
	});

	it('PATCH /notes/:id - should update a note', async () => {
		const res = await request(app.app)
			.patch(`/notes/${noteId}`)
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Updated Integration Title',
			});

		expect(res.statusCode).toBe(200);
		expect(res.body.title).toBe('Updated Integration Title');
	});

	it('DELETE /notes/:id - should delete a note', async () => {
		const res = await request(app.app)
			.delete(`/notes/${noteId}`)
			.set('Authorization', `Bearer ${token}`);

		expect(res.statusCode).toBe(204);

		// Verify deletion
		const verifyRes = await request(app.app)
			.get(`/notes/${noteId}`)
			.set('Authorization', `Bearer ${token}`);
		expect(verifyRes.statusCode).toBe(404);
	});

	it('should return 401 if no token provided', async () => {
		const res = await request(app.app).get('/notes');
		expect(res.statusCode).toBe(401);
	});

	it('should return 403 if trying to access another users note', async () => {
		const otherUser = {
			email: 'other@example.com',
			password: 'password123',
			name: 'Other User',
		};

		// Setup other user
		await prisma.client.noteModel.deleteMany({
			where: { user: { email: otherUser.email } },
		});
		await prisma.client.userModel.deleteMany({
			where: { email: otherUser.email },
		});

		await request(app.app).post('/users/register').send(otherUser);
		const otherLoginRes = await request(app.app).post('/users/login').send({
			email: otherUser.email,
			password: otherUser.password,
		});
		const otherToken = otherLoginRes.body.jwt;

		// Create a note by the first user
		const noteRes = await request(app.app)
			.post('/notes')
			.set('Authorization', `Bearer ${token}`)
			.send({ title: 'Private Note', content: 'Secret' });
		const privateNoteId = noteRes.body.id;

		// Try to access it with the other user's token
		const res = await request(app.app)
			.get(`/notes/${privateNoteId}`)
			.set('Authorization', `Bearer ${otherToken}`);

		expect(res.statusCode).toBe(403);

		// Cleanup other user
		await prisma.client.noteModel.deleteMany({
			where: { user: { email: otherUser.email } },
		});
		await prisma.client.userModel.deleteMany({
			where: { email: otherUser.email },
		});
	});
});
