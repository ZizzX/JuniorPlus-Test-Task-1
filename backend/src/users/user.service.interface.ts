import { UserModel } from '../generated/prisma/client';
import { User } from './user.entity';

export interface IUserService {
	createUser(
		email: string,
		name: string,
		password: string
	): Promise<UserModel | null>;
	validateUser(email: string, password: string): Promise<boolean>;
}
