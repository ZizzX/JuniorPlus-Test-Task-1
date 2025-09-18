import { Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';

export interface IUserController extends BaseController {
	registerUser(
		req: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: () => void
	): void;
	loginUser(
		req: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: () => void
	): void;
}
