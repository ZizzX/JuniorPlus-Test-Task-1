import { randomUUID } from 'crypto';
import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import pinoHttp from 'pino-http';
import { TYPES } from './common/inject.constants';
import { IConfigService } from './config/config.service.interface';
import { IExceptionFilter } from './exception-filter/exception.filter.interface';
import { ILogger } from './logger/logger.interface';
import { IUserController } from './users/user.controller.interface';
import { PrismaService } from './database/prisma.service';

@injectable()
export class App {
	private port: number;
	private logger: ILogger;
	app: Express;
	server!: Server;
	private UserController: IUserController;
	private exceptionFilter: IExceptionFilter;
	private configService: IConfigService;

	constructor(
		@inject(TYPES.LoggerService) logger: ILogger,
		@inject(TYPES.UserController) userController: IUserController,
		@inject(TYPES.ExceptionFilter) exceptionFilter: IExceptionFilter,
		@inject(TYPES.ConfigService) configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService
	) {
		this.app = express();
		this.logger = logger;
		this.UserController = userController;
		this.exceptionFilter = exceptionFilter;
		this.configService = configService;
		this.prismaService = prismaService;
		this.port = Number(this.configService.get('PORT')) || 3000;
	}

	useMiddleware() {
		this.app.use(express.json());
	}

	useRoutes() {
		this.app.use('/users', this.UserController.getRouter());
	}

	useLogger() {
		this.app.use(
			pinoHttp({
				logger: (this.logger as any).logger,
				genReqId: (req) => (req.headers['x-request-id'] as string) || randomUUID(),
				customLogLevel: (res) => {
					const code = res.statusCode ?? 200;
					if (code >= 500) return 'error';
					if (code >= 400) return 'warn';
					return 'info';
				},
				serializers: {
					req: (req) => ({
						id: req.id,
						method: req.method,
						url: req.url,
					}),
					res: (res) => ({
						statusCode: res.statusCode,
					}),
					err: (err) => ({
						type: err.type,
						message: err.message,
						stack: err.stack,
					}),
				},
				customSuccessMessage: (req, res) => {
					return `${req.method} ${req.url} completed with status ${res.statusCode}`;
				},
				customErrorMessage: (req, res) => {
					return `${req.method} ${req.url} failed with status ${res.statusCode}`;
				},
			})
		);
	}

	useExceptionFilters() {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init() {
		this.useMiddleware();
		this.useLogger();
		this.useRoutes();
		this.useExceptionFilters();
		await this.prismaService.connect();
		this.server = this.app.listen(this.port, () => {
			this.logger.info(`Server is running on http://localhost:${this.port}`);
		});
	}
}
