export interface IUser {
	id: string;
	email: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
	setPassword(password: string, salt: number): void;
	getPassword(): string;
}
