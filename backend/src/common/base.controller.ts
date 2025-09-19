import { Router } from 'express';
import { ILogger } from '../logger/logger.interface';
import { IControllerRoute } from './route.interface';

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
			const handler = route.handler.bind(this);
			const middlewares = route.middlewares?.map(m => m.bind(this));
			const pipe = middlewares ? [...middlewares, handler] : handler;
			this.router[route.method](route.path, pipe);
		}
	}

	public getRouter(): Router {
		return this.router;
	}

	public send<T>(res: any, code: number, data: T): void {
		res.type('application/json');
		res.status(code).json(data);
	}

	public ok<T>(res: any, data: T): void {
		this.send<T>(res, 200, data);
	}

	public created<T>(res: any, data: T): void {
		this.send<T>(res, 201, data);
	}

	public clientError(res: any, message?: string): void {
		this.send(res, 400, { message: message ?? 'Bad Request' });
	}

	public unauthorized(res: any, message?: string): void {
		this.send(res, 401, { message: message ?? 'Unauthorized' });
	}

	public forbidden(res: any, message?: string): void {
		this.send(res, 403, { message: message ?? 'Forbidden' });
	}

	public notFound(res: any, message?: string): void {
		this.send(res, 404, { message: message ?? 'Not Found' });
	}

	public conflict(res: any, message?: string): void {
		this.send(res, 409, { message: message ?? 'Conflict' });
	}

	public tooMany(res: any, message?: string): void {
		this.send(res, 429, { message: message ?? 'Too Many Requests' });
	}

	public fail(res: any, message?: string): void {
		this.send(res, 500, { message: message ?? 'Internal Server Error' });
	}
}
