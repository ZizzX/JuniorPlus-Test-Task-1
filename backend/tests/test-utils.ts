import { Container } from 'inversify';
import { App } from '../src/app';
import { TYPES } from '../src/common/inject.constants';
import { containerModule } from '../src/common/inject.container-module';
import { IConfigService } from '../src/config/config.service.interface';
import { PrismaService } from '../src/database/prisma.service';

export async function getTestApp() {
	const container = new Container();
	container.load(containerModule);
	
	const app = container.get<App>(TYPES.Application);
	const config = container.get<IConfigService>(TYPES.ConfigService);
	const prisma = container.get<PrismaService>(TYPES.PrismaService);
	
	return { app, config, prisma, container };
}
