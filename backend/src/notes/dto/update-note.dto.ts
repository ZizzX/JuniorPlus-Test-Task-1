import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateNoteDto {
	@IsOptional()
	@IsString()
	@MinLength(1, { message: 'Заголовок должен содержать минимум 1 символ' })
	@MaxLength(255, { message: 'Заголовок не должен превышать 255 символов' })
	title?: string;

	@IsOptional()
	@IsString()
	@MinLength(1, { message: 'Содержимое должно содержать минимум 1 символ' })
	@MaxLength(10000, {
		message: 'Содержимое не должно превышать 10000 символов',
	})
	content?: string;
}
