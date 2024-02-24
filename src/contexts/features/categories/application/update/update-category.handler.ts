import { getCoalescedField, getNullOrValueField } from '@libs/common';
import { IInferredCommandHandler } from '@libs/cqrs';
import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

import { Category, CategoryNotFoundError, ICategoriesCommandRepository } from '../../domain';
import { UpdateCategoryCommand } from './update-category.command';

@Injectable()
export class UpdateCategoryHandler implements IInferredCommandHandler<UpdateCategoryCommand> {
	constructor(
		private readonly categoryCommandRepository: ICategoriesCommandRepository,
		private readonly logger: PinoLogger,
	) {
		this.logger.setContext(this.constructor.name);
	}

	async execute(command: UpdateCategoryCommand): Promise<void> {
		this.logger.info(command, 'Updating category:');

		const currentEntity = await this.categoryCommandRepository.getOneById(command.id);

		if (!currentEntity) {
			throw CategoryNotFoundError.withId(command.id);
		}

		await this.categoryCommandRepository.update(this.updateCategoryInstance(command, currentEntity));
	}

	private updateCategoryInstance(command: UpdateCategoryCommand, currentEntity: Category) {
		return {
			id: currentEntity.id,
			name: getCoalescedField(command.name, currentEntity.name),
			ctx: getCoalescedField(command.ctx, currentEntity.ctx),
			description: getNullOrValueField(command.description, currentEntity.description),
			parentId: getNullOrValueField(command.parentId, currentEntity.parentId),
		};
	}
}
