import { ICertification, IEducation, IExperience, ISalaryRange } from '@app/core';
import { IActor } from '@libs/common';
import { Command } from '@libs/cqrs';

export class CreateJobUserProfileCommand extends Command<CreateJobUserProfileCommand, CreateJobUserProfileResponse> {
  userId: string;

  bio?: string;

  salaryRange: ISalaryRange;

  jobs?: string[];

  jobPositions?: string[];

  experience?: IExperience[];

  education?: IEducation[];

  certificates?: ICertification[];

  requestedBy: string;

  actor: IActor;

  constructor(command: CreateJobUserProfileCommand) {
    super(command);

    Object.assign(this, command);
  }
}

export type CreateJobUserProfileResponse = {
  id: string;
};
