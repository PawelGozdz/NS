import { DomainError, DomainErrorCode, DomainErrorOptions } from '@libs/common';

export class JobPositionIncorrectIdsError extends DomainError {
  static withSkillIds(ids: number[], data?: DomainErrorOptions): JobPositionIncorrectIdsError {
    const message = `Requested skill ids [${ids.join(',')}] don't exists`;
    const options = {
      code: DomainErrorCode.InvalidParameter,
      data,
    };
    return new JobPositionIncorrectIdsError(message, options);
  }
}
