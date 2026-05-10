/// <reference types="jest" />
import 'reflect-metadata';
import { NoteRepository } from '../../src/notes/note.repository';
import { PrismaService } from '../../src/database/prisma.service';
import { Note } from '../../src/notes/note.entity';

describe('NoteRepository', () => {
	let repository: NoteRepository;
	let prismaService: PrismaService;

	const mockPrisma = {
		noteModel: {
			create: jest.fn(),
			findUnique: jest.fn(),
			findMany: jest.fn(),
			count: jest.fn(),
			update: jest.fn(),
			delete: jest.fn(),
		},
	};

	beforeEach(() => {
		prismaService = { client: mockPrisma } as unknown as PrismaService;
		repository = new NoteRepository(prismaService);
		jest.clearAllMocks();
	});

	const mockNoteModel = {
		id: '1',
		title: 'Test Title',
		content: 'Test Content',
		userId: 'user-1',
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	it('create() should call prisma.noteModel.create and return entity', async () => {
		mockPrisma.noteModel.create.mockResolvedValue(mockNoteModel);
		const result = await repository.create(
			'user-1',
			'Test Title',
			'Test Content'
		);

		expect(mockPrisma.noteModel.create).toHaveBeenCalledWith({
			data: { userId: 'user-1', title: 'Test Title', content: 'Test Content' },
		});
		expect(result).toBeInstanceOf(Note);
		expect(result.id).toBe(mockNoteModel.id);
	});

	it('findById() should return entity if found', async () => {
		mockPrisma.noteModel.findUnique.mockResolvedValue(mockNoteModel);
		const result = await repository.findById('1');

		expect(mockPrisma.noteModel.findUnique).toHaveBeenCalledWith({
			where: { id: '1' },
		});
		expect(result).toBeInstanceOf(Note);
		expect(result?.id).toBe(mockNoteModel.id);
	});

	it('findById() should return null if not found', async () => {
		mockPrisma.noteModel.findUnique.mockResolvedValue(null);
		const result = await repository.findById('2');
		expect(result).toBeNull();
	});

	it('findByUserId() should return entities with pagination', async () => {
		mockPrisma.noteModel.findMany.mockResolvedValue([mockNoteModel]);
		const result = await repository.findByUserId('user-1', 0, 10);

		expect(mockPrisma.noteModel.findMany).toHaveBeenCalledWith({
			where: { userId: 'user-1' },
			skip: 0,
			take: 10,
			orderBy: { createdAt: 'desc' },
		});
		expect(result[0]).toBeInstanceOf(Note);
	});

	it('findByUserIdCount() should call prisma.noteModel.count', async () => {
		mockPrisma.noteModel.count.mockResolvedValue(5);
		const result = await repository.findByUserIdCount('user-1');
		expect(result).toBe(5);
		expect(mockPrisma.noteModel.count).toHaveBeenCalledWith({
			where: { userId: 'user-1' },
		});
	});

	it('update() should call prisma.noteModel.update', async () => {
		mockPrisma.noteModel.update.mockResolvedValue(mockNoteModel);
		const result = await repository.update('1', 'New Title');

		expect(mockPrisma.noteModel.update).toHaveBeenCalledWith({
			where: { id: '1' },
			data: { title: 'New Title', content: undefined },
		});
		expect(result).toBeInstanceOf(Note);
	});

	it('delete() should call prisma.noteModel.delete', async () => {
		await repository.delete('1');
		expect(mockPrisma.noteModel.delete).toHaveBeenCalledWith({
			where: { id: '1' },
		});
	});
});
