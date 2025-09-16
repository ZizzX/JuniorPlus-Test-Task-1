import { Router } from 'express';
import { ILogger } from '../logger/logger.interface';

export abstract class BaseController {
	protected logger: ILogger;
	protected router: Router;

	constructor(logger: ILogger) {
		this.logger = logger;
		this.router = Router();
		this.initializeRoutes();
	}

	protected abstract initializeRoutes(): void;

	public getRouter(): Router {
		return this.router;
	}
}
