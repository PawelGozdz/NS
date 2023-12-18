import { Command } from '@libs/cqrs';

export class CreateUserCommand extends Command<CreateUserCommand, CreateUserResponse> {
	email: string;
	hash: string;
	hashedRt: string | null;
	roleId: string;

	constructor(command: CreateUserCommand) {
		super(command);

		Object.assign(this, command);
	}
}

export type CreateUserResponse = {
	id: string;
};
