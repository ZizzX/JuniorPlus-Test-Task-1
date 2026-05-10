/// <reference types="jest" />
import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from '../../src/common/inject.constants';
import { INoteService } from '../../src/notes/note.service.interface';
import { IUserService } from '../../src/users/user.service.interface';
import { ILogger } from '../../src/logger/logger.interface';
import { NoteController } from '../../src/notes/note.controller';
import { Note } from '../../src/notes/note.entity';
import express, { Express, Request, Response, NextFunction } from 'express';
import request from 'supertest';
import { json } from 'body-parser';
import { HttpError } from '../../src/exception-filter/http-error.class';

describe('NoteController', () => {
	let app: Express;
	let noteService: jest.Mocked<INoteService>;
	let userService: jest.Mocked<IUserService>;
	let logger: jest.Mocked<ILogger>;

	const mockNote = new Note(
		'1',
		'Test Title',
		'Test Content',
		'user-1',
		new Date(),
		new Date()
	);

	beforeEach(() => {
		const container = new Container();

		noteService = {
			createNote: jest.fn(),
			getNotesByUser: jest.fn(),
			getNoteById: jest.fn(),
			updateNote: jest.fn(),
			deleteNote: jest.fn(),
		};
		userService = {
			getUserInfo: jest.fn(),
			createUser: jest.fn(),
			validateUser: jest.fn(),
		};
		logger = {
			info: jest.fn(),
			warn: jest.fn(),
			error: jest.fn(),
		} as any;

		container.bind<NoteController>(TYPES.NoteController).to(NoteController);
		container
			.bind<INoteService>(TYPES.NoteService)
			.toConstantValue(noteService);
		container
			.bind<IUserService>(TYPES.UserService)
			.toConstantValue(userService);
		container.bind<ILogger>(TYPES.LoggerService).toConstantValue(logger);

		const controller = container.get<NoteController>(TYPES.NoteController);

		app = express();
		app.use(json());
		// Simulate AuthMiddleware
		app.use((req: Request, res: Response, next: NextFunction) => {
			(req as any).userEmail = 'test@test.com';
			next();
		});
		app.use('/notes', controller.getRouter());

		// Error handling for tests to catch HttpError and return status codes
		app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
			if (err instanceof HttpError) {
				res.status(err.statusCode).json({ error: err.message });
			} else {
				res.status(500).json({ error: err.message });
			}
		});

		userService.getUserInfo.mockResolvedValue({
			id: 'user-1',
			email: 'test@test.com',
		} as any);
	});

	it('POST /notes - success', async () => {
		noteService.createNote.mockResolvedValue(mockNote);
		const res = await request(app)
			.post('/notes')
			.send({ title: 'Test Title', content: 'Test Content' });

		expect(res.status).toBe(201);
		expect(res.body.id).toBe(mockNote.id);
		expect(noteService.createNote).toHaveBeenCalledWith('user-1', {
			title: 'Test Title',
			content: 'Test Content',
		});
	});

	it('POST /notes - validation failure (empty title)', async () => {
		const res = await request(app)
			.post('/notes')
			.send({ title: '', content: 'Test Content' });

		expect(res.status).toBe(422);
		expect(res.body.errors).toBeDefined();
	});

	it('GET /notes - success with pagination', async () => {
		noteService.getNotesByUser.mockResolvedValue({
			notes: [mockNote],
			total: 1,
		});
		const res = await request(app).get('/notes?page=1&limit=5');

		expect(res.status).toBe(200);
		expect(res.body.notes).toHaveLength(1);
		expect(res.body.total).toBe(1);
		expect(res.body.page).toBe(1);
		expect(res.body.limit).toBe(5);
		expect(noteService.getNotesByUser).toHaveBeenCalledWith('user-1', 1, 5);
	});

	it('GET /notes/:id - success', async () => {
		noteService.getNoteById.mockResolvedValue(mockNote);
		const res = await request(app).get('/notes/1');

		expect(res.status).toBe(200);
		expect(res.body.id).toBe(mockNote.id);
		expect(noteService.getNoteById).toHaveBeenCalledWith('1', 'user-1');
	});

	it('GET /notes/:id - not found', async () => {
		noteService.getNoteById.mockRejectedValue(new HttpError(404, 'Not Found'));
		const res = await request(app).get('/notes/999');

		expect(res.status).toBe(404);
		expect(res.body.error).toBe('Not Found');
	});

	it('PATCH /notes/:id - success', async () => {
		const updatedNote = { ...mockNote, title: 'Updated' } as Note;
		noteService.updateNote.mockResolvedValue(updatedNote);
		const res = await request(app).patch('/notes/1').send({ title: 'Updated' });

		expect(res.status).toBe(200);
		expect(res.body.title).toBe('Updated');
		expect(noteService.updateNote).toHaveBeenCalledWith('1', 'user-1', {
			title: 'Updated',
		});
	});

	it('DELETE /notes/:id - success', async () => {
		noteService.deleteNote.mockResolvedValue(undefined);
		const res = await request(app).delete('/notes/1');

		expect(res.status).toBe(204);
		expect(noteService.deleteNote).toHaveBeenCalledWith('1', 'user-1');
	});

	it('all routes - unauthorized if user not found in database', async () => {
		userService.getUserInfo.mockResolvedValue(null);
		const res = await request(app).get('/notes');
		expect(res.status).toBe(401);
		expect(res.body.error).toBe('User not found');
	});
});
