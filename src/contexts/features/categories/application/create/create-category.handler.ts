import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

import { AppContext, IOutboxRepository } from '@app/core';
import { IInferredCommandHandler } from '@libs/cqrs';

import { CategoryAlreadyExistsError, CategoryCreatedEvent, ICategoriesCommandRepository } from '../../domain';
import { CreateCategoryCommand, CreateCategoryResponseDto } from './create-category.command';

@Injectable()
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

    const currentEntity = await this.categoryCommandRepository.getOneByNameAndContext(command.name, command.context);

    if (currentEntity) {
      throw CategoryAlreadyExistsError.withNameAndContext(command.name, command.context);
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
      context: command.context,
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
