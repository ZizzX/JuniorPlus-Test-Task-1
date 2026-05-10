/// <reference types="jest" />
import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from '../../src/common/inject.constants';
import { IUserService } from '../../src/users/user.service.interface';
import { ILogger } from '../../src/logger/logger.interface';
import { UserController } from '../../src/users/user.controller';
import { User } from '../../src/users/user.entity';
import express, { Express, Request, Response, NextFunction } from 'express';
import request from 'supertest';
import { json } from 'body-parser';
import { IConfigService } from '../../src/config/config.service.interface';

describe('UserController', () => {
	let app: Express;
	let userService: jest.Mocked<IUserService>;
	let logger: jest.Mocked<ILogger>;
	let configService: jest.Mocked<IConfigService>;

	const mockUser = new User('test@test.com', 'Test', { id: '1' });

	beforeEach(() => {
		const container = new Container();

		userService = {
			createUser: jest.fn(),
			validateUser: jest.fn(),
			getUserInfo: jest.fn(),
		};
		logger = {
			info: jest.fn(),
			warn: jest.fn(),
			error: jest.fn(),
		} as any;
		configService = {
			get: jest.fn(),
		} as any;

		container.bind<UserController>(TYPES.UserController).to(UserController);
		container.bind<IUserService>(TYPES.UserService).toConstantValue(userService);
		container.bind<ILogger>(TYPES.LoggerService).toConstantValue(logger);
		container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(configService);

		const controller = container.get<UserController>(TYPES.UserController);

		app = express();
		app.use(json());
		app.use('/users', controller.getRouter());

		configService.get.mockReturnValue('secret');
	});

	it('POST /users/register - success', async () => {
		userService.createUser.mockResolvedValue(mockUser);
		const res = await request(app)
			.post('/users/register')
			.send({ email: 'test@test.com', name: 'Test', password: 'password' });

		expect(res.status).toBe(201);
		expect(res.body.email).toBe('test@test.com');
	});

	it('POST /users/login - success', async () => {
		userService.validateUser.mockResolvedValue(true);
		userService.getUserInfo.mockResolvedValue(mockUser);
		const res = await request(app)
			.post('/users/login')
			.send({ email: 'test@test.com', password: 'password' });

		expect(res.status).toBe(200);
		expect(res.body.jwt).toBeDefined();
	});

	it('GET /users/info - success', async () => {
		userService.getUserInfo.mockResolvedValue(mockUser);

		// Setup app with AuthMiddleware simulation for this test
		const controller = new UserController(logger, userService, configService);
		const authApp = express();
		authApp.use(json());
		authApp.use((req, res, next) => {
			(req as any).userEmail = 'test@test.com';
			next();
		});
		authApp.use('/users', controller.getRouter());

		const res = await request(authApp).get('/users/info');
		expect(res.status).toBe(200);
		expect(res.body.email).toBe('test@test.com');
	});
});
