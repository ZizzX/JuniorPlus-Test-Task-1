import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { inject, injectable } from 'inversify';
import { TYPES } from '../common/inject.constants';
import { ILogger } from '../logger/logger.interface';
import { IConfigService } from './config.service.interface';

@injectable()
export class ConfigService implements IConfigService {
	private readonly config: DotenvParseOutput;

	constructor(@inject(TYPES.LoggerService) private logger: ILogger) {
		const result: DotenvConfigOutput = config();
		if (result.error) {
			this.logger.error(
				`[ConfigService] Файл .env не найден, используются переменные окружения.`
			);
			// В критических системах здесь можно выбросить ошибку: throw new Error('Missing .env file');
			this.config = process.env as DotenvParseOutput; // Fallback на переменные окружения системы
		} else {
			this.logger.info('[ConfigService] Конфигурация .env загружена');
			this.config = result.parsed ?? (process.env as DotenvParseOutput); // Используем parsed, если он есть, иначе fallback на process.env
		}
	}

	get<T extends string | number>(key: string): T {
		const value = this.config[key] || process.env[key];
		if (!value) {
			this.logger.warn(
				`[ConfigService] Ключ "${key}" не найден в конфигурации`
			);
		}
		return value as T;
	}
}
