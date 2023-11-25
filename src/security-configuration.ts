import { INestApplication } from '@nestjs/common';
import { json, urlencoded } from 'express';
import helmet from 'helmet';

export const nestApplicationSecirityConfiguration = (app: INestApplication) => {
	app.use(helmet());
	app.enableCors();

	app.use(json({ limit: '3mb' }));
	app.use(urlencoded({ extended: true, limit: '3mb' }));
};
