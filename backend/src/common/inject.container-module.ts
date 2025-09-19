import { ContainerModule } from 'inversify';
import { App } from '../app';
import { ExceptionFilter } from '../exception-filter/exception.filter';
import { IExceptionFilter } from '../exception-filter/exception.filter.interface';
import { ILogger } from '../logger/logger.interface';
import { LoggerService } from '../logger/logger.service';
import { UserController } from '../users/user.controller';
import { IUserController } from '../users/user.controller.interface';
import { UserService } from '../users/user.service';
import { IUserService } from '../users/user.service.interface';
import { TYPES } from './inject.constants';

const containerModule = new ContainerModule(({ bind }) => {
	bind<ILogger>(TYPES.LoggerService).to(LoggerService).inSingletonScope();
	bind<IExceptionFilter>(TYPES.ExceptionFilter)
		.to(ExceptionFilter)
		.inSingletonScope();
	bind<IUserController>(TYPES.UserController)
		.to(UserController)
		.inSingletonScope();
	bind<IUserService>(TYPES.UserService).to(UserService);
	bind<App>(TYPES.Application).to(App).inSingletonScope();
});

export { containerModule };
