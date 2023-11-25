/* eslint-disable import/no-extraneous-dependencies */
import { createMock } from '@golevelup/ts-jest';
import { DynamicModule, Type } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

export type PinoLoggerMock = jest.Mocked<Required<PinoLogger>>;
export const PinoLoggerMockToken = PinoLogger as any as Type<PinoLoggerMock>;

export class TestLoggerModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: TestLoggerModule,
      providers: [
        {
          provide: PinoLogger,
          useFactory: () => createMock<PinoLogger>(),
        },
      ],
      exports: [
        {
          provide: PinoLogger,
          useFactory: () => createMock<PinoLogger>(),
        },
      ],
    };
  }
}
