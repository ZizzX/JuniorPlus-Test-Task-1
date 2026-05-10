import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller';
import { TYPES } from '../common/inject.constants';
import { ILogger } from '../logger/logger.interface';
import { INoteController } from './note.controller.interface';
import { INoteService } from './note.service.interface';
import { AuthGuard } from '../common/auth.guard';
import { ValidateMiddleware } from '../common/validate.middleware';
import { CreateNoteDto, UpdateNoteDto } from './dto';
import { IUserService } from '../users/user.service.interface';
import { HttpError } from '../exception-filter/http-error.class';

@injectable()
export class NoteController extends BaseController implements INoteController {
	constructor(
		@inject(TYPES.LoggerService) logger: ILogger,
		@inject(TYPES.NoteService) private noteService: INoteService,
		@inject(TYPES.UserService) private userService: IUserService
	) {
		super(logger);

		this.bindRoutes([
			{
				method: 'post',
				path: '/',
				handler: this.createNote,
				middlewares: [new AuthGuard(), new ValidateMiddleware(CreateNoteDto)],
			},
			{
				method: 'get',
				path: '/',
				handler: this.getNotesByUser,
				middlewares: [new AuthGuard()],
			},
			{
				method: 'get',
				path: '/:id',
				handler: this.getNoteById,
				middlewares: [new AuthGuard()],
			},
			{
				method: 'patch',
				path: '/:id',
				handler: this.updateNote,
				middlewares: [new AuthGuard(), new ValidateMiddleware(UpdateNoteDto)],
			},
			{
				method: 'delete',
				path: '/:id',
				handler: this.deleteNote,
				middlewares: [new AuthGuard()],
			},
		]);
	}

	private async getUserId(userEmail: string): Promise<string> {
		const user = await this.userService.getUserInfo(userEmail);
		if (!user) {
			throw new HttpError(401, 'User not found', 'NoteController');
		}
		return user.id;
	}

	public async createNote(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const userId = await this.getUserId(req.userEmail);
			const note = await this.noteService.createNote(userId, req.body);
			this.created(res, note);
		} catch (err) {
			next(err);
		}
	}

	public async getNotesByUser(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const userId = await this.getUserId(req.userEmail);
			const page = Number(req.query.page) || 1;
			const limit = Number(req.query.limit) || 10;
			const result = await this.noteService.getNotesByUser(userId, page, limit);
			this.ok(res, {
				...result,
				page,
				limit,
			});
		} catch (err) {
			next(err);
		}
	}

	public async getNoteById(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const userId = await this.getUserId(req.userEmail);
			const note = await this.noteService.getNoteById(
				req.params.id as string,
				userId
			);
			this.ok(res, note);
		} catch (err) {
			next(err);
		}
	}

	public async updateNote(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const userId = await this.getUserId(req.userEmail);
			const note = await this.noteService.updateNote(
				req.params.id as string,
				userId,
				req.body
			);
			this.ok(res, note);
		} catch (err) {
			next(err);
		}
	}

	public async deleteNote(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const userId = await this.getUserId(req.userEmail);
			await this.noteService.deleteNote(req.params.id as string, userId);
			this.send(res, 204, null);
		} catch (err) {
			next(err);
		}
	}
}
