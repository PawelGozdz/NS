import { CategoryGlobalDto } from '@app/core';
import { Command } from '@libs/cqrs';
import { PickType } from '@nestjs/swagger';

export class CreateCategoryCommand extends Command<CreateCategoryCommand, CreateCategoryResponseDto> {
	name: string;

	description?: string;

	parentId?: number;

	ctx: string;

	constructor(command: CreateCategoryCommand) {
		super(command);

		Object.assign(this, command);
	}
}

export class CreateCategoryResponseDto extends PickType(CategoryGlobalDto, ['id']) {}
