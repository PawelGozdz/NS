import { Module } from '@nestjs/common';
import { OpenTelemetryModule } from 'nestjs-otel';

const OpenTelemetryModuleConfig = OpenTelemetryModule.forRoot({
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
export class OpenTelemetryModuleModule {}
