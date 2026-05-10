import { inject, injectable } from 'inversify';
import { TYPES } from '../common/inject.constants';
import { Note } from './note.entity';
import { INoteRepository } from './note.repository.interface';
import { PrismaService } from '../database/prisma.service';
import { NoteModel } from '../generated/prisma/client';

@injectable()
export class NoteRepository implements INoteRepository {
	constructor(
		@inject(TYPES.PrismaService) private prismaService: PrismaService
	) {}

	private mapToEntity(model: NoteModel): Note {
		return new Note(
			model.id,
			model.title,
			model.content,
			model.userId,
			model.createdAt,
			model.updatedAt
		);
	}

	async create(userId: string, title: string, content: string): Promise<Note> {
		const model = await this.prismaService.client.noteModel.create({
			data: {
				userId,
				title,
				content,
			},
		});
		return this.mapToEntity(model);
	}

	async findById(id: string): Promise<Note | null> {
		const model = await this.prismaService.client.noteModel.findUnique({
			where: { id },
		});
		return model ? this.mapToEntity(model) : null;
	}

	async findByUserId(userId: string, skip: number, take: number): Promise<Note[]> {
		const models = await this.prismaService.client.noteModel.findMany({
			where: { userId },
			skip,
			take,
			orderBy: { createdAt: 'desc' },
		});
		return models.map((model) => this.mapToEntity(model));
	}

	async findByUserIdCount(userId: string): Promise<number> {
		return this.prismaService.client.noteModel.count({
			where: { userId },
		});
	}

	async update(id: string, title?: string, content?: string): Promise<Note> {
		const model = await this.prismaService.client.noteModel.update({
			where: { id },
			data: {
				title,
				content,
			},
		});
		return this.mapToEntity(model);
	}

	async delete(id: string): Promise<void> {
		await this.prismaService.client.noteModel.delete({
			where: { id },
		});
	}
}
