import { inject, injectable } from 'inversify';
import { TYPES } from '../common/inject.constants';
import { IConfigService } from '../config/config.service.interface';
import { ILogger } from '../logger/logger.interface';
import { User } from './user.entity';
import { IUserService } from './user.service.interface';
import { IUserRepository } from './user.repository.interface';

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
	): Promise<User | null> {
		const existedUser = await this.userRepository.find(email);
		if (existedUser) {
			this.logger.warn(
				`[UserService] Пользователь с email ${email} уже существует`
			);
			return null;
		}

		const newUser = new User(email, name);
		const salt = Number(this.configService.get('SALT')) || 10;
		await newUser.setPassword(password, salt);

		const createdUser = await this.userRepository.create(newUser);
		this.logger.info(
			`[UserService] Пользователь с email ${email} успешно создан`
		);

		return createdUser;
	}

	async validateUser(email: string, password: string): Promise<boolean> {
		const existedUser = await this.userRepository.find(email);
		if (!existedUser) {
			return false;
		}

		return existedUser.comparePassword(password);
	}

	async getUserInfo(email: string): Promise<User | null> {
		return this.userRepository.find(email);
	}
}
