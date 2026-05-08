import { PrismaService } from '../database/prisma.service';
import { UserRepository } from '../users/user.repository';

export const TYPES = {
	LoggerService: Symbol.for('LoggerService'),
	ExceptionFilter: Symbol.for('ExceptionFilter'),
	ConfigService: Symbol.for('ConfigService'),
	UserController: Symbol.for('UserController'),
	Application: Symbol.for('Application'),
	UserService: Symbol.for('UserService'),
	PrismaService: Symbol.for('PrismaService'),
	UserRepository: Symbol.for('UserRepository'),
} as const;
