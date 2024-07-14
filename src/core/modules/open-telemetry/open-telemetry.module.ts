import { Module } from '@nestjs/common';
import { OpenTelemetryModule as OTM } from 'nestjs-otel';

const OpenTelemetryModuleConfig = OTM.forRoot({
  metrics: {
    hostMetrics: true, // Includes Host Metrics
    apiMetrics: {
      enable: true, // Includes api metrics
      defaultAttributes: {
        // You can set default labels for api metrics
        custom: 'label',
      },
      ignoreRoutes: [], // You can ignore specific routes (See https://docs.nestjs.com/middleware#excluding-routes for options)
      ignoreUndefinedRoutes: false, // Records metrics for all URLs, even undefined ones
    },
  },
});

@Module({
  imports: [OpenTelemetryModuleConfig],
  exports: [OpenTelemetryModuleConfig],
})
export class OpenTelemetryModule {}
