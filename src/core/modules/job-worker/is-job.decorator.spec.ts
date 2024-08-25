/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Reflector } from '@nestjs/core';
import PgBoss from 'pg-boss';

import { BaseJob } from '@libs/common';
import { catchActError } from '@libs/testing';

import { IsJobEnum, Job } from './is-job.decorator';

describe('@Job Decorator', () => {
  class MockBaseJob extends BaseJob<any> {
    type = 'mockJobType';

    async start(): Promise<void> {
      // mock
    }

    async work(_job: PgBoss.Job<any>): Promise<void> {
      // mock
    }
  }
  class MockNonBaseJob {}

  const reflector = new Reflector();

  it('should not throw an error when decorating a class extending BaseJob', () => {
    // Arrange
    function decorateValidJob() {
      @Job()
      class ValidJob extends MockBaseJob {}
    }

    // Act
    const { error } = catchActError(() => decorateValidJob());

    // Assert
    expect(error).toBeUndefined();
  });

  it('should throw an error when decorating a class not extending BaseJob', async () => {
    // Arrange
    function decorateInvalidJob() {
      @Job()
      class InvalidJob extends MockNonBaseJob {}
    }

    // Act
    const { error } = catchActError(() => decorateInvalidJob());

    // Assert
    expect(error?.message).toMatch(/InvalidJob does not extend BaseJob and cannot be decorated with @Job/);
  });

  it('should set IS_JOB metadata to true', () => {
    // Arrange
    @Job()
    class ActiveJob extends MockBaseJob {}
    const isJob = reflector.get(IsJobEnum.IS_JOB, ActiveJob);

    // Assert
    expect(isJob).toBe(true);
  });

  it('should set IS_ACTIVE_JOB metadata to false when active option is false', () => {
    // Arrange & Act
    @Job({ active: false })
    class InactiveJob extends MockBaseJob {}
    const isActiveJob = reflector.get(IsJobEnum.IS_ACTIVE_JOB, InactiveJob);

    // Assert
    expect(isActiveJob).toBe(false);
  });

  it('should set IS_ACTIVE_JOB metadata to true when active option is true', () => {
    // Arrange & Act
    @Job({ active: true })
    class ActiveJob extends MockBaseJob {}
    const isActiveJob = reflector.get(IsJobEnum.IS_ACTIVE_JOB, ActiveJob);

    // Assert
    expect(isActiveJob).toBe(true);
  });

  it('should set IS_ACTIVE_JOB metadata to true when active option is omitted', () => {
    // Arrange & Act
    @Job()
    class DefaultActiveJob extends MockBaseJob {}
    const isActiveJob = reflector.get(IsJobEnum.IS_ACTIVE_JOB, DefaultActiveJob);

    // Assert
    expect(isActiveJob).toBe(true);
  });
});
