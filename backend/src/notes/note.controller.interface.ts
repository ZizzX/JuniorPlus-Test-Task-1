import { NextFunction, Request, Response } from 'express';

export interface INoteController {
	createNote(req: Request, res: Response, next: NextFunction): Promise<void>;
	getNotesByUser(req: Request, res: Response, next: NextFunction): Promise<void>;
	getNoteById(req: Request, res: Response, next: NextFunction): Promise<void>;
	updateNote(req: Request, res: Response, next: NextFunction): Promise<void>;
	deleteNote(req: Request, res: Response, next: NextFunction): Promise<void>;
}
