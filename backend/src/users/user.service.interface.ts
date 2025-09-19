import { User } from './user.entity';

export interface IUserService {
	createUser(
		email: string,
		name: string,
		password: string
	): Promise<User | null>;
	validateUser(email: string, password: string): Promise<boolean>;
}
