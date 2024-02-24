import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import { CompositePropagator, W3CBaggagePropagator, W3CTraceContextPropagator } from '@opentelemetry/core';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { B3InjectEncoding, B3Propagator } from '@opentelemetry/propagator-b3';
import { Resource } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchSpanProcessor, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import process from 'process';

import config, { Environment } from '@app/config/app';

const exporterOptions = {
	url: config.JAEGER_URL,
};

const traceExporter = new OTLPTraceExporter(exporterOptions);

const spanProcessor =
	process.env.NODE_ENV === Environment.DEVELOPMENT ? new SimpleSpanProcessor(traceExporter) : new BatchSpanProcessor(traceExporter);

export const otelSDK = new NodeSDK({
	contextManager: new AsyncLocalStorageContextManager(),
	resource: new Resource({
		[SemanticResourceAttributes.SERVICE_NAME]: config.APP_NAME,
		[SemanticResourceAttributes.SERVICE_VERSION]: config.APP_VERSION,
	}),
	traceExporter,
	spanProcessor,
	textMapPropagator: new CompositePropagator({
		propagators: [
			new W3CTraceContextPropagator(),
			new W3CBaggagePropagator(),
			new B3Propagator(),
			new B3Propagator({
				injectEncoding: B3InjectEncoding.MULTI_HEADER,
			}),
		],
	}),
	instrumentations: [
		getNodeAutoInstrumentations({
			'@opentelemetry/instrumentation-express': { enabled: true },
			'@opentelemetry/instrumentation-http': { enabled: true },
			'@opentelemetry/instrumentation-grpc': { enabled: true },
			'@opentelemetry/instrumentation-pg': { enabled: true },
			'@opentelemetry/instrumentation-nestjs-core': { enabled: true },
			'@opentelemetry/instrumentation-pino': { enabled: true },
		}),
	],
});
