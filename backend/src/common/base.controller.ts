import { Router } from 'express';
import { ILogger } from '../logger/logger.interface';
import { IControllerRoute } from './controller.route.interface';

export abstract class BaseController {
	protected logger: ILogger;
	protected router: Router;

	constructor(logger: ILogger) {
		this.logger = logger;
		this.router = Router();
	}

	protected bindRoutes(routes: IControllerRoute[]): void {
		for (const route of routes) {
			this.logger.info(
				`Binding route ${route.method.toUpperCase()} ${route.path}`
			);
			this.router[route.method](route.path, (req, res, next) => {
				route.handler(req, res, next);
			});
		}
	}

	public getRouter(): Router {
		return this.router;
	}
}
