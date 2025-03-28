import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import config from '@app/config';
import { AppUtils } from '@libs/common';

export class SwaggerBuilder {
  // eslint-disable-next-line @typescript-eslint/ban-types
  static async build(app: INestApplication, module: Function, path: string, title: string, description: string, useApiAuth?: boolean) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(title)
      .setDescription(description)
      .setVersion(config.appConfig.APP_VERSION)
      .addServer(`/${config.globalPrefix}/v${config.globalVersioning}`);

    if (AppUtils.isNotEmpty(useApiAuth)) {
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
