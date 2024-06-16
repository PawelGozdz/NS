import { createMock } from '@golevelup/ts-jest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { Database } from '@app/core';
import { TestLoggerModule } from '@libs/testing';

import { GracefulShutDownConfig, GracefulShutdownService } from './graceful-shutdown.service';
import { JobManagerService, otelSDK } from './modules';

jest.mock('./modules/open-telemetry', () => ({
  otelSDK: {
    shutdown: jest.fn(),
  },
}));

describe('GracefulShutdownService', () => {
  let service: GracefulShutdownService;
  let dbMock: jest.Mocked<Database>;
  let jobManagerServiceMock: jest.Mocked<JobManagerService>;

  beforeEach(async () => {
    dbMock = createMock();
    jobManagerServiceMock = createMock();
    dbMock.destroy = jest.fn();

    const module = await Test.createTestingModule({
      imports: [TestLoggerModule.forRoot()],
      providers: [
        GracefulShutdownService,
        {
          provide: Database,
          useValue: dbMock,
        },
        {
          provide: JobManagerService,
          useValue: jobManagerServiceMock,
        },
      ],
    }).compile();

    service = module.get<GracefulShutdownService>(GracefulShutdownService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const app: jest.Mocked<INestApplication> = createMock();
  app.close = jest.fn();

  const mockConfig: GracefulShutDownConfig = {
    app,
    applicationName: 'test',
  };

  const signal = 'SIGTERM';

  describe('onApplicationShutdown', () => {
    it('should gracefuly shut down all connections', async () => {
      // Arrange
      service.setConfig(mockConfig);

      // Act
      await service.onApplicationShutdown(signal);

      // Assert
      expect(dbMock.destroy).toHaveBeenCalled();
      expect(otelSDK.shutdown).toHaveBeenCalledTimes(1);
      expect(jobManagerServiceMock.stopJobs).toHaveBeenCalledTimes(1);
    });
  });
});
