import 'reflect-metadata';
import 'class-transformer';
import { Container } from 'inversify';
import { App } from './app';
import { TYPES } from './common/inject.constants';
import { containerModule } from './common/inject.container-module';

async function bootstrap() {
	console.log('[Main] Starting Backend Engine v1.0.1...');
	const container = new Container();
	container.load(containerModule);

	const app = container.get<App>(TYPES.Application);
	await app.init();
}

bootstrap();
