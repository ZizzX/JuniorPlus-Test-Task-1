import { NextFunction, Request, Response } from 'express';
import { IMiddleware } from './middleware.interface';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export class ValidateMiddleware implements IMiddleware {
	constructor(private classToValidate: ClassConstructor<object>) {}

	async execute(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const instance = plainToInstance(this.classToValidate, req.body);

		const errors = await validate(instance, {
			validationError: { target: false, value: false },
			whitelist: true,
			forbidNonWhitelisted: true,
		});

		if (errors.length > 0) {
			res.status(422).send({ errors });
		} else {
			next();
		}
	}
}
