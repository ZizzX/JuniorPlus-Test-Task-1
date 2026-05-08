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

	async create({ email, passwordHash, name }: User): Promise<UserModel> {
		return this.prismaService.client.userModel.create({
			data: {
				email,
				passwordHash,
				name,
			},
		});
	}

	async find(email: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findFirst({
			where: {
				email,
			},
		});
	}
}
