import { inject, injectable } from 'inversify';
import { TYPES } from '../common/inject.constants';
import { Note } from './note.entity';
import { INoteService } from './note.service.interface';
import { INoteRepository } from './note.repository.interface';
import { CreateNoteDto, UpdateNoteDto } from './dto';
import { HttpError } from '../exception-filter/http-error.class';

@injectable()
export class NoteService implements INoteService {
	constructor(
		@inject(TYPES.NoteRepository) private noteRepository: INoteRepository
	) {}

	async createNote(userId: string, { title, content }: CreateNoteDto): Promise<Note> {
		return this.noteRepository.create(userId, title, content);
	}

	async getNotesByUser(userId: string, page: number, limit: number): Promise<{ notes: Note[]; total: number }> {
		const skip = (page - 1) * limit;
		const [notes, total] = await Promise.all([
			this.noteRepository.findByUserId(userId, skip, limit),
			this.noteRepository.findByUserIdCount(userId),
		]);
		return { notes, total };
	}

	async getNoteById(id: string, userId: string): Promise<Note> {
		const note = await this.noteRepository.findById(id);
		if (!note) {
			throw new HttpError(404, 'Note not found', 'NoteService');
		}
		if (note.userId !== userId) {
			throw new HttpError(403, 'Forbidden: You do not own this note', 'NoteService');
		}
		return note;
	}

	async updateNote(id: string, userId: string, dto: UpdateNoteDto): Promise<Note> {
		await this.getNoteById(id, userId); // Validates existence and ownership
		return this.noteRepository.update(id, dto.title, dto.content);
	}

	async deleteNote(id: string, userId: string): Promise<void> {
		await this.getNoteById(id, userId); // Validates existence and ownership
		await this.noteRepository.delete(id);
	}
}
