import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'Неверный формат email' })
	email!: string;

	@IsString({ message: 'Пароль обязателен' })
	password!: string;
}
