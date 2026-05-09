import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller';
import { TYPES } from '../common/inject.constants';
import { ValidateMiddleware } from '../common/validate.middleware';
import { ILogger } from '../logger/logger.interface';
import { UserLoginDto, UserRegisterDto } from './user.dto';
import { IUserController } from './user.controller.interface';
import { IUserService } from './user.service.interface';
import { HttpError } from '../exception-filter/http-error.class';
import { sign } from 'jsonwebtoken';
import { IConfigService } from '../config/config.service.interface';
import { AuthGuard } from '../common/auth.guard';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.LoggerService) logger: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
		@inject(TYPES.ConfigService) private configService: IConfigService
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
			{
				method: 'get',
				path: '/info',
				handler: this.info,
				middlewares: [new AuthGuard()],
			},
		]);
	}

	public async registerUser(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const { email, name, password } = req.body;
		const user = await this.userService.createUser(email, name, password);
		if (!user) {
			return next(
				new HttpError(422, 'Такой пользователь уже существует', 'register')
			);
		}

		this.created(res, {
			email: user.email,
			name: user.name,
			id: user.id,
		});
	}

	public async loginUser(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const isValid = await this.userService.validateUser(
			body.email,
			body.password
		);

		if (!isValid) {
			return next(new HttpError(401, 'Ошибка авторизации', 'login'));
		}

		const user = await this.userService.getUserInfo(body.email);
		if (!user) {
			return next(new HttpError(401, 'Пользователь не найден', 'login'));
		}

		const jwt = await this.signJWT(
			user.email,
			this.configService.get('SECRET')
		);

		this.ok(res, {
			jwt,
			user: {
				email: user.email,
				name: user.name,
				id: user.id,
			},
		});
	}

	public async info(
		{ userEmail }: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const userInfo = await this.userService.getUserInfo(userEmail);
		this.ok(res, {
			id: userInfo?.id,
			email: userInfo?.email,
			name: userInfo?.name,
		});
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						reject(err);
					}
					resolve(token as string);
				}
			);
		});
	}
}
