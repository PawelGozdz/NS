import { Transactional } from '@nestjs-cls/transactional';
import { difference } from 'lodash';
import { PinoLogger } from 'nestjs-pino';

import { Actor, AppContext, IOutboxRepository } from '@app/core';
import { generateSlug } from '@libs/common';
import { CommandHandler, IInferredCommandHandler, QueryBus } from '@libs/cqrs';

import { IJobPositionCommandRepository, JobPosition, JobPositionAlreadyExistsError, JobPositionCreatedEvent } from '../../domain';
import { JobPositionIncorrectIdsError } from '../../domain/job-position/errors/job-position-incorrect-skill-ids.error';
import { GetManySkillsQuery, GetManySkillsResponseDto } from '../skills-get-many/get-many-skills.query';
import { CreateJobPositionCommand, CreateJobPositionResponseDto } from './create-job-position.command';

@CommandHandler(CreateJobPositionCommand)
export class CreateJobPositionHandler implements IInferredCommandHandler<CreateJobPositionCommand> {
  constructor(
    private readonly jobPositionRepository: IJobPositionCommandRepository,
    private readonly queryBus: QueryBus,
    private readonly outboxRepository: IOutboxRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @Transactional()
  async execute(command: CreateJobPositionCommand): Promise<CreateJobPositionResponseDto> {
    this.logger.info(command, 'Creating job position:');

    const slug = generateSlug(command.title);

    const currentPosition = await this.jobPositionRepository.getOneByCategoryIdAndSlug(command.categoryId, slug);

    if (currentPosition) {
      throw JobPositionAlreadyExistsError.withSlugAndCategoryId(slug, command.categoryId);
    }

    const actor = Actor.create(command.actor.type, this.constructor.name, command.actor.id);

    if (command?.skillIds?.length) {
      await this.validateSkillIds(actor, command.skillIds);
    }

    const jobPositionInstance = this.createInstance(command, slug);

    await this.jobPositionRepository.save(jobPositionInstance);

    await this.outboxRepository.store(this.createOutbox(new JobPositionCreatedEvent({ ...jobPositionInstance, actor })));

    return { id: jobPositionInstance.id.value };
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

  private createInstance(command: CreateJobPositionCommand, slug: string) {
    return JobPosition.create({
      title: command.title,
      slug,
      categoryId: command.categoryId,
      skillIds: command.skillIds ?? [],
    });
  }

  private createOutbox(event: JobPositionCreatedEvent) {
    return {
      context: AppContext.JOBS,
      eventName: JobPositionCreatedEvent.name,
      data: event,
      actor: event.actor,
    };
  }
}
