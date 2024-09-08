import { ICertification, IEducation, IExperience, ISalaryRange } from '@app/core';
import { IActorBase } from '@libs/common';
import { Command } from '@libs/cqrs';

export class CreateJobUserProfileCommand extends Command<CreateJobUserProfileCommand, CreateJobUserProfileResponseDto> {
  userId: string;

  bio?: string;

  salaryRange: ISalaryRange;

  jobIds?: string[];

  jobPositionIds?: string[];

  experience?: IExperience[];

  education?: IEducation[];

  certificates?: ICertification[];

  actor: IActorBase;

  constructor(command: CreateJobUserProfileCommand) {
    super(command);

    Object.assign(this, command);
  }
}

export type CreateJobUserProfileResponseDto = {
  id: string;
};
