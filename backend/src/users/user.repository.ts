import { inject, injectable } from 'inversify';
import { TYPES } from '../common/inject.constants';
import { User } from './user.entity';
import { IUserRepository } from './user.repository.interface';
import { UserModel } from '../generated/prisma/client';
import { PrismaService } from '../database/prisma.service';

@injectable()
export class UserRepository implements IUserRepository {
	constructor(
		@inject(TYPES.PrismaService) private prismaService: PrismaService
	) {}

	private mapToEntity(model: UserModel): User {
		return new User(model.email, model.name, {
			id: model.id,
			passwordHash: model.passwordHash,
			createdAt: model.createdAt,
			updatedAt: model.updatedAt,
		});
	}

	async create(user: User): Promise<User> {
		const model = await this.prismaService.client.userModel.create({
			data: {
				email: user.email,
				passwordHash: user.getPassword(),
				name: user.name,
			},
		});
		return this.mapToEntity(model);
	}

	async find(email: string): Promise<User | null> {
		const model = await this.prismaService.client.userModel.findFirst({
			where: {
				email,
			},
		});
		return model ? this.mapToEntity(model) : null;
	}

	async findById(id: string): Promise<User | null> {
		const model = await this.prismaService.client.userModel.findUnique({
			where: {
				id,
			},
		});
		return model ? this.mapToEntity(model) : null;
	}
}
