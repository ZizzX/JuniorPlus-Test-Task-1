import 'reflect-metadata';
import { NoteService } from '../../src/notes/note.service';
import { INoteRepository } from '../../src/notes/note.repository.interface';
import { Note } from '../../src/notes/note.entity';
import { HttpError } from '../../src/exception-filter/http-error.class';

describe('NoteService', () => {
	let service: NoteService;
	let repository: jest.Mocked<INoteRepository>;

	const mockNote = new Note(
		'1',
		'Test Title',
		'Test Content',
		'user-1',
		new Date(),
		new Date()
	);

	beforeEach(() => {
		repository = {
			create: jest.fn(),
			findById: jest.fn(),
			findByUserId: jest.fn(),
			findByUserIdCount: jest.fn(),
			update: jest.fn(),
			delete: jest.fn(),
		};
		service = new NoteService(repository);
		jest.clearAllMocks();
	});

	it('createNote() should call repository.create', async () => {
		repository.create.mockResolvedValue(mockNote);
		const result = await service.createNote('user-1', {
			title: 'Test',
			content: 'Content',
		});
		expect(repository.create).toHaveBeenCalledWith('user-1', 'Test', 'Content');
		expect(result).toBe(mockNote);
	});

	it('getNotesByUser() should return notes and total', async () => {
		repository.findByUserId.mockResolvedValue([mockNote]);
		repository.findByUserIdCount.mockResolvedValue(1);

		const result = await service.getNotesByUser('user-1', 1, 10);
		expect(repository.findByUserId).toHaveBeenCalledWith('user-1', 0, 10);
		expect(result).toEqual({ notes: [mockNote], total: 1 });
	});

	it('getNoteById() should return note if found and user is owner', async () => {
		repository.findById.mockResolvedValue(mockNote);
		const result = await service.getNoteById('1', 'user-1');
		expect(result).toBe(mockNote);
	});

	it('getNoteById() should throw 404 if not found', async () => {
		repository.findById.mockResolvedValue(null);
		await expect(service.getNoteById('1', 'user-1')).rejects.toThrow(HttpError);
		try {
			await service.getNoteById('1', 'user-1');
		} catch (e: any) {
			expect(e.statusCode).toBe(404);
		}
	});

	it('getNoteById() should throw 403 if user is not owner', async () => {
		repository.findById.mockResolvedValue(mockNote);
		await expect(service.getNoteById('1', 'user-2')).rejects.toThrow(HttpError);
		try {
			await service.getNoteById('1', 'user-2');
		} catch (e: any) {
			expect(e.statusCode).toBe(403);
		}
	});

	it('updateNote() should check ownership and update', async () => {
		repository.findById.mockResolvedValue(mockNote);
		repository.update.mockResolvedValue({
			...mockNote,
			title: 'Updated',
		} as Note);

		const result = await service.updateNote('1', 'user-1', {
			title: 'Updated',
		});
		expect(repository.update).toHaveBeenCalledWith('1', 'Updated', undefined);
		expect(result.title).toBe('Updated');
	});

	it('deleteNote() should check ownership and delete', async () => {
		repository.findById.mockResolvedValue(mockNote);
		await service.deleteNote('1', 'user-1');
		expect(repository.delete).toHaveBeenCalledWith('1');
	});
});
