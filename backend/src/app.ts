import express, { Express } from 'express';
import { Server } from 'http';
import { userRouter } from './users/user.router';

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

    public async init() {
        this.useRoutes();
        this.server = this.app.listen(this.port);
        console.log(`Server is running on http://localhost:${this.port}`);
    }
}