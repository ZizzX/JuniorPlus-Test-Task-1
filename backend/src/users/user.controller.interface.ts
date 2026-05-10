import { NextFunction, Request, Response, Router } from 'express';
import { UserLoginDto, UserRegisterDto } from './dto';

export interface IUserController {
	getRouter(): Router;
	registerUser(
		req: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction
	): Promise<void> | void;
	loginUser(
		req: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction
	): Promise<void> | void;
	info(req: Request, res: Response, next: NextFunction): Promise<void> | void;
}
