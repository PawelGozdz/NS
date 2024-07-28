import { Transactional } from '@nestjs-cls/transactional';
import { PinoLogger } from 'nestjs-pino';

import { AppContext, IOutboxRepository } from '@app/core';
import { AppUtils } from '@libs/common';
import { CommandHandler, IInferredCommandHandler } from '@libs/cqrs';

import { CategoryAlreadyExistsError, CategoryCreatedEvent, ICategoriesCommandRepository } from '../../domain';
import { CreateCategoryCommand, CreateCategoryResponseDto } from './create-category.command';

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler implements IInferredCommandHandler<CreateCategoryCommand> {
  constructor(
    private readonly categoryCommandRepository: ICategoriesCommandRepository,
    private readonly outboxRepository: IOutboxRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @Transactional()
  async execute(command: CreateCategoryCommand): Promise<CreateCategoryResponseDto> {
    this.logger.info(command, 'Creating category:');

    const currentEntity = await this.categoryCommandRepository.getOneByName(command.name);

    if (AppUtils.isNotEmpty(currentEntity)) {
      throw CategoryAlreadyExistsError.withName(command.name);
    }

    const categoryInstance = this.createCategoryInstance(command);

    const category = await this.categoryCommandRepository.save(categoryInstance);

    await this.outboxRepository.store(this.createOutbox(new CategoryCreatedEvent({ id: category.id, ...categoryInstance })));

    return {
      id: category.id,
    };
  }

  private createCategoryInstance(command: CreateCategoryCommand) {
    return {
      name: command.name,
      description: command.description,
      parentId: command.parentId,
    };
  }

  private createOutbox(event: CategoryCreatedEvent) {
    return {
      context: AppContext.CATEGORIES,
      eventName: CategoryCreatedEvent.name,
      data: event,
    };
  }
}
