import { UserModel } from '../generated/prisma/client';

export interface IUserService {
	createUser(
		email: string,
		name: string,
		password: string
	): Promise<UserModel | null>;
	validateUser(email: string, password: string): Promise<boolean>;
	getUserInfo(email: string): Promise<UserModel | null>;
}
