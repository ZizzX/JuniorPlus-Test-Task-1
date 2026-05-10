import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateNoteDto {
	@IsString()
	@MinLength(1, { message: 'Title must be at least 1 character' })
	@MaxLength(255, { message: 'Title must not exceed 255 characters' })
	title!: string;

	@IsString()
	@MinLength(1, { message: 'Content must be at least 1 character' })
	@MaxLength(10000, { message: 'Content must not exceed 10000 characters' })
	content!: string;
}
