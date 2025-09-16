import { Router, Request, Response } from 'express';
import { ILogger } from '../logger/logger.interface';

export class UserRouter {
	private router: Router;
	private logger: ILogger;

	constructor(logger: ILogger) {
		this.logger = logger;
		this.router = Router();
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get('/', (req: Request, res: Response) => {
			this.logger.info('Fetching users', { requestId: (req as any).id });
			res.json({ users: [], requestId: (req as any).id });
		});
	}

	getRouter(): Router {
		return this.router;
	}
}
