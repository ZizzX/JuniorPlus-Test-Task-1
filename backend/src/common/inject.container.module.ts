import { ContainerModule } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { ExceptionFilter } from '../exception-filter/exception.filter';
import { IExceptionFilter } from '../exception-filter/exception.filter.interface';
import { LoggerService } from '../logger/logger.service';
import { UserController } from '../users/user.controller';
import { TYPES } from './inject.constants';
import { App } from '../app';

const containerModule = new ContainerModule(({ bind }) => {
	bind<ILogger>(TYPES.LoggerService).to(LoggerService).inSingletonScope();
	bind<IExceptionFilter>(TYPES.ExceptionFilter)
		.to(ExceptionFilter)
		.inSingletonScope();
	bind<UserController>(TYPES.UserController)
		.to(UserController)
		.inSingletonScope();
	bind<App>(TYPES.Application).to(App).inSingletonScope();
});

export { containerModule };
