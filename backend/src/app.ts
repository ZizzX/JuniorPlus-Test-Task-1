import express, { Express, Request, Response, NextFunction } from 'express';
import { Server } from 'http';
import { userRouter } from './users/user.router';
import pinoHttp from 'pino-http';
import { logger } from './logger/logger.service';
import { randomUUID } from 'crypto';
import onHeaders from 'on-headers';

export class App {
    port: number;
    app: Express;
    server!: Server;

    constructor() {
        this.app = express();
        this.port = Number(process.env.PORT) || 3000;
    }

    useRoutes() {
        this.app.use('/users', userRouter);
    }

    useLogger() {
        this.app.use(
            pinoHttp({
                logger: (logger as any).logger,
                genReqId: (req) => (req.headers['x-request-id'] as string) || randomUUID(),
                customLogLevel: (res, err) => {
                    const code = res.statusCode ?? 200;
                    if (err || code >= 500) return 'error';
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
            logger.info(`Server is running on http://localhost:${this.port}`);
        });
    }
}