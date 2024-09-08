import { ICertification, IEducation, IExperience, ISalaryRange } from '@app/core';
import { IActorBase } from '@libs/common';
import { Command } from '@libs/cqrs';

export class UpdateJobUserProfileCommand extends Command<UpdateJobUserProfileCommand, void> {
  id: string;

  bio?: string | null;

  salaryRange?: ISalaryRange;

  jobIds?: string[];

  jobPositionIds?: string[];

  experience?: IExperience[];

  education?: IEducation[];

  certificates?: ICertification[];

  actor: IActorBase;

  constructor(command: UpdateJobUserProfileCommand) {
    super(command);

    Object.assign(this, command);
  }
}
