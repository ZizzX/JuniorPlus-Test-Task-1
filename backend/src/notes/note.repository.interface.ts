import { Note } from './note.entity';

export interface INoteRepository {
	create(userId: string, title: string, content: string): Promise<Note>;
	findById(id: string): Promise<Note | null>;
	findByUserId(userId: string, skip: number, take: number): Promise<Note[]>;
	findByUserIdCount(userId: string): Promise<number>;
	update(id: string, title?: string, content?: string): Promise<Note>;
	delete(id: string): Promise<void>;
}
