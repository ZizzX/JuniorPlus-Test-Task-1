import { INote } from './note.interface';

export class Note implements INote {
	constructor(
		public readonly id: string,
		public readonly title: string,
		public readonly content: string,
		public readonly userId: string,
		public readonly createdAt: Date,
		public readonly updatedAt: Date
	) {}
}
