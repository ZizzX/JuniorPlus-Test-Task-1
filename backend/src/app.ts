import { randomUUID } from 'crypto';
import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import pinoHttp from 'pino-http';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { TYPES } from './common/inject.constants';
import { IConfigService } from './config/config.service.interface';
import { IExceptionFilter } from './exception-filter/exception.filter.interface';
import { ILogger } from './logger/logger.interface';
import { IUserController } from './users/user.controller.interface';
import { PrismaService } from './database/prisma.service';
import { IMiddleware } from './common/middleware.interface';
import { setupSwagger } from './common/swagger.config';

@injectable()
export class App {
	private port: number;
	private logger: ILogger;
	app: Express;
	server!: Server;
	private userController: IUserController;
	private exceptionFilter: IExceptionFilter;
	private configService: IConfigService;

	constructor(
		@inject(TYPES.LoggerService) logger: ILogger,
		@inject(TYPES.UserController) userController: IUserController,
		@inject(TYPES.ExceptionFilter) exceptionFilter: IExceptionFilter,
		@inject(TYPES.ConfigService) configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
		@inject(TYPES.AuthMiddleware) private authMiddleware: IMiddleware
	) {
		this.app = express();
		this.logger = logger;
		this.userController = userController;
		this.exceptionFilter = exceptionFilter;
		this.configService = configService;
		this.prismaService = prismaService;
		this.port = Number(this.configService.get('PORT')) || 3000;
	}

	useMiddleware() {
		this.app.use(helmet());
		this.app.use(cors());
		this.app.use(
			rateLimit({
				windowMs: 15 * 60 * 1000,
				limit: 100,
				standardHeaders: 'draft-7',
				legacyHeaders: false,
				message: 'Too many requests from this IP, please try again after 15 minutes',
			})
		);

		this.app.use(express.json());
		this.app.use(this.authMiddleware.execute.bind(this.authMiddleware));
	}

	useRoutes() {
		this.app.get('/health', (req, res) => {
			res.status(200).json({
				status: 'ok',
				uptime: process.uptime(),
				timestamp: new Date().toISOString(),
			});
		});
		this.app.use('/users', this.userController.getRouter());
		setupSwagger(this.app);
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
				serializers: {
					req: req => ({
						id: req.id,
						method: req.method,
						url: req.url,
						body: req.method !== 'GET' ? req.body : undefined,
					}),
					res: res => ({
						statusCode: res.statusCode,
					}),
					err: err => ({
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

	private async setupGracefulShutdown() {
		const shutdown = async (signal: string) => {
			this.logger.info(`Received ${signal}. Shutting down gracefully...`);

			if (this.server) {
				this.server.close(async () => {
					this.logger.info('HTTP server closed.');
					await this.prismaService.disconnect();
					this.logger.info('Database connection closed.');
					process.exit(0);
				});
			} else {
				await this.prismaService.disconnect();
				process.exit(0);
			}

			setTimeout(() => {
				this.logger.error('Could not close connections in time, forcefully shutting down');
				process.exit(1);
			}, 10000);
		};

		process.on('SIGTERM', () => shutdown('SIGTERM'));
		process.on('SIGINT', () => shutdown('SIGINT'));
	}

	public async init() {
		this.useMiddleware();
		this.useLogger();
		this.useRoutes();
		this.useExceptionFilters();

		await this.prismaService.connect();
		
		// If already in test mode, we might not want to start the actual listener if supertest handles it
		// but typically we need it for init to be complete. 
		// Supertest can take the express instance directly, but this.server needs to be populated.
		this.server = this.app.listen(this.port, () => {
			this.logger.info(`Server is running on http://localhost:${this.port}`);
		});

		await this.setupGracefulShutdown();
	}
}
