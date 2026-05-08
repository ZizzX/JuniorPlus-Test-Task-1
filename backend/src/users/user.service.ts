import { inject, injectable } from 'inversify';
import { TYPES } from '../common/inject.constants';
import { IConfigService } from '../config/config.service.interface';
import { ILogger } from '../logger/logger.interface';
import { User } from './user.entity';
import { IUserService } from './user.service.interface';
import { IUserRepository } from './user.repository.interface';
import { UserModel } from '../generated/prisma/client';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.LoggerService) private logger: ILogger,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UserRepository) private userRepository: IUserRepository
	) {}

	async createUser(
		email: string,
		name: string,
		password: string
	): Promise<UserModel | null> {
		const existedUser = await this.userRepository.find(email);
		if (existedUser) {
			this.logger.warn(
				`[UserService] Пользователь с email ${email} уже существует`
			);
		}

		const newUser = new User(email, name);
		const salt = Number(this.configService.get('SALT')) || 10;
		await newUser.setPassword(password, salt);

		const createdUser = await this.userRepository.create(newUser);
		this.logger.info(`[UserService] Пользователь ${email} успешно создан`);

		return createdUser;
	}

	async validateUser(email: string, password: string): Promise<boolean> {
		const existedUser = await this.userRepository.find(email);
		if (!existedUser) {
			return false;
		}

		const userEntity = new User(
			existedUser.email,
			existedUser.name,
			existedUser.passwordHash
		);
		return userEntity.comparePassword(password);
	}
}
