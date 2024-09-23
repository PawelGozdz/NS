import { Transactional } from '@nestjs-cls/transactional';
import { difference } from 'lodash';
import { PinoLogger } from 'nestjs-pino';

import { Actor, AppContext, IOutboxRepository } from '@app/core';
import { EntityId, generateSlug } from '@libs/common';
import { CommandHandler, IInferredCommandHandler, QueryBus } from '@libs/cqrs';

import { IJobPositionCommandRepository, JobPosition, JobPositionAlreadyExistsError, JobPositionUpdatedEvent } from '../../domain';
import { JobPositionIncorrectIdsError } from '../../domain/job-position/errors/job-position-incorrect-skill-ids.error';
import { GetManySkillsQuery, GetManySkillsResponseDto } from '../skills-get-many/get-many-skills.query';
import { UpdateJobPositionCommand, UpdateJobPositionResponseDto } from './update-job-position.command';

@CommandHandler(UpdateJobPositionCommand)
export class UpdateJobPositionHandler implements IInferredCommandHandler<UpdateJobPositionCommand> {
  constructor(
    private readonly jobPositionRepository: IJobPositionCommandRepository,
    private readonly queryBus: QueryBus,
    private readonly outboxRepository: IOutboxRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @Transactional()
  async execute(command: UpdateJobPositionCommand): Promise<UpdateJobPositionResponseDto> {
    this.logger.info(command, 'Updating job position:');

    const entityId = EntityId.create(command.id);

    const currentPosition = await this.jobPositionRepository.getOneById(entityId);

    if (!currentPosition) {
      throw JobPositionAlreadyExistsError.withId(entityId);
    }

    if (command.categoryId ?? command.title) {
      const slug = generateSlug(command.title ?? currentPosition.title);
      const categoryId = command.categoryId ?? currentPosition.categoryId;

      const jobPosition = await this.jobPositionRepository.getOneByCategoryIdAndSlug(categoryId, slug);

      if (jobPosition && jobPosition.id.value !== currentPosition.id.value) {
        throw JobPositionAlreadyExistsError.withSlugAndCategoryId(slug, categoryId);
      }
    }

    const actor = Actor.create(command.actor.type, this.constructor.name, command.actor.id);

    if (command?.skillIds?.length) {
      await this.validateSkillIds(actor, command.skillIds);
    }

    const jobPositionInstance = this.createInstance(command, currentPosition);

    await this.jobPositionRepository.update(jobPositionInstance);

    await this.outboxRepository.store(this.createOutbox(new JobPositionUpdatedEvent({ ...jobPositionInstance, actor })));

    return { id: currentPosition.id.value };
  }

  private async validateSkillIds(actor: Actor, skillIds?: number[]) {
    const skills = await this.queryBus.execute<GetManySkillsResponseDto>(new GetManySkillsQuery({ _filter: { ids: [...new Set(skillIds)] }, actor }));

    const comparedIds = difference(
      skillIds ?? [],
      skills.map((s) => s.id),
    );

    if (comparedIds.length) {
      throw JobPositionIncorrectIdsError.withSkillIds(comparedIds);
    }
  }

  private createInstance(command: UpdateJobPositionCommand, currentJobPosition: JobPosition) {
    const title = command.title ?? currentJobPosition.title;

    return JobPosition.create({
      id: currentJobPosition.id,
      title,
      categoryId: command.categoryId ?? currentJobPosition.categoryId,
      skillIds: command.skillIds ?? currentJobPosition.skillIds,
    });
  }

  private createOutbox(event: JobPositionUpdatedEvent) {
    return {
      context: AppContext.JOBS,
      eventName: JobPositionUpdatedEvent.name,
      data: event,
      actor: event.actor,
    };
  }
}
