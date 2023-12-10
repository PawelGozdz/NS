import { Command } from '@libs/cqrs';

export class UpdateUserCommand extends Command<UpdateUserCommand, void> {
	id: string;
	email?: string;
	hash?: string;
	hashedRt?: string | null;
	roleId?: string;

	constructor(command: UpdateUserCommand) {
		super(command);

		Object.assign(this, command);
	}
}
