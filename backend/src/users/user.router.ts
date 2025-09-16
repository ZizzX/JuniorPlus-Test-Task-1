import { Router, Request, Response } from 'express';
import { ILogger } from '../logger/logger.interface';
import { BaseController } from '../common/base.controller';

export class UserRouter extends BaseController {
	constructor(logger: ILogger) {
		super(logger);
	}

	protected initializeRoutes() {
		this.router.get('/', (req: Request, res: Response) => {
			this.logger.info('Fetching users', { requestId: (req as any).id });
			res.json({ users: [], requestId: (req as any).id });
		});
	}
}
