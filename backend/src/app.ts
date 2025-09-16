import express, { Express } from 'express';
import { Server } from 'http';
import { UserController } from './users/user.controller';
import pinoHttp from 'pino-http';
import { ILogger } from './logger/logger.interface';
import { randomUUID } from 'crypto';

export class App {
	private port: number;
	private logger: ILogger;
	app: Express;
	server!: Server;
	private UserController: UserController;

	constructor(logger: ILogger, userController: UserController) {
		this.app = express();
		this.port = Number(process.env.PORT) || 3000;
		this.logger = logger;
		this.UserController = userController;
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
		this.app.use(
			(
				err: Error,
				req: express.Request,
				res: express.Response,
				next: express.NextFunction
			) => {
				this.logger.error(
					`Error on processing request ${req.method} ${req.path}: ${err.message}`
				);
				res.status(500).send({ error: err.message });
			}
		);
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
