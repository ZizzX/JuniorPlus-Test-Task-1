import { IsEmail, IsString, MinLength } from 'class-validator';

export class UserRegisterDto {
	@IsEmail({}, { message: 'Неверный формат email' })
	email!: string;

	@IsString({ message: 'Пароль должен быть строкой' })
	@MinLength(6, { message: 'Пароль должен быть не менее 6 символов' })
	password!: string;

	@IsString({ message: 'Имя должно быть строкой' })
	name!: string;
}

export class UserLoginDto {
	@IsEmail({}, { message: 'Неверный формат email' })
	email!: string;

	@IsString({ message: 'Пароль обязателен' })
	password!: string;
}
