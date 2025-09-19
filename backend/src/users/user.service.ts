import { inject, injectable } from 'inversify';
import { TYPES } from '../common/inject.constants';
import { ILogger } from '../logger/logger.interface';
import { User } from './user.entity';
import { IUserService } from './user.service.interface';

@injectable()
export class UserService implements IUserService {
	constructor(@inject(TYPES.LoggerService) private logger: ILogger) {}
	async createUser(
		email: string,
		name: string,
		password: string
	): Promise<User | null> {
		const newUser = new User(email, name);
		newUser.setPassword(password);
		if (!newUser.id) {
			this.logger.error('User ID is not defined');
			return null;
		}
		this.logger.info(`User created with ID: ${newUser.id}`);
		return newUser;
	}

	async validateUser(email: string, password: string): Promise<boolean> {
		return true;
	}
}
