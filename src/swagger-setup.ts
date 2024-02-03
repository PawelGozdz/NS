import config, { globalPrefix, globalVersioning } from '@config/app';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class SwaggerBuilder {
	static async build(app: INestApplication, module: Function, path: string, title: string, description: string, useApiAuth?: boolean) {
		const swaggerConfig = new DocumentBuilder()
			.setTitle(title)
			.setDescription(description)
			.setVersion(config.APP_VERSION)
			.addServer(`/${globalPrefix}/v${globalVersioning}`);

		if (!useApiAuth) {
			swaggerConfig.addBearerAuth();
		} else {
			swaggerConfig.addApiKey({ type: 'apiKey', name: 'Authorization', in: 'header' }, 'Authorization');
		}

		const document = SwaggerModule.createDocument(app, swaggerConfig.build(), {
			include: [module],
		});

		SwaggerModule.setup(path, app, document, {
			swaggerOptions: {
				tagsSorter: 'alpha',
				operationsSorter: 'alpha',
			},
		});
	}
}
