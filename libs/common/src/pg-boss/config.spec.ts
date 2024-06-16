/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createMock } from '@golevelup/ts-jest';
import PgBoss from 'pg-boss';

import { BaseJob, JobManager } from './config';

describe('BaseJob', () => {
  let bossMock: jest.Mocked<PgBoss>;
  let job: BaseJob<any>;

  beforeEach(() => {
    bossMock = createMock();

    class TestJob extends BaseJob<any> {
      work = jest.fn();

      type = 'testJob';
    }
    job = new TestJob(bossMock);
  });

  it('should start job correctly', async () => {
    // Act
    await job.start();

    // Assert
    expect(bossMock.work).toHaveBeenCalledWith(job.type, job.work);
  });

  it('should emit data correctly', async () => {
    // Assert
    const testData = { some: 'data' };

    // Act
    await job.emit(testData);

    // Assert
    expect(bossMock.send).toHaveBeenCalledWith(job.type, testData, job.options);
  });
});

describe('JobManager', () => {
  let bossMock: jest.Mocked<PgBoss>;
  let jobManager: JobManager<any>;

  beforeEach(() => {
    bossMock = {} as any; // Mocking PgBoss
    jobManager = new JobManager(bossMock);
  });

  it('should register job correctly', () => {
    // Arrange
    class TestJob extends BaseJob<any> {
      work = jest.fn();

      type = 'testJob';
    }
    const testJob = new TestJob(bossMock);
    jobManager.register(testJob);

    // Assert
    expect(jobManager['jobs'].has(testJob.type)).toBeTruthy();
  });
});
