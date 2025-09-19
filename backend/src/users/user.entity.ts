import { IUser } from './user.interface';

export class User implements IUser {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	private password: string = '';

	constructor(
		public email: string,
		public name: string
	) {
		this.id = crypto.randomUUID();
		this.createdAt = new Date();
		this.updatedAt = new Date();
	}

	setPassword(password: string) {
		this.password = password;
		this.updatedAt = new Date();
	}

	getPassword() {
		return this.password;
	}
}
