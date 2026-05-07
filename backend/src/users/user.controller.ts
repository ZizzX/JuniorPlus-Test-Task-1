import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller';
import { TYPES } from '../common/inject.constants';
import { ValidateMiddleware } from '../common/validate.middleware';
import { ILogger } from '../logger/logger.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { IUserController } from './user.controller.interface';
import { IUserService } from './user.service.interface';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.LoggerService) logger: ILogger,
		@inject(TYPES.UserService) private userService: IUserService
	) {
		super(logger);

		this.bindRoutes([
			{
				method: 'post',
				path: '/register',
				handler: this.registerUser,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				method: 'post',
				path: '/login',
				handler: this.loginUser,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
		]);
	}

	public async registerUser(
		req: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const { email, name, password } = req.body;
		const user = await this.userService.createUser(email, name, password);
		if (!user) {
			this.internalError(res, 'User creation failed');
			return;
		}

		this.created(res, { user });
	}

	public loginUser(
		req: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction
	): void {
		this.ok(res, { user: {} });
	}
}
