import { compare, hash } from 'bcryptjs';
import { IUser } from './user.interface';

export class User implements IUser {
	public id: string;
	public createdAt: Date;
	public updatedAt: Date;
	private passwordHash: string = '';

	constructor(
		public email: string,
		public name: string,
		data?: {
			id?: string;
			passwordHash?: string;
			createdAt?: Date;
			updatedAt?: Date;
		}
	) {
		this.id = data?.id || crypto.randomUUID();
		this.createdAt = data?.createdAt || new Date();
		this.updatedAt = data?.updatedAt || new Date();
		this.passwordHash = data?.passwordHash || '';
	}

	public async setPassword(password: string, salt: number): Promise<void> {
		this.passwordHash = await hash(password, salt);
		this.updatedAt = new Date();
	}

	public getPassword(): string {
		return this.passwordHash;
	}

	public async comparePassword(password: string): Promise<boolean> {
		return compare(password, this.passwordHash);
	}
}
