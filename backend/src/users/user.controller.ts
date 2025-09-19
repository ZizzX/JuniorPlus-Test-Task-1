import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller';
import { TYPES } from '../common/inject.constants';
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
			},
			{
				method: 'post',
				path: '/login',
				handler: this.loginUser,
			},
		]);
	}

	public registerUser(
		req: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: () => void
	) {
		const { email, name, password } = req.body;
		const user = this.userService.createUser(email, name, password);
		if (!user) {
			this.logger.error('User creation failed', {
				user,
				requestId: (req as any).id,
			});
			this.internalError(res, 'User creation failed');
			return;
		}

		this.logger.info('User registered successfully', {
			user,
			requestId: (req as any).id,
		});
		this.created(res, { user, requestId: (req as any).id });
	}

	public loginUser(
		req: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: () => void
	) {
		this.logger.info('Logging in user', { requestId: (req as any).id });
		this.ok(res, { user: {}, requestId: (req as any).id });
	}
}
