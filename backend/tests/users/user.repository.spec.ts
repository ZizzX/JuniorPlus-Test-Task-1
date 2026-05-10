/// <reference types="jest" />
import 'reflect-metadata';
import { UserRepository } from '../../src/users/user.repository';
import { PrismaService } from '../../src/database/prisma.service';
import { User } from '../../src/users/user.entity';

describe('UserRepository', () => {
	let repository: UserRepository;
	let prismaService: PrismaService;

	const mockPrisma = {
		userModel: {
			create: jest.fn(),
			findFirst: jest.fn(),
			findUnique: jest.fn(),
		},
	};

	beforeEach(() => {
		prismaService = { client: mockPrisma } as unknown as PrismaService;
		repository = new UserRepository(prismaService);
		jest.clearAllMocks();
	});

	const mockUserModel = {
		id: '1',
		email: 'test@test.com',
		name: 'Test',
		passwordHash: 'hashed',
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	it('create() should call prisma.userModel.create and return User entity', async () => {
		mockPrisma.userModel.create.mockResolvedValue(mockUserModel);
		const user = new User('test@test.com', 'Test');
		const result = await repository.create(user);

		expect(mockPrisma.userModel.create).toHaveBeenCalled();
		expect(result).toBeInstanceOf(User);
		expect(result.email).toBe(mockUserModel.email);
		expect(result.getPassword()).toBe(mockUserModel.passwordHash);
	});

	it('find() should return User entity if found', async () => {
		mockPrisma.userModel.findFirst.mockResolvedValue(mockUserModel);
		const result = await repository.find('test@test.com');

		expect(mockPrisma.userModel.findFirst).toHaveBeenCalledWith({
			where: { email: 'test@test.com' },
		});
		expect(result).toBeInstanceOf(User);
		expect(result?.email).toBe(mockUserModel.email);
	});

	it('findById() should return User entity if found', async () => {
		mockPrisma.userModel.findUnique.mockResolvedValue(mockUserModel);
		const result = await repository.findById('1');

		expect(mockPrisma.userModel.findUnique).toHaveBeenCalledWith({
			where: { id: '1' },
		});
		expect(result).toBeInstanceOf(User);
		expect(result?.id).toBe(mockUserModel.id);
	});
});
