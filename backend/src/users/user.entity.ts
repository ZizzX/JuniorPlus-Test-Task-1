import { compare, hash } from 'bcryptjs';
import { IUser } from './user.interface';

export class User implements IUser {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	passwordHash: string = '';

	constructor(
		public email: string,
		public name: string,
		existingHash?: string
	) {
		this.id = crypto.randomUUID();
		this.createdAt = new Date();
		this.updatedAt = new Date();

		if (existingHash) {
			this.passwordHash = existingHash;
		}
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
