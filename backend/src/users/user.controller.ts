import { Router, Request, Response } from 'express';
import { ILogger } from '../logger/logger.interface';
import { BaseController } from '../common/base.controller';

export class UserController extends BaseController {
	constructor(logger: ILogger) {
		super(logger);

		this.bindRoutes([
			{
				method: 'post',
				path: '/register',
				handler: this.registerUser.bind(this),
			},
			{
				method: 'post',
				path: '/login',
				handler: this.loginUser.bind(this),
			},
		]);
	}

	private registerUser(req: Request, res: Response, next: () => void) {
		this.logger.info('Registering user', { requestId: (req as any).id });
		res.json({ user: {}, requestId: (req as any).id });
	}

	private loginUser(req: Request, res: Response, next: () => void) {
		this.logger.info('Logging in user', { requestId: (req as any).id });
		res.json({ user: {}, requestId: (req as any).id });
	}
}
