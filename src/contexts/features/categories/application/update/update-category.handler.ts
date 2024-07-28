import { Transactional } from '@nestjs-cls/transactional';
import { PinoLogger } from 'nestjs-pino';

import { Actor, AppContext, IOutboxRepository } from '@app/core';
import { getCoalescedField, getNullOrValueField } from '@libs/common';
import { CommandHandler, IInferredCommandHandler } from '@libs/cqrs';

import { Category, CategoryNotFoundError, CategoryUpdatedEvent, ICategoriesCommandRepository } from '../../domain';
import { UpdateCategoryCommand } from './update-category.command';

@CommandHandler(UpdateCategoryCommand)
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

    const actor = Actor.create(command.actor.type, this.constructor.name, command.actor.id);

    await this.outboxRepository.store(
      this.createOutbox(
        new CategoryUpdatedEvent({
          ...categoryInstance,
          actor,
        }),
      ),
    );
  }

  private updateCategoryInstance(command: UpdateCategoryCommand, currentEntity: Category): Category {
    return {
      id: currentEntity.id,
      name: getCoalescedField(command.name, currentEntity.name) as string,
      description: getNullOrValueField(command.description, currentEntity.description),
      parentId: getNullOrValueField(command.parentId, currentEntity.parentId),
    };
  }

  private createOutbox(event: CategoryUpdatedEvent) {
    return {
      context: AppContext.CATEGORIES,
      eventName: CategoryUpdatedEvent.name,
      data: event,
      actor: event.actor,
    };
  }
}
