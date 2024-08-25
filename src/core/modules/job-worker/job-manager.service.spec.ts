/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createMock } from '@golevelup/ts-jest';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { JobManager } from '@libs/common';
import { TestLoggerModule } from '@libs/testing';

import { IsJobEnum } from './is-job.decorator';
import { JobManagerService } from './job-manager.service';
import { PgBossProvider } from './pg-boss.provider';

jest.mock('@libs/common/pg-boss/config', () => ({
  JobManager: jest.fn().mockImplementation(() => ({
    start: jest.fn(),
    register: jest.fn(),
    stopJobs: jest.fn(),
  })),
}));

describe('JobManagerService', () => {
  let service: JobManagerService;
  let jobManagerMock: jest.Mocked<JobManager<any>>;

  let discoveryServiceMock: jest.Mocked<DiscoveryService>;
  let reflectorMock: jest.Mocked<Reflector>;
  let pgBossProviderMock: jest.Mocked<PgBossProvider>;

  const metadataRegistry = {
    ActiveJob: [IsJobEnum.IS_JOB, IsJobEnum.IS_ACTIVE_JOB],
    InactiveJob: [IsJobEnum.IS_JOB],
  };

  beforeEach(async () => {
    discoveryServiceMock = createMock();
    discoveryServiceMock.getProviders = jest
      .fn()
      .mockReturnValue([{ metatype: class ActiveJob {} }, { metatype: class InactiveJob {} }, { metatype: class NotJobProvider {} }]);

    reflectorMock = createMock();
    reflectorMock.get = jest.fn().mockImplementation((metadataKey, type) => {
      const metadataForType = metadataRegistry[type.name];
      return metadataForType ? metadataForType.includes(metadataKey) : undefined;
    });

    pgBossProviderMock = createMock();
    jobManagerMock = createMock();

    const module: TestingModule = await Test.createTestingModule({
      imports: [TestLoggerModule.forRoot()],
      providers: [
        JobManagerService,
        { provide: DiscoveryService, useValue: discoveryServiceMock },
        { provide: Reflector, useValue: reflectorMock },
        { provide: PgBossProvider, useValue: pgBossProviderMock },
      ],
    }).compile();

    service = module.get<JobManagerService>(JobManagerService);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    service.jobManager = jobManagerMock;
  });

  describe('onModuleInit', () => {
    it('should register active jobs', async () => {
      // Act
      await service.onModuleInit();

      // Assert
      expect(jobManagerMock.register).toHaveBeenCalledTimes(1);
    });

    it('should skip inactive jobs and warn them', async () => {
      // Arrange
      discoveryServiceMock.getProviders = jest.fn().mockReturnValueOnce([{ metatype: class InactiveJob {} }, { metatype: class NotJobProvider {} }]);

      await service.onModuleInit();
      expect(jobManagerMock.register).toHaveBeenCalledTimes(0);
    });
  });

  describe('stopJobs', () => {
    it('should stop jobs', async () => {
      // Act
      await service.stopJobs();

      // Assert
      expect(jobManagerMock.stop).toHaveBeenCalledTimes(1);
    });
  });
});
