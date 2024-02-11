import { IUpdateProfile } from '@app/core';
import { Command } from '@libs/cqrs';

export class UpdateUserCommand extends Command<UpdateUserCommand, void> {
	id: string;
	email?: string;
	profile?: IUpdateProfile;

	constructor(command: UpdateUserCommand) {
		super(command);

		Object.assign(this, command);
	}
}
