import { NextFunction, Request, Response, Router } from 'express';

export interface IControllerRoute {
	method: keyof Pick<Router, 'get' | 'post' | 'put' | 'delete' | 'patch'>;
	path: string;
	handler: (req: Request, res: Response, next: NextFunction) => void;
	middlewares?: Array<
		(req: Request, res: Response, next: NextFunction) => void
	>;
}
