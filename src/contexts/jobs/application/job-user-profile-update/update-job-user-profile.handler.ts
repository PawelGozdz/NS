import { Transactional } from '@nestjs-cls/transactional';
import { PinoLogger } from 'nestjs-pino';

import { Actor, Certification, Education, Experience, SalaryRange } from '@app/core';
import { EntityId } from '@libs/common';
import { CommandHandler, IInferredCommandHandler } from '@libs/cqrs';

import { IJobUserProfileCommandRepository, JobUserProfileNotFoundError } from '../../domain';
import { UpdateJobUserProfileCommand } from './update-job-user-profile.command';

@CommandHandler(UpdateJobUserProfileCommand)
export class UpdateJobUserProfileHandler implements IInferredCommandHandler<UpdateJobUserProfileCommand> {
  constructor(
    private readonly userCommandRepository: IJobUserProfileCommandRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @Transactional()
  async execute(command: UpdateJobUserProfileCommand): Promise<void> {
    this.logger.info(command, 'Updating job user profile:');

    const id = EntityId.create(command.id);

    const user = await this.userCommandRepository.getOneById(id);

    if (!user) {
      throw JobUserProfileNotFoundError.withEntityId(id);
    }

    const salaryRange = command.salaryRange ? SalaryRange.create(command.salaryRange.from, command.salaryRange.to) : undefined;
    const jobIds = command.jobIds ? command.jobIds.map((j) => EntityId.create(j)) : undefined;
    const jobPositionIds = command.jobPositionIds ? command.jobPositionIds.map((j) => EntityId.create(j)) : undefined;
    const experience = command.experience
      ? command.experience.map((exp) => Experience.create(exp.skillId, exp.startDate, exp.endDate, exp.experienceInMonths))
      : undefined;
    const education = command.education ? command.education.map((edu) => Education.create(edu.degree, edu.institution, edu.graduateYear)) : undefined;
    const certificates = command.certificates
      ? command.certificates.map((cert) => Certification.create(cert.name, cert.institution, cert.completionYear))
      : undefined;
    const actor = Actor.create(command.actor.type, this.constructor.name, command.actor.id);

    user.update({
      bio: command.bio ?? null,
      salaryRange,
      jobIds,
      jobPositionIds,
      experience,
      education,
      certificates,
      actor,
    });

    await this.userCommandRepository.save(user);
  }
}
