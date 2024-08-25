import { Injectable, SetMetadata } from '@nestjs/common';

import { BaseJob } from '@libs/common';

interface JobOptions {
  active?: boolean;
}

export enum IsJobEnum {
  IS_JOB = 'isJob',
  IS_ACTIVE_JOB = 'isActiveJob',
}

export function Job(options: JobOptions = { active: true }): ClassDecorator {
  return function (target: Function) {
    if (!Object.prototype.isPrototypeOf.call(BaseJob.prototype, target.prototype)) {
      throw new Error(`${target.name} does not extend BaseJob and cannot be decorated with @Job`);
    }

    Injectable()(target);
    SetMetadata(IsJobEnum.IS_JOB, true)(target);
    SetMetadata(IsJobEnum.IS_ACTIVE_JOB, options.active !== false)(target);
  };
}
