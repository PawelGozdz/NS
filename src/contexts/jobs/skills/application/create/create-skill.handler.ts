import { Transactional } from '@nestjs-cls/transactional';
import { PinoLogger } from 'nestjs-pino';

import { GetManyCategoriesQuery } from '@app/contexts/features';
import { AppContext, IOutboxRepository } from '@app/core';
import { AppUtils } from '@libs/common';
import { CommandHandler, IInferredCommandHandler, QueryBus } from '@libs/cqrs';

import { ISkillsCommandRepository, SkillAlreadyExistsError, SkillCreatedEvent, SkillNotFoundError } from '../../domain';
import { CreateSkillCommand, CreateSkillResponseDto } from './create-skill.command';

@CommandHandler(CreateSkillCommand)
export class CreateSkillHandler implements IInferredCommandHandler<CreateSkillCommand> {
  constructor(
    private readonly skillCommandRepository: ISkillsCommandRepository,
    private readonly outboxRepository: IOutboxRepository,
    private readonly queryBus: QueryBus,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @Transactional()
  async execute(command: CreateSkillCommand): Promise<CreateSkillResponseDto> {
    this.logger.info(command, 'Creating skill:');

    const currentEntity = await this.skillCommandRepository.getOneByNameAndCategoryId(command.name, command.categoryId);

    if (AppUtils.isNotEmpty(currentEntity)) {
      throw SkillAlreadyExistsError.withNameAndCategoryId(command.name, command.categoryId);
    }

    const category = await this.queryBus.execute(new GetManyCategoriesQuery({ _filter: { id: command.categoryId } }));

    if (AppUtils.isEmpty(category)) {
      throw SkillNotFoundError.withCategoryId(command.categoryId);
    }

    const instance = this.createInstance(command);

    const skill = await this.skillCommandRepository.save(instance);

    await this.outboxRepository.store(this.createOutbox(new SkillCreatedEvent({ id: skill.id, ...instance })));

    return {
      id: skill.id,
    };
  }

  private createInstance(command: CreateSkillCommand) {
    return {
      name: command.name,
      description: command.description,
      categoryId: command.categoryId,
    };
  }

  private createOutbox(event: SkillCreatedEvent) {
    return {
      context: AppContext.SKILLS,
      eventName: SkillCreatedEvent.name,
      data: event,
    };
  }
}
