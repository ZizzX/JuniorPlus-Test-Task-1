export const TYPES = {
	LoggerService: Symbol.for('LoggerService'),
	ExceptionFilter: Symbol.for('ExceptionFilter'),
	ConfigService: Symbol.for('ConfigService'),
	UserController: Symbol.for('UserController'),
	Application: Symbol.for('Application'),
	UserService: Symbol.for('UserService'),
	PrismaService: Symbol.for('PrismaService'),
	UserRepository: Symbol.for('UserRepository'),
	AuthMiddleware: Symbol.for('AuthMiddleware'),
	NoteRepository: Symbol.for('NoteRepository'),
	NoteService: Symbol.for('NoteService'),
	NoteController: Symbol.for('NoteController'),
} as const;
