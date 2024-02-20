import { IInferredCommandHandler } from '@libs/cqrs';
import { PinoLogger } from 'nestjs-pino';

import { Injectable } from '@nestjs/common';
import { CategoryAlreadyExistsError } from '../../domain';
import { ICategoriesCommandRepository } from '../../domain/caregories/category-command-repository.interface';
import { CreateCategoryCommand, CreateCategoryResponseDto } from './create-category.command';

@Injectable()
export class CreateCategoryHandler implements IInferredCommandHandler<CreateCategoryCommand> {
	constructor(
		private readonly categoryCommandRepository: ICategoriesCommandRepository,
		private readonly logger: PinoLogger,
	) {
		this.logger.setContext(this.constructor.name);
	}

	async execute(command: CreateCategoryCommand): Promise<CreateCategoryResponseDto> {
		this.logger.info(command, 'Creating category:');

		const currentEntity = await this.categoryCommandRepository.getOneByNameAndContext(command.name, command.ctx);

		if (currentEntity) {
			throw CategoryAlreadyExistsError.withNameAndContext(command.name, command.ctx);
		}

		const category = await this.categoryCommandRepository.save(this.createCategoryInstance(command));

		return {
			id: category.id,
		};
	}

	private createCategoryInstance(command: CreateCategoryCommand) {
		return {
			name: command.name,
			ctx: command.ctx,
			description: command.description,
			parentId: command.parentId,
		};
	}
}
