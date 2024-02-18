import { Command } from '@libs/cqrs';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryCommand extends Command<CreateCategoryCommand, CreateCategoryResponseDto> {
	name: string;
	description?: string;
	parentId?: number;
	context: string;

	constructor(command: CreateCategoryCommand) {
		super(command);

		Object.assign(this, command);
	}
}

export class CreateCategoryResponseDto {
	@ApiProperty({
		example: 'a6185a9f-8873-4f1b-b630-3729318bc600',
	})
	id: number;
}
