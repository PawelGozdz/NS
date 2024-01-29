import { Database } from '@app/database';
import { createMock } from '@golevelup/ts-jest';
import { TestLoggerModule } from '@libs/testing';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { GracefulShutDownConfig, GracefulShutdownService } from './graceful-shutdown.service';
import { otelSDK } from './modules';

jest.mock('./modules', () => ({
	otelSDK: {
		shutdown: jest.fn(),
	},
}));

describe('GracefulShutdownService', () => {
	let service: GracefulShutdownService;
	let dbMock: jest.Mocked<Database>;

	beforeEach(async () => {
		dbMock = createMock();

		const module = await Test.createTestingModule({
			imports: [TestLoggerModule.forRoot()],
			providers: [
				GracefulShutdownService,
				{
					provide: Database,
					useValue: dbMock,
				},
			],
		}).compile();

		service = module.get<GracefulShutdownService>(GracefulShutdownService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	const app: jest.Mocked<INestApplication> = createMock();

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
		});
	});
});
