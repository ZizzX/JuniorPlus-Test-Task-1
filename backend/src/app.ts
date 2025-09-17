import express, { Express } from 'express';
import { Server } from 'http';
import { UserController } from './users/user.controller';
import pinoHttp from 'pino-http';
import { ILogger } from './logger/logger.interface';
import { randomUUID } from 'crypto';
import { IExceptionFilter } from './exception-filter/exception.filter.interface';
import { injectable, inject } from 'inversify';
import { TYPES } from './common/inject.constants';

@injectable()
export class App {
	private port: number;
	private logger: ILogger;
	app: Express;
	server!: Server;
	private UserController: UserController;
	private exceptionFilter: IExceptionFilter;

	constructor(
		@inject(TYPES.LoggerService) logger: ILogger,
		@inject(TYPES.UserController) userController: UserController,
		@inject(TYPES.ExceptionFilter) exceptionFilter: IExceptionFilter
	) {
		this.app = express();
		this.port = Number(process.env.PORT) || 3000;
		this.logger = logger;
		this.UserController = userController;
		this.exceptionFilter = exceptionFilter;
	}

	useRoutes() {
		this.app.use('/users', this.UserController.getRouter());
	}

	useLogger() {
		this.app.use(
			pinoHttp({
				logger: (this.logger as any).logger,
				genReqId: req =>
					(req.headers['x-request-id'] as string) || randomUUID(),
				customLogLevel: res => {
					const code = res.statusCode ?? 200;
					if (code >= 500) return 'error';
					if (code >= 400) return 'warn';
					return 'info';
				},
			})
		);
	}

	useExceptionFilters() {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init() {
		this.useLogger();
		this.useRoutes();
		this.useExceptionFilters();
		this.server = this.app.listen(this.port, () => {
			this.logger.info(`Server is running on http://localhost:${this.port}`);
		});
	}
}
