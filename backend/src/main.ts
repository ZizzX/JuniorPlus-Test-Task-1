import { Container } from 'inversify';
import { App } from './app';
import { TYPES } from './common/inject.constants';
import { containerModule } from './common/inject.container-module';

async function bootstrap() {
	const container = new Container();
	container.load(containerModule);

	const app = container.get<App>(TYPES.Application);
	await app.init();
}

bootstrap();
