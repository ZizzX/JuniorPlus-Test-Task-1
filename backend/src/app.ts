import express, { Express, Request, Response, NextFunction } from 'express';
import { Server } from 'http';
import { UserRouter } from './users/user.router';
import pinoHttp from 'pino-http';
import { ILogger } from './logger/logger.interface';
import { randomUUID } from 'crypto';

export class App {
	private port: number;
	private logger: ILogger;
	app: Express;
	server!: Server;

	constructor(logger: ILogger) {
		this.app = express();
		this.port = Number(process.env.PORT) || 3000;
		this.logger = logger;
	}

	useRoutes() {
		const userRouter = new UserRouter(this.logger);
		this.app.use('/users', userRouter.getRouter());
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

	public async init() {
		this.useLogger();
		this.useRoutes();
		this.server = this.app.listen(this.port, () => {
			this.logger.info(`Server is running on http://localhost:${this.port}`);
		});
	}
}
