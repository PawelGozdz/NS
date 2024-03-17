import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

import { IInferredCommandHandler } from '@libs/cqrs';

import { CategoryAlreadyExistsError, ICategoriesCommandRepository } from '../../domain';
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

    const currentEntity = await this.categoryCommandRepository.getOneByNameAndContext(command.name, command.context);

    if (currentEntity) {
      throw CategoryAlreadyExistsError.withNameAndContext(command.name, command.context);
    }

    const category = await this.categoryCommandRepository.save(this.createCategoryInstance(command));

    return {
      id: category.id,
    };
  }

  private createCategoryInstance(command: CreateCategoryCommand) {
    return {
      name: command.name,
      context: command.context,
      description: command.description,
      parentId: command.parentId,
    };
  }
}
