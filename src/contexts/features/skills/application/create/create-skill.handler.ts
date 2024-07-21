import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

import { AppContext, IOutboxRepository } from '@app/core';
import { IInferredCommandHandler } from '@libs/cqrs';

import { ISkillsCommandRepository, SkillAlreadyExistsError, SkillCreatedEvent } from '../../domain';
import { CreateSkillCommand, CreateSkillResponseDto } from './create-skill.command';

@Injectable()
export class CreateSkillHandler implements IInferredCommandHandler<CreateSkillCommand> {
  constructor(
    private readonly skillCommandRepository: ISkillsCommandRepository,
    private readonly outboxRepository: IOutboxRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @Transactional()
  async execute(command: CreateSkillCommand): Promise<CreateSkillResponseDto> {
    this.logger.info(command, 'Creating skill:');

    const currentEntity = await this.skillCommandRepository.getOneByNameAndContext(command.name, command.context);

    if (currentEntity) {
      throw SkillAlreadyExistsError.withNameAndContext(command.name, command.context);
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
      context: command.context,
      description: command.description,
      parentId: command.parentId,
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
