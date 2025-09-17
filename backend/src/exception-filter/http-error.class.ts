export class HttpError extends Error {
	context?: string;
	statusCode: number;

	constructor(statusCode: number, message: string, context?: string) {
		super(message);
		this.statusCode = statusCode;
		this.message = message;
		this.context = context;
	}
}
