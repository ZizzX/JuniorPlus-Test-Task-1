import { IUser } from './user.interface';

export class User implements IUser {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	private password: string = '';

	constructor(
		public email: string,
		public name: string,
		private passwordHash?: string
	) {
		this.id = crypto.randomUUID();
		this.createdAt = new Date();
		this.updatedAt = new Date();

		if (passwordHash) {
			this.password = passwordHash;
		}
	}

	setPassword(password: string): void {
		this.password = password;
		this.updatedAt = new Date();
	}

	getPassword(): string {
		return this.password;
	}
}
