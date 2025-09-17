import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller';
import { TYPES } from '../common/inject.constants';
import { ILogger } from '../logger/logger.interface';

@injectable()
export class UserController extends BaseController {
	constructor(@inject(TYPES.LoggerService) logger: ILogger) {
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
		this.created(res, { user: {}, requestId: (req as any).id });
	}

	private loginUser(req: Request, res: Response, next: () => void) {
		this.logger.info('Logging in user', { requestId: (req as any).id });
		this.ok(res, { user: {}, requestId: (req as any).id });
	}
}
