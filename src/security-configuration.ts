import { INestApplication } from '@nestjs/common';
import { json, urlencoded } from 'express';
import helmet from 'helmet';

export const nestApplicationSecirityConfiguration = (app: INestApplication) => {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'none'"],
          styleSrc: ["'none'"],
          objectSrc: ["'none'"],
        },
      },
      crossOriginEmbedderPolicy: { policy: 'require-corp' },
      crossOriginResourcePolicy: { policy: 'same-site' },
      hidePoweredBy: true,
      frameguard: {
        action: 'deny',
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      ieNoOpen: true,
      permittedCrossDomainPolicies: { permittedPolicies: 'none' },
      referrerPolicy: { policy: 'no-referrer' },
      xssFilter: true,
    }),
  );

  app.enableCors();

  app.use(json({ limit: '3mb' }));

  app.use(urlencoded({ extended: true, limit: '3mb' }));
};
