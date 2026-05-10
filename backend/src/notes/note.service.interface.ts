import { Note } from './note.entity';
import { CreateNoteDto, UpdateNoteDto } from './dto';

export interface INoteService {
	createNote(userId: string, dto: CreateNoteDto): Promise<Note>;
	getNotesByUser(userId: string, page: number, limit: number): Promise<{ notes: Note[]; total: number }>;
	getNoteById(id: string, userId: string): Promise<Note>;
	updateNote(id: string, userId: string, dto: UpdateNoteDto): Promise<Note>;
	deleteNote(id: string, userId: string): Promise<void>;
}
