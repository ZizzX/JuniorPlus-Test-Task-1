import { inject, injectable } from 'inversify';
import { TYPES } from '../common/inject.constants';
import { ILogger } from '../logger/logger.interface';
import { IConfigService } from '../config/config.service.interface';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../generated/prisma/client';

@injectable()
export class PrismaService {
	client: PrismaClient;

	constructor(
		@inject(TYPES.LoggerService) private logger: ILogger,
		@inject(TYPES.ConfigService) private configService: IConfigService
	) {
		const dbUrl = this.configService.get<string>('DATABASE_URL');
		const adapter = new PrismaBetterSqlite3({ url: dbUrl });
		this.client = new PrismaClient({ adapter });
	}

	async connect(): Promise<void> {
		try {
			await this.client.$connect();
			this.logger.info('[PrismaService] Успешно подключились к базе данных');
		} catch (e) {
			if (e instanceof Error) {
				this.logger.error(
					'[PrismaService] Ошибка подключения к БД: ' + e.message
				);
			}
		}
	}

	async disconnect(): Promise<void> {
		await this.client.$disconnect();
	}
}
