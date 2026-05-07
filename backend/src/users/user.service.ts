import { inject, injectable } from 'inversify';
import { TYPES } from '../common/inject.constants';
import { IConfigService } from '../config/config.service.interface';
import { ILogger } from '../logger/logger.interface';
import { User } from './user.entity';
import { IUserService } from './user.service.interface';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.LoggerService) private logger: ILogger,
		@inject(TYPES.ConfigService) private configService: IConfigService
	) {}

	async createUser(
		email: string,
		name: string,
		password: string
	): Promise<User | null> {
		const newUser = new User(email, name);
		const salt = Number(this.configService.get('SALT')) || 10;
		await newUser.setPassword(password, salt);
		
		this.logger.info(`[UserService] Пользователь ${email} успешно создан`);
		return newUser;
	}

	async validateUser(email: string, password: string): Promise<boolean> {
		// В реальном приложении здесь будет поиск пользователя в БД
		// Для текущей реализации предположим, что мы проверяем пароль
		// этого пользователя (логика будет дополнена при появлении Repository)
		return true;
	}
}
