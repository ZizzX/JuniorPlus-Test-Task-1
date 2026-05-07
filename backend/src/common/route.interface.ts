import { NextFunction, Request, Response, Router } from 'express';
import { IMiddleware } from './middleware.interface';

export interface IControllerRoute {
	method: keyof Pick<Router, 'get' | 'post' | 'put' | 'delete' | 'patch'>;
	path: string;
	handler: (req: Request, res: Response, next: NextFunction) => void;
	middlewares?: IMiddleware[];
}
