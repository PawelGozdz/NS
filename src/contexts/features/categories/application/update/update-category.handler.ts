import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

import { IOutboxRepository } from '@app/core';
import { AppContext, getCoalescedField, getNullOrValueField } from '@libs/common';
import { IInferredCommandHandler } from '@libs/cqrs';

import { Category, CategoryNotFoundError, CategoryUpdatedEvent, ICategoriesCommandRepository } from '../../domain';
import { UpdateCategoryCommand } from './update-category.command';

@Injectable()
export class UpdateCategoryHandler implements IInferredCommandHandler<UpdateCategoryCommand> {
  constructor(
    private readonly categoryCommandRepository: ICategoriesCommandRepository,
    private readonly outboxRepository: IOutboxRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @Transactional()
  async execute(command: UpdateCategoryCommand): Promise<void> {
    this.logger.info(command, 'Updating category:');

    const currentEntity = await this.categoryCommandRepository.getOneById(command.id);

    if (!currentEntity) {
      throw CategoryNotFoundError.withId(command.id);
    }

    const categoryInstance = this.updateCategoryInstance(command, currentEntity);

    await this.categoryCommandRepository.update(categoryInstance);

    await this.outboxRepository.store(this.createOutbox(new CategoryUpdatedEvent(categoryInstance)));
  }

  private updateCategoryInstance(command: UpdateCategoryCommand, currentEntity: Category): Category {
    return {
      id: currentEntity.id,
      name: getCoalescedField(command.name, currentEntity.name) as string,
      context: getCoalescedField(command.context, currentEntity.context) as string,
      description: getNullOrValueField(command.description, currentEntity.description),
      parentId: getNullOrValueField(command.parentId, currentEntity.parentId),
    };
  }

  private createOutbox(event: CategoryUpdatedEvent) {
    return {
      context: AppContext.CATEGORIES,
      eventName: CategoryUpdatedEvent.name,
      data: event,
    };
  }
}
