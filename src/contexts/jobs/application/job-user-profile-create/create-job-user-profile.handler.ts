import { Transactional } from '@nestjs-cls/transactional';
import { PinoLogger } from 'nestjs-pino';

import { Actor, Certification, Education, Experience, SalaryRange } from '@app/core';
import { EntityId } from '@libs/common';
import { CommandHandler, IInferredCommandHandler } from '@libs/cqrs';

import { IJobUserProfileCommandRepository, JobUserProfile, JobUserProfileAlreadyExistsError } from '../../domain';
import { CreateJobUserProfileCommand, CreateJobUserProfileResponseDto } from './create-job-user-profile.command';

@CommandHandler(CreateJobUserProfileCommand)
export class CreateJobUserProfileHandler implements IInferredCommandHandler<CreateJobUserProfileCommand> {
  constructor(
    private readonly userRepository: IJobUserProfileCommandRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @Transactional()
  async execute(command: CreateJobUserProfileCommand): Promise<CreateJobUserProfileResponseDto> {
    this.logger.info(command, 'Creating job user profile:');

    const userId = EntityId.create(command.userId);

    const currentUser = await this.userRepository.getOneByUserId(userId);

    if (currentUser) {
      throw JobUserProfileAlreadyExistsError.withUserId(userId);
    }

    const user = this.createUserInstance(command);

    await this.userRepository.save(user);

    return { id: user.getId() };
  }

  private createUserInstance(command: CreateJobUserProfileCommand) {
    return JobUserProfile.create({
      userId: EntityId.create(command.userId),
      actor: Actor.create(command.actor.type, this.constructor.name, command.actor.id),
      bio: command.bio,
      certificates: command?.certificates?.map((cert) => Certification.create(cert.name, cert.institution, cert.completionYear)),
      education: command?.education?.map((edu) => Education.create(edu.degree, edu.institution, edu.graduateYear)),
      experience: command?.experience?.map((exp) => Experience.create(exp.skillId, exp.startDate, exp.endDate, exp.experienceInMonths)),
      jobPositionIds: command?.jobPositionIds?.map((j) => EntityId.create(j)),
      salaryRange: SalaryRange.create(command.salaryRange.from, command.salaryRange.to),
      jobIds: command?.jobIds?.map((j) => EntityId.create(j)),
    });
  }
}
