import { CommandHandler, IInferredCommandHandler } from '@libs/cqrs';
import { PinoLogger } from 'nestjs-pino';

import { Category, CategoryAlreadyExistsError } from '../../domain';
import { ICategoriesCommandRepository } from '../../domain/caregories/category-command-repository.interface';
import { CreateCategoryCommand, CreateCategoryResponseDto } from './create-category.command';

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler implements IInferredCommandHandler<CreateCategoryCommand> {
	constructor(
		private readonly categoryCommandRepository: ICategoriesCommandRepository,
		private readonly logger: PinoLogger,
	) {
		this.logger.setContext(this.constructor.name);
	}

	async execute(command: CreateCategoryCommand): Promise<CreateCategoryResponseDto> {
		this.logger.info(command, 'Creating category:');

		const currentEntity = await this.categoryCommandRepository.getOneByNameAndContext(command.name, command.context);

		if (currentEntity) {
			throw CategoryAlreadyExistsError.withNameAndContext(command.name, command.context);
		}

		const category = this.createUserInstance(command);

		await this.categoryCommandRepository.save(category);

		const savedEntity = (await this.categoryCommandRepository.getOneByNameAndContext(command.name, command.context)) as Category;

		return {
			id: savedEntity.id,
		};
	}

	private createUserInstance(command: CreateCategoryCommand) {
		return Category.create({
			name: command.name,
			context: command.context,
			description: command.description,
			parentId: command.parentId,
		});
	}
}
